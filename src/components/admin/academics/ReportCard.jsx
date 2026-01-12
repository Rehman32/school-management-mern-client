// ============================================
// REPORT CARD COMPONENT
// client/src/components/admin/academics/ReportCard.jsx
// Printable student report card with grades
// ============================================

import React, { forwardRef } from 'react';

const ReportCard = forwardRef(({ student, examResults, schoolInfo, academicYear }, ref) => {
  
  const calculateGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', remarks: 'Outstanding' };
    if (percentage >= 80) return { grade: 'A', remarks: 'Excellent' };
    if (percentage >= 70) return { grade: 'B+', remarks: 'Very Good' };
    if (percentage >= 60) return { grade: 'B', remarks: 'Good' };
    if (percentage >= 50) return { grade: 'C', remarks: 'Average' };
    if (percentage >= 40) return { grade: 'D', remarks: 'Below Average' };
    return { grade: 'F', remarks: 'Fail' };
  };

  const calculateTotal = () => {
    if (!examResults || examResults.length === 0) return { obtained: 0, total: 0, percentage: 0 };
    
    const obtained = examResults.reduce((sum, r) => sum + (r.marksObtained || 0), 0);
    const total = examResults.reduce((sum, r) => sum + (r.maxMarks || 100), 0);
    const percentage = total > 0 ? ((obtained / total) * 100).toFixed(1) : 0;
    
    return { obtained, total, percentage };
  };

  const totals = calculateTotal();
  const gradeInfo = calculateGrade(totals.percentage);

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
    <div ref={ref} className="bg-white p-8 max-w-3xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="text-center border-b-4 border-blue-600 pb-4 mb-6">
        <div className="flex justify-center items-center gap-4 mb-2">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {schoolInfo?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blue-800 uppercase">
              {schoolInfo?.name || 'School Name'}
            </h1>
            <p className="text-sm text-gray-600">
              {schoolInfo?.address || 'School Address'}
            </p>
          </div>
        </div>
        <div className="mt-4 inline-block px-8 py-2 bg-blue-600 text-white font-bold text-lg rounded">
          REPORT CARD
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Academic Year: {academicYear || '2025-2026'}
        </p>
      </div>

      {/* Student Info */}
      <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="space-y-2">
          <div className="flex">
            <span className="text-gray-600 w-32">Student Name:</span>
            <span className="font-bold text-gray-800">{student.fullName}</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 w-32">Class:</span>
            <span className="font-bold text-gray-800">{student.class?.name || 'N/A'}</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 w-32">Roll No:</span>
            <span className="font-bold text-gray-800">{student.rollNumber || 'N/A'}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex">
            <span className="text-gray-600 w-32">Admission No:</span>
            <span className="font-bold text-gray-800">{student.admissionNumber || 'N/A'}</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 w-32">Date of Birth:</span>
            <span className="font-bold text-gray-800">{formatDate(student.dob)}</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 w-32">Guardian:</span>
            <span className="font-bold text-gray-800">{student.guardians?.[0]?.name || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-3 text-left border">Subject</th>
            <th className="p-3 text-center border w-24">Max Marks</th>
            <th className="p-3 text-center border w-24">Obtained</th>
            <th className="p-3 text-center border w-20">%</th>
            <th className="p-3 text-center border w-20">Grade</th>
          </tr>
        </thead>
        <tbody>
          {examResults && examResults.length > 0 ? (
            examResults.map((result, index) => {
              const percentage = result.maxMarks > 0 
                ? ((result.marksObtained / result.maxMarks) * 100).toFixed(1)
                : 0;
              const grade = calculateGrade(percentage);
              
              return (
                <tr key={index} className={`border ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="p-3 border font-medium">{result.subject?.name || result.subjectName || 'Subject'}</td>
                  <td className="p-3 border text-center">{result.maxMarks || 100}</td>
                  <td className="p-3 border text-center font-bold">
                    <span className={percentage < 40 ? 'text-red-600' : 'text-green-600'}>
                      {result.marksObtained || 0}
                    </span>
                  </td>
                  <td className="p-3 border text-center">{percentage}%</td>
                  <td className="p-3 border text-center font-bold">
                    <span className={grade.grade === 'F' ? 'text-red-600' : 'text-blue-600'}>
                      {grade.grade}
                    </span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="p-8 text-center text-gray-500 border">
                No exam results available
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="bg-blue-100 font-bold">
            <td className="p-3 border">Total</td>
            <td className="p-3 border text-center">{totals.total}</td>
            <td className="p-3 border text-center">{totals.obtained}</td>
            <td className="p-3 border text-center">{totals.percentage}%</td>
            <td className="p-3 border text-center text-blue-600">{gradeInfo.grade}</td>
          </tr>
        </tfoot>
      </table>

      {/* Result Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600">Overall Percentage</p>
          <p className="text-3xl font-bold text-blue-600">{totals.percentage}%</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600">Grade</p>
          <p className="text-3xl font-bold text-green-600">{gradeInfo.grade}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600">Result</p>
          <p className={`text-xl font-bold ${totals.percentage >= 40 ? 'text-green-600' : 'text-red-600'}`}>
            {totals.percentage >= 40 ? 'PASS' : 'FAIL'}
          </p>
        </div>
      </div>

      {/* Remarks */}
      <div className="border-t border-b py-4 mb-8">
        <p className="text-sm text-gray-600 mb-1">Remarks:</p>
        <p className="font-medium text-gray-800">{gradeInfo.remarks}</p>
      </div>

      {/* Grading Scale */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg">
        <p className="text-sm font-bold text-gray-700 mb-2">Grading Scale:</p>
        <div className="grid grid-cols-7 gap-2 text-xs text-center">
          <div><span className="font-bold">A+</span><br/>90-100%</div>
          <div><span className="font-bold">A</span><br/>80-89%</div>
          <div><span className="font-bold">B+</span><br/>70-79%</div>
          <div><span className="font-bold">B</span><br/>60-69%</div>
          <div><span className="font-bold">C</span><br/>50-59%</div>
          <div><span className="font-bold">D</span><br/>40-49%</div>
          <div><span className="font-bold text-red-600">F</span><br/>Below 40%</div>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-3 gap-8 mt-12">
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="text-sm text-gray-600">Class Teacher</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="text-sm text-gray-600">Parent/Guardian</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="text-sm text-gray-600">Principal</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>This is a computer-generated report card.</p>
        <p>Generated on: {new Date().toLocaleDateString('en-IN')}</p>
      </div>
    </div>
  );
});

ReportCard.displayName = 'ReportCard';

export default ReportCard;
