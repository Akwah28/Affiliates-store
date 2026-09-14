/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { useRouter, matchPath } from './lib/router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AffiliateRedirectPage } from './pages/AffiliateRedirectPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardOverview } from './pages/admin/AdminDashboardOverview';
import { AdminProductsListPage } from './pages/admin/AdminProductsListPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export default function App() {
  const { path } = useRouter();

  // Route matching logic
  const renderRoute = () => {
    // 1. Affiliate Redirect
    const goMatch = matchPath('/go/:productId', path);
    if (goMatch) {
      return <AffiliateRedirectPage productId={goMatch.productId} />;
    }

    // 2. Admin Login
    if (path === '/admin/login') {
      return <AdminLoginPage />;
    }

    // 3. Admin Area (Wrapped in AdminLayout)
    if (path.startsWith('/admin')) {
      const editProductMatch = matchPath('/admin/products/:id/edit', path);
      if (editProductMatch) {
        return (
          <AdminLayout currentPath={path}>
            <AdminProductFormPage productId={editProductMatch.id} />
          </AdminLayout>
        );
      }

      if (path === '/admin/products/new') {
        return (
          <AdminLayout currentPath={path}>
            <AdminProductFormPage />
          </AdminLayout>
        );
      }

      if (path === '/admin/products') {
        return (
          <AdminLayout currentPath={path}>
            <AdminProductsListPage />
          </AdminLayout>
        );
      }

      if (path === '/admin/categories') {
        return (
          <AdminLayout currentPath={path}>
            <AdminCategoriesPage />
          </AdminLayout>
        );
      }

      if (path === '/admin/analytics') {
        return (
          <AdminLayout currentPath={path}>
            <AdminAnalyticsPage />
          </AdminLayout>
        );
      }

      if (path === '/admin/settings') {
        return (
          <AdminLayout currentPath={path}>
            <AdminSettingsPage />
          </AdminLayout>
        );
      }

      if (path === '/admin') {
        return (
          <AdminLayout currentPath={path}>
            <AdminDashboardOverview />
          </AdminLayout>
        );
      }

      return (
        <AdminLayout currentPath={path}>
          <NotFoundPage />
        </AdminLayout>
      );
    }

    // 4. Public Storefront Routes (Wrapped with public Navbar and Footer)
    let storefrontContent = null;

    if (path === '/') {
      storefrontContent = <HomePage />;
    } else if (path === '/shop') {
      storefrontContent = <ShopPage />;
    } else {
      const categoryMatch = matchPath('/category/:slug', path);
      if (categoryMatch) {
        storefrontContent = <ShopPage categorySlug={categoryMatch.slug} />;
      } else {
        const productMatch = matchPath('/product/:slug', path);
        if (productMatch) {
          storefrontContent = <ProductDetailPage slug={productMatch.slug} />;
        } else {
          storefrontContent = <NotFoundPage />;
        }
      }
    }

    return (
      <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-indigo-500 selection:text-white">
        <Navbar currentPath={path} />
        <div className="flex-1">
          {storefrontContent}
        </div>
        <Footer />
      </div>
    );
  };

  return (
    <AuthProvider>
      <StoreProvider>
        {renderRoute()}
      </StoreProvider>
    </AuthProvider>
  );
}
