import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  uploadProductImage 
} from '../../lib/storeService';
import { Category } from '../../types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Layers, 
  Upload, 
  Check, 
  AlertCircle,
  FolderPlus 
} from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, products, refreshStoreData, settings } = useStore();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [order, setOrder] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const resetForm = () => {
    setIsEditing(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setOrder(categories.length + 1);
    setError(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setIsEditing(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setOrder(cat.order || 0);
    setError(null);
    setShowModal(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
      );
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      const url = await uploadProductImage(file, 'categories');
      setImage(url);
    } catch (err) {
      console.warn('Image upload notice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }
    if (!slug.trim()) {
      setError('Category slug is required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        storeId: settings.id,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        image: image.trim(),
        order: Number(order) || 0,
      };

      if (isEditing) {
        await updateCategory(isEditing, payload);
      } else {
        await createCategory(payload);
      }

      await refreshStoreData();
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      console.warn('Category save notice:', err);
      setError(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        await refreshStoreData();
      } catch (err) {
        console.warn('Category delete notice:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Category Organization</h1>
          <p className="text-xs text-stone-500 mt-1">
            Group products into accessible taxonomies with custom navigation slugs.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Cards / Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <div key={cat.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-xl object-cover border border-stone-200" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base">
                      {cat.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">{cat.name}</h3>
                    <span className="text-[11px] font-mono text-stone-400">/{cat.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-stone-400 hover:text-indigo-600 rounded-md hover:bg-stone-50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-md hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {cat.description && (
                <p className="text-xs text-stone-500 line-clamp-2">
                  {cat.description}
                </p>
              )}

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>{productCount} products</span>
                <span className="text-[11px] text-stone-400">Order: {cat.order || 0}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h2 className="text-base font-bold text-stone-900">
              {isEditing ? 'Edit Category' : 'Create Category'}
            </h2>

            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Ergonomics & Desk Setup"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ergonomics-desk-setup"
                  className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description for category header"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                  />
                  <label className="cursor-pointer px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-24 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
