import React from 'react';
import { useStore } from '../context/StoreContext';
import { navigate } from '../lib/router';
import { 
  ShieldCheck, 
  ExternalLink, 
  Mail, 
  Phone, 
  MessageSquare 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, categories } = useStore();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              {settings.logo ? (
                <img src={settings.logo} alt={settings.name} className="w-8 h-8 rounded-md object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-md bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                  {settings.name.charAt(0)}
                </div>
              )}
              <span className="font-bold text-lg text-white tracking-tight">{settings.name}</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {settings.description}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {settings.instagram && (
                <a 
                  href={settings.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-stone-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <span className="text-xs font-medium">IG</span>
                </a>
              )}
              {settings.facebook && (
                <a 
                  href={settings.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-stone-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <span className="text-xs font-medium">FB</span>
                </a>
              )}
              {settings.tiktok && (
                <a 
                  href={settings.tiktok} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-stone-400 hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <span className="text-xs font-medium">TT</span>
                </a>
              )}
              {settings.whatsapp && (
                <a 
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-stone-400 hover:text-emerald-400 transition-colors"
                  aria-label="WhatsApp"
                >
                  <span className="text-xs font-medium">WA</span>
                </a>
              )}
            </div>
          </div>

          {/* Categories Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-xs">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/category/${cat.slug}`}
                    onClick={(e) => { e.preventDefault(); navigate(`/category/${cat.slug}`); }}
                    className="text-stone-400 hover:text-indigo-400 transition-colors"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/shop"
                  onClick={(e) => { e.preventDefault(); navigate('/shop'); }}
                  className="text-stone-400 hover:text-indigo-400 transition-colors"
                >
                  All Products
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact & Inquiries</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              {settings.contactEmail && (
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-500" />
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-white">
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings.whatsapp && (
                <li className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp: {settings.whatsapp}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Legal / Affiliate Disclosure Statement */}
          <div className="space-y-3 bg-stone-800/60 p-4 rounded-xl border border-stone-800">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Affiliate Disclosure</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              {settings.name} is an affiliate publisher and participant in various affiliate marketing programs designed to provide a means for sites to earn advertising fees by linking to official merchant retail websites. When you click links on our site and make a purchase, we may receive a referral commission at no additional cost to you.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} {settings.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Product prices and availability are subject to change on vendor sites.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
