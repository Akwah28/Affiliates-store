import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { navigate } from '../../lib/router';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  BarChart3, 
  Settings, 
  LogOut, 
  Store, 
  Menu, 
  X,
  ExternalLink
} from 'lucide-react';

interface AdminLayoutProps {
  currentPath: string;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentPath, children }) => {
  const { user, loading, logout } = useAuth();
  const { settings } = useStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-stone-900 text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center font-bold text-xs">
            A
          </div>
          <span className="font-bold text-sm truncate">{settings.name} Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1.5 text-stone-300 hover:text-white"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-stone-900 text-stone-300 flex flex-col transition-transform duration-300 md:static md:translate-x-0
        ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Brand Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              AD
            </div>
            <div>
              <h2 className="font-bold text-sm text-white leading-tight truncate w-36">
                {settings.name}
              </h2>
              <span className="text-[11px] text-stone-500 block">Affiliate Console</span>
            </div>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path !== '/admin' && currentPath.startsWith(item.path));
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  navigate(item.path);
                  setMobileNavOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Public Storefront link & Logout */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Public Storefront</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="px-3 py-2 bg-stone-800/60 rounded-lg">
            <div className="text-[11px] text-stone-400 font-medium truncate">{user.email}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">● Authenticated Admin</div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
