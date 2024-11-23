import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Breadcrumb } from './components/Breadcrumb';
import { GridCard } from './components/GridCard';
import { SubcategoryDetail } from './components/SubcategoryDetail';
import { Cluster, Category, Subcategory, NavigationSubcategory, Modifier, CategoryItem } from './types/data';

function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [breadcrumbItems, setBreadcrumbItems] = useState<Array<{ label: string; path: string }>>([]);
  const [clusters, setClusters] = useState<Record<string, Cluster>>({});
  const [currentCluster, setCurrentCluster] = useState<Cluster | null>(null);
  const [currentCategoryData, setCurrentCategoryData] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | Modifier | null>(null);
  const [categoryDataMap, setCategoryDataMap] = useState<Record<string, Category>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClusters();
  }, []);

  const loadClusters = async () => {
    try {
      const conceptData = await import('./data/concept/concept.json');
      const contextData = await import('./data/context/context.json');
      const compositionData = await import('./data/composition/composition.json');
      const creativityData = await import('./data/creativity/creativity.json');
      
      setClusters({
        concept: conceptData.default,
        context: contextData.default,
        composition: compositionData.default,
        creativity: creativityData.default
      });
    } catch (err) {
      setError('Failed to load clusters');
      console.error('Error loading clusters:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadClusterData = async (clusterName: string) => {
    try {
      const data = await import(`./data/${clusterName}/${clusterName}.json`);
      setCurrentCluster(data.default);
      setCurrentCategoryData(null);
      
      // Load category data for each category in the cluster
      const categoryDataPromises = Object.keys(data.default.categories).map(async (categoryKey) => {
        try {
          const categoryData = await import(`./data/${clusterName}/${categoryKey}/${categoryKey}.json`);
          return [categoryKey, categoryData.default] as const;
        } catch (err) {
          console.error(`Failed to load category data for ${categoryKey}:`, err);
          return [categoryKey, null] as const;
        }
      });

      const categoryDataEntries = await Promise.all(categoryDataPromises);
      const newCategoryDataMap = Object.fromEntries(
        categoryDataEntries.filter(([, data]) => data !== null)
      );
      setCategoryDataMap(newCategoryDataMap);
    } catch (err) {
      setError(`Failed to load cluster data: ${clusterName}`);
      console.error('Error loading cluster data:', err);
    }
  };

  const loadCategoryData = async (clusterName: string, categoryPath: string) => {
    try {
      setLoading(true);
      const data = await import(`./data/${clusterName}/${categoryPath}/${categoryPath}.json`);
      setCurrentCategoryData(data.default);
    } catch (err) {
      setError(`Failed to load category data: ${categoryPath}`);
      console.error('Error loading category data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSubcategoryData = async (clusterName: string, subcategoryPath: string) => {
    try {
      setLoading(true);
      const pathParts = subcategoryPath.split('/');
      const categoryPath = pathParts[0];
      const subcategory = pathParts[pathParts.length - 1];
      const data = await import(`./data/${clusterName}/${categoryPath}/${subcategory}/${subcategory}.json`);
      setSelectedSubcategory(data.default);
      setCurrentCategoryData(null);
    } catch (err) {
      setError(`Failed to load subcategory data: ${subcategoryPath}`);
      console.error('Error loading subcategory data:', err);
    } finally {
      setLoading(false);
    }
  };

  const normalizePath = (path: string): string => {
    return '/' + path.split('/').filter(Boolean).join('/') + '/';
  };

  const handleNavigate = (path: string) => {
    setSelectedSubcategory(null);
    setError(null);
    
    if (path === '/') {
      setCurrentPath('/');
      setBreadcrumbItems([]);
      setCurrentCluster(null);
      setCurrentCategoryData(null);
      return;
    }

    const pathParts = path.split('/').filter(Boolean);
    const level = pathParts.length;

    if (path.startsWith('/')) {
      const newBreadcrumbItems = pathParts.map((part, index) => {
        const itemPath = '/' + pathParts.slice(0, index + 1).join('/');
        const label = index === 0 ? clusters[part]?.name || part : 
                     index === 1 ? currentCluster?.categories[part]?.name || part :
                     part;
        return { label, path: itemPath };
      });
      
      setBreadcrumbItems(newBreadcrumbItems);
      setCurrentPath(normalizePath(path));
      
      // Load appropriate data based on navigation level
      const clusterName = pathParts[0];
      
      if (level === 1) {
        // Only load cluster data when navigating to cluster level
        loadClusterData(clusterName);
      } else if (level === 2) {
        // Load both cluster and category data when navigating to category level
        loadClusterData(clusterName).then(() => {
          loadCategoryData(clusterName, pathParts[1]);
        });
      } else if (level === 3) {
        // Load cluster, category, and subcategory data
        loadClusterData(clusterName).then(() => {
          loadSubcategoryData(clusterName, pathParts.slice(1).join('/'));
        });
      }
      return;
    }

    // Handle relative navigation
    const pathSegment = path.split('/').filter(Boolean)[0];
    const currentClusterName = breadcrumbItems[0]?.path.split('/')[1];
    
    if (currentPath === '/') {
      handleNavigate(`/${pathSegment}`);
    } else if (currentClusterName) {
      if (breadcrumbItems.length === 1) {
        handleNavigate(`/${currentClusterName}/${pathSegment}`);
      } else if (breadcrumbItems.length === 2) {
        const categoryPath = breadcrumbItems[1].path.split('/')[2];
        handleNavigate(`/${currentClusterName}/${categoryPath}/${pathSegment}`);
      }
    }
  };

  const handleCardClick = (item: CategoryItem, itemPath: string) => {
    const pathParts = currentPath.split('/').filter(Boolean);
    const clusterName = pathParts[0];

    if (isNavigationSubcategory(item)) {
      handleNavigate(itemPath);
    } else if ('items' in item || 'modifiers' in item) {
      if (pathParts.length === 2) { // We're at the category level
        loadSubcategoryData(clusterName, `${pathParts[1]}/${itemPath}`);
        const newBreadcrumbItems = [...breadcrumbItems, {
          label: item.name,
          path: `${currentPath}${itemPath}`
        }];
        setBreadcrumbItems(newBreadcrumbItems);
        setCurrentPath(`${currentPath}${itemPath}/`);
      } else {
        setSelectedSubcategory(item as Subcategory | Modifier);
      }
    } else {
      handleNavigate(itemPath);
    }
  };

  const handleSubcategoryClick = (key: string, subcategory: NavigationSubcategory | Subcategory | Category) => {
    const pathParts = currentPath.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      handleCardClick(subcategory, key);
    }
  };

  const isNavigationSubcategory = (
    item: CategoryItem
  ): item is NavigationSubcategory => {
    return 'path' in item && typeof item.path === 'string';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <main className="container-custom py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <main className="container-custom py-8">
          <div className="text-center text-red-600 dark:text-red-400">
            <h2 className="text-xl font-semibold">Error</h2>
            <p>{error}</p>
          </div>
        </main>
      </div>
    );
  }

  const renderContent = () => {
    if (selectedSubcategory) {
      return <SubcategoryDetail subcategory={selectedSubcategory} />;
    }

    if (currentPath === '/' && clusters) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(clusters).map(([key, cluster]) => (
            <GridCard
              key={key}
              title={cluster.name}
              description={cluster.description}
              icon="📁"
              onClick={() => handleCardClick(cluster, key)}
              subcategories={cluster.categories}
              onSubcategoryClick={handleSubcategoryClick}
            />
          ))}
        </div>
      );
    }

    if (currentCluster && !currentCategoryData) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(currentCluster.categories).map(([key, category]) => (
            <GridCard
              key={key}
              title={category.name}
              description={category.description}
              icon="📁"
              onClick={() => handleCardClick(category, key)}
              subcategories={categoryDataMap[key]?.subcategories}
              onSubcategoryClick={handleSubcategoryClick}
            />
          ))}
        </div>
      );
    }

    if (currentCategoryData) {
      if (currentCategoryData.modifiers) {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(currentCategoryData.modifiers).map(([key, modifier]) => (
              <GridCard
                key={key}
                title={modifier.name}
                description={modifier.description || ''}
                icon="📄"
                onClick={() => handleCardClick(modifier, key)}
                items={modifier.items}
                subcategories={modifier.subcategories}
                onSubcategoryClick={handleSubcategoryClick}
              />
            ))}
          </div>
        );
      }

      if (currentCategoryData.subcategories) {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(currentCategoryData.subcategories).map(([key, subcategory]) => {
              const items = isNavigationSubcategory(subcategory)
                ? undefined
                : (subcategory as Subcategory).items;

              return (
                <GridCard
                  key={key}
                  title={subcategory.name}
                  description={subcategory.description || ''}
                  icon="📄"
                  onClick={() => handleCardClick(subcategory, key)}
                  items={items}
                  subcategories={isNavigationSubcategory(subcategory) ? undefined : (subcategory as Subcategory).subcategories}
                  onSubcategoryClick={handleSubcategoryClick}
                />
              );
            })}
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Hero />
      <Breadcrumb items={breadcrumbItems} onNavigate={handleNavigate} />
      
      <main className="container-custom max-w-[1920px] py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
