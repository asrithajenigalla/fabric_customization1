import React, { useState, useRef, useEffect } from 'react';
import { ButtonFinish, ColorSwatch, WeaveId, WeaveItem } from '../types';
import { WEAVE_ITEMS, COLOR_SWATCHES, BUTTON_OPTIONS } from '../data/studioData';
import { 
  Palette, 
  Sparkles, 
  Layers, 
  Sliders, 
  Check, 
  Eye, 
  Info,
  ChevronDown,
  Droplet
} from 'lucide-react';

interface RightWeaveColorPanelProps {
  selectedWeave: WeaveItem;
  onSelectWeave: (weave: WeaveItem) => void;
  selectedColor: ColorSwatch;
  onSelectColor: (color: ColorSwatch) => void;
  secondaryWeftColor?: string;
  onSelectSecondaryWeft: (hex: string) => void;
  isShotSilk: boolean;
  onToggleShotSilk: (enabled: boolean) => void;
  sheenAdjust: number;
  onSheenAdjustChange: (val: number) => void;
  buttonFinish: ButtonFinish;
  onSelectButtonFinish: (finish: ButtonFinish) => void;
}

export const RightWeaveColorPanel: React.FC<RightWeaveColorPanelProps> = ({
  selectedWeave,
  onSelectWeave,
  selectedColor,
  onSelectColor,
  secondaryWeftColor,
  onSelectSecondaryWeft,
  isShotSilk,
  onToggleShotSilk,
  sheenAdjust,
  onSheenAdjustChange,
  buttonFinish,
  onSelectButtonFinish,
}) => {
  const [activeTab, setActiveTab] = useState<'weave' | 'color' | 'hardware'>('weave');
  const [colorMode, setColorMode] = useState<'swatches' | 'wheel'>('swatches');
  const [customHex, setCustomHex] = useState<string>(selectedColor.hex);

  // Wheel canvas ref
  const wheelCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isPickingWheel, setIsPickingWheel] = useState<boolean>(false);

  // Synchronize custom hex with selected color
  useEffect(() => {
    setCustomHex(selectedColor.hex);
  }, [selectedColor]);

  // Draw interactive hue wheel
  useEffect(() => {
    const canvas = wheelCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2;

    ctx.clearRect(0, 0, width, height);

    // Render radial chromatic circle
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = ((angle - 1) * Math.PI) / 180;
      const endAngle = ((angle + 1) * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 2, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = `hsl(${angle}, 85%, 50%)`;
      ctx.fill();
    }

    // Inner white gradient to create saturation falloff
    const innerGrad = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius - 2);
    innerGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    innerGrad.addColorStop(0.75, 'rgba(255, 255, 255, 0.1)');
    innerGrad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 2, 0, Math.PI * 2);
    ctx.fill();

    // Center cutout for donut wheel feel
    ctx.beginPath();
    ctx.arc(radius, radius, radius * 0.38, 0, Math.PI * 2);
    ctx.fillStyle = '#FAF8F5';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [colorMode]);

  // Handle color wheel interaction
  const handleWheelClickOrDrag = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = wheelCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = rect.width / 2;

    if (distance > radius * 0.3 && distance <= radius) {
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      if (angle < 0) angle += 360;

      const sat = Math.min(100, Math.max(30, Math.round((distance / radius) * 100)));
      const lit = 45; // balanced silk tone

      // Convert HSL to Hex
      const hex = hslToHex(angle, sat, lit);
      const newSwatch: ColorSwatch = {
        name: `Atelier Custom ${Math.round(angle)}°`,
        hex: hex,
        pantone: `PANTONE ${Math.round(10 + (angle / 360) * 9)}-${Math.round(1000 + sat * 20)} TCX`,
        category: 'Atelier Signature',
        hsl: { h: Math.round(angle), s: sat, l: lit },
      };
      onSelectColor(newSwatch);
    }
  };

  function hslToHex(h: number, s: number, l: number) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  }

  const handleHexInputChange = (val: string) => {
    setCustomHex(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      onSelectColor({
        name: 'Custom Swatch',
        hex: val.toUpperCase(),
        pantone: 'PANTONE Custom TCX',
        category: 'Atelier Signature',
        hsl: { h: 0, s: 70, l: 50 },
      });
    }
  };

  return (
    <aside className="w-80 lg:w-96 h-full flex flex-col bg-[#FAF8F5] border-l border-black/8 z-10 shrink-0">
      {/* Panel Header */}
      <div className="p-4 border-b border-black/8 bg-white/60 backdrop-blur-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-serif font-medium tracking-tight text-slate-900">
              Weave & Color
            </h2>
            <p className="text-xs text-slate-500">
              Fiber composition, loom structure & dye formulation
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/5 text-slate-700">
            {selectedWeave.weightGsm} GSM
          </span>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-black/5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('weave')}
            className={`flex-1 py-1.5 rounded-md transition-all text-center ${
              activeTab === 'weave'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weave Structure
          </button>
          <button
            onClick={() => setActiveTab('color')}
            className={`flex-1 py-1.5 rounded-md transition-all text-center ${
              activeTab === 'color'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Color & Dye
          </button>
          <button
            onClick={() => setActiveTab('hardware')}
            className={`flex-1 py-1.5 rounded-md transition-all text-center ${
              activeTab === 'hardware'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hardware
          </button>
        </div>
      </div>

      {/* Panel Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* TAB 1: WEAVE STRUCTURE */}
        {activeTab === 'weave' && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Loom Weave Selection
                </span>
                <span className="text-[11px] text-slate-400">
                  6 Atelier Qualities
                </span>
              </div>

              {/* Weave Cards Grid */}
              <div className="space-y-2">
                {WEAVE_ITEMS.map((weave) => {
                  const isSelected = selectedWeave.id === weave.id;
                  return (
                    <button
                      key={weave.id}
                      onClick={() => onSelectWeave(weave)}
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group relative overflow-hidden ${
                        isSelected
                          ? 'border-amber-600/60 bg-amber-500/8 shadow-xs ring-1 ring-amber-500/20'
                          : 'border-black/6 bg-white hover:border-black/15 hover:bg-[#FDFBF7]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">
                              {weave.name}
                            </span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            {weave.category} · {weave.origin}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono text-slate-700 font-medium">
                            {weave.weightGsm} GSM
                          </span>
                          <p className="text-[10px] text-slate-400">
                            {Math.round(weave.sheen * 100)}% Lustre
                          </p>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                        {weave.description}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-black/5 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="capitalize">{weave.weaveStructure}</span>
                        <span>{weave.threadDensity}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weave Physics & Refinement Sliders */}
            <div className="p-3.5 bg-white rounded-xl border border-black/6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">
                  Surface Lustre & Specular Flare
                </span>
                <span className="text-xs font-mono text-slate-600">
                  {sheenAdjust > 0 ? `+${sheenAdjust}%` : `${sheenAdjust}%`}
                </span>
              </div>
              <input
                type="range"
                min="-40"
                max="40"
                value={sheenAdjust}
                onChange={(e) => onSheenAdjustChange(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Matte Soft Crepe</span>
                <span>Balanced Charmeuse</span>
                <span>Mirror Silk Gloss</span>
              </div>

              {/* Two-Tone Shot Silk Toggle */}
              <div className="pt-3 border-t border-black/5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-medium text-slate-800">
                      Iridescent Shot-Silk (Chameleon Weave)
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Cross-weaves contrasting warp and weft silk filaments
                    </p>
                  </div>
                  <button
                    onClick={() => onToggleShotSilk(!isShotSilk)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      isShotSilk ? 'bg-amber-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        isShotSilk ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {isShotSilk && (
                  <div className="mt-3 p-2.5 bg-amber-500/10 rounded-lg space-y-2 border border-amber-500/20">
                    <span className="text-[11px] font-medium text-amber-900 block">
                      Secondary Weft Yarn Color:
                    </span>
                    <div className="flex items-center gap-2">
                      {['#E05A2B', '#9B111E', '#0D5C3A', '#C88736', '#16325C', '#DCA7A5'].map((cHex) => (
                        <button
                          key={cHex}
                          onClick={() => onSelectSecondaryWeft(cHex)}
                          className={`w-6 h-6 rounded-full border transition-all ${
                            secondaryWeftColor === cHex
                              ? 'ring-2 ring-amber-600 scale-110 shadow-xs'
                              : 'opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: cHex }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COLOR & DYE */}
        {activeTab === 'color' && (
          <div className="space-y-5">
            {/* Color Library / Wheel Segmented Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-600">
                Palette & Formulations
              </span>
              <div className="flex items-center bg-black/5 p-0.5 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setColorMode('swatches')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    colorMode === 'swatches' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Atelier Swatches
                </button>
                <button
                  onClick={() => setColorMode('wheel')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    colorMode === 'wheel' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Precision Wheel
                </button>
              </div>
            </div>

            {/* Mode 1: Curated Swatch Library */}
            {colorMode === 'swatches' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {COLOR_SWATCHES.map((swatch) => {
                    const isSelected = selectedColor.hex.toLowerCase() === swatch.hex.toLowerCase();
                    return (
                      <button
                        key={swatch.name}
                        onClick={() => onSelectColor(swatch)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-slate-900 bg-white shadow-xs ring-1 ring-slate-900'
                            : 'border-black/6 bg-white/70 hover:bg-white hover:border-black/15'
                        }`}
                      >
                        <div
                          className="w-7 h-7 rounded-lg border border-black/10 shrink-0 shadow-xs flex items-center justify-center"
                          style={{ backgroundColor: swatch.hex }}
                        >
                          {isSelected && (
                            <Check className={`w-3.5 h-3.5 ${swatch.hsl.l > 70 ? 'text-slate-900' : 'text-white'}`} />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-xs font-semibold text-slate-900 block truncate">
                            {swatch.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono block truncate">
                            {swatch.pantone.split(' ')[1] || swatch.hex}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mode 2: Interactive Precision Color Wheel */}
            {colorMode === 'wheel' && (
              <div className="p-4 bg-white rounded-xl border border-black/6 flex flex-col items-center space-y-4">
                <div className="relative flex items-center justify-center">
                  <canvas
                    ref={wheelCanvasRef}
                    width={220}
                    height={220}
                    className="cursor-crosshair rounded-full shadow-inner"
                    onMouseDown={(e) => {
                      setIsPickingWheel(true);
                      handleWheelClickOrDrag(e);
                    }}
                    onMouseMove={(e) => {
                      if (isPickingWheel) handleWheelClickOrDrag(e);
                    }}
                    onMouseUp={() => setIsPickingWheel(false)}
                    onMouseLeave={() => setIsPickingWheel(false)}
                  />
                  {/* Center Selected Preview */}
                  <div
                    className="absolute w-14 h-14 rounded-full border-2 border-white shadow-md flex items-center justify-center"
                    style={{ backgroundColor: selectedColor.hex }}
                  >
                    <Droplet className={`w-4 h-4 ${selectedColor.hsl?.l > 70 ? 'text-slate-800' : 'text-white'}`} />
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Hex Color Code:</span>
                    <input
                      type="text"
                      value={customHex}
                      onChange={(e) => handleHexInputChange(e.target.value)}
                      className="font-mono text-xs px-2 py-1 bg-black/5 rounded border border-black/10 text-right w-24 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Active Color Info Card */}
            <div className="p-3 bg-white rounded-xl border border-black/6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg shadow-xs border border-black/10"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">
                    {selectedColor.name}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-500">
                    {selectedColor.pantone}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                Colorfast Guaranteed
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: HARDWARE & DETAILS */}
        {activeTab === 'hardware' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-600 block mb-2">
                Fasteners & Buttons
              </span>
              <p className="text-xs text-slate-500 mb-3">
                Tailored 11mm turnback cuff buttons & front placket closures
              </p>

              <div className="space-y-2">
                {BUTTON_OPTIONS.map((btn) => {
                  const isSelected = buttonFinish === btn.id;
                  return (
                    <button
                      key={btn.id}
                      onClick={() => onSelectButtonFinish(btn.id as ButtonFinish)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-slate-900 bg-white ring-1 ring-slate-900 shadow-xs'
                          : 'border-black/6 bg-white/70 hover:bg-white hover:border-black/15'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full border border-black/20 shadow-inner flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: btn.colorHex === 'match' ? selectedColor.hex : btn.colorHex,
                          }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-black/30" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-900 block">
                            {btn.name}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {btn.description}
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-slate-900" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tailoring Notes */}
            <div className="p-3 bg-amber-500/8 border border-amber-500/20 rounded-xl space-y-1">
              <span className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                Bespoke Atelier Assembly
              </span>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                Hand-shanked buttonhole stitching with French seam interior reinforcement prevents fabric pull along the bias drape.
              </p>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
};
