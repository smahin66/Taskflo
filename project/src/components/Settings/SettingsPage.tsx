import React, { useState } from 'react';
import { Globe, Monitor, Settings as SettingsIcon, Tag } from 'lucide-react';
import BlockedResourceManager from '../BlockedResources/BlockedResourceManager';
import CategoryManager from '../CategoryManager/CategoryManager';

const SettingsPage: React.FC = () => {
  const [showBlockedResources, setShowBlockedResources] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl">
          <SettingsIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Paramètres
        </h1>
      </div>

      <div className="grid gap-4">
        <button
          onClick={() => setShowBlockedResources(true)}
          className="flex items-center justify-between p-4 bg-white dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <h3 className="text-gray-900 dark:text-white font-medium">
                Ressources bloquées
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gérer les sites web et applications à bloquer
              </p>
            </div>
          </div>
          <span className="text-gray-400 dark:text-gray-500">&rarr;</span>
        </button>

        <button
          onClick={() => setShowCategories(true)}
          className="flex items-center justify-between p-4 bg-white dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
              <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-left">
              <h3 className="text-gray-900 dark:text-white font-medium">
                Catégories
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gérer les catégories de tâches
              </p>
            </div>
          </div>
          <span className="text-gray-400 dark:text-gray-500">&rarr;</span>
        </button>
      </div>

      {showBlockedResources && (
        <BlockedResourceManager onClose={() => setShowBlockedResources(false)} />
      )}

      {showCategories && (
        <CategoryManager
          onClose={() => setShowCategories(false)}
          onCategoryChange={() => {
            setShowCategories(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default SettingsPage;