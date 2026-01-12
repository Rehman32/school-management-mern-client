// ============================================
// STUDENT ID CARD COMPONENT
// client/src/components/admin/students/StudentIDCard.jsx
// Printable student ID card
// ============================================

import React, { forwardRef } from 'react';

const StudentIDCard = forwardRef(({ student, schoolInfo }, ref) => {
  
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!student) return null;

  return (
    <div ref={ref} className="flex gap-6">
      {/* Front of ID Card */}
      <div 
        className="w-[340px] h-[214px] bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-4 text-white shadow-xl relative overflow-hidden"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Header */}
        <div className="relative flex items-center gap-3 mb-3 pb-2 border-b border-white/30">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">
              {schoolInfo?.name?.charAt(0) || 'S'}
            </span>
          </div>
          <div>
            <h2 className="font-bold text-sm uppercase tracking-wide">
              {schoolInfo?.name || 'School Name'}
            </h2>
            <p className="text-xs opacity-80">{schoolInfo?.address?.slice(0, 40) || 'School Address'}...</p>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex gap-4">
          {/* Photo */}
          <div className="w-20 h-24 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            {student.photo ? (
              <img src={student.photo} alt={student.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 text-center text-xs p-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-1"></div>
                Photo
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 text-xs space-y-1">
            <div>
              <p className="opacity-70 text-[10px] uppercase">Student Name</p>
              <p className="font-bold text-sm">{student.fullName}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="opacity-70 text-[10px] uppercase">Adm. No</p>
                <p className="font-semibold">{student.admissionNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="opacity-70 text-[10px] uppercase">Class</p>
                <p className="font-semibold">{student.class?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="opacity-70 text-[10px] uppercase">Roll No</p>
                <p className="font-semibold">{student.rollNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="opacity-70 text-[10px] uppercase">Blood Group</p>
                <p className="font-semibold">{student.bloodGroup || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-[10px]">
          <span>Valid: 2025-2026</span>
          <span>ID: {student._id?.slice(-8).toUpperCase()}</span>
        </div>
      </div>

      {/* Back of ID Card */}
      <div 
        className="w-[340px] h-[214px] bg-white rounded-2xl p-4 shadow-xl border-2 border-gray-200"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {/* Guardian Info */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 uppercase font-medium mb-1">Guardian Information</p>
          {student.guardians && student.guardians[0] ? (
            <div className="text-sm">
              <p className="font-semibold text-gray-800">
                {student.guardians[0].name}
              </p>
              <p className="text-gray-600 text-xs">
                {student.guardians[0].relationship} · {student.guardians[0].phone}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No guardian info</p>
          )}
        </div>

        {/* Address */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 uppercase font-medium mb-1">Address</p>
          <p className="text-xs text-gray-700">
            {student.address 
              ? `${student.address.street || ''}, ${student.address.city || ''}, ${student.address.state || ''}`
              : 'N/A'
            }
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-gray-100 rounded-lg p-2 text-[10px] text-gray-600 mb-2">
          <p className="font-medium text-gray-800 mb-1">Important:</p>
          <p>If found, please return to school or call: {schoolInfo?.phone || 'N/A'}</p>
        </div>

        {/* Signature */}
        <div className="flex justify-between items-end pt-2 border-t border-gray-200">
          <div className="text-center">
            <div className="w-20 border-b border-gray-400 mb-1"></div>
            <p className="text-[10px] text-gray-500">Principal</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center text-[8px] text-gray-400">
              QR CODE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

StudentIDCard.displayName = 'StudentIDCard';

export default StudentIDCard;
