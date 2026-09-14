import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { navigate } from '../lib/router';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface ShopPageProps {
  initialCategoryId?: string;
  categorySlug?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ categorySlug }) => {
  const { categories, products, loading } = useStore();
  
  // URL search query extraction if present
  const searchParams = new URLSearchParams(window.location.search);
  const initialSearch = searchParams.get('q') || '';

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(() => {
    if (categorySlug) {
      const matched = categories.find((c) => c.slug === categorySlug);
      return matched ? matched.id : 'all';
    }
    return 'all';
  });
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'featured'>('newest');

  // If categorySlug prop changed or loaded
  React.useEffect(() => {
    if (categorySlug && categories.length > 0) {
      const matched = categories.find((c) => c.slug === categorySlug);
      if (matched) {
        setSelectedCategoryId(matched.id);
      }
    }
  }, [categorySlug, categories]);

  const currentCategory = categories.find((c) => c.id === selectedCategoryId);

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => p.status === 'active');

    if (selectedCategoryId && selectedCategoryId !== 'all') {
      list = list.filter((p) => p.categoryId === selectedCategoryId);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => 
        p.name.toLowerCase().includes(q) || 
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sort
    return [...list].sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      }
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  }, [products, selectedCategoryId, search, sortBy]);

  const getCategoryName = (catId?: string) => {
    if (!catId) return undefined;
    return categories.find((c) => c.id === catId)?.name;
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            {currentCategory ? currentCategory.name : 'All Curated Products'}
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            {currentCategory?.description || 'Browse our complete directory of editor-approved gear and affiliate recommendations.'}
          </p>
        </div>

        {/* Filter and Search Controls Bar */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              id="shop-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords or brand..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-stone-300 outline-hidden transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Select Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-400 shrink-0" />
              <select
                id="shop-category-select"
                value={selectedCategoryId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedCategoryId(val);
                  if (val === 'all') {
                    navigate('/shop');
                  } else {
                    const cat = categories.find((c) => c.id === val);
                    if (cat) navigate(`/category/${cat.slug}`);
                  }
                }}
                className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-700 outline-hidden cursor-pointer"
              >
                <option value="all">All Categories ({products.filter((p) => p.status === 'active').length})</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-stone-400 shrink-0" />
              <select
                id="shop-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-700 outline-hidden cursor-pointer"
              >
                <option value="newest">Latest Added</option>
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-72 rounded-xl bg-stone-100 animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
            <h3 className="text-base font-semibold text-stone-900">No products match your criteria</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query or selecting a different category from the filters above.
            </p>
            <button
              type="button"
              onClick={() => { setSearch(''); setSelectedCategoryId('all'); }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                categoryName={getCategoryName(product.categoryId)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
