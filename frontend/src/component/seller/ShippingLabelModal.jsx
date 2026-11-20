import React, { useEffect, useState } from "react";
import { Printer, X, Eye, Download, CheckCircle2 } from "lucide-react";

export default function ShippingLabelModal({
  order,
  onClose,
  canPrint = true,
  autoPrint = false,
  onPrintSuccess,
}) {
  if (!order) return null;

  const [hasPrintedOrSaved, setHasPrintedOrSaved] = useState(false);

  const awb = order.trackingNumber || `FMPC${order._id.slice(-8).toUpperCase()}`;
  const orderId = `OD${order._id.slice(-16).toUpperCase()}`;
  const courier = order.courier || "E-Kart Logistics";
  const isPrepaid = true;

  // 💾 1. DOWNLOAD STANDALONE HTML LABEL DIRECTLY TO USER'S DEVICE
  const downloadLabelFile = () => {
    const labelHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Shipping_Label_${awb}</title>
  <style>
    @page { size: 100mm 150mm; margin: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 0; padding: 12px; background: #fff; color: #0f172a; }
    .label-box { border: 2px solid #0f172a; max-width: 420px; margin: auto; font-size: 11px; line-height: 1.3; }
    .row { display: flex; border-bottom: 1.5px solid #0f172a; }
    .col { padding: 6px; }
    .border-r { border-right: 1.5px solid #0f172a; }
    .font-bold { font-weight: 700; }
    .font-black { font-weight: 900; }
    .barcode { display: flex; align-items: center; gap: 2px; height: 36px; margin-top: 4px; }
    .bar { background: #0f172a; height: 100%; }
    table { width: 100%; border-collapse: collapse; font-size: 10px; }
    th, td { padding: 4px; border-bottom: 1px solid #cbd5e1; text-align: left; }
    th { border-bottom: 1.5px solid #0f172a; background: #f1f5f9; }
    @media print {
      body { padding: 0; }
      .label-box { border: none; max-width: 100%; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body onload="window.print()">
  <div class="label-box">
    <div class="row font-bold">
      <div class="col border-r font-black" style="width: 15%;">STD</div>
      <div class="col border-r" style="width: 35%;">${courier}</div>
      <div class="col border-r" style="width: 35%; font-family: monospace;">${orderId}</div>
      <div class="col font-black" style="width: 15%; text-align: center;">${isPrepaid ? "PREPAID" : "COD"}</div>
    </div>
    <div class="row">
      <div class="col border-r" style="width: 35%; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="font-size: 9px; color: #64748b;">Ordered through</div>
          <div style="font-size: 15px; font-weight: 900; color: #2563eb; font-style: italic;">Bazario ⚡</div>
        </div>
        <div style="margin: 15px 0;">
          <div style="font-size: 9px; font-family: monospace; color: #64748b;">AWB No. ${awb}</div>
          <div class="barcode">
            ${[2,3,1,4,2,1,3,2,4,1,2,3,1,4,2,3,1,2,4,3,1,2,3,1,2,4,2,1].map(w => `<div class="bar" style="width: ${w * 1.5}px;"></div>`).join("")}
          </div>
        </div>
        <div style="font-size: 9px; color: #64748b; font-family: monospace;">
          HBD: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' })}<br/>
          CPD: ${new Date(Date.now() + 5*24*60*60*1000).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' })}
        </div>
      </div>
      <div class="col" style="width: 65%;">
        <div style="font-weight: 700; color: #475569; font-size: 10px;">Shipping/Customer address:</div>
        <div style="font-weight: 900; font-size: 13px; margin-top: 2px;">Name: ${order.shippingAddress?.fullName || order.user?.name || "Customer"}</div>
        <div style="color: #334155; margin-top: 2px;">${order.shippingAddress?.street || "Address not provided"}</div>
        <div style="color: #334155;">${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""}</div>
        <div style="font-weight: 900; font-size: 13px; margin-top: 4px;">${order.shippingAddress?.city || ""} - <u>${order.shippingAddress?.pincode || ""}</u>, IN</div>
        ${order.shippingAddress?.phone ? `<div style="font-weight: 700; color: #1e293b; margin-top: 4px;">Ph: +91 ${order.shippingAddress?.phone}</div>` : ""}
      </div>
    </div>
    <div class="col" style="border-bottom: 1.5px solid #0f172a; font-size: 10px;">
      <b>Sold By:</b> ${order.orderitem?.[0]?.brand || "Bazario Verified Seller"}, Plot 25/B, E-Commerce Hub, GANGANAGAR - 335001<br/>
      <span style="font-family: monospace; color: #64748b;">GSTIN: 08BDRPC2330N1ZD</span>
    </div>
    <div style="border-bottom: 1.5px solid #0f172a;">
      <table>
        <thead>
          <tr>
            <th>SKU ID | Description</th>
            <th style="text-align: center; width: 45px;">QTY</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderitem?.map(item => `
            <tr>
              <td>SKU-${item.product?._id?.slice(-5) || "001"} | ${item.title || item.product?.title || "Item"}</td>
              <td style="text-align: center; font-weight: 700;">${item.quantity || 1}</td>
            </tr>
          `).join("") || ""}
        </tbody>
      </table>
    </div>
    <div class="row" style="border-bottom: none; align-items: center; justify-content: space-between;">
      <div class="col" style="flex: 1;">
        <div style="font-size: 9px; font-family: monospace; font-weight: 700;">${awb}</div>
        <div class="barcode" style="height: 26px;">
          ${[1,3,2,1,4,2,3,1,2,4,1,3,2,4,1,2,3,4,1,2,3,1,4,2,3,1].map(w => `<div class="bar" style="width: ${w * 2}px;"></div>`).join("")}
        </div>
      </div>
      <div class="col" style="text-align: right;">
        <div style="font-size: 9px; color: #64748b; font-weight: 700;">Packaging Type</div>
        <div style="display: inline-block; border: 2px solid #0f172a; padding: 2px 8px; font-weight: 900; font-size: 14px; margin-top: 2px;">B4</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([labelHTML], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Shipping_Label_${awb}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 🖨️ 2. TRIGGER PRINT & AUTO-DOWNLOAD TO GUARANTEE FILE IS SAVED ON DEVICE
  const handlePrint = () => {
    if (!canPrint) return;

    // 1. Download offline file directly into user's Downloads folder
    downloadLabelFile();

    // 2. Set temporary document title so browser "Save as PDF" defaults to clean filename
    const originalTitle = document.title;
    document.title = `Shipping_Label_${awb}`;

    // 3. Listen for print dialog completion before marking order as ready
    const handleAfterPrint = () => {
      window.removeEventListener("afterprint", handleAfterPrint);
      document.title = originalTitle;
      setHasPrintedOrSaved(true);
      if (onPrintSuccess) {
        onPrintSuccess(order._id);
      }
    };

    window.addEventListener("afterprint", handleAfterPrint, { once: true });

    // Fallback timer in case afterprint does not fire in certain browser setups
    setTimeout(() => {
      setHasPrintedOrSaved(true);
      if (onPrintSuccess) {
        onPrintSuccess(order._id);
      }
    }, 1200);

    window.print();
  };

  // 🛑 AUTO-PRINT: Triggers when autoPrint=true
  useEffect(() => {
    if (canPrint && autoPrint && !hasPrintedOrSaved) {
      const timer = setTimeout(() => {
        handlePrint();
      }, 400); // 400ms ensures DOM is fully rendered
      return () => clearTimeout(timer);
    }
  }, [canPrint, autoPrint]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      
      {/* Modal Container */}
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
        
        {/* Header Action Bar */}
        <div className="print:hidden flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              Flipkart Style Shipping Label
              {!canPrint && (
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-black uppercase border border-amber-200">
                  Preview Only
                </span>
              )}
              {hasPrintedOrSaved && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Saved to Device
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {canPrint
                ? "Label will be saved to your device and printed for parcel dispatch."
                : "Archived Label & Tax Invoice (Read-only)"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canPrint ? (
              <>
                <button
                  onClick={downloadLabelFile}
                  title="Save standalone label to device"
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Download File</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Print & Save
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200">
                <Eye className="w-3.5 h-3.5" />
                View Only
              </div>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 🟢 Status Alert Banner after Printing / Saving */}
        {hasPrintedOrSaved && canPrint && (
          <div className="print:hidden mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Label has been saved to your device! Order is now ready to pack.</span>
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer shrink-0"
            >
              Done: Ready to Pack
            </button>
          </div>
        )}

        {/* 🟢 EXACT FLIPKART SHIPPING LABEL (4x6 Aspect Ratio) */}
        <div className="border border-slate-900 p-4 bg-white text-slate-950 font-sans text-xs leading-tight print:p-0 print:border-none">
          
          {/* Top Row: STD | Courier | Order ID | COD/PREPAID */}
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
                  Name: {order.shippingAddress?.fullName || order.user?.name || "Customer"},
                </p>
                <p className="text-slate-800 mt-0.5">
                  {order.shippingAddress?.street || "Address not provided"},
                </p>
                <p className="text-slate-800">
                  {order.shippingAddress?.city || ""}, {order.shippingAddress?.state || ""},
                </p>
                <p className="font-black text-slate-950 text-xs mt-1">
                  {order.shippingAddress?.city || ""} - <span className="text-sm font-black underline">{order.shippingAddress?.pincode || ""}</span>, IN
                </p>
                {order.shippingAddress?.phone && (
                  <p className="text-slate-700 mt-1 font-bold">
                    Ph: +91 {order.shippingAddress?.phone}
                  </p>
                )}
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

          {/* Items SKU Table (Robust Snapshotted Fallback) */}
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
                      SKU-{item.product?._id?.slice(-5) || item.product?.toString?.().slice(-5) || "001"} | {item.title || item.product?.title || "Item"}
                    </td>
                    <td className="p-1 text-center font-bold">{item.quantity || 1}</td>
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
