import React, { useState } from 'react';
import { PatternItem } from '../types';
import { PATTERN_ITEMS, ASSET_IMAGES } from '../data/studioData';
import { 
  Sparkles, 
  Move, 
  RotateCw, 
  Sliders, 
  UploadCloud, 
  Check, 
  Maximize, 
  Grid,
  HelpCircle
} from 'lucide-react';

interface LeftPatternPanelProps {
  selectedPatternId: string;
  onSelectPattern: (patternId: string) => void;
  patternScale: number;
  onPatternScaleChange: (scale: number) => void;
  patternRotation: number;
  onPatternRotationChange: (rotation: number) => void;
  patternOpacity: number;
  onPatternOpacityChange: (opacity: number) => void;
}

export const LeftPatternPanel: React.FC<LeftPatternPanelProps> = ({
  selectedPatternId,
  onSelectPattern,
  patternScale,
  onPatternScaleChange,
  patternRotation,
  onPatternRotationChange,
  patternOpacity,
  onPatternOpacityChange,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [customPrints, setCustomPrints] = useState<PatternItem[]>([]);

  const categories = ['All', 'Botanical', 'Geometric', 'Classic', 'Atelier Artisanal'];

  const allPatterns = [...PATTERN_ITEMS, ...customPrints];
  const filteredPatterns = activeCategory === 'All'
    ? allPatterns
    : allPatterns.filter((p) => p.category === activeCategory || p.isSolid);

  const selectedPattern = allPatterns.find((p) => p.id === selectedPatternId) || PATTERN_ITEMS[0];

  // Drag start handler for tileable patterns
  const handleDragStart = (e: React.DragEvent, patternId: string) => {
    e.dataTransfer.setData('text/plain', patternId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Mock upload handler for custom atelier motif
  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const newPattern: PatternItem = {
          id: `custom-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, '').slice(0, 18),
          category: 'Atelier Artisanal',
          thumbnailUrl: result,
          repeatSizeCm: 20,
          style: 'Bespoke client motif file',
          isSolid: false,
        };
        setCustomPrints((prev) => [newPattern, ...prev]);
        onSelectPattern(newPattern.id);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className="w-80 lg:w-96 h-full flex flex-col bg-[#FAF8F5] border-r border-black/8 z-10 shrink-0">
      {/* Panel Header */}
      <div className="p-4 border-b border-black/8 bg-white/60 backdrop-blur-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-serif font-medium tracking-tight text-slate-900">
              Pattern & Print
            </h2>
            <p className="text-xs text-slate-500">
              Curated tileable textiles & drag-and-drop prints
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/5 text-slate-700">
            {allPatterns.length} Motifs
          </span>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all font-medium ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern List Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Curated Grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-600">
              Tileable Textile Library
            </span>
            <span className="text-[11px] text-slate-400">
              Drag or Click to Apply
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {filteredPatterns.map((item) => {
              const isSelected = selectedPatternId === item.id;
              const isBotanicalSpecial = item.id === 'abstract-florals';

              return (
                <div
                  key={item.id}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onClick={() => onSelectPattern(item.id)}
                  className={`group relative rounded-xl border p-2 cursor-pointer transition-all duration-200 select-none ${
                    isSelected
                      ? 'border-slate-900 bg-white ring-1 ring-slate-900 shadow-xs'
                      : 'border-black/6 bg-white/70 hover:bg-white hover:border-black/15 hover:shadow-xs'
                  }`}
                >
                  {/* Pattern Swatch Thumbnail */}
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-black/8 bg-slate-100 mb-2">
                    <img
                      src={isBotanicalSpecial ? ASSET_IMAGES.patternBotanical : item.thumbnailUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[11px] font-medium text-white bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                        Drag to Drape
                      </span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-slate-900 block truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {item.category} {item.repeatSizeCm > 0 && `· ${item.repeatSizeCm}cm repeat`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Pattern Parameter Sliders */}
        {!selectedPattern.isSolid && (
          <div className="p-3.5 bg-white rounded-xl border border-black/6 space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 pb-2">
              <span className="text-xs font-semibold text-slate-900">
                Print Projection Controls
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {selectedPattern.name}
              </span>
            </div>

            {/* Scale Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Motif Scale</span>
                <span className="font-mono text-slate-700">{patternScale}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="220"
                value={patternScale}
                onChange={(e) => onPatternScaleChange(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Micro Micro-print</span>
                <span>Standard (100%)</span>
                <span>Bold Statement</span>
              </div>
            </div>

            {/* Rotation Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Bias Angle</span>
                <span className="font-mono text-slate-700">{patternRotation}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={patternRotation}
                onChange={(e) => onPatternRotationChange(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Straight Grain</span>
                <span>True Bias (45°)</span>
                <span>360° Free Rotate</span>
              </div>
            </div>

            {/* Print Opacity / Pigment Saturation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Print Saturation & Depth</span>
                <span className="font-mono text-slate-700">{Math.round(patternOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={Math.round(patternOpacity * 100)}
                onChange={(e) => onPatternOpacityChange(Number(e.target.value) / 100)}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Subtle Watermark</span>
                <span>Deep Reactive Ink</span>
              </div>
            </div>
          </div>
        )}

        {/* Custom Motif Upload Simulator */}
        <div className="p-3 bg-white rounded-xl border border-dashed border-black/15 text-center space-y-2">
          <UploadCloud className="w-5 h-5 mx-auto text-slate-500" />
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-slate-900 block">
              Upload Bespoke Vector or Swatch
            </span>
            <p className="text-[11px] text-slate-500">
              Supports seamless PNG, JPG, or SVG repeat files
            </p>
          </div>
          <label className="inline-block cursor-pointer px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-xs">
            <span>Browse Motif File</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSimulatedUpload}
            />
          </label>
        </div>

        {/* Atelier Craftsmanship Note */}
        <div className="p-3 bg-white/60 rounded-xl border border-black/6 text-slate-600 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Rotary Screen & Digital Acid Ink</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            All silk prints are applied using reactive eco-dyes in Como, Italy, ensuring permanent fiber penetration without compromising the liquid silk hand-feel.
          </p>
        </div>

      </div>
    </aside>
  );
};
