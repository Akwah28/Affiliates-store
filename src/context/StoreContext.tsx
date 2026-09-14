import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { StoreSettings, Category, Product } from '../types';
import { 
  getStoreSettings, 
  getCategories, 
  getProducts, 
  DEFAULT_STORE_SETTINGS, 
  DEFAULT_STORE_ID,
  seedInitialDataIfNeeded 
} from '../lib/storeService';

interface StoreContextType {
  settings: StoreSettings;
  categories: Category[];
  products: Product[];
  loading: boolean;
  refreshStoreData: () => Promise<void>;
  updateLocalSettings: (newSettings: StoreSettings) => void;
}

const StoreContext = createContext<StoreContextType>({
  settings: DEFAULT_STORE_SETTINGS,
  categories: [],
  products: [],
  loading: true,
  refreshStoreData: async () => {},
  updateLocalSettings: () => {},
});

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // Ensure initial seed if empty and authenticated
      await seedInitialDataIfNeeded(DEFAULT_STORE_ID);
      const [fetchedSettings, fetchedCategories, fetchedProducts] = await Promise.all([
        getStoreSettings(DEFAULT_STORE_ID),
        getCategories(DEFAULT_STORE_ID),
        getProducts({ storeId: DEFAULT_STORE_ID })
      ]);
      setSettings(fetchedSettings);
      setCategories(fetchedCategories);
      setProducts(fetchedProducts);
    } catch (err) {
      console.warn('Notice loading store context data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, user]);

  // Update dynamic document title & meta tags based on current store settings
  useEffect(() => {
    if (settings.seoTitle || settings.name) {
      document.title = settings.seoTitle || settings.name;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && (settings.seoDescription || settings.description)) {
      metaDesc.setAttribute('content', settings.seoDescription || settings.description);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', settings.seoTitle || settings.name);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', settings.seoDescription || settings.description);
    }
  }, [settings]);

  const updateLocalSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
  };

  return (
    <StoreContext.Provider value={{
      settings,
      categories,
      products,
      loading,
      refreshStoreData: loadData,
      updateLocalSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
