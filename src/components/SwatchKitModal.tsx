import React, { useState } from 'react';
import { X, Check, Mail, Sparkles, Package } from 'lucide-react';
import { WEAVE_ITEMS, COLOR_SWATCHES } from '../data/studioData';

interface SwatchKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SwatchKitModal: React.FC<SwatchKitModalProps> = ({ isOpen, onClose }) => {
  const [selectedWeaves, setSelectedWeaves] = useState<string[]>(['satin-silk', 'herringbone-tweed', 'plain-weave']);
  const [shippingAddress, setShippingAddress] = useState({ name: '', email: '', address: '', country: 'United States' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleWeave = (id: string) => {
    setSelectedWeaves((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((w) => w !== id) : prev) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F5] w-full max-w-lg rounded-2xl shadow-2xl border border-black/10 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/8 bg-white/70 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-mono tracking-widest text-slate-500">
              Tactile Atelier Samples
            </span>
            <h2 className="text-lg font-serif font-semibold text-slate-900">
              Request Physical Swatch Ring
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-black/5 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <Package className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-semibold text-slate-900">
                Swatch Ring Dispatched
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Your archival 10cm x 10cm mounted silk cards are on their way with express courier.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Select Weaves to Include (up to 4):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {WEAVE_ITEMS.map((w) => {
                    const isChecked = selectedWeaves.includes(w.id);
                    return (
                      <button
                        type="button"
                        key={w.id}
                        onClick={() => toggleWeave(w.id)}
                        className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                          isChecked
                            ? 'border-slate-900 bg-white ring-1 ring-slate-900 font-medium'
                            : 'border-black/6 bg-white/70 text-slate-600'
                        }`}
                      >
                        <span className="truncate">{w.name}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-slate-900 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-black/5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Delivery Destination:
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={shippingAddress.name}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-black/10 bg-white text-slate-800"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={shippingAddress.email}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-black/10 bg-white text-slate-800"
                />
                <input
                  type="text"
                  placeholder="Street Address, City, Postal Code"
                  required
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-black/10 bg-white text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
              >
                Request Free Sample Ring ($0.00)
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
