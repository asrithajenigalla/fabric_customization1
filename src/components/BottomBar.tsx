import React from 'react';
import { CameraAngle, LightingMode } from '../types';
import { 
  Camera, 
  Sun, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Maximize, 
  Layers, 
  Check
} from 'lucide-react';

interface BottomBarProps {
  cameraAngle: CameraAngle;
  onCameraAngleChange: (angle: CameraAngle) => void;
  lighting: LightingMode;
  onLightingChange: (mode: LightingMode) => void;
  onOpenExportOrder: () => void;
  price: number;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  cameraAngle,
  onCameraAngleChange,
  lighting,
  onLightingChange,
  onOpenExportOrder,
  price,
}) => {
  const cameraAngles: { id: CameraAngle; label: string }[] = [
    { id: 'front', label: 'Front' },
    { id: 'side', label: '3/4 Side' },
    { id: 'back', label: 'Back' },
    { id: 'cuff-detail', label: 'Cuff Detail' },
  ];

  const lightingModes: { id: LightingMode; label: string; icon: string }[] = [
    { id: 'soft-studio', label: 'Soft Studio', icon: '✦' },
    { id: 'natural-daylight', label: 'Natural Daylight', icon: '☀' },
    { id: 'golden-hour', label: 'Golden Hour', icon: '🌅' },
    { id: 'runway-spotlight', label: 'Runway', icon: '💡' },
  ];

  return (
    <div className="h-16 bg-[#FAF8F5] border-t border-black/8 px-6 flex items-center justify-between z-20 shrink-0">
      
      {/* 1. Camera Angle Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium hidden sm:flex">
          <Camera className="w-3.5 h-3.5 text-slate-700" />
          <span>Camera Angle:</span>
        </div>
        <div className="flex items-center bg-black/5 p-1 rounded-xl gap-1">
          {cameraAngles.map((angle) => {
            const isActive = cameraAngle === angle.id;
            return (
              <button
                key={angle.id}
                onClick={() => onCameraAngleChange(angle.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-black/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                }`}
              >
                {angle.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Lighting Mode Switcher */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium hidden lg:flex">
          <Sun className="w-3.5 h-3.5 text-slate-700" />
          <span>Lighting:</span>
        </div>
        <div className="flex items-center bg-black/5 p-1 rounded-xl gap-1">
          {lightingModes.map((mode) => {
            const isActive = lighting === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onLightingChange(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-black/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                }`}
              >
                <span className="text-[11px]">{mode.icon}</span>
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Export & Order Action */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="text-[11px] text-slate-500">Made-to-Order Atelier</div>
          <div className="text-sm font-semibold text-slate-900 font-mono">
            ${price} USD
          </div>
        </div>

        <button
          onClick={onOpenExportOrder}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 shadow-sm hover:shadow active:scale-98 cursor-pointer"
        >
          <span>Export & Order</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
