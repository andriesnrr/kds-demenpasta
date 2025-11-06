import { Order } from '@/types/order';

export function printReceipt(order: Order) {
  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  
  if (!printWindow) {
    alert('Popup diblokir! Izinkan popup untuk print receipt.');
    return;
  }

  // Generate receipt HTML
  const receiptHTML = generateReceiptHTML(order);

  // Write HTML to new window
  printWindow.document.write(receiptHTML);
  printWindow.document.close();

  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    // Auto close after printing (optional)
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };
}

function generateReceiptHTML(order: Order): string {
  const itemsHTML = order.items
    .map(
      item => `
    <tr class="border-b border-gray-200">
      <td class="py-2">
        <div class="font-semibold">${item.menuName}</div>
        ${item.notes ? `<div class="text-xs text-gray-600 italic">* ${item.notes}</div>` : ''}
      </td>
      <td class="text-center py-2">${item.quantity}</td>
      <td class="text-right py-2">${formatNumber(item.price)}</td>
      <td class="text-right py-2 font-semibold">${formatNumber(item.subtotal)}</td>
    </tr>
  `
    )
    .join('');

  const additionalsHTML =
    order.additionals && order.additionals.length > 0
      ? `
    <tr>
      <td colspan="4" class="py-2 pt-3">
        <div class="text-xs font-semibold text-gray-700">ADDITIONAL:</div>
      </td>
    </tr>
    ${order.additionals
      .map(
        add => `
      <tr class="border-b border-gray-200">
        <td class="py-2 pl-4">${add.name}</td>
        <td class="text-center py-2">${add.quantity}</td>
        <td class="text-right py-2">${formatNumber(add.price)}</td>
        <td class="text-right py-2 font-semibold">${formatNumber(add.subtotal)}</td>
      </tr>
    `
      )
      .join('')}
  `
      : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Receipt - ${order.orderNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          width: 80mm;
          margin: 0 auto;
          padding: 10mm;
          background: white;
        }
        
        .receipt {
          width: 100%;
        }
        
        .header {
          text-align: center;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 2px dashed #999;
        }
        
        .logo {
          width: 60px;
          height: 60px;
          margin: 0 auto 10px;
        }
        
        .business-name {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .info-section {
          margin-bottom: 15px;
          font-size: 11px;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3px;
        }
        
        .separator {
          border-bottom: 1px dashed #999;
          margin: 10px 0;
        }
        
        .separator-thick {
          border-bottom: 2px dashed #999;
          margin: 15px 0;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }
        
        th {
          text-align: left;
          padding: 5px 0;
          border-bottom: 1px solid #333;
        }
        
        td {
          padding: 5px 0;
        }
        
        .total-section {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 2px solid #000;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          font-weight: bold;
          margin-top: 10px;
        }
        
        .footer {
          text-align: center;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px dashed #999;
          font-size: 10px;
        }
        
        .text-right {
          text-align: right;
        }
        
        .text-center {
          text-align: center;
        }
        
        .font-bold {
          font-weight: bold;
        }
        
        .text-red {
          color: #C41E3A;
        }
        
        @media print {
          body {
            width: 80mm;
            margin: 0;
            padding: 0;
          }
          
          .receipt {
            page-break-after: always;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <!-- Header -->
        <div class="header">
          <div class="business-name">DEMEN PASTA</div>
          <div style="font-size: 10px; margin-bottom: 3px;">Dimsum Mentai Ampas Tahu</div>
          <div style="font-size: 10px;">📞 0851-7677-1352</div>
          <div style="font-size: 10px;">📍 Surabaya, Indonesia</div>
        </div>
        
        <!-- Order Info -->
        <div class="info-section">
          <div class="info-row">
            <span class="font-bold">No. Order:</span>
            <span class="font-bold text-red">${order.orderNumber}</span>
          </div>
          <div class="info-row">
            <span>Tanggal:</span>
            <span>${new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
          </div>
          <div class="info-row">
            <span>Waktu:</span>
            <span>${new Date(order.createdAt).toLocaleTimeString('id-ID')}</span>
          </div>
          <div class="info-row">
            <span>Kasir:</span>
            <span>Admin</span>
          </div>
        </div>
        
        <!-- Customer Info -->
        <div class="info-section" style="padding-bottom: 10px;">
          <div class="separator"></div>
          <div class="info-row">
            <span class="font-bold">Customer:</span>
            <span>${order.customerName}</span>
          </div>
          <div class="info-row">
            <span>HP:</span>
            <span>${order.customerPhone}</span>
          </div>
          <div class="info-row">
            <span>Tipe:</span>
            <span style="text-transform: uppercase;">${order.orderType}</span>
          </div>
          ${order.tableNumber ? `
          <div class="info-row">
            <span>Meja:</span>
            <span>${order.tableNumber}</span>
          </div>
          ` : ''}
        </div>
        
        <div class="separator-thick"></div>
        
        <!-- Items -->
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th class="text-center" style="width: 40px;">Qty</th>
              <th class="text-right" style="width: 60px;">Harga</th>
              <th class="text-right" style="width: 70px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
            ${additionalsHTML}
          </tbody>
        </table>
        
        <div class="separator-thick"></div>
        
        <!-- Summary -->
        <div class="info-section">
          <div class="info-row">
            <span>Total Items:</span>
            <span class="font-bold">${order.totalItems}</span>
          </div>
          <div class="info-row">
            <span>Total Pieces:</span>
            <span class="font-bold">${order.totalPieces} pcs</span>
          </div>
        </div>
        
        <!-- Total -->
        <div class="total-section">
          <div class="total-row">
            <span>TOTAL:</span>
            <span class="text-red">${formatCurrency(order.totalPrice)}</span>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p style="font-weight: bold; margin-bottom: 8px;">Terima kasih atas pesanan Anda!</p>
          <p style="margin-bottom: 3px;">Follow kami:</p>
          <p style="margin-bottom: 3px;">📱 TikTok: @demen.pasta</p>
          <p style="margin-bottom: 10px;">📷 Instagram: @demenpasta</p>
          <p style="font-style: italic; font-size: 9px;">~ Selamat menikmati ~</p>
          <p style="margin-top: 10px; font-size: 9px;">*** ${order.orderNumber} ***</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function formatNumber(num: number): string {
  return num.toLocaleString('id-ID');
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}