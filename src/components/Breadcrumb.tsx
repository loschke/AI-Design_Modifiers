interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export const Breadcrumb = ({ items, onNavigate }: BreadcrumbProps) => {
  return (
    <nav className="sticky top-0 z-50 bg-base-100 border-b border-base-200 shadow-sm">
      <div className="container-custom py-4">
        <ol className="flex items-center space-x-2">
          <li>
            <button
              onClick={() => onNavigate('/')}
              className="text-base-content hover:text-accent font-medium transition-colors"
            >
              Home
            </button>
          </li>
          
          {items.map((item, index) => (
            <li key={item.path} className="flex items-center">
              <svg
                className="w-5 h-5 mx-3 text-base-content/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              
              <button
                onClick={() => onNavigate(item.path)}
                className={`${
                  index === items.length - 1
                    ? 'text-accent font-bold'
                    : 'text-base-content hover:text-accent font-medium'
                } transition-colors`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};
