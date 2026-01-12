// ============================================
// RECEIPT MODAL COMPONENT
// client/src/components/admin/fees/ReceiptModal.jsx
// Modal to preview and print fee receipt
// ============================================

import React, { useRef, useEffect, useState } from 'react';
import { X, Printer, Download } from 'lucide-react';
import FeeReceipt from './FeeReceipt';
import { printComponent } from '../../../utils/pdfGenerator';
import { getProfile } from '../../../api/settingsApi';

const ReceiptModal = ({ isOpen, onClose, receipt, isDark }) => {
  const receiptRef = useRef(null);
  const [schoolInfo, setSchoolInfo] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchSchoolInfo();
    }
  }, [isOpen]);

  const fetchSchoolInfo = async () => {
    try {
      const res = await getProfile();
      setSchoolInfo(res.data?.data || res.data);
    } catch (err) {
      console.error('Failed to fetch school info:', err);
    }
  };

  const handlePrint = () => {
    const receiptNumber = receipt?.receiptNumber || `RCP-${receipt?._id?.slice(-8).toUpperCase()}`;
    printComponent(receiptRef, `Fee_Receipt_${receiptNumber}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Fee Receipt
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Printer size={18} />
              Print / Download
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
            </button>
          </div>
        </div>

        {/* Receipt Preview */}
        <div className="p-4">
          <div className="bg-white rounded-xl shadow-inner overflow-hidden">
            <FeeReceipt 
              ref={receiptRef} 
              receipt={receipt} 
              schoolInfo={schoolInfo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
