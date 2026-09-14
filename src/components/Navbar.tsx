import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { navigate } from '../lib/router';
import { 
  Menu, 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  LayoutDashboard, 
  Search,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath }) => {
  const { settings, categories } = useStore();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Affiliate Notice Banner */}
      <div className="bg-stone-900 text-stone-300 text-[11px] py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Independent editorial recommendations. We may earn an affiliate commission when you buy through our links.</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Store Name */}
          <div className="flex items-center gap-6">
            <a 
              id="brand-logo-link"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="flex items-center gap-2.5 group"
            >
              {settings.logo ? (
                <img 
                  src={settings.logo} 
                  alt={settings.name} 
                  className="w-9 h-9 rounded-lg object-cover border border-stone-200 group-hover:border-indigo-500 transition-colors"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  {settings.name.charAt(0)}
                </div>
              )}
              <span className="font-bold text-lg text-stone-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                {settings.name}
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <a
                href="/"
                onClick={(e) => { e.preventDefault(); navigate('/'); }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentPath === '/' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Home
              </a>
              <a
                href="/shop"
                onClick={(e) => { e.preventDefault(); navigate('/shop'); }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentPath === '/shop' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                All Products
              </a>

              {/* Categories Dropdown/Links */}
              {categories.slice(0, 3).map((cat) => (
                <a
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={(e) => { e.preventDefault(); navigate(`/category/${cat.slug}`); }}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    currentPath === `/category/${cat.slug}`
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {cat.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Search bar & Actions */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative items-center">
              <Search className="w-4 h-4 absolute left-3 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-9 pr-3 py-1.5 text-xs bg-stone-100 border border-transparent focus:border-stone-300 focus:bg-white rounded-lg w-44 lg:w-60 transition-all outline-hidden text-stone-800"
              />
            </form>

            {/* Admin link or Login */}
            {user ? (
              <button
                id="navbar-admin-btn"
                type="button"
                onClick={() => navigate('/admin')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Admin Dashboard</span>
              </button>
            ) : (
              <button
                id="navbar-login-btn"
                type="button"
                onClick={() => navigate('/admin/login')}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors"
                title="Admin Portal"
              >
                <span className="text-xs">Admin</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center mb-3">
            <Search className="w-4 h-4 absolute left-3 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gear and products..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-stone-100 border border-stone-200 rounded-lg outline-hidden"
            />
          </form>

          <div className="flex flex-col gap-1">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); navigate('/'); setMobileMenuOpen(false); }}
              className="px-3 py-2 text-sm font-medium text-stone-800 rounded-md hover:bg-stone-100"
            >
              Home
            </a>
            <a
              href="/shop"
              onClick={(e) => { e.preventDefault(); navigate('/shop'); setMobileMenuOpen(false); }}
              className="px-3 py-2 text-sm font-medium text-stone-800 rounded-md hover:bg-stone-100"
            >
              Shop All Products
            </a>

            <div className="pt-2 pb-1 text-xs font-semibold text-stone-400 uppercase tracking-wider px-3">
              Categories
            </div>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/category/${cat.slug}`}
                onClick={(e) => { e.preventDefault(); navigate(`/category/${cat.slug}`); setMobileMenuOpen(false); }}
                className="px-3 py-2 text-sm text-stone-600 rounded-md hover:bg-stone-100 flex items-center justify-between"
              >
                <span>{cat.name}</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100">
            {user ? (
              <button
                type="button"
                onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
                className="w-full py-2 px-3 text-sm font-medium text-center text-white bg-indigo-600 rounded-lg"
              >
                Go to Admin Dashboard
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { navigate('/admin/login'); setMobileMenuOpen(false); }}
                className="w-full py-2 px-3 text-xs font-medium text-center text-stone-600 border border-stone-200 rounded-lg"
              >
                Admin Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
