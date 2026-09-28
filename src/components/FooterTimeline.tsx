import React from 'react';
import { TimelineEntry } from '../types';
import { History, Undo2, Redo2, RotateCcw } from 'lucide-react';

interface FooterTimelineProps {
  timeline: TimelineEntry[];
  currentIndex: number;
  onJumpToIndex: (index: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
}

export const FooterTimeline: React.FC<FooterTimelineProps> = ({
  timeline,
  currentIndex,
  onJumpToIndex,
  onUndo,
  onRedo,
  onReset,
}) => {
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < timeline.length - 1;

  return (
    <footer className="h-10 bg-[#FAF8F5]/90 border-t border-black/5 px-6 flex items-center justify-between text-xs text-slate-500 z-10 shrink-0 backdrop-blur-xs select-none">
      
      {/* Left controls: Undo / Redo / History icon */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <History className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] uppercase tracking-wider text-slate-500 hidden sm:inline">
            Customization Timeline:
          </span>
        </div>

        <div className="flex items-center gap-1 ml-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1 rounded transition-colors ${
              canUndo
                ? 'text-slate-700 hover:text-slate-900 hover:bg-black/5'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            title="Undo recent step"
          >
            <Undo2 className="w-3 h-3" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1 rounded transition-colors ${
              canRedo
                ? 'text-slate-700 hover:text-slate-900 hover:bg-black/5'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            title="Redo step"
          >
            <Redo2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Middle: Horizontal timeline chain */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-xl px-2">
        {timeline.map((entry, idx) => {
          const isCurrent = idx === currentIndex;
          const isPast = idx < currentIndex;

          return (
            <button
              key={entry.id}
              onClick={() => onJumpToIndex(idx)}
              className={`flex items-center gap-1.5 py-0.5 px-2 rounded-md transition-all text-[11px] whitespace-nowrap cursor-pointer ${
                isCurrent
                  ? 'bg-slate-900 text-white font-medium shadow-xs'
                  : isPast
                  ? 'text-slate-600 hover:bg-black/5 hover:text-slate-900'
                  : 'text-slate-400 hover:bg-black/5'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isCurrent
                    ? 'bg-amber-400'
                    : isPast
                    ? 'bg-slate-400'
                    : 'bg-slate-200'
                }`}
              />
              <span>{entry.title}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Reset and Status */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
          {timeline.length} iterations recorded
        </span>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 transition-colors p-1"
          title="Restore Atelier Default Settings"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

    </footer>
  );
};
