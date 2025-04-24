import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { X, Plus, Palette, Tag, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Input from '../ui/Input';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategoryManagerProps {
  onClose: () => void;
  onCategoryChange: () => void;
}

const COLORS = [
  { name: 'Rouge', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Jaune', value: '#eab308' },
  { name: 'Vert', value: '#22c55e' },
  { name: 'Bleu', value: '#3b82f6' },
  { name: 'Violet', value: '#a855f7' },
  { name: 'Rose', value: '#ec4899' },
  { name: 'Gris', value: '#64748b' }
];

const CategoryManager: React.FC<CategoryManagerProps> = ({ onClose, onCategoryChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', color: COLORS[0].value });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des catégories');
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      if (!newCategory.name.trim()) {
        setError('Le nom de la catégorie est requis');
        return;
      }

      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('categories')
        .insert([{
          name: newCategory.name.trim(),
          color: newCategory.color,
          user_id: userData.user?.id
        }]);

      if (error) {
        if (error.code === '23505') {
          setError('Cette catégorie existe déjà');
          return;
        }
        throw error;
      }

      await loadCategories();
      onCategoryChange();
      setNewCategory({ name: '', color: COLORS[0].value });
      setError('');
      toast.success('Catégorie ajoutée avec succès');
    } catch (error: any) {
      toast.error('Erreur lors de l\'ajout de la catégorie');
      console.error('Error adding category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadCategories();
      onCategoryChange();
      toast.success('Catégorie supprimée avec succès');
    } catch (error: any) {
      toast.error('Erreur lors de la suppression de la catégorie');
      console.error('Error deleting category:', error);
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
                <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Gérer les catégories
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
            <div className="flex space-x-3">
              <Input
                placeholder="Nouvelle catégorie"
                value={newCategory.name}
                onChange={(e) => {
                  setNewCategory(prev => ({ ...prev, name: e.target.value }));
                  setError('');
                }}
                error={error}
                fullWidth
              />
              <div className="relative">
                <button
                  className="w-10 h-10 rounded-xl border border-gray-200 dark:border-dark-600"
                  style={{ backgroundColor: newCategory.color }}
                >
                  <Palette className="w-5 h-5 text-white mx-auto" />
                </button>
                <div className="absolute top-full right-0 mt-2 p-2 bg-white dark:bg-dark-700 rounded-xl shadow-lg border border-gray-100 dark:border-dark-600 grid grid-cols-4 gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color.value}
                      className="w-6 h-6 rounded-full hover:ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-dark-700"
                      style={{ backgroundColor: color.value }}
                      onClick={() => setNewCategory(prev => ({ ...prev, color: color.value }))}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={handleAddCategory}
              disabled={loading}
              fullWidth
              className="mt-3"
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
            {categories.map(category => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-gray-900 dark:text-white font-medium">
                    {category.name}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
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

export default CategoryManager;