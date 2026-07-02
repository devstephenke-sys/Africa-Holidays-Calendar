import React from 'react';
import { AdPosition } from '../types.ts';
import { Megaphone, Info } from 'lucide-react';

interface GoogleAdProps {
  positionKey: string;
  ads: AdPosition[];
  className?: string;
}

export const GoogleAd: React.FC<GoogleAdProps> = ({ positionKey, ads, className = "" }) => {
  const adConfig = ads.find(a => a.positionKey === positionKey);
  
  if (!adConfig || !adConfig.isActive) {
    return null;
  }

  // Define some realistic-looking travel ads to display in the placeholders
  const mockAds: Record<string, { title: string; desc: string; cta: string; link: string; color: string }> = {
    top_banner: {
      title: "🌍 Fly to Kenya: Save 20% on Holiday Bookings!",
      desc: "Explore Nairobi, Maasai Mara, and Diani Beach. Best travel rates for October 2026.",
      cta: "Book Flights Now",
      link: "https://www.google.com/travel",
      color: "from-amber-500/10 to-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
    },
    results_between: {
      title: "🏨 Luxury Safari Lodges - South Africa",
      desc: "Stay in 5-star cabins in Kruger National Park. All-inclusive luxury safari tours.",
      cta: "Explore Deals",
      link: "https://www.google.com/travel",
      color: "from-sky-500/10 to-indigo-500/10 border-indigo-500/20 text-indigo-800 dark:text-indigo-300"
    },
    sidebar: {
      title: "🏖️ Unwind in Zanzibar",
      desc: "7-Day Beach Packages starting from $599. Direct flights from Nairobi & Joburg.",
      cta: "Get Offer",
      link: "https://www.google.com/travel",
      color: "from-pink-500/10 to-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300"
    },
    footer: {
      title: "✈️ Travel Insurance for African Holidays",
      desc: "Instant coverage for over 45 African nations. 24/7 medical & travel support.",
      cta: "Get Instant Quote",
      link: "https://www.google.com/travel",
      color: "from-purple-500/10 to-blue-500/10 border-blue-500/20 text-blue-800 dark:text-blue-300"
    }
  };

  const adContent = mockAds[positionKey] || {
    title: "✨ Featured African Getaway Tours",
    desc: "Discover beautiful destinations and plan around local public holidays.",
    cta: "Learn More",
    link: "https://www.google.com/travel",
    color: "from-slate-500/10 to-slate-600/10 border-slate-500/20 text-slate-800 dark:text-slate-300"
  };

  const isSidebar = positionKey === 'sidebar';

  return (
    <div 
      className={`relative border rounded-xl overflow-hidden shadow-sm transition-all duration-300 bg-white dark:bg-zinc-900 ${adContent.color} ${className}`}
      id={`ad-slot-${positionKey}`}
    >
      {/* AdSense Info Label */}
      <div className="absolute top-0 right-0 bg-neutral-200/80 dark:bg-zinc-800/80 text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-bl-lg text-zinc-500 flex items-center gap-1 z-10">
        <Megaphone className="w-2.5 h-2.5 text-zinc-400" />
        <span>ADSENSE PLACEHOLDER</span>
      </div>

      <div className={`p-4 flex ${isSidebar ? 'flex-col justify-between h-full' : 'flex-col sm:flex-row items-center justify-between gap-4'} min-h-[90px]`}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded font-medium border border-zinc-200 dark:border-zinc-700">Ad</span>
            <h4 className="font-display font-semibold text-sm tracking-tight">{adContent.title}</h4>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">{adContent.desc}</p>
          
          <div className="mt-2 flex items-center gap-4 text-[10px] text-zinc-400 font-mono">
            <span>Client: {adConfig.adClient}</span>
            <span>Slot: {adConfig.adSlot}</span>
          </div>
        </div>

        <div className={`flex items-center gap-2 ${isSidebar ? 'mt-4 w-full' : ''}`}>
          <a
            href={adContent.link}
            target="_blank"
            referrerPolicy="no-referrer"
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg text-center transition-all duration-200 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:scale-105 ${isSidebar ? 'w-full' : ''}`}
          >
            {adContent.cta}
          </a>
        </div>
      </div>
      
      {/* Earnings/Simulation explanation drawer at bottom (small text to educate visitor) */}
      <div className="bg-neutral-50 dark:bg-zinc-950/40 border-t border-zinc-200/50 dark:border-zinc-800/50 px-4 py-1 flex items-center justify-between text-[10px] text-zinc-400">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-zinc-400" />
          Active Format: {adConfig.adFormat}
        </span>
        <span className="font-mono">CPC/CPM Simulated</span>
      </div>
    </div>
  );
};
