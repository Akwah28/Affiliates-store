import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { deleteProduct, updateProduct } from '../../lib/storeService';
import { Product } from '../../types';
import { navigate } from '../../lib/router';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  XCircle,
  AlertTriangle 
} from 'lucide-react';

export const AdminProductsListPage: React.FC = () => {
  const { products, categories, refreshStoreData } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
    if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.affiliateUrl.toLowerCase().includes(q) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'Uncategorized';
    return categories.find((c) => c.id === categoryId)?.name || 'Uncategorized';
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      await updateProduct(product.id, { status: newStatus });
      await refreshStoreData();
    } catch (err) {
      console.warn('Status toggle notice:', err);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      await updateProduct(product.id, { featured: !product.featured });
      await refreshStoreData();
    } catch (err) {
      console.warn('Featured toggle notice:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      setActionLoading(true);
      await deleteProduct(deletingId);
      await refreshStoreData();
      setDeletingId(null);
    } catch (err) {
      console.warn('Delete product notice:', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Product Catalog Management</h1>
          <p className="text-xs text-stone-500 mt-1">
            Create, edit, toggle visibility, and update affiliate partner links.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/admin/products/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or affiliate URL..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-700 outline-hidden cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-700 outline-hidden cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Affiliate URL</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">
                    No products match your filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                          alt={p.name}
                          className="w-11 h-11 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-stone-900 truncate">{p.name}</p>
                          <span className="text-[10px] text-stone-400 font-mono block">/{p.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-stone-600">
                      <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md text-[11px]">
                        {getCategoryName(p.categoryId)}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-stone-900">
                      ${p.price.toFixed(2)}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          p.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {p.status === 'active' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-stone-500" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                          p.featured
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-stone-50 text-stone-400 hover:text-stone-700'
                        }`}
                      >
                        <Sparkles className={`w-3 h-3 ${p.featured ? 'text-amber-500 fill-amber-500' : ''}`} />
                        <span>{p.featured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <a
                        href={p.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-[11px] max-w-[140px] truncate"
                        title={p.affiliateUrl}
                      >
                        <span className="truncate">{p.affiliateUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => navigate(`/product/${p.slug}`)}
                          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md"
                          title="View on storefront"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                          className="p-1.5 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingId(p.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Delete Product?</h3>
              <p className="text-xs text-stone-500 mt-1">
                This action will permanently delete this product and its storefront page. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
