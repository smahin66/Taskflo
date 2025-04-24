import React from 'react';
import { CheckCircle, Moon, Sun } from 'lucide-react';
import Button from '../ui/Button';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme, onLogin }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
              TaskFlow
            </span>
          </div>

          <div className="flex items-center space-x-4">
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

            <Button
              variant="primary"
              size="md"
              onClick={onLogin}
            >
              Se connecter
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;