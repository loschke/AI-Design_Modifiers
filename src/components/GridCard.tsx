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
              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-accent text-accent-content hover:bg-primary hover:text-primary-content transition-colors duration-200"
            >
              {item}
            </button>
          ))}
          {items.length > 3 && (
            <span className="text-sm text-neutral-content self-center">
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
        {title && <h4 className="text-sm font-black italic text-neutral-content">{title}</h4>}
        <h4 className="text-sm font-black italic text-neutral-content">{key}</h4>
        <div className="flex flex-wrap gap-2">
          {values.slice(0, 3).map((value, valueIndex) => (
            <button 
              key={`${key}-${valueIndex}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-accent text-accent-content hover:bg-primary hover:text-primary-content transition-colors duration-200"
            >
              {value}
            </button>
          ))}
          {values.length > 3 && (
            <span className="text-sm text-neutral-content font-bold self-center">
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
        <h4 className="text-sm font-black italic text-neutral-content">Beinhaltet:</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(subcategories).map(([key, subcategory]) => (
            <button 
              key={key}
              onClick={(e) => handleItemClick(e, key, subcategory)}
              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-accent text-accent-content hover:bg-primary hover:text-primary-content transition-colors duration-200"
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
        <h4 className="text-sm font-black italic text-neutral-content">Beinhaltet:</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(modifiers).map(([key, modifier]) => (
            <span key={key} className="text-sm text-base-content font-bold">
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
      className="card cursor-pointer group hover:bg-base-200 transition-colors duration-200"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-neutral">
              <span className="text-neutral-content text-lg">
                {icon}
              </span>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-black italic text-base-content group-hover:text-accent truncate">
              {title}
            </h3>
            <p className="mt-1 text-sm text-neutral-content">
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
