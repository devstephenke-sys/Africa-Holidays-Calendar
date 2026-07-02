import React, { useState } from 'react';
import { AdPosition } from '../types.ts';
import { Settings, Save, ToggleLeft, ToggleRight, Check } from 'lucide-react';

interface AdConfigManagerProps {
  ads: AdPosition[];
  onUpdateAd: (id: number, data: any) => Promise<void>;
}

export const AdConfigManager: React.FC<AdConfigManagerProps> = ({ ads, onUpdateAd }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [client, setClient] = useState('');
  const [slot, setSlot] = useState('');
  const [format, setFormat] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<number | null>(null);

  const startEdit = (ad: AdPosition) => {
    setEditingId(ad.id);
    setClient(ad.adClient);
    setSlot(ad.adSlot);
    setFormat(ad.adFormat);
  };

  const handleSave = async (id: number) => {
    setLoading(true);
    try {
      await onUpdateAd(id, {
        adClient: client,
        adSlot: slot,
        adFormat: format
      });
      setSuccessId(id);
      setEditingId(null);
      setTimeout(() => setSuccessId(null), 3000);
    } catch (e) {
      console.error("Failed to update ad position:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (ad: AdPosition) => {
    try {
      await onUpdateAd(ad.id, { isActive: !ad.isActive });
    } catch (e) {
      console.error("Failed to toggle ad position:", e);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h3 className="font-display font-semibold text-lg text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-500" />
            AdSense Placements Manager
          </h3>
          <p className="text-xs text-zinc-500">Configure where Google Ads appear across holiday queries and search lists</p>
        </div>
      </div>

      <div className="space-y-4">
        {ads.map(ad => {
          const isEditing = editingId === ad.id;
          const isSuccess = successId === ad.id;

          return (
            <div 
              key={ad.id} 
              className="border border-zinc-100 dark:border-zinc-800 rounded-xl p-4 transition-all duration-200 hover:border-zinc-200 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/20"
              id={`manager-ad-${ad.positionKey}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-semibold text-sm text-zinc-800 dark:text-zinc-200">{ad.displayName}</span>
                    <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-700/50">
                      Key: {ad.positionKey}
                    </span>
                  </div>
                  
                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">AdSense Client ID</label>
                        <input 
                          type="text"
                          value={client}
                          onChange={(e) => setClient(e.target.value)}
                          className="w-full text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">AdSlot ID</label>
                        <input 
                          type="text"
                          value={slot}
                          onChange={(e) => setSlot(e.target.value)}
                          className="w-full text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Ad Format</label>
                        <select 
                          value={format}
                          onChange={(e) => setFormat(e.target.value)}
                          className="w-full text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                        >
                          <option value="auto">Auto-sizes</option>
                          <option value="rectangle">Fixed Rectangle</option>
                          <option value="banner">Leaderboard Banner</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400 pt-1 font-mono">
                      <span>Ad Client: <strong className="text-zinc-700 dark:text-zinc-300">{ad.adClient}</strong></span>
                      <span>Ad Slot: <strong className="text-zinc-700 dark:text-zinc-300">{ad.adSlot}</strong></span>
                      <span>Format: <strong className="text-zinc-700 dark:text-zinc-300">{ad.adFormat}</strong></span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  {/* Status Toggle */}
                  <button 
                    onClick={() => handleToggle(ad)}
                    className="flex items-center gap-1 bg-transparent hover:opacity-85 cursor-pointer text-zinc-500 focus:outline-none"
                    title={ad.isActive ? "Disable this placement" : "Enable this placement"}
                  >
                    {ad.isActive ? (
                      <div className="flex items-center gap-1 text-emerald-600 font-medium text-xs">
                        <span>Active</span>
                        <ToggleRight className="w-8 h-8 text-emerald-500" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-zinc-400 font-medium text-xs">
                        <span>Inactive</span>
                        <ToggleLeft className="w-8 h-8 text-zinc-300" />
                      </div>
                    )}
                  </button>

                  {/* Actions */}
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2.5 py-1.5 text-xs font-semibold border border-zinc-200 dark:border-zinc-700 text-zinc-500 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSave(ad.id)}
                        disabled={loading}
                        className="px-3 py-1.5 text-xs font-semibold bg-amber-500 text-white rounded-lg shadow-sm hover:bg-amber-600 flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(ad)}
                      className={`px-3 py-1.5 text-xs font-semibold border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1 cursor-pointer ${isSuccess ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : ''}`}
                    >
                      {isSuccess ? <Check className="w-3.5 h-3.5" /> : <Settings className="w-3.5 h-3.5" />}
                      <span>{isSuccess ? 'Saved' : 'Configure'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
