import { useState, useEffect } from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check system preference and localStorage for dark mode
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedPreference = localStorage.getItem('darkMode');
    const shouldEnableDarkMode = storedPreference 
      ? storedPreference === 'true'
      : darkModePreference;
    
    setIsDarkMode(shouldEnableDarkMode);
    updateDarkMode(shouldEnableDarkMode);
  }, []);

  const updateDarkMode = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', enabled.toString());
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    updateDarkMode(!isDarkMode);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            AI Design Modifiers
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search modifiers..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-64 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
