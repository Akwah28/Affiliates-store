import React from 'react';
import { Product } from '../types';
import { navigate } from '../lib/router';
import { ExternalLink, ArrowRight, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  categoryName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, categoryName }) => {
  const discountPercent = product.oldPrice && product.oldPrice > product.price 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : null;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-stone-300"
    >
      {/* Product Image Container */}
      <div 
        className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden cursor-pointer"
        onClick={() => navigate(`/product/${product.slug}`)}
      >
        <img
          src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {product.badge && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-stone-50 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-300" />
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="inline-flex px-2 py-0.5 text-xs font-semibold bg-rose-600 text-white rounded-md shadow-xs">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {categoryName && (
          <span className="absolute bottom-3 left-3 text-xs font-medium px-2.5 py-1 bg-white/90 backdrop-blur-xs text-stone-700 rounded-md border border-stone-200/60 shadow-xs">
            {categoryName}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 
          className="text-base font-semibold text-stone-900 line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer"
          onClick={() => navigate(`/product/${product.slug}`)}
        >
          {product.name}
        </h3>

        {product.shortDescription && (
          <p className="mt-2 text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        )}

        {/* Price & Action */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-stone-100">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-stone-900">
                ${product.price.toFixed(2)}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-stone-400 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-400">Partner store price</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`view-btn-${product.id}`}
              type="button"
              onClick={() => navigate(`/product/${product.slug}`)}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              title="View details"
              aria-label="View product details"
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              id={`buy-btn-${product.id}`}
              href={`/go/${product.id}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/go/${product.id}`);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors shadow-xs"
            >
              <span>{product.ctaText || 'Buy Now'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-90" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
