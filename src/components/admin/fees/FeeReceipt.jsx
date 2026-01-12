// ============================================
// FEE RECEIPT COMPONENT
// client/src/components/admin/fees/FeeReceipt.jsx
// Print-ready fee receipt with PDF generation
// ============================================

import React, { forwardRef } from 'react';

const FeeReceipt = forwardRef(({ receipt, schoolInfo }, ref) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  if (!receipt) return null;

  return (
    <div ref={ref} className="bg-white p-8 max-w-2xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 uppercase">
          {schoolInfo?.name || 'School Name'}
        </h1>
        <p className="text-sm text-gray-600">
          {schoolInfo?.address || 'School Address'}
        </p>
        <p className="text-sm text-gray-600">
          Phone: {schoolInfo?.phone || 'N/A'} | Email: {schoolInfo?.email || 'N/A'}
        </p>
        <div className="mt-4 inline-block px-6 py-2 bg-gray-800 text-white font-bold text-lg">
          FEE RECEIPT
        </div>
      </div>

      {/* Receipt Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Receipt No:</p>
          <p className="font-bold text-gray-800">{receipt.receiptNumber || `RCP-${receipt._id?.slice(-8).toUpperCase()}`}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Date:</p>
          <p className="font-bold text-gray-800">{formatDate(receipt.paymentDate || receipt.createdAt)}</p>
        </div>
      </div>

      {/* Student Info */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Student Name:</p>
            <p className="font-bold text-gray-800">{receipt.student?.fullName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Admission No:</p>
            <p className="font-bold text-gray-800">{receipt.student?.admissionNumber || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Class:</p>
            <p className="font-bold text-gray-800">{receipt.student?.class?.name || receipt.class?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Roll No:</p>
            <p className="font-bold text-gray-800">{receipt.student?.rollNumber || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Fee Details Table */}
      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-3 text-left border">Description</th>
            <th className="p-3 text-right border">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border">
            <td className="p-3 border font-medium">{receipt.feeType || 'Tuition Fee'}</td>
            <td className="p-3 border text-right">{formatCurrency(receipt.amount)}</td>
          </tr>
          {receipt.lateFee > 0 && (
            <tr className="border">
              <td className="p-3 border text-red-600">Late Fee</td>
              <td className="p-3 border text-right text-red-600">{formatCurrency(receipt.lateFee)}</td>
            </tr>
          )}
          {receipt.discount > 0 && (
            <tr className="border">
              <td className="p-3 border text-green-600">Discount</td>
              <td className="p-3 border text-right text-green-600">-{formatCurrency(receipt.discount)}</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 font-bold">
            <td className="p-3 border">Total Paid</td>
            <td className="p-3 border text-right text-lg">{formatCurrency(receipt.amountPaid || receipt.amount)}</td>
          </tr>
        </tfoot>
      </table>

      {/* Payment Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Payment Method:</p>
          <p className="font-bold text-gray-800 capitalize">{receipt.paymentMethod || 'Cash'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Transaction ID:</p>
          <p className="font-bold text-gray-800">{receipt.transactionId || 'N/A'}</p>
        </div>
      </div>

      {/* Amount in Words */}
      <div className="border-t border-b py-3 mb-6">
        <p className="text-sm text-gray-600">Amount in Words:</p>
        <p className="font-bold text-gray-800 italic">
          {numberToWords(receipt.amountPaid || receipt.amount)} Only
        </p>
      </div>

      {/* Footer */}
      <div className="grid grid-cols-2 gap-8 mt-12">
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="text-sm text-gray-600">Student/Parent Signature</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="text-sm text-gray-600">Authorized Signature</p>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>This is a computer-generated receipt. No signature required.</p>
        <p>For any queries, please contact the school office.</p>
      </div>
    </div>
  );
});

// Helper function to convert number to words
function numberToWords(num) {
  if (num === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const numToWords = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
    return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
  };
  
  return 'Rupees ' + numToWords(Math.floor(num));
}

FeeReceipt.displayName = 'FeeReceipt';

export default FeeReceipt;
