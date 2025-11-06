import { Order } from '@/types/order';
import html2canvas from 'html2canvas';

// --- HELPER: GENERATE HTML STRING ---
function getReceiptCSS(): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inconsolata', monospace; font-size: 12px; line-height: 1.4; color: #000; background: #fff; }
    .receipt-wrapper { width: 80mm; margin: 0 auto; background: #fff; padding: 10px; } /* Wrapper untuk capture */
    .receipt { width: 100%; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-bold { font-weight: 700; }
    .header { margin-bottom: 15px; text-align: center; }
    .logo { width: 80px; height: auto; margin-bottom: 5px; border-radius: 50%; }
    .brand-name { font-size: 18px; font-weight: bold; margin: 5px 0; }
    .info-grid { display: grid; grid-template-columns: auto 1fr; gap: 2px 10px; margin-bottom: 10px; }
    .info-label { font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    th { text-align: left; border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 5px 0; font-size: 11px; text-transform: uppercase; }
    .item-row td { padding-top: 8px; vertical-align: top; }
    .item-name { padding-right: 5px; }
    .item-note { font-size: 10px; font-style: italic; opacity: 0.7; }
    .separator-dashed { border-bottom: 1px dashed #000; margin: 5px 0; width: 100%; }
    .separator-solid { border-bottom: 2px solid #000; margin: 10px 0; width: 100%; }
    .section-title { font-size: 11px; font-weight: bold; padding-top: 5px; }
    .total-section { margin-top: 10px; }
    .total-row { display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; margin-top: 5px; padding-top: 5px; border-top: 2px solid #000; }
    .footer { text-align: center; margin-top: 20px; font-size: 11px; }
    @media print { @page { margin: 0; size: auto; } body { -webkit-print-color-adjust: exact; } }
  `;
}

function getReceiptContent(order: Order): string {
  const logoSrc = '/images/logo-demen-pasta.jpg';
  const itemsHTML = order.items.map(item => `
    <tr class="item-row">
      <td class="item-name"><div>${item.menuName}</div>${item.notes ? `<div class="item-note">(Note: ${item.notes})</div>` : ''}</td>
      <td class="text-center">${item.quantity}</td>
      <td class="text-right">${formatNumber(item.price)}</td>
      <td class="text-right font-bold">${formatNumber(item.subtotal)}</td>
    </tr>`).join('');

  const additionalsHTML = order.additionals && order.additionals.length > 0 ? `
    <tr class="separator-row"><td colspan="4"><div class="separator-dashed"></div></td></tr>
    <tr><td colspan="4" class="section-title">ADDITIONAL:</td></tr>
    ${order.additionals.map(add => `
      <tr class="item-row">
        <td class="item-name pl-2">+ ${add.name}</td>
        <td class="text-center">${add.quantity}</td>
        <td class="text-right">${formatNumber(add.price)}</td>
        <td class="text-right font-bold">${formatNumber(add.subtotal)}</td>
      </tr>`).join('')}
  ` : '';

  return `
    <div class="header">
      <img src="${logoSrc}" alt="DEMEN PASTA" class="logo" crossorigin="anonymous" />
      <div class="brand-name">DEMEN PASTA</div>
      <div>Dimsum Mentai Ampas Tahu</div>
      <div>📍 Gresik, Indonesia</div>
      <div>WA: 0851-7677-1352</div>
    </div>
    <div class="separator-dashed"></div>
    <div class="info-grid">
      <span class="info-label">No. Order:</span> <span>#${order.orderNumber}</span>
      <span class="info-label">Tanggal:</span> <span>${new Date(order.createdAt).toLocaleString('id-ID')}</span>
      <span class="info-label">Customer:</span> <span>${order.customerName}</span>
      <span class="info-label">Tipe:</span> <span style="text-transform: uppercase;">${order.orderType}</span>
      ${order.tableNumber ? `<span class="info-label">Meja:</span> <span>${order.tableNumber}</span>` : ''}
    </div>
    <div class="separator-solid"></div>
    <table>
      <thead><tr><th width="45%">ITEM</th><th width="15%" class="text-center">QTY</th><th width="20%" class="text-right">HARGA</th><th width="20%" class="text-right">TOTAL</th></tr></thead>
      <tbody>${itemsHTML}${additionalsHTML}</tbody>
    </table>
    <div class="separator-solid"></div>
    <div class="info-grid" style="margin-bottom: 0;">
       <span>Total Item:</span> <span class="text-right">${order.totalItems}</span>
       <span>Total Pcs:</span> <span class="text-right">${order.totalPieces}</span>
    </div>
    <div class="total-section">
      <div class="total-row"><span>GRAND TOTAL:</span><span>${formatCurrency(order.totalPrice)}</span></div>
    </div>
    <div class="footer">
      <p>Terima kasih telah berbelanja!</p>
      <p style="margin-top: 5px;">Follow IG/TikTok: <b>@demen.pasta</b></p>
      <br/><p style="font-family: monospace;">*** ${order.orderNumber} ***</p>
    </div>
  `;
}

// --- 1. PRINT FUNCTION ---
export function printReceipt(order: Order) {
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (!printWindow) { alert('Popup diblokir! Izinkan popup.'); return; }
  
  printWindow.document.write(`<html><head><title>Receipt #${order.orderNumber}</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${getReceiptCSS()}</style></head><body><div class="receipt-wrapper"><div class="receipt">${getReceiptContent(order)}</div></div></body></html>`);
  printWindow.document.close();
  printWindow.onload = () => { setTimeout(() => { printWindow.print(); }, 500); };
}

// --- HELPER: CREATE HIDDEN ELEMENT FOR CAPTURE ---
async function captureReceipt(order: Order): Promise<Blob | null> {
  // Buat elemen temporary yang tidak terlihat di layar tapi dirender
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '0';
  container.innerHTML = `<style>${getReceiptCSS()}</style><div class="receipt-wrapper" id="receipt-capture"><div class="receipt">${getReceiptContent(order)}</div></div>`;
  document.body.appendChild(container);

  const element = container.querySelector('#receipt-capture') as HTMLElement;
  
  // Tunggu sebentar agar gambar logo terload (jika ada cache)
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Kualitas lebih bagus (retina)
      useCORS: true, // Penting agar bisa capture gambar dari folder public/
      logging: false,
      backgroundColor: '#ffffff', // Pastikan background putih
    });
    document.body.removeChild(container);
    return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  } catch (error) {
    console.error("Gagal generate gambar receipt:", error);
    if (document.body.contains(container)) document.body.removeChild(container);
    return null;
  }
}

// --- 2. DOWNLOAD FUNCTION ---
export async function downloadReceipt(order: Order) {
  const blob = await captureReceipt(order);
  if (!blob) { alert('Gagal membuat gambar receipt.'); return; }
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Receipt-${order.orderNumber}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// --- 3. SHARE FUNCTION ---
export async function shareReceipt(order: Order) {
  // Cek apakah browser mendukung Web Share API untuk file
  if (!navigator.canShare) {
     alert('Browser Anda tidak mendukung fitur Share Gambar otomatis. Gunakan tombol Download, lalu share manual.');
     downloadReceipt(order);
     return;
  }

  const blob = await captureReceipt(order);
  if (!blob) { alert('Gagal membuat gambar receipt.'); return; }

  const file = new File([blob], `Receipt-${order.orderNumber}.png`, { type: 'image/png' });

  if (navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `Receipt #${order.orderNumber} - Demen Pasta`,
        text: `Ini struk digital untuk pesanan #${order.orderNumber}. Terima kasih!`,
      });
    } catch (error) {
      if ((error as any).name !== 'AbortError') {
        console.error('Error sharing:', error);
        // Fallback jika share gagal tapi bukan karena dibatalkan user
        downloadReceipt(order);
      }
    }
  } else {
     // Fallback untuk desktop atau browser yang tidak support share file
     alert('Fitur share langsung tidak didukung di perangkat ini. Receipt akan di-download.');
     downloadReceipt(order);
  }
}

// FORMATTERS
function formatNumber(num: number): string { return new Intl.NumberFormat('id-ID').format(num); }
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}