import { NavigationSubcategory, Subcategory, Category, Modifier } from '../types/data';

interface GridCardProps {
  title: string;
  description: string;
  icon?: string;
  onClick: () => void;
  items?: string[] | Record<string, string[]>;
  subcategories?: Record<string, NavigationSubcategory | Subcategory | Category>;
  modifiers?: Record<string, Modifier>;
  onSubcategoryClick?: (key: string, item: NavigationSubcategory | Subcategory | Category | Modifier) => void;
}

export const GridCard = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  items,
  subcategories,
  modifiers,
  onSubcategoryClick
}: GridCardProps) => {
  const handleItemClick = (e: React.MouseEvent, key: string, item: NavigationSubcategory | Subcategory | Category | Modifier) => {
    e.stopPropagation(); // Prevent card click when clicking subcategory
    if (onSubcategoryClick) {
      onSubcategoryClick(key, item);
    }
  };

  const renderItems = (items: string[] | Record<string, string[]>, title?: string) => {
    if (Array.isArray(items)) {
      return (
        <div className="flex flex-wrap gap-2">
          {items.slice(0, 3).map((item, index) => (
            <button 
              key={index}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
            >
              {item}
            </button>
          ))}
          {items.length > 3 && (
            <span className="text-sm text-gray-500 dark:text-gray-400 self-center">
              +{items.length - 3} more
            </span>
          )}
        </div>
      );
    }

    const firstCategory = Object.entries(items)[0];
    if (!firstCategory) return null;

    const [key, values] = firstCategory;
    return (
      <div className="flex flex-col gap-2 mt-3">
        {title && <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h4>}
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{key}</h4>
        <div className="flex flex-wrap gap-2">
          {values.slice(0, 3).map((value, valueIndex) => (
            <button 
              key={`${key}-${valueIndex}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
            >
              {value}
            </button>
          ))}
          {values.length > 3 && (
            <span className="text-sm text-gray-500 dark:text-gray-400 font-bold self-center">
              +{values.length - 3} more
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderSubcategories = () => {
    if (!subcategories) return null;

    return (
      <div className="mt-4 space-y-3">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Beinhaltet:</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(subcategories).map(([key, subcategory]) => (
            <button 
              key={key}
              onClick={(e) => handleItemClick(e, key, subcategory)}
              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
            >
              {subcategory.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderModifiers = () => {
    if (!modifiers) return null;

    return (
      <div className="mt-4 space-y-3">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Beinhaltet:</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(modifiers).map(([key, modifier]) => (
            <span key={key} className="text-sm text-gray-600 font-bold dark:text-gray-300">
              {modifier.name}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div 
      onClick={onClick}
      className="card cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <span className="text-blue-600 dark:text-blue-400 text-lg">
                {icon}
              </span>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
            
            {renderSubcategories()}
            
            {items && (
              <div className="mt-4">
                {renderItems(items)}
              </div>
            )}

            {renderModifiers()}
          </div>
        </div>
      </div>
    </div>
  );
};
