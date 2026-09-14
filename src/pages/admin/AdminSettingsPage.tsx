import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { updateStoreSettings, uploadProductImage } from '../../lib/storeService';
import { StoreSettings } from '../../types';
import { 
  Store, 
  Upload, 
  Check, 
  AlertCircle, 
  Mail, 
  MessageSquare, 
  Share2, 
  Search,
  DollarSign 
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { settings, refreshStoreData, updateLocalSettings } = useStore();

  const [name, setName] = useState(settings.name || '');
  const [logo, setLogo] = useState(settings.logo || '');
  const [description, setDescription] = useState(settings.description || '');
  const [contactEmail, setContactEmail] = useState(settings.contactEmail || '');
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp || '');
  const [instagram, setInstagram] = useState(settings.instagram || '');
  const [facebook, setFacebook] = useState(settings.facebook || '');
  const [tiktok, setTiktok] = useState(settings.tiktok || '');
  const [seoTitle, setSeoTitle] = useState(settings.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(settings.seoDescription || '');
  const [currency, setCurrency] = useState(settings.currency || 'USD');

  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const url = await uploadProductImage(file, 'store-branding');
      setLogo(url);
    } catch (err) {
      console.warn('Logo upload notice:', err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Store name cannot be empty.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const updated: StoreSettings = {
        ...settings,
        name: name.trim(),
        logo: logo.trim(),
        description: description.trim(),
        contactEmail: contactEmail.trim(),
        whatsapp: whatsapp.trim(),
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        tiktok: tiktok.trim(),
        seoTitle: seoTitle.trim() || name.trim(),
        seoDescription: seoDescription.trim() || description.trim(),
        currency: currency.trim() || 'USD',
        updatedAt: new Date().toISOString()
      };

      await updateStoreSettings(updated);
      updateLocalSettings(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.warn('Settings save notice:', err);
      setError('Failed to update store settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">Storefront Settings & Branding</h1>
        <p className="text-xs text-stone-500 mt-1">
          Configure dynamic store name, logo asset, social channels, and global SEO metadata.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-700">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Store settings and SEO saved and applied live across storefront!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Brand Identity */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
            <Store className="w-4 h-4 text-indigo-600" />
            <span>Storefront Brand Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Store Name (Dynamic throughout site)
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Curated Finds & Gear"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Default Currency Code
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="USD"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Store Tagline / Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Handpicked gadgets, gear, and daily essentials reviewed for modern living."
              className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden focus:bg-white"
            />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Store Logo URL
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <input
                type="url"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden focus:bg-white"
              />
              <label className="cursor-pointer px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shrink-0">
                <Upload className="w-3.5 h-3.5 text-stone-500" />
                <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo'}</span>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
            {logo && (
              <div className="mt-2 flex items-center gap-2">
                <img src={logo} alt="Preview" className="w-8 h-8 rounded-md object-cover border border-stone-200" />
                <span className="text-[11px] text-stone-400">Current navbar logo</span>
              </div>
            )}
          </div>
        </div>

        {/* Social & Contact Channels */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-600" />
            <span>Customer Contacts & Social Links</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@yourstore.com"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">WhatsApp Phone / Link</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Instagram URL</label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/yourhandle"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Facebook URL</label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/yourpage"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">TikTok URL</label>
              <input
                type="url"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                placeholder="https://tiktok.com/@youraccount"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Global SEO & OpenGraph Meta */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-600" />
            <span>Search Engine Optimization (SEO)</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">SEO Page Title Tag</label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Curated Finds & Gear | Best Handpicked Tech and Deals"
              className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">SEO Meta Description</label>
            <textarea
              rows={3}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Discover editor-tested tech, productivity essentials, and smart lifestyle tools with direct verified vendor links."
              className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            id="save-settings-btn"
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving Settings...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
