import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Check, 
  ShoppingBag, 
  Sparkles, 
  Scissors, 
  Ruler, 
  Calendar,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { ColorSwatch, WeaveItem, PatternItem, ButtonFinish } from '../types';
import { ASSET_IMAGES, PATTERN_ITEMS } from '../data/studioData';

interface ExportOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  weave: WeaveItem;
  color: ColorSwatch;
  secondaryWeftColor?: string;
  isShotSilk: boolean;
  patternId: string;
  patternScale: number;
  patternRotation: number;
  buttonFinish: ButtonFinish;
  price: number;
  onAddToCart: (item: {
    weaveName: string;
    colorName: string;
    pantone: string;
    colorHex: string;
    patternName: string;
    buttonFinish: string;
    size: string;
    price: number;
  }) => void;
}

export const ExportOrderModal: React.FC<ExportOrderModalProps> = ({
  isOpen,
  onClose,
  weave,
  color,
  secondaryWeftColor,
  isShotSilk,
  patternId,
  patternScale,
  patternRotation,
  buttonFinish,
  price,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState('US 6 (Bust 34", Waist 27")');
  const [customNotes, setCustomNotes] = useState('');
  const [isExported, setIsExported] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  if (!isOpen) return null;

  const currentPattern = PATTERN_ITEMS.find((p) => p.id === patternId);

  const sizes = [
    'US 2 (Bust 32", Waist 25")',
    'US 4 (Bust 33", Waist 26")',
    'US 6 (Bust 34", Waist 27")',
    'US 8 (Bust 36", Waist 29")',
    'US 10 (Bust 38", Waist 31")',
    'US 12 (Bust 40", Waist 33")',
    'Custom Atelier Bespoke (Made-to-Measure)',
  ];

  const handleDownloadTechPack = () => {
    setIsExported(true);
    setTimeout(() => setIsExported(false), 3000);
  };

  const handleOrder = () => {
    onAddToCart({
      weaveName: weave.name,
      colorName: color.name,
      pantone: color.pantone,
      colorHex: color.hex,
      patternName: currentPattern?.name || 'Solid Weave',
      buttonFinish: buttonFinish.replace('-', ' '),
      size: selectedSize,
      price: price,
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F5] w-full max-w-4xl rounded-2xl shadow-2xl border border-black/10 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-black/8 bg-white/70 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-slate-500">
                Atelier Tech Pack & Production Spec
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            </div>
            <h2 className="text-xl font-serif font-semibold text-slate-900">
              Silk Blouse Specification Sheet
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-black/5 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Top Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Swatch & Render Card */}
            <div className="p-4 bg-white rounded-xl border border-black/6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="relative w-32 h-44 rounded-lg overflow-hidden shadow-md border border-black/10">
                <img
                  src={ASSET_IMAGES.front}
                  alt="Blouse Configuration"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: color.hex,
                    mixBlendMode: 'multiply',
                    opacity: 0.85,
                  }}
                />
                {currentPattern && !currentPattern.isSolid && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: currentPattern.id === 'abstract-florals'
                        ? `url(${ASSET_IMAGES.patternBotanical})`
                        : `url('${currentPattern.thumbnailUrl}')`,
                      backgroundSize: '40px',
                      opacity: 0.7,
                      mixBlendMode: 'multiply',
                    }}
                  />
                )}
              </div>

              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-900 block">
                  Tailored Blouse Silhouette
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  STYLE #TT-BL-2026
                </span>
              </div>
            </div>

            {/* Fabric & Weave Spec */}
            <div className="p-4 bg-white rounded-xl border border-black/6 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block border-b border-black/5 pb-1">
                Loom Architecture
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Weave Name:</span>
                  <span className="font-semibold text-slate-900">{weave.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Weight & Density:</span>
                  <span className="font-mono text-slate-800">{weave.weightGsm} GSM ({weave.threadDensity})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Structure:</span>
                  <span className="capitalize text-slate-800">{weave.weaveStructure}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Origin Mill:</span>
                  <span className="text-slate-800">{weave.origin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Yardage Req:</span>
                  <span className="font-mono text-slate-800">2.45 meters (54" width)</span>
                </div>
              </div>
            </div>

            {/* Color & Print Spec */}
            <div className="p-4 bg-white rounded-xl border border-black/6 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block border-b border-black/5 pb-1">
                Dye & Print Profile
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Primary Hue:</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                    <span className="font-semibold text-slate-900">{color.name}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pantone Spec:</span>
                  <span className="font-mono text-[11px] text-slate-800">{color.pantone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hex Code:</span>
                  <span className="font-mono text-slate-800">{color.hex}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Applied Print:</span>
                  <span className="font-medium text-slate-800">{currentPattern?.name || 'Solid'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fasteners:</span>
                  <span className="capitalize text-slate-800">{buttonFinish.replace('-', ' ')}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Sizing & Tailoring Options */}
          <div className="p-4 bg-white rounded-xl border border-black/6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Atelier Sizing & Fit
              </span>
              <span className="text-xs text-amber-700 flex items-center gap-1">
                <Ruler className="w-3 h-3" />
                Complimentary Tailor Review
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Select Size:</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-black/10 text-xs bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                >
                  {sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 block mb-1">Bespoke Adjustments (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. +1.5cm sleeve length, relaxed bust ease"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-black/10 text-xs bg-white text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Craft Guarantee */}
          <div className="flex items-center gap-4 p-3 bg-black/3 rounded-xl border border-black/6 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <span className="font-semibold text-slate-900">Como Artisanal Provenance & Fit Guarantee</span>
              <p className="text-[11px] text-slate-500">
                Each garment is woven on vintage Rapier looms in Lombardy, hand-cut, and sewn with double-stitched French seams.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-black/8 bg-white flex items-center justify-between">
          <button
            onClick={handleDownloadTechPack}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-black/5 rounded-xl border border-black/10 transition-colors cursor-pointer"
          >
            {isExported ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Tech Pack PDF Exported</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Tech Pack (PDF)</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">Total Investment</span>
              <span className="text-lg font-serif font-bold text-slate-900">
                ${price} USD
              </span>
            </div>

            <button
              onClick={handleOrder}
              disabled={isAdded}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-98 cursor-pointer"
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Custom Garment</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
