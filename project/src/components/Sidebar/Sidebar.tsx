import React from 'react';
import { Home, CheckSquare, ListTodo, Settings, PieChart, Calendar } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Category } from '../../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  categories,
  isOpen,
  onClose
}) => {
  const { t } = useLanguage();
  
  const mainNavItems = [
    { id: 'dashboard', label: t('dashboard'), icon: Home },
    { id: 'weekly', label: t('weekly'), icon: Calendar },
    { id: 'all', label: t('all_tasks'), icon: ListTodo },
    { id: 'active', label: t('active'), icon: PieChart },
    { id: 'completed', label: t('completed'), icon: CheckSquare },
  ];
  
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    if (window.innerWidth < 768) {
      onClose();
    }
  };
  
  return (
    <>
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={onClose}
        ></div>
      )}
    
      <aside 
        className={`
          fixed md:sticky top-0 bottom-0 left-0 z-20
          w-64 h-screen md:h-[calc(100vh-4rem)] 
          bg-white dark:bg-dark-800 
          shadow-md overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 sticky top-0 bg-white dark:bg-dark-800 z-10 border-b border-gray-100 dark:border-dark-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('app.title')}</h2>
        </div>
        
        <nav className="px-3 py-2">
          <div className="mb-6">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Main
            </p>
            <ul>
              {mainNavItems.map(item => {
                const Icon = item.icon;
                return (
                  <li key={item.id} className="mb-1">
                    <button
                      onClick={() => handleTabClick(item.id)}
                      className={`
                        w-full flex items-center px-3 py-2 text-sm rounded-xl
                        transition-colors duration-200
                        ${activeTab === item.id 
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 font-medium' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'}
                      `}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          
          {categories.length > 0 && (
            <div>
              <p className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('categories')}
              </p>
              <ul>
                {categories.map(category => (
                  <li key={category.id} className="mb-1">
                    <button
                      onClick={() => handleTabClick(category.id)}
                      className={`
                        w-full flex items-center px-3 py-2 text-sm rounded-xl
                        transition-colors duration-200
                        ${activeTab === category.id 
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 font-medium' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'}
                      `}
                    >
                      <div 
                        className="w-5 h-5 mr-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-6">
            <button
              onClick={() => handleTabClick('settings')}
              className={`
                w-full flex items-center px-3 py-2 text-sm rounded-xl
                transition-colors duration-200
                ${activeTab === 'settings'
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'}
              `}
            >
              <Settings className="h-5 w-5 mr-3" />
              {t('settings')}
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;