import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { navigate } from '../lib/router';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Layers 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { settings, categories, products, loading } = useStore();

  const activeProducts = products.filter((p) => p.status === 'active');
  const featuredProducts = activeProducts.filter((p) => p.featured);
  const regularProducts = activeProducts.slice(0, 8);

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return undefined;
    return categories.find((c) => c.id === categoryId)?.name;
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white border-b border-stone-200">
        <div className="absolute inset-0 bg-radial from-indigo-50/50 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200/80 text-stone-700 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Verified Editor Reviews & Recommendations</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.1]">
              Top-Tier Tech, Gear, & Everyday Essentials.
            </h1>

            <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-2xl">
              {settings.description} We research, test, and hand-select verified products so you never waste money on hype.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                id="hero-explore-btn"
                type="button"
                onClick={() => navigate('/shop')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-sm shadow-indigo-200 active:scale-98"
              >
                <span>Browse All Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 text-xs font-medium text-stone-500 pl-2">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Direct vendor links
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Zero markups
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES PILLS / BAR */}
      {categories.length > 0 && (
        <section className="py-8 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Popular Categories</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  id={`cat-card-${cat.id}`}
                  onClick={() => navigate(`/category/${cat.slug}`)}
                  className="group relative flex items-center gap-3 p-3 bg-stone-50 hover:bg-indigo-50/60 border border-stone-200 hover:border-indigo-300 rounded-xl cursor-pointer transition-all duration-200"
                >
                  {cat.image ? (
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-11 h-11 rounded-lg object-cover border border-stone-200 shrink-0 group-hover:scale-105 transition-transform" 
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-lg bg-stone-200 flex items-center justify-center font-bold text-stone-600 shrink-0">
                      {cat.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-stone-900 truncate group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </p>
                    <span className="text-[11px] text-stone-500">
                      {products.filter((p) => p.categoryId === cat.id && p.status === 'active').length} items
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Featured Selections</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                  Editor's Handpicked Highlights
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start sm:self-auto"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  categoryName={getCategoryName(product.categoryId)} 
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MAIN CATALOG GRID */}
      <section className="py-12 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                Latest Recommended Gear
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Updated weekly with current deals and verified retailer links.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              See all ({activeProducts.length})
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-72 rounded-xl bg-stone-100 animate-pulse" />
              ))}
            </div>
          ) : regularProducts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-stone-200 rounded-xl bg-stone-50">
              <p className="text-sm text-stone-500">No active products found in the catalog.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {regularProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  categoryName={getCategoryName(product.categoryId)} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TRUST & TRANSPARENCY NOTICE */}
      <section className="py-12 bg-stone-100 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2 max-w-2xl">
              <h3 className="text-lg font-bold text-stone-900">
                How Our Affiliate Program Operates
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                When you click "Buy Now" on our recommendations, you will be seamlessly directed to verified merchant partner websites (e.g. Amazon, Keychron, Peak Design) using our tracked affiliate tag. We never mark up prices, collect personal billing info, or fulfill shipments.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="shrink-0 px-5 py-2.5 text-xs font-semibold rounded-lg bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors"
            >
              Start Exploring
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
