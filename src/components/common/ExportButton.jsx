// ============================================
// EXPORT BUTTON COMPONENT
// client/src/components/common/ExportButton.jsx
// Reusable export to Excel/CSV button
// ============================================

import React, { useState } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';

const ExportButton = ({ 
  onExport, 
  label = 'Export', 
  isDark,
  disabled = false,
  className = ''
}) => {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    if (disabled || exporting) return;
    
    setExporting(true);
    try {
      await onExport();
      setExported(true);
      setTimeout(() => setExported(false), 2000);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || exporting}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
        exported
          ? 'bg-green-500 text-white'
          : isDark
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {exporting ? (
        <Loader2 size={18} className="animate-spin" />
      ) : exported ? (
        <Check size={18} />
      ) : (
        <Download size={18} />
      )}
      {exporting ? 'Exporting...' : exported ? 'Exported!' : label}
    </button>
  );
};

export default ExportButton;
