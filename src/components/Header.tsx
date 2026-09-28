import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Sparkles, 
  X,
  Palette,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { WEAVE_ITEMS, COLOR_SWATCHES, PATTERN_ITEMS } from '../data/studioData';
import { WeaveItem, ColorSwatch, PatternItem } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSwatchKit: () => void;
  onSelectWeave: (weave: WeaveItem) => void;
  onSelectColor: (color: ColorSwatch) => void;
  onSelectPattern: (patternId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenSwatchKit,
  onSelectWeave,
  onSelectColor,
  onSelectPattern,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter matching elements based on user query
  const query = searchQuery.trim().toLowerCase();
  const matchedWeaves = query ? WEAVE_ITEMS.filter(w => w.name.toLowerCase().includes(query) || w.category.toLowerCase().includes(query)) : [];
  const matchedColors = query ? COLOR_SWATCHES.filter(c => c.name.toLowerCase().includes(query) || c.pantone.toLowerCase().includes(query)) : [];
  const matchedPatterns = query ? PATTERN_ITEMS.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)) : [];

  const hasResults = query && (matchedWeaves.length > 0 || matchedColors.length > 0 || matchedPatterns.length > 0);

  return (
    <header className="h-16 bg-[#FAF8F5] border-b border-black/8 px-6 flex items-center justify-between z-30 shrink-0 relative">
      
      {/* Zone 1: Wordmark Brand */}
      <div className="flex items-center gap-6">
        <a 
          href="/" 
          className="text-lg font-serif tracking-widest uppercase font-semibold text-slate-900 select-none hover:opacity-90 transition-opacity"
        >
          THREADS & TEXTURES
        </a>

        {/* Quiet Nav Links adhering to Top Bar Contract */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-medium text-slate-600">
          <span className="text-slate-900 border-b border-slate-900 pb-0.5 font-semibold">Custom Weave Studio</span>
          <button 
            onClick={onOpenSwatchKit}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Fabric Sample Archives
          </button>
          <a href="#artisan" className="hover:text-slate-900 transition-colors">
            Como Atelier Craft
          </a>
        </nav>
      </div>

      {/* Zone 2: Interactive Search Bar */}
      <div className="relative flex-1 max-w-md mx-6">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search weaves, Pantone codes, prints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
            className="w-full bg-black/4 hover:bg-black/6 focus:bg-white text-xs pl-9 pr-8 py-2 rounded-xl border border-black/6 focus:border-slate-900 focus:outline-hidden transition-all text-slate-800 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Quick Results Dropdown */}
        {isSearchFocused && hasResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-black/8 p-3 space-y-3 z-50">
            {matchedWeaves.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Weaves
                </span>
                <div className="space-y-1">
                  {matchedWeaves.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => {
                        onSelectWeave(w);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-black/5 text-left text-xs transition-colors"
                    >
                      <span className="font-medium text-slate-800">{w.name}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{w.weightGsm} GSM</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {matchedColors.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Color Swatches
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {matchedColors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        onSelectColor(c);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-black/5 text-left text-xs transition-colors"
                    >
                      <div className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: c.hex }} />
                      <span className="truncate text-slate-800 font-medium">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {matchedPatterns.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Textile Prints
                </span>
                <div className="space-y-1">
                  {matchedPatterns.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectPattern(p.id);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-black/5 text-left text-xs transition-colors"
                    >
                      <span className="font-medium text-slate-800">{p.name}</span>
                      <span className="text-slate-400 text-[11px]">{p.category}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Zone 3: Account & Cart Primary Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSwatchKit}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
        >
          <Palette className="w-3.5 h-3.5 text-slate-500" />
          <span>Swatch Kit</span>
        </button>

        <button
          onClick={onOpenCart}
          className="relative p-2 text-slate-700 hover:text-slate-900 hover:bg-black/5 rounded-xl transition-colors cursor-pointer"
          title="Shopping Cart & Custom Configs"
        >
          <ShoppingBag className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] font-medium flex items-center justify-center font-mono shadow-xs">
              {cartCount}
            </span>
          )}
        </button>

        <div className="h-5 w-px bg-black/10 mx-0.5" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E8DEC8] border border-black/10 flex items-center justify-center text-xs font-serif font-semibold text-slate-800 shadow-xs">
            AL
          </div>
        </div>
      </div>

    </header>
  );
};
