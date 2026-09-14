import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { getProductBySlug } from '../lib/storeService';
import { Product } from '../types';
import { navigate } from '../lib/router';
import { 
  ExternalLink, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Share2,
  Check
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { categories } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      const prod = await getProductBySlug(slug);
      if (isMounted) {
        setProduct(prod);
        setLoading(false);
        if (prod) {
          document.title = `${prod.name} | View Product Deals`;
        }
      }
    }
    load();
    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-4/3 bg-stone-100 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-stone-100 rounded-md w-3/4 animate-pulse" />
            <div className="h-6 bg-stone-100 rounded-md w-1/4 animate-pulse" />
            <div className="h-24 bg-stone-100 rounded-md animate-pulse" />
            <div className="h-12 bg-stone-100 rounded-md w-1/2 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-900">Product Not Found</h2>
        <p className="mt-2 text-stone-600 text-sm">
          The requested product may have been archived, renamed, or is currently inactive.
        </p>
        <button
          type="button"
          onClick={() => navigate('/shop')}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Storefront
        </button>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const discountPercent = product.oldPrice && product.oldPrice > product.price 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Bar */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8">
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            className="hover:text-stone-900 transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button 
            type="button" 
            onClick={() => navigate('/shop')} 
            className="hover:text-stone-900 transition-colors"
          >
            Catalog
          </button>
          {category && (
            <>
              <span>/</span>
              <button 
                type="button" 
                onClick={() => navigate(`/category/${category.slug}`)} 
                className="hover:text-stone-900 transition-colors"
              >
                {category.name}
              </button>
            </>
          )}
          <span>/</span>
          <span className="text-stone-800 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs p-6 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            
            {/* Gallery Column */}
            <div className="space-y-4">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={allImages[activeImageIndex] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />

                {product.badge && (
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-stone-900 text-stone-50 rounded-full shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails if multiple */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx ? 'border-indigo-600 scale-95' : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Information Column */}
            <div className="flex flex-col">
              {category && (
                <div className="mb-2">
                  <span 
                    onClick={() => navigate(`/category/${category.slug}`)}
                    className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-indigo-600 hover:underline"
                  >
                    {category.name}
                  </span>
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Pricing Section */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-black text-stone-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.oldPrice && (
                  <span className="text-base text-stone-400 line-through">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                )}
                {discountPercent && (
                  <span className="px-2.5 py-0.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-md">
                    Save {discountPercent}% OFF
                  </span>
                )}
              </div>

              {product.shortDescription && (
                <p className="mt-4 text-sm text-stone-600 leading-relaxed border-l-2 border-indigo-200 pl-3 italic">
                  "{product.shortDescription}"
                </p>
              )}

              {/* Affiliate CTA Box */}
              <div className="mt-8 p-5 bg-stone-50 border border-stone-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Direct Retailer Recommendation
                  </span>
                  <span className="text-[11px] text-stone-400">External Merchant</span>
                </div>

                <a
                  id="product-buy-now-cta"
                  href={`/go/${product.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/go/${product.id}`);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-base rounded-xl transition-all shadow-md shadow-indigo-200 hover:shadow-lg"
                >
                  <span>{product.ctaText || 'Buy Now on Partner Site'}</span>
                  <ExternalLink className="w-5 h-5" />
                </a>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Safe official partner redirect. No extra fees.</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3 h-3" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Full Description & Specs */}
              <div className="mt-8 pt-8 border-t border-stone-200 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                  Product Overview & Review
                </h3>
                <div className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
