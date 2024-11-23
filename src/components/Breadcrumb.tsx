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
    <nav className="container-custom py-4">
      <ol className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
        <li>
          <button
            onClick={() => onNavigate('/')}
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Home
          </button>
        </li>
        
        {items.map((item, index) => (
          <li key={item.path} className="flex items-center">
            <svg
              className="w-4 h-4 mx-2"
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
                  ? 'text-blue-600 dark:text-blue-400 font-medium'
                  : 'hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};
