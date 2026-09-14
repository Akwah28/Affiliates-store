import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { getAffiliateClicks } from '../../lib/storeService';
import { AffiliateClick } from '../../types';
import { 
  BarChart3, 
  MousePointerClick, 
  Calendar, 
  Clock, 
  TrendingUp, 
  ExternalLink,
  Globe
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const { products, settings } = useStore();
  const [clicks, setClicks] = useState<AffiliateClick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getAffiliateClicks(settings.id);
      setClicks(data);
      setLoading(false);
    }
    load();
  }, [settings.id]);

  // Clicks time calculations
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  let clicksToday = 0;
  let clicksThisWeek = 0;
  let clicksThisMonth = 0;

  const productClickMap: Record<string, number> = {};

  clicks.forEach((c) => {
    const time = new Date(c.timestamp).getTime();
    if (time >= todayStart) clicksToday++;
    if (time >= weekStart) clicksThisWeek++;
    if (time >= monthStart) clicksThisMonth++;

    productClickMap[c.productId] = (productClickMap[c.productId] || 0) + 1;
  });

  const sortedProductStats = Object.entries(productClickMap)
    .map(([productId, count]) => {
      const prod = products.find((p) => p.id === productId);
      return {
        productId,
        product: prod,
        clicks: count
      };
    })
    .sort((a, b) => b.clicks - a.clicks);

  // Recent 10 clicks audit log
  const recentClicks = [...clicks]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 15);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">Affiliate Traffic & Click Analytics</h1>
        <p className="text-xs text-stone-500 mt-1">
          Detailed metrics of customer referrals, redirects, and partner destination traffic.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>Total Historical Clicks</span>
            <MousePointerClick className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">{loading ? '...' : clicks.length}</span>
            <span className="text-xs text-stone-400">all time</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>Clicks Today</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">{loading ? '...' : clicksToday}</span>
            <span className="text-xs text-emerald-600 font-medium">since midnight</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>Clicks This Week</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">{loading ? '...' : clicksThisWeek}</span>
            <span className="text-xs text-blue-600 font-medium">past 7 days</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>Clicks This Month</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">{loading ? '...' : clicksThisMonth}</span>
            <span className="text-xs text-purple-600 font-medium">current cycle</span>
          </div>
        </div>
      </div>

      {/* Top Products by Clicks */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-stone-900">Clicks Per Product</h2>
          <p className="text-xs text-stone-500">Breakdown of customer click-throughs to each merchant partner offer</p>
        </div>

        {sortedProductStats.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-400 bg-stone-50 rounded-xl border border-dashed border-stone-200">
            No product clicks recorded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {sortedProductStats.map(({ productId, product, clicks: count }) => {
              const percentage = clicks.length > 0 ? Math.round((count / clicks.length) * 100) : 0;
              return (
                <div key={productId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 max-w-md truncate">
                      <span className="font-bold text-stone-900 truncate">
                        {product?.name || `Product: ${productId}`}
                      </span>
                      {product && (
                        <span className="text-stone-400 text-[11px]">
                          (${product.price.toFixed(2)})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-indigo-600">{count} clicks</span>
                      <span className="text-stone-400 text-[11px] w-10 text-right">{percentage}%</span>
                    </div>
                  </div>

                  {/* Progress bar visual */}
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Real-time Click Audit Log */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-stone-900">Recent Click Stream Logs</h2>
          <p className="text-xs text-stone-500">Live timestamped outbound affiliate redirect events</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-[11px] text-stone-500 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Product Target</th>
                <th className="py-2.5 px-4">Referrer</th>
                <th className="py-2.5 px-4">Store ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
              {recentClicks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-stone-400 font-sans">
                    No clicks logged yet.
                  </td>
                </tr>
              ) : (
                recentClicks.map((c, i) => {
                  const prod = products.find((p) => p.id === c.productId);
                  return (
                    <tr key={c.id || i} className="hover:bg-stone-50">
                      <td className="py-2.5 px-4 text-stone-600">
                        {new Date(c.timestamp).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 font-sans font-semibold text-stone-900">
                        {prod ? prod.name : c.productId}
                      </td>
                      <td className="py-2.5 px-4 text-stone-500 truncate max-w-xs">
                        {c.referrer || 'Direct / Storefront'}
                      </td>
                      <td className="py-2.5 px-4 text-stone-400">
                        {c.storeId}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
