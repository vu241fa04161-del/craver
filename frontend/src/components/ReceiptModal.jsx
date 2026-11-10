import React from 'react';
import { X, Printer, UtensilsCrossed, CheckCircle2, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ReceiptModal = () => {
  const { receiptOrder, setReceiptOrder } = useCart();

  if (!receiptOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-100 max-h-[90vh] overflow-y-auto relative print:shadow-none print:border-none print:m-0 print:p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Actions header (hidden when printing) */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-stone-100 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Official Receipt</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setReceiptOrder(null)}
              className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-md">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">Craver Express</h2>
            <p className="text-xs text-stone-500">101 Gourmet Avenue, Food District</p>
            <p className="text-[11px] text-stone-400">support@craver.com • +1 (800) 555-CRAV</p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60 text-xs">
            <div>
              <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Order No.</div>
              <div className="font-mono font-bold text-stone-900">{receiptOrder._id}</div>
            </div>
            <div>
              <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Date & Time</div>
              <div className="font-bold text-stone-900">
                {receiptOrder.createdAt ? new Date(receiptOrder.createdAt).toLocaleString() : 'Just now'}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Customer</div>
              <div className="font-bold text-stone-900">{receiptOrder.customerName || 'Alex Johnson'}</div>
            </div>
            <div>
              <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Payment</div>
              <div className="font-bold text-stone-900">{receiptOrder.paymentMethod || 'Credit Card'}</div>
            </div>
          </div>

          {/* Delivery Location */}
          <div className="flex items-start gap-2 text-xs text-stone-600 bg-stone-50/50 p-2.5 rounded-xl border border-stone-100">
            <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-900">Delivered to: </span>
              {receiptOrder.deliveryAddress}
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-stone-400 mb-2">
              Itemized Summary
            </div>
            <div className="space-y-2 border-y border-stone-200 py-3">
              {receiptOrder.items?.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-stone-800">
                    <span className="font-bold text-stone-900">{it.quantity}x</span> {it.name}
                  </span>
                  <span className="font-bold text-stone-900">${(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown Totals */}
          <div className="space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-stone-900">${receiptOrder.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-bold text-stone-900">
                {receiptOrder.deliveryFee === 0 ? 'FREE' : `$${receiptOrder.deliveryFee?.toFixed(2)}`}
              </span>
            </div>
            {receiptOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount Applied</span>
                <span>-${receiptOrder.discount?.toFixed(2)}</span>
              </div>
            )}
            {receiptOrder.tip > 0 && (
              <div className="flex justify-between">
                <span>Courier Tip</span>
                <span className="font-bold text-stone-900">${receiptOrder.tip?.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-black text-stone-900">
              <span>Grand Total</span>
              <span className="text-brand-600 text-base">${receiptOrder.totalAmount?.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-4 border-t border-dashed border-stone-200 text-[11px] text-stone-400">
            <p>Thank you for craving with Craver!</p>
            <p className="mt-0.5">Contact us at support@craver.com if you have any questions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
