import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { getAffiliateClicks } from '../../lib/storeService';
import { AffiliateClick, Product } from '../../types';
import { navigate } from '../../lib/router';
import { 
  Package, 
  CheckCircle2, 
  MousePointerClick, 
  Sparkles, 
  Plus, 
  ExternalLink,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export const AdminDashboardOverview: React.FC = () => {
  const { products, categories, settings } = useStore();
  const [clicks, setClicks] = useState<AffiliateClick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const data = await getAffiliateClicks(settings.id);
      setClicks(data);
      setLoading(false);
    }
    loadStats();
  }, [settings.id]);

  // Statistics calculation
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === 'active').length;
  const featuredProductsCount = products.filter((p) => p.featured).length;
  const totalClicks = clicks.length;

  // Clicks per product calculation
  const clickCountByProduct = clicks.reduce((acc, c) => {
    acc[c.productId] = (acc[c.productId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top clicked products
  const topProductsWithClicks = Object.entries(clickCountByProduct)
    .map(([productId, count]) => {
      const prod = products.find((p) => p.id === productId);
      return {
        product: prod,
        productId,
        clicks: Number(count)
      };
    })
    .sort((a, b) => (b.clicks as number) - (a.clicks as number))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Store Dashboard Overview</h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time analytics, inventory metrics, and affiliate conversion links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/admin/products/new')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Real Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Total Products</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">{totalProducts}</span>
            <span className="text-xs text-stone-400 font-medium">listings</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Active on Store</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">{activeProducts}</span>
            <span className="text-xs text-emerald-600 font-medium">live now</span>
          </div>
        </div>

        {/* Total Affiliate Clicks */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Total Affiliate Clicks</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">
              {loading ? '...' : totalClicks}
            </span>
            <span className="text-xs text-indigo-600 font-medium">redirects recorded</span>
          </div>
        </div>

        {/* Featured Products */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Featured Spotlights</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">{featuredProductsCount}</span>
            <span className="text-xs text-amber-600 font-medium">highlighted</span>
          </div>
        </div>
      </div>

      {/* Grid: Top Clicked Products & Quick Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Clicked Products Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">Top Performing Affiliate Links</h2>
              <p className="text-xs text-stone-500">Products generating the highest customer clicks and redirects</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/admin/analytics')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-stone-400">Loading click statistics...</div>
          ) : topProductsWithClicks.length === 0 ? (
            <div className="py-12 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200">
              <MousePointerClick className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-xs text-stone-600 font-medium">No affiliate clicks recorded yet.</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Click "Buy Now" on any storefront product to see live tracking here.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {topProductsWithClicks.map(({ product, productId, clicks }) => (
                <div key={productId} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {product?.image ? (
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-500 shrink-0">
                        ?
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {product?.name || `Product ID: ${productId}`}
                      </p>
                      <p className="text-[11px] text-stone-400 truncate">
                        ${product?.price?.toFixed(2) || '0.00'} • {product?.affiliateUrl || 'Custom link'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-black text-indigo-600">{clicks}</span>
                      <span className="text-[10px] text-stone-400 block uppercase tracking-wider font-semibold">clicks</span>
                    </div>
                    {product && (
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                        className="text-xs text-stone-400 hover:text-stone-700 p-1"
                        title="Edit product"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Store Health */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
          <h2 className="text-base font-bold text-stone-900">Store Quick Controls</h2>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate('/admin/products/new')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-stone-200 hover:border-indigo-400 bg-stone-50 hover:bg-indigo-50/50 transition-colors text-left"
            >
              <div>
                <span className="text-xs font-bold text-stone-900 block">Add New Product</span>
                <span className="text-[11px] text-stone-500">Insert images, price, and affiliate URL</span>
              </div>
              <Plus className="w-4 h-4 text-indigo-600 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/categories')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-stone-200 hover:border-indigo-400 bg-stone-50 hover:bg-indigo-50/50 transition-colors text-left"
            >
              <div>
                <span className="text-xs font-bold text-stone-900 block">Manage Categories</span>
                <span className="text-[11px] text-stone-500">{categories.length} categories configured</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/settings')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-stone-200 hover:border-indigo-400 bg-stone-50 hover:bg-indigo-50/50 transition-colors text-left"
            >
              <div>
                <span className="text-xs font-bold text-stone-900 block">Store Branding & SEO</span>
                <span className="text-[11px] text-stone-500">Logo, social links, and meta tags</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
            </button>
          </div>

          <div className="p-4 bg-stone-100 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
            <span className="font-semibold text-stone-900 block">Affiliate Architecture</span>
            <p className="text-[11px] text-stone-500">
              Each click on "Buy Now" routes via <code className="text-indigo-600 bg-stone-200 px-1 py-0.5 rounded">/go/:productId</code>, records verified timestamp & referrer into Firestore, then safely forwards users to external partner URLs.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
