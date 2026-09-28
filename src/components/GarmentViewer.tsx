import React, { useState, useRef, useEffect } from 'react';
import { CameraAngle, ColorSwatch, GarmentZone, LightingMode, WeaveItem } from '../types';
import { ASSET_IMAGES, PATTERN_ITEMS } from '../data/studioData';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Compass, 
  Sun, 
  Sparkles, 
  Eye,
  Layers,
  Info
} from 'lucide-react';

interface GarmentViewerProps {
  weave: WeaveItem;
  color: ColorSwatch;
  secondaryWeftColor?: string;
  isShotSilk: boolean;
  patternId: string;
  patternScale: number;
  patternRotation: number;
  patternOpacity: number;
  cameraAngle: CameraAngle;
  lighting: LightingMode;
  sheenAdjust: number;
  buttonFinish: string;
  activeZone: GarmentZone;
  onZoneSelect: (zone: GarmentZone) => void;
  onAngleChange: (angle: CameraAngle) => void;
  onDropPattern?: (patternId: string) => void;
}

export const GarmentViewer: React.FC<GarmentViewerProps> = ({
  weave,
  color,
  secondaryWeftColor,
  isShotSilk,
  patternId,
  patternScale,
  patternRotation,
  patternOpacity,
  cameraAngle,
  lighting,
  sheenAdjust,
  buttonFinish,
  activeZone,
  onZoneSelect,
  onAngleChange,
  onDropPattern,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [turntableRotation, setTurntableRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [isHoveringCuff, setIsHoveringCuff] = useState<boolean>(true); // Active default as requested in prompt
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [inspectionMode, setInspectionMode] = useState<'normal' | 'sheen-analysis' | 'wireframe-weave'>('normal');

  // Compute base image according to camera angle and turntable rotation
  let activeImage = ASSET_IMAGES.front;
  if (cameraAngle === 'cuff-detail') {
    activeImage = ASSET_IMAGES.cuff;
  } else if (cameraAngle === 'back') {
    activeImage = ASSET_IMAGES.back;
  } else if (cameraAngle === 'side') {
    activeImage = ASSET_IMAGES.front; // will use subtle 3D transform
  }

  // Active pattern
  const currentPattern = PATTERN_ITEMS.find((p) => p.id === patternId);

  // Compute lighting atmospheric styles
  const getLightingStyle = () => {
    switch (lighting) {
      case 'soft-studio':
        return {
          background: 'radial-gradient(circle at 45% 35%, #FBF9F5 0%, #EDE7DD 60%, #E0D7C8 100%)',
          brightness: 1.02,
          contrast: 1.0,
          warmth: 1.0,
        };
      case 'natural-daylight':
        return {
          background: 'radial-gradient(circle at 65% 25%, #FFFDF9 0%, #F1ECE2 55%, #DDD6C7 100%)',
          brightness: 1.08,
          contrast: 1.05,
          warmth: 0.98,
        };
      case 'golden-hour':
        return {
          background: 'radial-gradient(circle at 25% 45%, #FDEED9 0%, #EAD7BE 50%, #D1B898 100%)',
          brightness: 1.04,
          contrast: 1.08,
          warmth: 1.15,
        };
      case 'runway-spotlight':
        return {
          background: 'radial-gradient(circle at 50% 30%, #E6E1D8 0%, #CAC1B2 50%, #A89D8C 100%)',
          brightness: 1.12,
          contrast: 1.15,
          warmth: 0.95,
        };
    }
  };

  const lightingProps = getLightingStyle();
  const effectiveSheen = Math.min(1.0, Math.max(0.05, weave.sheen + sheenAdjust / 100));

  // Drag-to-rotate turntable interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    if (cameraAngle === 'cuff-detail') return;
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    if (Math.abs(deltaX) > 4) {
      const newRotation = (turntableRotation + deltaX * 0.4) % 360;
      setTurntableRotation(newRotation);
      setDragStartX(e.clientX);

      // Map rotation to angle automatically if dragged far
      const normalized = (newRotation + 360) % 360;
      if (normalized > 120 && normalized < 240 && cameraAngle !== 'back') {
        onAngleChange('back');
      } else if ((normalized <= 60 || normalized >= 300) && cameraAngle !== 'front') {
        onAngleChange('front');
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom handlers
  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(2.5, Math.max(0.75, prev + delta)));
  };

  const resetView = () => {
    setZoomLevel(1);
    setTurntableRotation(0);
    onAngleChange('front');
  };

  // Drag and drop pattern support
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const patternData = e.dataTransfer.getData('text/plain');
    if (patternData && onDropPattern) {
      onDropPattern(patternData);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex-1 h-full min-h-[580px] flex flex-col items-center justify-center overflow-hidden select-none transition-colors duration-700"
      style={{ background: lightingProps.background }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Subtle Studio Architectural Floor Reflection Line */}
      <div className="absolute bottom-12 inset-x-0 h-40 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-16 w-96 h-12 bg-black/10 rounded-full blur-xl pointer-events-none transform scale-y-50" />

      {/* Top Floating Viewport Control Ribbon */}
      <div className="absolute top-4 left-6 right-6 flex items-center justify-between pointer-events-auto z-20">
        <div className="flex items-center gap-2 bg-[#FAF8F5]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-xs font-medium text-slate-800 tracking-wide uppercase">
            Interactive Atelier Viewer
          </span>
          <span className="text-slate-300 text-xs">|</span>
          <span className="text-xs text-slate-500 font-mono">
            {cameraAngle === 'cuff-detail' ? 'Macro 1:1 Detail' : `${Math.round((turntableRotation + 360) % 360)}° Orbit`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Inspection Mode Selector */}
          <div className="flex items-center bg-[#FAF8F5]/90 backdrop-blur-md rounded-full border border-black/8 p-0.5 shadow-sm text-xs">
            <button
              onClick={() => setInspectionMode('normal')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                inspectionMode === 'normal' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Photorealistic Drape & Lighting"
            >
              Photoreal
            </button>
            <button
              onClick={() => setInspectionMode('sheen-analysis')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                inspectionMode === 'sheen-analysis' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Specular Lustre & Thread Reflection"
            >
              Lustre Heatmap
            </button>
            <button
              onClick={() => setInspectionMode('wireframe-weave')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                inspectionMode === 'wireframe-weave' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Weave Interlacing Grid"
            >
              Weave Matrix
            </button>
          </div>

          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`p-2 rounded-full border border-black/8 transition-all shadow-sm ${
              showHotspots ? 'bg-slate-900 text-white' : 'bg-[#FAF8F5]/90 text-slate-700 hover:bg-white'
            }`}
            title="Toggle Garment Hotspots"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Garment Stage */}
      <div 
        className="relative flex items-center justify-center w-full h-full max-h-[820px] transition-transform duration-300 ease-out"
        style={{
          transform: `scale(${zoomLevel}) rotateY(${cameraAngle === 'side' ? '30deg' : '0deg'})`,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {/* Real-time Blouse Base Composite */}
        <div className="relative w-auto h-[86%] max-h-[740px] aspect-[3/4] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 bg-transparent">
          
          {/* 1. PHOTOREALISTIC BASE BLOUSE IMAGE */}
          <img
            src={activeImage}
            alt="Tailored Silk Blouse on Mannequin"
            className="w-full h-full object-cover object-center pointer-events-none select-none transition-opacity duration-500"
            style={{
              filter: `contrast(${lightingProps.contrast}) brightness(${lightingProps.brightness})`,
            }}
          />

          {/* 2. REAL-TIME COLOR TINT & FABRIC DYE LAYER */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-500"
            style={{
              backgroundColor: color.hex,
              mixBlendMode: 'multiply',
              opacity: color.name === 'Ivory Pearl' ? 0.25 : 0.85,
            }}
          />

          {/* 2b. SECONDARY WEFT COLOR TINT (IRIDESCENT SHOT-SILK SHIMMER) */}
          {isShotSilk && secondaryWeftColor && (
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-500"
              style={{
                background: `linear-gradient(115deg, ${secondaryWeftColor}88 0%, transparent 45%, ${secondaryWeftColor}66 100%)`,
                mixBlendMode: 'color-dodge',
                opacity: 0.75,
              }}
            />
          )}

          {/* 3. TILEABLE PATTERN OVERLAY */}
          {currentPattern && !currentPattern.isSolid && (
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundImage: currentPattern.id === 'abstract-florals' 
                  ? `url(${ASSET_IMAGES.patternBotanical})`
                  : `url('${currentPattern.thumbnailUrl}')`,
                backgroundSize: `${patternScale * 1.8}px`,
                backgroundRepeat: 'repeat',
                transform: `rotate(${patternRotation}deg)`,
                opacity: patternOpacity * 0.78,
                mixBlendMode: 'multiply',
              }}
            />
          )}

          {/* 4. PROCEDURAL WEAVE MICRO-TEXTURE & RELIEF SHADER */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-500"
            style={{
              opacity: weave.id === 'herringbone-tweed' ? 0.65 : 0.35,
              mixBlendMode: weave.id === 'satin-silk' ? 'screen' : 'overlay',
              backgroundImage: 
                weave.id === 'herringbone-tweed'
                  ? 'repeating-linear-gradient(45deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 6px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 2px, transparent 2px, transparent 6px)'
                  : weave.id === 'plain-weave'
                  ? 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 4px)'
                  : weave.id === 'jacquard-silk'
                  ? 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)'
                  : weave.id === 'silk-twill'
                  ? 'repeating-linear-gradient(45deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1.5px, transparent 1.5px, transparent 4px)'
                  : 'radial-gradient(circle at 45% 30%, rgba(255,255,255,0.45) 0%, transparent 70%)',
            }}
          />

          {/* 5. SPECULAR SILK CHARMEUSE SHEEN & LIGHT REFLECTION */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,${effectiveSheen * 0.45}) 0%, transparent 35%, rgba(255,255,255,${effectiveSheen * 0.25}) 60%, transparent 100%)`,
              mixBlendMode: 'soft-light',
            }}
          />

          {/* 6. INSPECTION MODE OVERLAYS */}
          {inspectionMode === 'sheen-analysis' && (
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-80"
              style={{
                background: 'linear-gradient(45deg, rgba(16,185,129,0.3), rgba(245,158,11,0.5), rgba(239,68,68,0.4))'
              }}
            />
          )}

          {inspectionMode === 'wireframe-weave' && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-40 mix-blend-difference"
              style={{
                backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                backgroundSize: '12px 12px',
              }}
            />
          )}

          {/* 7. INTERACTIVE CUFF HOVER ZONE & TAILOR'S CURSOR AS SPECIFIED */}
          {cameraAngle !== 'cuff-detail' && (
            <div
              className={`absolute bottom-[24%] right-[22%] w-24 h-24 rounded-full transition-all duration-300 cursor-pointer pointer-events-auto ${
                isHoveringCuff ? 'ring-2 ring-amber-500/80 bg-amber-500/10 scale-105' : 'hover:ring-1 hover:ring-amber-400/50'
              }`}
              onMouseEnter={() => setIsHoveringCuff(true)}
              onMouseLeave={() => setIsHoveringCuff(false)}
              onClick={() => onAngleChange('cuff-detail')}
            >
              {/* Animated Tailor Reticle & Caliper */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border border-white"></span>
                </span>
              </div>

              {/* Cursor / Tooltip callout as highlighted in the prompt */}
              <div 
                className={`absolute bottom-full right-0 mb-3 w-64 p-3 bg-slate-950/95 backdrop-blur-md text-white rounded-xl shadow-xl border border-white/10 transition-all duration-200 pointer-events-none z-30 ${
                  isHoveringCuff ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-amber-400 font-mono mb-1">
                  <span>ZONE: FRENCH CUFF</span>
                  <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300">Macro View Available</span>
                </div>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  Tailored mitered turnback with {buttonFinish.replace('-', ' ')} button. Micro-weave warp tension: 320 ends/in.
                </p>
                <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Click to inspect micro-weave & button details
                </div>
              </div>
            </div>
          )}

          {/* 8. COLLAR HOTSPOT */}
          {showHotspots && cameraAngle !== 'cuff-detail' && (
            <button
              onClick={() => onZoneSelect(activeZone === 'collar' ? 'all' : 'collar')}
              className="absolute top-[18%] left-[48%] -translate-x-1/2 group pointer-events-auto p-2"
              title="Tailored Point Collar"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white border border-slate-900 shadow-md"></span>
              </span>
              <span className="opacity-0 group-hover:opacity-100 absolute left-full ml-2 top-0 text-[11px] whitespace-nowrap bg-slate-900/90 text-white px-2 py-1 rounded shadow-lg transition-opacity font-mono">
                Collar & Stand
              </span>
            </button>
          )}

          {/* 9. BODICE HOTSPOT */}
          {showHotspots && cameraAngle !== 'cuff-detail' && (
            <button
              onClick={() => onZoneSelect(activeZone === 'bodice' ? 'all' : 'bodice')}
              className="absolute top-[44%] left-[46%] group pointer-events-auto p-2"
              title="Tailored Bodice & Fluid Pleats"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white/90 border border-slate-900 shadow-md"></span>
              </span>
              <span className="opacity-0 group-hover:opacity-100 absolute left-full ml-2 top-0 text-[11px] whitespace-nowrap bg-slate-900/90 text-white px-2 py-1 rounded shadow-lg transition-opacity font-mono">
                Bodice Charmeuse Drape
              </span>
            </button>
          )}

          {/* Drag Over Visual Indicator */}
          {isDragOver && (
            <div className="absolute inset-0 bg-amber-500/20 backdrop-blur-xs border-2 border-dashed border-amber-500 rounded-2xl flex items-center justify-center z-40 transition-all">
              <div className="bg-slate-950/90 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                <span className="text-sm font-medium">Release to drape pattern on garment</span>
              </div>
            </div>
          )}

          {/* Close Macro Button if in Cuff View */}
          {cameraAngle === 'cuff-detail' && (
            <div className="absolute top-4 right-4 z-30">
              <button
                onClick={() => onAngleChange('front')}
                className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-medium rounded-lg shadow-lg flex items-center gap-1.5 backdrop-blur-md transition-colors"
              >
                <span>Back to Full Mannequin</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Left: Fabric Real-time Telemetry & Physics */}
      <div className="absolute bottom-6 left-6 pointer-events-auto z-20 hidden md:block">
        <div className="bg-[#FAF8F5]/92 backdrop-blur-md rounded-xl p-3 border border-black/8 shadow-sm text-xs space-y-1.5 min-w-[210px]">
          <div className="flex items-center justify-between text-slate-500 border-b border-black/5 pb-1">
            <span className="font-semibold text-slate-800">{weave.name}</span>
            <span className="font-mono text-[11px]">{weave.weightGsm} GSM</span>
          </div>
          <div className="flex items-center justify-between text-slate-600 text-[11px]">
            <span>Lustre Reflection:</span>
            <span className="font-mono font-medium">{Math.round(effectiveSheen * 100)}%</span>
          </div>
          <div className="flex items-center justify-between text-slate-600 text-[11px]">
            <span>Weave Matrix:</span>
            <span className="text-slate-700 capitalize">{weave.weaveStructure}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600 text-[11px]">
            <span>Color Ref:</span>
            <span className="font-mono text-[10px] text-slate-700">{color.pantone.split(' ')[1] || color.hex}</span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Right: Viewport Zoom & Turntable Controls */}
      <div className="absolute bottom-6 right-6 pointer-events-auto flex items-center gap-1.5 bg-[#FAF8F5]/90 backdrop-blur-md p-1.5 rounded-xl border border-black/8 shadow-sm z-20">
        <button
          onClick={() => handleZoom(0.2)}
          className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-black/5 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-0.2)}
          className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-black/5 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-black/10 mx-0.5" />
        <button
          onClick={resetView}
          className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-black/5 rounded-lg transition-colors"
          title="Reset Camera View"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
