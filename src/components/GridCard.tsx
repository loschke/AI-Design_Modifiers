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
  onClick, 
  items,
  subcategories,
  modifiers,
  onSubcategoryClick
}: GridCardProps) => {
  const handleItemClick = (e: React.MouseEvent, key: string, item: NavigationSubcategory | Subcategory | Category | Modifier) => {
    e.stopPropagation();
    if (onSubcategoryClick) {
      onSubcategoryClick(key, item);
    }
  };

  const renderItems = (items: string[] | Record<string, string[]>, title?: string) => {
    if (Array.isArray(items)) {
      return (
        <div className="flex flex-wrap gap-4">
          {items.slice(0, 3).map((item, index) => (
            <button 
              key={index}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-base-200 text-base-content hover:bg-accent hover:text-accent-content transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {item}
            </button>
          ))}
          {items.length > 3 && (
            <span className="text-sm text-neutral-content self-center font-medium px-2">
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
      <div className="flex flex-col gap-4 mt-4">
        {title && <h4 className="text-sm font-bold text-neutral-content/50 uppercase tracking-wide">{title}</h4>}
        <h4 className="text-sm font-bold text-neutral-content/50 uppercase tracking-wide">{key}</h4>
        <div className="flex flex-wrap gap-4">
          {values.slice(0, 3).map((value, valueIndex) => (
            <button 
              key={`${key}-${valueIndex}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-base-200 text-base-content hover:bg-accent hover:text-accent-content transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {value}
            </button>
          ))}
          {values.length > 3 && (
            <span className="text-sm text-neutral-content font-medium self-center px-2">
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
      <div className="mt-6 space-y-4">
        <h4 className="text-sm font-bold text-neutral-content/50 uppercase tracking-wide">Beinhaltet:</h4>
        <div className="flex flex-wrap gap-4">
          {Object.entries(subcategories).map(([key, subcategory]) => (
            <button 
              key={key}
              onClick={(e) => handleItemClick(e, key, subcategory)}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-base-200 text-base-content hover:bg-accent hover:text-accent-content transition-all duration-300 shadow-sm hover:shadow-md"
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
      <div className="mt-6 space-y-4">
        <h4 className="text-sm font-bold text-neutral-content/50 uppercase tracking-wide">Beinhaltet:</h4>
        <div className="flex flex-wrap gap-4">
          {Object.entries(modifiers).map(([key, modifier]) => (
            <span 
              key={key} 
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-base-200 text-base-content"
            >
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
      className="card bg-base-300/50 backdrop-blur-sm hover:bg-base-200 cursor-pointer group transition-all duration-300 border border-base-200/20 hover:border-accent/20"
    >
      <div className="flex flex-col gap-6">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-black text-base-content group-hover:text-accent truncate transition-colors duration-300">
            {title}
          </h3>
          <p className="mt-2 text-base text-neutral-content/90 leading-relaxed">
            {description}
          </p>
          
          {renderSubcategories()}
          
          {items && (
            <div className="mt-6">
              {renderItems(items)}
            </div>
          )}

          {renderModifiers()}
        </div>
      </div>
    </div>
  );
};
