import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { X, Plus, Globe, Monitor, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { BlockedResource } from '../../types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface BlockedResourceManagerProps {
  onClose: () => void;
}

const BlockedResourceManager: React.FC<BlockedResourceManagerProps> = ({ onClose }) => {
  const [resources, setResources] = useState<BlockedResource[]>([]);
  const [newResource, setNewResource] = useState({ url: '', name: '', type: 'website' as const });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blocked_resources')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setResources(data || []);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des ressources');
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = async () => {
    try {
      if (!newResource.url.trim() || !newResource.name.trim()) {
        setError('Tous les champs sont requis');
        return;
      }

      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('blocked_resources')
        .insert([{
          url: newResource.url.trim(),
          name: newResource.name.trim(),
          type: newResource.type,
          user_id: userData.user?.id
        }]);

      if (error) {
        if (error.code === '23505') {
          setError('Cette ressource existe déjà');
          return;
        }
        throw error;
      }

      await loadResources();
      setNewResource({ url: '', name: '', type: 'website' });
      setError('');
      toast.success('Ressource ajoutée avec succès');
    } catch (error: any) {
      toast.error('Erreur lors de l\'ajout de la ressource');
      console.error('Error adding resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('blocked_resources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadResources();
      toast.success('Ressource supprimée avec succès');
    } catch (error: any) {
      toast.error('Erreur lors de la suppression de la ressource');
      console.error('Error deleting resource:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100 dark:border-dark-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Gérer les ressources bloquées
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
              hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="space-y-4">
              <Input
                placeholder="URL ou nom de l'application"
                value={newResource.url}
                onChange={(e) => {
                  setNewResource(prev => ({ ...prev, url: e.target.value }));
                  setError('');
                }}
                error={error}
                fullWidth
              />
              <Input
                placeholder="Nom à afficher"
                value={newResource.name}
                onChange={(e) => {
                  setNewResource(prev => ({ ...prev, name: e.target.value }));
                  setError('');
                }}
                fullWidth
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => setNewResource(prev => ({ ...prev, type: 'website' }))}
                  className={`flex-1 py-2 px-3 rounded-xl border transition-all duration-200 ${
                    newResource.type === 'website'
                      ? 'bg-gray-100 dark:bg-dark-700 border-gray-300 dark:border-dark-600'
                      : 'bg-white dark:bg-dark-800 border-transparent hover:bg-gray-50 dark:hover:bg-dark-700'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <Globe className="w-4 h-4 mr-1.5 text-blue-500 dark:text-blue-400" />
                    <span className={`text-sm font-medium ${
                      newResource.type === 'website'
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      Site Web
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setNewResource(prev => ({ ...prev, type: 'application' }))}
                  className={`flex-1 py-2 px-3 rounded-xl border transition-all duration-200 ${
                    newResource.type === 'application'
                      ? 'bg-gray-100 dark:bg-dark-700 border-gray-300 dark:border-dark-600'
                      : 'bg-white dark:bg-dark-800 border-transparent hover:bg-gray-50 dark:hover:bg-dark-700'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <Monitor className="w-4 h-4 mr-1.5 text-purple-500 dark:text-purple-400" />
                    <span className={`text-sm font-medium ${
                      newResource.type === 'application'
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      Application
                    </span>
                  </div>
                </button>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={handleAddResource}
              disabled={loading}
              fullWidth
              className="mt-4"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div className="flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Ajouter
                </div>
              )}
            </Button>
          </div>

          <div className="space-y-2">
            {resources.map(resource => (
              <div
                key={resource.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  {resource.type === 'website' ? (
                    <Globe className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  ) : (
                    <Monitor className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                  )}
                  <div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {resource.name}
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {resource.url}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteResource(resource.id)}
                  className="p-1.5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400
                  hover:bg-gray-100 dark:hover:bg-dark-600 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockedResourceManager;