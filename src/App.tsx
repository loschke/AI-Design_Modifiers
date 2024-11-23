import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Breadcrumb } from './components/Breadcrumb';
import { GridCard } from './components/GridCard';
import { SubcategoryDetail } from './components/SubcategoryDetail';
import { Cluster, Category, Subcategory, NavigationSubcategory, Modifier, CategoryItem } from './types/data';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPath, setCurrentPath] = useState('/');
  const [breadcrumbItems, setBreadcrumbItems] = useState<Array<{ label: string; path: string }>>([]);
  const [clusters, setClusters] = useState<Record<string, Cluster>>({});
  const [currentCluster, setCurrentCluster] = useState<Cluster | null>(null);
  const [currentCategoryData, setCurrentCategoryData] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | Modifier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [navigationLevel, setNavigationLevel] = useState(0);
  const [currentClusterName, setCurrentClusterName] = useState<string | null>(null);

  useEffect(() => {
    loadClusters();
  }, []);

  const loadClusters = async () => {
    try {
      const conceptData = await import('./data/concept/concept.json');
      const contextData = await import('./data/context/context.json');
      
      setClusters({
        concept: conceptData.default,
        context: contextData.default
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
      setCurrentClusterName(clusterName);
      setCurrentCategoryData(null);
    } catch (err) {
      setError(`Failed to load cluster data: ${clusterName}`);
      console.error('Error loading cluster data:', err);
    }
  };

  const loadCategoryData = async (clusterName: string, categoryPath: string) => {
    try {
      setLoading(true);
      const data = await import(`./data/${clusterName}/medium/medium.json`);
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
      const data = await import(`./data/${clusterName}/medium/${subcategoryPath}/${subcategoryPath}.json`);
      setSelectedSubcategory(data.default);
      setCurrentCategoryData(null); // Clear category data to show subcategory detail
    } catch (err) {
      setError(`Failed to load subcategory data: ${subcategoryPath}`);
      console.error('Error loading subcategory data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
      setCurrentClusterName(null);
      setCurrentCategoryData(null);
      setNavigationLevel(0);
      return;
    }

    const pathParts = path.split('/').filter(Boolean);
    const level = pathParts.length;
    setNavigationLevel(level);

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
          loadSubcategoryData(clusterName, pathParts[2]);
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
        handleNavigate(`/${currentClusterName}/medium/${pathSegment}`);
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
        loadSubcategoryData(clusterName, itemPath);
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

  const isNavigationSubcategory = (
    item: CategoryItem
  ): item is NavigationSubcategory => {
    return 'path' in item && typeof item.path === 'string';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header onSearch={handleSearch} />
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
        <Header onSearch={handleSearch} />
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
              imagePath={cluster.imagePath}
              onClick={() => handleCardClick(cluster, key)}
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
              imagePath={category.imagePath}
              onClick={() => handleCardClick(category, key)}
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
                imagePath={modifier.imagePath}
                onClick={() => handleCardClick(modifier, key)}
                items={modifier.items}
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
                : subcategory.items;

              return (
                <GridCard
                  key={key}
                  title={subcategory.name}
                  description={subcategory.description || ''}
                  icon="📄"
                  imagePath={subcategory.imagePath}
                  onClick={() => handleCardClick(subcategory, key)}
                  items={items}
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
      <Header onSearch={handleSearch} />
      <Breadcrumb items={breadcrumbItems} onNavigate={handleNavigate} />
      
      <main className="container-custom max-w-[1920px] py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
