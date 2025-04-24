import React, { useState } from 'react';
import Button from '../ui/Button';
import { Plus, Menu, Search, X, User, Sun, Moon, CheckCircle } from 'lucide-react';
import ProfilePage from '../Profile/ProfilePage';
import { useLanguage } from '../../contexts/LanguageContext';

interface HeaderProps {
  onAddTask: () => void;
  onToggleSidebar: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onAddTask, 
  onToggleSidebar, 
  theme,
  onToggleTheme 
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { t } = useLanguage();
  
  return (
    <>
      <header className="sticky top-0 z-10 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="p-2 mr-2 md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl transition-colors duration-200"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <a 
              href="/"
              className="flex items-center mr-4 hover:opacity-80 transition-opacity"
            >
              <CheckCircle className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                TaskFlow
              </span>
            </a>
            
            {searchOpen ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('search')}
                  className="w-full md:w-64 py-2 pl-9 pr-4 bg-gray-100 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl transition-colors duration-200 md:flex items-center hidden"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
                <span className="ml-2 text-sm">{t('search')}</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={onAddTask}
              variant="primary"
              size="md"
            >
              <div className="flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                {t('add_task')}
              </div>
            </Button>

            <button
              onClick={onToggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl transition-colors duration-200"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={() => setShowProfile(true)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl transition-colors duration-200"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {showProfile && (
        <ProfilePage onClose={() => setShowProfile(false)} />
      )}
    </>
  );
};

export default Header;