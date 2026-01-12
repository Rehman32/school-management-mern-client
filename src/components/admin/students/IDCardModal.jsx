// ============================================
// STUDENT ID CARD MODAL
// client/src/components/admin/students/IDCardModal.jsx
// Modal to preview and print student ID card
// ============================================

import React, { useRef, useEffect, useState } from 'react';
import { X, Printer } from 'lucide-react';
import StudentIDCard from './StudentIDCard';
import { printComponent } from '../../../utils/pdfGenerator';
import { getProfile } from '../../../api/settingsApi';

const IDCardModal = ({ isOpen, onClose, student, isDark }) => {
  const cardRef = useRef(null);
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
    const studentName = student?.fullName?.replace(/\s+/g, '_') || 'Student';
    printComponent(cardRef, `ID_Card_${studentName}`);
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
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Student ID Card
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {student?.fullName} - {student?.class?.name || 'N/A'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Printer size={18} />
              Print ID Card
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
            </button>
          </div>
        </div>

        {/* ID Card Preview */}
        <div className="p-8 flex justify-center">
          <div ref={cardRef}>
            <StudentIDCard 
              student={student}
              schoolInfo={schoolInfo}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-sm text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            💡 Tip: Print on card stock paper (85.6mm × 53.98mm) for best results. Use landscape orientation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IDCardModal;
