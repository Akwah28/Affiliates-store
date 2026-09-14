import React from 'react';
import { navigate } from '../lib/router';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-stone-50">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="w-14 h-14 bg-stone-200 text-stone-600 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-black text-stone-900">404 - Page Not Found</h1>
        <p className="text-xs text-stone-600 max-w-xs mx-auto">
          The page or product link you requested could not be located on this storefront.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </button>
        </div>
      </div>
    </div>
  );
};
