import React, { useEffect, useState, useRef } from 'react';
import { getProductById, recordAffiliateClick } from '../lib/storeService';
import { Product } from '../types';
import { navigate } from '../lib/router';
import { Loader2, ExternalLink, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface AffiliateRedirectPageProps {
  productId: string;
}

export const AffiliateRedirectPage: React.FC<AffiliateRedirectPageProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const hasLoggedClick = useRef(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    async function processRedirect() {
      try {
        if (!productId) {
          setError('No product ID provided.');
          return;
        }

        const prod = await getProductById(productId);

        if (!prod) {
          setError('Product not found or has been removed.');
          return;
        }

        if (prod.status !== 'active') {
          setError('This product offer is currently inactive.');
          return;
        }

        // Validate URL format (only http and https allowed)
        let affiliateUrl = prod.affiliateUrl?.trim();
        if (!affiliateUrl || (!affiliateUrl.startsWith('http://') && !affiliateUrl.startsWith('https://'))) {
          setError('Invalid affiliate target destination configured for this product.');
          return;
        }

        setProduct(prod);

        // Record real affiliate click in Firestore
        if (!hasLoggedClick.current) {
          hasLoggedClick.current = true;
          await recordAffiliateClick(prod.id, prod.storeId);
        }

        // Countdown and redirect
        let currentSeconds = 3;
        timer = setInterval(() => {
          currentSeconds -= 1;
          setCountdown(currentSeconds);
          if (currentSeconds <= 0) {
            clearInterval(timer);
            // Execute external partner redirect
            window.location.href = affiliateUrl;
          }
        }, 1000);

      } catch (err: any) {
        console.warn('Redirect notice:', err);
        setError('Failed to process affiliate redirect.');
      }
    }

    processRedirect();

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [productId]);

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-stone-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-stone-200 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Redirect Unavailable</h2>
          <p className="mt-2 text-xs text-stone-600 leading-relaxed">
            {error}
          </p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
          >
            <span>Back to Storefront</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-stone-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-stone-200 text-center shadow-xs space-y-6">
        {/* Animated spinner */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
          <ExternalLink className="w-6 h-6 text-indigo-600 absolute" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Retail Partner
          </span>

          <h2 className="mt-3 text-xl font-bold text-stone-900">
            Redirecting to Partner Store...
          </h2>

          {product && (
            <p className="mt-2 text-xs text-stone-500 font-medium">
              Taking you to the official offer for <strong className="text-stone-800">{product.name}</strong>
            </p>
          )}
        </div>

        {/* Progress box */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
          <p className="text-xs text-stone-600">
            Redirecting automatically in <span className="font-bold text-indigo-600 text-sm">{countdown}</span> seconds.
          </p>

          {product && (
            <a
              id="manual-redirect-btn"
              href={product.affiliateUrl}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
            >
              <span>Click here if not redirected automatically</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <div className="text-[11px] text-stone-400">
          Affiliate disclosure: Purchases made through this referral link support our independent publication without any extra charge to you.
        </div>
      </div>
    </div>
  );
};
