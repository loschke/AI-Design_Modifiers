import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Breadcrumb } from './components/Breadcrumb';
import { GridCard } from './components/GridCard';
import { SubcategoryDetail } from './components/SubcategoryDetail';
import { Cluster, Category, Subcategory, NavigationSubcategory, Modifier, CategoryItem, SubcategoryData } from './types/data';

type SubcategoryEntry = [string, NavigationSubcategory | Subcategory];

function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [breadcrumbItems, setBreadcrumbItems] = useState<Array<{ label: string; path: string }>>([]);
  const [clusters, setClusters] = useState<Record<string, Cluster>>({});
  const [currentCluster, setCurrentCluster] = useState<Cluster | null>(null);
  const [currentCategoryData, setCurrentCategoryData] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryData | null>(null);
  const [categoryDataMap, setCategoryDataMap] = useState<Record<string, Category>>({});
  const [subcategoryDataMap, setSubcategoryDataMap] = useState<Record<string, SubcategoryData>>({});
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

      // Load subcategory data for previews
      const firstCategoryKey = Object.keys(newCategoryDataMap)[0];
      const loadedCategoryData = newCategoryDataMap[firstCategoryKey];
      if (loadedCategoryData?.subcategories) {
        const subcategoryPromises = (Object.entries(loadedCategoryData.subcategories) as SubcategoryEntry[]).map(async ([key, subcat]) => {
          if ('path' in subcat) {
            try {
              const subcategoryData = await import(`./data/${clusterName}/${firstCategoryKey}/${key}/${key}.json`);
              return [key, subcategoryData.default] as const;
            } catch (err) {
              console.error(`Failed to load subcategory data for ${key}:`, err);
              return [key, null] as const;
            }
          }
          return [key, null] as const;
        });

        const subcategoryEntries = await Promise.all(subcategoryPromises);
        const newSubcategoryDataMap = Object.fromEntries(
          subcategoryEntries.filter(([, data]) => data !== null)
        ) as Record<string, SubcategoryData>;
        setSubcategoryDataMap(newSubcategoryDataMap);
      }
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

      // Load subcategory data for previews
      if (data.default.subcategories) {
        const subcategoryPromises = (Object.entries(data.default.subcategories) as SubcategoryEntry[]).map(async ([key, subcat]) => {
          if ('path' in subcat) {
            try {
              const subcategoryData = await import(`./data/${clusterName}/${categoryPath}/${key}/${key}.json`);
              return [key, subcategoryData.default] as const;
            } catch (err) {
              console.error(`Failed to load subcategory data for ${key}:`, err);
              return [key, null] as const;
            }
          }
          return [key, null] as const;
        });

        const subcategoryEntries = await Promise.all(subcategoryPromises);
        const newSubcategoryDataMap = Object.fromEntries(
          subcategoryEntries.filter(([, data]) => data !== null)
        ) as Record<string, SubcategoryData>;
        setSubcategoryDataMap(newSubcategoryDataMap);
      }
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
      const category = pathParts[0];
      const subcategory = pathParts[pathParts.length - 1];
      
      // Load the subcategory data using the correct path structure including the category
      const data = await import(`./data/${clusterName}/${category}/${subcategory}/${subcategory}.json`);
      
      // Create a proper SubcategoryData object that includes both items and modifiers
      const subcategoryData: SubcategoryData = {
        name: data.default.name,
        description: data.default.description,
        items: data.default.items,
        modifiers: data.default.modifiers
      };
      
      setSelectedSubcategory(subcategoryData);
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
        loadClusterData(clusterName);
      } else if (level === 2) {
        loadCategoryData(clusterName, pathParts[1]);
      } else if (level === 3) {
        loadSubcategoryData(clusterName, pathParts.slice(1).join('/'));
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

  const handleCardClick = (item: CategoryItem | Modifier, itemPath: string) => {
    const pathParts = currentPath.split('/').filter(Boolean);
    const clusterName = pathParts[0];

    if (isNavigationSubcategory(item)) {
      handleNavigate(itemPath);
    } else if ('items' in item || 'modifiers' in item) {
      if (pathParts.length === 2) {
        loadSubcategoryData(clusterName, `${pathParts[1]}/${itemPath}`);
        const newBreadcrumbItems = [...breadcrumbItems, {
          label: item.name,
          path: `${currentPath}${itemPath}`
        }];
        setBreadcrumbItems(newBreadcrumbItems);
        setCurrentPath(`${currentPath}${itemPath}/`);
      } else {
        setSelectedSubcategory(item as SubcategoryData);
      }
    } else {
      handleNavigate(itemPath);
    }
  };

  const handleSubcategoryClick = (key: string, item: NavigationSubcategory | Subcategory | Category | Modifier) => {
    const pathParts = currentPath.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      handleCardClick(item, key);
    }
  };

  const isNavigationSubcategory = (
    item: CategoryItem | Modifier
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
          {Object.entries(currentCluster.categories).map(([key, category]) => {
            const categoryData = categoryDataMap[key];
            let previewItems: string[] | Record<string, string[]> | undefined;
            let previewModifiers: Record<string, Modifier> | undefined;

            // Get preview data from the category's data
            if (categoryData) {
              if (categoryData.items) {
                previewItems = categoryData.items;
              } else if (categoryData.modifiers) {
                previewModifiers = categoryData.modifiers;
              }
            }

            return (
              <GridCard
                key={key}
                title={category.name}
                description={category.description}
                icon="📁"
                onClick={() => handleCardClick(category, key)}
                subcategories={categoryData?.subcategories}
                items={previewItems}
                modifiers={previewModifiers}
                onSubcategoryClick={handleSubcategoryClick}
              />
            );
          })}
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
              if (isNavigationSubcategory(subcategory)) {
                const subcategoryData = subcategoryDataMap[key];
                let previewItems: string[] | Record<string, string[]> | undefined;
                let previewModifiers: Record<string, Modifier> | undefined;

                // Get preview data from the subcategory's data
                if (subcategoryData) {
                  if (subcategoryData.items) {
                    previewItems = subcategoryData.items;
                  } else if (subcategoryData.modifiers) {
                    previewModifiers = subcategoryData.modifiers;
                  }
                }

                return (
                  <GridCard
                    key={key}
                    title={subcategory.name}
                    description={subcategory.description || ''}
                    icon="📄"
                    onClick={() => handleCardClick(subcategory, key)}
                    items={previewItems}
                    modifiers={previewModifiers}
                  />
                );
              }

              return (
                <GridCard
                  key={key}
                  title={subcategory.name}
                  description={subcategory.description || ''}
                  icon="📄"
                  onClick={() => handleCardClick(subcategory, key)}
                  items={(subcategory as Subcategory).items}
                  subcategories={(subcategory as Subcategory).subcategories}
                  modifiers={(subcategory as Subcategory).modifiers}
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
