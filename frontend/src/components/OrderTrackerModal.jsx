import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  Home,
  Phone,
  MessageSquare,
  MapPin,
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export const OrderTrackerModal = () => {
  const { activeOrder, setActiveOrder, isTrackerOpen, setIsTrackerOpen } = useCart();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isTrackerOpen || !activeOrder) return null;

  const statuses = ['Order Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentStatusIndex = statuses.indexOf(activeOrder.status) !== -1
    ? statuses.indexOf(activeOrder.status)
    : 0;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const updated = await api.getOrderById(activeOrder._id);
      setActiveOrder(updated);
    } catch (e) {
      console.warn('Could not refresh order status');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-100 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200/80 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Bike className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-stone-900">
                  Live Order Tracker
                </h3>
                <span className="font-mono text-xs bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-bold">
                  #{activeOrder._id}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Estimated Arrival: <span className="font-bold text-brand-600">{activeOrder.estimatedTime || '20-25 min'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-all ${
                isRefreshing ? 'animate-spin text-brand-500' : ''
              }`}
              title="Refresh status"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsTrackerOpen(false)}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Interactive Progress Stepper */}
        <div className="p-6 bg-gradient-to-b from-stone-50/50 to-white border-b border-stone-100">
          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-5 left-6 right-6 h-1 bg-stone-200 -z-0">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-brand-500 transition-all duration-700"
                style={{
                  width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Stepper icons */}
            <div className="flex justify-between items-center relative z-10">
              {[
                { title: 'Confirmed', icon: CheckCircle2 },
                { title: 'Kitchen', icon: ChefHat },
                { title: 'On The Way', icon: Bike },
                { title: 'Delivered', icon: Home },
              ].map((step, idx) => {
                const Icon = step.icon;
                const isPassed = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;

                return (
                  <div key={step.title} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                        isCurrent
                          ? 'bg-brand-500 text-white ring-4 ring-brand-100 scale-110'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-stone-400 border-2 border-stone-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[11px] font-bold mt-2 ${
                        isCurrent
                          ? 'text-brand-600'
                          : isPassed
                          ? 'text-stone-800'
                          : 'text-stone-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Simulated Live GPS Map View */}
        <div className="p-6 space-y-5">
          <div className="relative h-44 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-inner flex items-center justify-center">
            {/* Stylized SVG Map Graphics */}
            <svg
              className="absolute inset-0 w-full h-full opacity-40"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
            >
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#d6d3d1" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Curving road */}
              <path
                d="M 40 130 Q 180 30, 320 120 T 520 80"
                fill="none"
                stroke="#f97316"
                strokeWidth="6"
                strokeDasharray="8 6"
                className="animate-pulse"
              />
            </svg>

            {/* Restaurant Pin */}
            <div className="absolute left-8 bottom-6 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-lg">
                <ChefHat className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold bg-white/90 px-1.5 py-0.5 rounded shadow mt-1">
                Kitchen
              </span>
            </div>

            {/* Courier Moving Pin */}
            <div className="absolute left-1/2 top-10 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
              <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-xl ring-4 ring-white">
                <Bike className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold bg-brand-600 text-white px-2 py-0.5 rounded-full shadow mt-1">
                Courier on Route
              </span>
            </div>

            {/* Destination Pin */}
            <div className="absolute right-8 top-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold bg-white/90 px-1.5 py-0.5 rounded shadow mt-1">
                You
              </span>
            </div>
          </div>

          {/* Courier Info Card */}
          <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-amber-500 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                MR
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-stone-900">Marco Ramirez</h4>
                  <span className="text-[11px] font-semibold text-amber-600 bg-amber-100 px-1.5 py-0.2 rounded">
                    ⭐ 4.95
                  </span>
                </div>
                <p className="text-xs text-stone-500">Silver Honda Civic • CRAV-78</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Calling driver: +1 (555) 234-8901')}
                className="w-9 h-9 rounded-xl bg-white hover:bg-emerald-50 text-emerald-600 border border-stone-200 flex items-center justify-center shadow-sm transition-all"
                title="Call driver"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => alert('Driver message: "I have picked up your food and am 8 mins away!"')}
                className="w-9 h-9 rounded-xl bg-white hover:bg-brand-50 text-brand-600 border border-stone-200 flex items-center justify-center shadow-sm transition-all"
                title="Message driver"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Itemized Order Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Order Details
            </h4>
            <div className="space-y-2 border border-stone-200/70 rounded-2xl p-3 bg-stone-50/50">
              {activeOrder.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-stone-700">
                  <span className="font-medium">
                    <span className="font-bold text-stone-900">{item.quantity}x</span> {item.name}
                  </span>
                  <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-stone-200 flex justify-between text-xs font-bold text-stone-900">
                <span>Total Paid ({activeOrder.paymentMethod})</span>
                <span className="text-brand-600">${activeOrder.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="flex items-start gap-2.5 text-xs text-stone-600">
            <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-900">Drop-off: </span>
              {activeOrder.deliveryAddress}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={() => setIsTrackerOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-all shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
