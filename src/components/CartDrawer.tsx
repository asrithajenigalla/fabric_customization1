import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 300 ? 0 : 25;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderConfirmed(true);
      onClearCart();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col border-l border-black/10">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-black/8 bg-white/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-serif font-semibold text-slate-900">
              Atelier Orders & Cart
            </span>
            <span className="text-xs font-mono text-slate-500">
              ({items.length} {items.length === 1 ? 'garment' : 'garments'})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {orderConfirmed ? (
            <div className="py-12 px-4 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-serif font-semibold text-slate-900">
                  Bespoke Commission Received
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Order #TT-9842 is scheduled for hand-weaving in Como, Italy. A digital proof and tailor measurement review have been sent to your email.
                </p>
              </div>
              <button
                onClick={() => {
                  setOrderConfirmed(false);
                  onClose();
                }}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Back to Custom Studio
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <p className="text-sm font-medium">Your atelier cart is empty</p>
              <p className="text-xs">Customize your silk blouse on the mannequin and click "Export & Order".</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white rounded-xl border border-black/6 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg border border-black/10 shrink-0 shadow-xs flex items-center justify-center"
                        style={{ backgroundColor: item.colorHex }}
                      >
                        <span className="text-[10px] text-white/90 font-mono font-bold">
                          {item.weaveName.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {item.weaveName} · {item.colorName}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-0.5 bg-black/2 p-2 rounded-lg">
                    <div className="flex justify-between">
                      <span>Pattern:</span>
                      <span className="font-medium text-slate-700">{item.patternName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hardware:</span>
                      <span className="font-medium text-slate-700">{item.buttonFinish}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span className="font-medium text-slate-700">{item.size}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 bg-black/5 rounded-lg px-2 py-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-medium">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-semibold font-mono text-slate-900">
                      ${item.price * item.quantity} USD
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && !orderConfirmed && (
          <div className="p-4 border-t border-black/8 bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Garment Subtotal:</span>
                <span className="font-mono text-slate-900">${subtotal} USD</span>
              </div>
              <div className="flex justify-between">
                <span>Insured Global Atelier Delivery:</span>
                <span className="font-mono text-slate-900">
                  {shipping === 0 ? 'Complimentary' : `$${shipping} USD`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-slate-900 pt-1.5 border-t border-black/6">
                <span>Estimated Total:</span>
                <span className="font-mono">${total} USD</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isCheckingOut ? (
                <span>Securing Loom Allocation...</span>
              ) : (
                <>
                  <span>Commission & Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3 h-3 text-slate-500" />
              <span>Includes 14-day Bespoke Alteration Privilege</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
