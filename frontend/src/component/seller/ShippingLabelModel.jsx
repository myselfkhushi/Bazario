import React from "react";
import { Printer, X } from "lucide-react";

export default function ShippingLabelModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const awb = order.trackingNumber || `FMPC${order._id.slice(-8).toUpperCase()}`;
  const orderId = `OD${order._id.slice(-16).toUpperCase()}`;
  const courier = order.courier || "E-Kart Logistics";
  const isPrepaid = true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      
      {/* Modal Container */}
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
        
        {/* Header Action Bar */}
        <div className="print:hidden flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">Flipkart Style Shipping Label</h3>
            <p className="text-xs text-slate-500 font-medium">Ready to Print & Paste on Parcel</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Label
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 🟢 EXACT FLIPKART SHIPPING LABEL (4x6 Aspect Ratio) */}
        <div className="border border-slate-900 p-4 bg-white text-slate-950 font-sans text-xs leading-tight print:p-0 print:border-none">
          
          {/* Top Row: STD | E-Kart Logistics | Order ID | COD/PREPAID */}
          <div className="grid grid-cols-12 border-b border-slate-900 text-[11px] font-bold">
            <div className="col-span-2 p-1.5 border-r border-slate-900 font-black">
              STD
            </div>
            <div className="col-span-4 p-1.5 border-r border-slate-900 truncate">
              {courier}
            </div>
            <div className="col-span-4 p-1.5 border-r border-slate-900 font-mono text-[10px] truncate">
              {orderId}
            </div>
            <div className="col-span-2 p-1.5 text-center font-black">
              {isPrepaid ? "PREPAID" : "COD"}
            </div>
          </div>

          {/* Main Middle Block: Left Barcode + Right QR & Address */}
          <div className="grid grid-cols-12 border-b border-slate-900">
            
            {/* Left Column (Ordered through Bazario + Vertical Barcode) */}
            <div className="col-span-4 p-2 border-r border-slate-900 flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-slate-600">Ordered through</p>
                <div className="flex items-center gap-1 font-black text-sm italic tracking-tight text-blue-600">
                  Bazario <span className="bg-yellow-400 text-slate-900 text-[9px] px-1 py-0.2 rounded font-sans not-italic">⚡</span>
                </div>
              </div>

              {/* Vertical Barcode */}
              <div className="py-4 my-auto flex items-center justify-center gap-1">
                <span className="text-[9px] font-mono font-bold -rotate-90 origin-center whitespace-nowrap text-slate-500">
                  AWB No. {awb}
                </span>
                <div className="flex items-center gap-0.5 h-36">
                  {[2,3,1,4,2,1,3,2,4,1,2,3,1,4,2,3,1,2,4,3,1,2,3,1,2,4,2,1].map((w, i) => (
                    <div key={i} className="bg-slate-900 h-full" style={{ width: `${w * 1.5}px` }} />
                  ))}
                </div>
              </div>

              <div className="text-[9px] font-mono font-bold text-slate-500">
                <p>(N) BLR/NLM</p>
                <p className="mt-1">HBD: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' })}</p>
                <p>CPD: {new Date(Date.now() + 5*24*60*60*1000).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' })}</p>
              </div>
            </div>

            {/* Right Column (2D QR Matrix + Customer Shipping Address) */}
            <div className="col-span-8 flex flex-col">
              
              {/* QR Code Block */}
              <div className="p-3 border-b border-slate-900 flex items-center justify-center bg-slate-50/50">
                <div className="w-32 h-32 border-2 border-slate-900 p-1 grid grid-cols-8 gap-0.5 bg-white">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`${(i*7 + 3) % 2 === 0 || i % 5 === 0 || i < 8 || i > 56 ? 'bg-slate-950' : 'bg-transparent'} rounded-xs`}
                    />
                  ))}
                </div>
              </div>

              {/* Shipping / Customer Address */}
              <div className="p-3 text-[11px] leading-snug">
                <p className="font-bold text-slate-700">Shipping/Customer address:</p>
                <p className="font-black text-slate-950 text-xs mt-0.5">
                  Name: {order.shippingAddress?.fullName},
                </p>
                <p className="text-slate-800 mt-0.5">
                  {order.shippingAddress?.street},
                </p>
                <p className="text-slate-800">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state},
                </p>
                <p className="font-black text-slate-950 text-xs mt-1">
                  {order.shippingAddress?.city} - <span className="text-sm font-black underline">{order.shippingAddress?.pincode}</span>, IN
                </p>
                <p className="text-slate-700 mt-1 font-bold">
                  Ph: +91 {order.shippingAddress?.phone}
                </p>
              </div>

            </div>
          </div>

          {/* Sold By Details */}
          <div className="p-2 border-b border-slate-900 text-[10px] leading-tight">
            <p>
              <strong className="font-bold">Sold By:</strong> {order.orderitem?.[0]?.brand || "Bazario Verified Retail"}, Plot 25/B, E-Commerce Industrial Area, GANGANAGAR - 335001
            </p>
            <p className="font-mono text-slate-600 mt-0.5">
              GSTIN: 08BDRPC2330N1ZD
            </p>
          </div>

          {/* Items SKU Table */}
          <div className="border-b border-slate-900">
            <table className="w-full text-[10px] text-left">
              <thead>
                <tr className="border-b border-slate-900 font-bold bg-slate-100">
                  <th className="p-1 border-r border-slate-900">SKU ID | Description</th>
                  <th className="p-1 text-center w-12">QTY</th>
                </tr>
              </thead>
              <tbody>
                {order.orderitem?.map((item, i) => (
                  <tr key={i} className="border-b border-slate-300 last:border-none">
                    <td className="p-1 border-r border-slate-900 font-medium max-w-[280px] truncate">
                      SKU-{item.product?._id?.slice(-5) || "001"} | {item.title}
                    </td>
                    <td className="p-1 text-center font-bold">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Barcode & Package Warning */}
          <div className="p-2 flex items-center justify-between">
            <div className="flex-1 pr-4">
              <p className="text-[9px] font-mono font-bold text-slate-700">{awb}</p>
              <div className="flex items-center gap-0.5 h-8 mt-1">
                {[1,3,2,1,4,2,3,1,2,4,1,3,2,4,1,2,3,4,1,2,3,1,4,2,3,1].map((w, i) => (
                  <div key={i} className="bg-slate-900 h-full" style={{ width: `${w * 2}px` }} />
                ))}
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-[9px] font-bold text-slate-500">Use Transparent Packaging</p>
              <div className="inline-block mt-1 border-2 border-slate-900 px-3 py-1 text-base font-black">
                B4
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}