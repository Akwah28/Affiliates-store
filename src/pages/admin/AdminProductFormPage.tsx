import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  getProductById, 
  createProduct, 
  updateProduct, 
  uploadProductImage, 
  DEFAULT_STORE_ID 
} from '../../lib/storeService';
import { Product } from '../../types';
import { navigate } from '../../lib/router';
import { 
  ArrowLeft, 
  Upload, 
  Link, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Image as ImageIcon 
} from 'lucide-react';

interface AdminProductFormPageProps {
  productId?: string; // If editing
}

export const AdminProductFormPage: React.FC<AdminProductFormPageProps> = ({ productId }) => {
  const { categories, refreshStoreData, settings } = useStore();
  const isEditing = Boolean(productId);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [price, setPrice] = useState<string>('0.00');
  const [oldPrice, setOldPrice] = useState<string>('');
  const [currency, setCurrency] = useState('USD');
  const [categoryId, setCategoryId] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [ctaText, setCtaText] = useState('Buy Now');
  const [badge, setBadge] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'active' | 'inactive' | 'draft'>('active');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto slug generation from product name if empty or creating
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generated);
    }
  };

  useEffect(() => {
    async function loadExisting() {
      if (productId) {
        const p = await getProductById(productId);
        if (p) {
          setName(p.name);
          setSlug(p.slug);
          setShortDescription(p.shortDescription || '');
          setDescription(p.description || '');
          setImage(p.image);
          setAdditionalImages(p.images || []);
          setPrice(p.price.toString());
          setOldPrice(p.oldPrice ? p.oldPrice.toString() : '');
          setCurrency(p.currency || 'USD');
          setCategoryId(p.categoryId || '');
          setAffiliateUrl(p.affiliateUrl);
          setCtaText(p.ctaText || 'Buy Now');
          setBadge(p.badge || '');
          setFeatured(p.featured);
          setStatus(p.status);
        }
      }
    }
    loadExisting();
  }, [productId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError(null);
      const uploadedUrl = await uploadProductImage(file);
      if (!image) {
        setImage(uploadedUrl);
      } else {
        setAdditionalImages((prev) => [...prev, uploadedUrl]);
      }
    } catch (err: any) {
      console.warn('Upload notice:', err);
      setError('Could not upload image to storage. You can still paste an image URL directly.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Required fields: Product name, Affiliate URL, Product image, Status
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!affiliateUrl.trim()) {
      setError('Affiliate URL is required.');
      return;
    }
    const cleanUrl = affiliateUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      setError('Affiliate URL must start with http:// or https://');
      return;
    }
    if (!image.trim()) {
      setError('Product primary image URL is required.');
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Please enter a valid price.');
      return;
    }

    try {
      setSaving(true);
      const productPayload = {
        storeId: settings.id || DEFAULT_STORE_ID,
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        shortDescription: shortDescription.trim(),
        description: description.trim() || shortDescription.trim(),
        image: image.trim(),
        images: additionalImages,
        price: parsedPrice,
        oldPrice: oldPrice ? parseFloat(oldPrice) : undefined,
        currency,
        categoryId: categoryId || undefined,
        affiliateUrl: cleanUrl,
        ctaText: ctaText.trim() || 'Buy Now',
        badge: badge.trim() || undefined,
        featured,
        status,
      };

      if (isEditing && productId) {
        await updateProduct(productId, productPayload);
      } else {
        await createProduct(productPayload);
      }

      await refreshStoreData();
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/products');
      }, 800);
    } catch (err: any) {
      console.warn('Failed to save product notice:', err);
      setError(err.message || 'Failed to save product in database.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <span className="text-xs font-medium text-stone-400">
          {isEditing ? 'Editing Product ID: ' + productId : 'Creating New Listing'}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-8">
        <h1 className="text-xl font-bold text-stone-900 mb-1">
          {isEditing ? 'Update Affiliate Product' : 'Add New Affiliate Product'}
        </h1>
        <p className="text-xs text-stone-500 mb-6">
          Fill in product details, marketing copy, and direct affiliate vendor destination.
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-700">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Product saved successfully! Returning to catalog...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-indigo-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                URL Slug <span className="text-stone-400 font-normal">(/product/:slug)</span>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="sony-wh-1000xm5-wireless-headphones"
                className="w-full px-3.5 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-lg focus:bg-white outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white outline-hidden cursor-pointer"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Affiliate URL & CTA */}
          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
              <Link className="w-4 h-4 text-indigo-600" />
              <span>Affiliate Redirection Configuration</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Affiliate Target URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                required
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                placeholder="https://amazon.com/dp/B00.../?tag=your-affiliate-id"
                className="w-full px-3.5 py-2 text-xs font-mono bg-white border border-stone-200 rounded-lg focus:border-indigo-500 outline-hidden"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                Direct external destination where visitors are forwarded after clicking Buy Now.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Buy Now / View on Amazon / Get Deal"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-stone-200 rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Product Badge <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Best Overall, Staff Pick, Sale"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-stone-200 rounded-lg outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Current Price ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="199.99"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Original Price ($) <span className="text-stone-400 font-normal">(strikethrough)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="249.99"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Currency
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="USD"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
              />
            </div>
          </div>

          {/* Image Management */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-stone-700">
              Primary Product Image <span className="text-rose-500">*</span>
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
              />

              <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors shrink-0">
                <Upload className="w-3.5 h-3.5 text-stone-500" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            </div>

            {image && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={image}
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover border border-stone-200"
                />
                <span className="text-[11px] text-stone-500">Live preview thumbnail</span>
              </div>
            )}
          </div>

          {/* Descriptions */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Short Description <span className="text-stone-400 font-normal">(shown on cards)</span>
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief 1-sentence value proposition or key feature"
              className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Full Product Review / Overview
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description, test findings, pros & cons, and specifications..."
              className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden leading-relaxed"
            />
          </div>

          {/* Visibility & Toggles */}
          <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0"
                />
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Mark as Featured Selection
                </span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-700">Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="text-xs font-semibold bg-stone-100 border border-stone-200 rounded-md px-2.5 py-1 text-stone-800 outline-hidden"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>

              <button
                id="save-product-btn"
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs disabled:opacity-50"
              >
                {saving ? 'Saving...' : isEditing ? 'Update Product' : 'Publish Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
