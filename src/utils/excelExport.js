// ============================================
// EXCEL EXPORT UTILITY
// client/src/utils/excelExport.js
// Export data to Excel/CSV for backup
// ============================================

/**
 * Convert data array to CSV string
 */
const arrayToCSV = (data, columns) => {
  if (!data || data.length === 0) return '';

  // Header row
  const headers = columns.map(col => `"${col.header}"`).join(',');
  
  // Data rows
  const rows = data.map(item => {
    return columns.map(col => {
      let value = col.accessor(item);
      
      // Handle null/undefined
      if (value === null || value === undefined) value = '';
      
      // Handle dates
      if (value instanceof Date) {
        value = value.toLocaleDateString('en-IN');
      }
      
      // Handle objects
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      
      // Escape quotes and wrap in quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
  });

  return [headers, ...rows].join('\n');
};

/**
 * Download CSV file
 */
const downloadCSV = (csvContent, filename) => {
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export Students to Excel/CSV
 */
export const exportStudents = (students) => {
  const columns = [
    { header: 'Admission No', accessor: (s) => s.admissionNumber },
    { header: 'Roll No', accessor: (s) => s.rollNumber },
    { header: 'Full Name', accessor: (s) => s.fullName },
    { header: 'Email', accessor: (s) => s.email },
    { header: 'Phone', accessor: (s) => s.phone },
    { header: 'Gender', accessor: (s) => s.gender },
    { header: 'Date of Birth', accessor: (s) => s.dob ? new Date(s.dob).toLocaleDateString('en-IN') : '' },
    { header: 'Class', accessor: (s) => s.class?.name || s.class?.grade || '' },
    { header: 'Section', accessor: (s) => s.class?.section || '' },
    { header: 'Blood Group', accessor: (s) => s.bloodGroup },
    { header: 'Address', accessor: (s) => s.address ? `${s.address.street || ''}, ${s.address.city || ''}, ${s.address.state || ''}` : '' },
    { header: 'Guardian Name', accessor: (s) => s.guardians?.[0]?.name || '' },
    { header: 'Guardian Phone', accessor: (s) => s.guardians?.[0]?.phone || '' },
    { header: 'Guardian Relation', accessor: (s) => s.guardians?.[0]?.relationship || '' },
    { header: 'Status', accessor: (s) => s.status },
    { header: 'Enrolled Date', accessor: (s) => s.enrolledDate ? new Date(s.enrolledDate).toLocaleDateString('en-IN') : '' },
  ];

  const csv = arrayToCSV(students, columns);
  downloadCSV(csv, 'Students_Export');
};

/**
 * Export Teachers to Excel/CSV
 */
export const exportTeachers = (teachers) => {
  const columns = [
    { header: 'Employee ID', accessor: (t) => t.employeeId },
    { header: 'Full Name', accessor: (t) => t.fullName },
    { header: 'Email', accessor: (t) => t.email },
    { header: 'Phone', accessor: (t) => t.phone },
    { header: 'Gender', accessor: (t) => t.gender },
    { header: 'Date of Birth', accessor: (t) => t.dob ? new Date(t.dob).toLocaleDateString('en-IN') : '' },
    { header: 'Department', accessor: (t) => t.department },
    { header: 'Qualifications', accessor: (t) => t.qualifications?.join(', ') || '' },
    { header: 'Experience (Years)', accessor: (t) => t.experience },
    { header: 'Salary', accessor: (t) => t.salary },
    { header: 'Employment Type', accessor: (t) => t.employmentType },
    { header: 'Classes Assigned', accessor: (t) => t.classesAssigned?.map(c => c.name || c).join(', ') || '' },
    { header: 'Subjects Assigned', accessor: (t) => t.subjectsAssigned?.map(s => s.name || s).join(', ') || '' },
    { header: 'Join Date', accessor: (t) => t.joiningDate ? new Date(t.joiningDate).toLocaleDateString('en-IN') : '' },
    { header: 'Status', accessor: (t) => t.status },
  ];

  const csv = arrayToCSV(teachers, columns);
  downloadCSV(csv, 'Teachers_Export');
};

/**
 * Export Fees to Excel/CSV
 */
export const exportFees = (fees) => {
  const columns = [
    { header: 'Receipt No', accessor: (f) => f.receiptNumber || f._id?.slice(-8) },
    { header: 'Student Name', accessor: (f) => f.student?.fullName || '' },
    { header: 'Admission No', accessor: (f) => f.student?.admissionNumber || '' },
    { header: 'Class', accessor: (f) => f.student?.class?.name || '' },
    { header: 'Fee Type', accessor: (f) => f.feeType },
    { header: 'Amount', accessor: (f) => f.amount },
    { header: 'Paid Amount', accessor: (f) => f.paidAmount || 0 },
    { header: 'Balance', accessor: (f) => (f.amount || 0) - (f.paidAmount || 0) },
    { header: 'Due Date', accessor: (f) => f.dueDate ? new Date(f.dueDate).toLocaleDateString('en-IN') : '' },
    { header: 'Payment Date', accessor: (f) => f.paymentDate ? new Date(f.paymentDate).toLocaleDateString('en-IN') : '' },
    { header: 'Payment Method', accessor: (f) => f.paymentMethod },
    { header: 'Status', accessor: (f) => f.status },
  ];

  const csv = arrayToCSV(fees, columns);
  downloadCSV(csv, 'Fees_Export');
};

/**
 * Export Attendance to Excel/CSV
 */
export const exportAttendance = (attendance) => {
  const columns = [
    { header: 'Date', accessor: (a) => a.date ? new Date(a.date).toLocaleDateString('en-PK') : '' },
    { header: 'Student Name', accessor: (a) => a.name || a.student?.fullName || a.fullName || '' },
    { header: 'Roll Number', accessor: (a) => a.rollNumber || a.student?.rollNumber || '' },
    { header: 'Admission No', accessor: (a) => a.admissionNumber || a.student?.admissionNumber || '' },
    { header: 'Class', accessor: (a) => a.class || a.student?.class?.name || '' },
    { header: 'Status', accessor: (a) => a.status || 'N/A' },
    { header: 'Remarks', accessor: (a) => a.remarks || '' },
  ];

  const csv = arrayToCSV(attendance, columns);
  downloadCSV(csv, 'Attendance_Export');
};

/**
 * Export Exam Results to Excel/CSV
 */
export const exportExamResults = (results, examName = 'Exam') => {
  const columns = [
    { header: 'Student Name', accessor: (r) => r.student?.fullName || '' },
    { header: 'Admission No', accessor: (r) => r.student?.admissionNumber || '' },
    { header: 'Class', accessor: (r) => r.class?.name || '' },
    { header: 'Subject', accessor: (r) => r.subject?.name || '' },
    { header: 'Marks Obtained', accessor: (r) => r.marksObtained },
    { header: 'Max Marks', accessor: (r) => r.maxMarks },
    { header: 'Percentage', accessor: (r) => r.maxMarks > 0 ? ((r.marksObtained / r.maxMarks) * 100).toFixed(2) : 0 },
    { header: 'Grade', accessor: (r) => r.grade || '' },
    { header: 'Remarks', accessor: (r) => r.remarks || '' },
  ];

  const csv = arrayToCSV(results, columns);
  downloadCSV(csv, `${examName}_Results_Export`);
};

/**
 * Export Classes to Excel/CSV
 */
export const exportClasses = (classes) => {
  const columns = [
    { header: 'Class Name', accessor: (c) => c.name },
    { header: 'Grade', accessor: (c) => c.grade },
    { header: 'Section', accessor: (c) => c.section },
    { header: 'Class Teacher', accessor: (c) => c.classTeacher?.fullName || '' },
    { header: 'Room Number', accessor: (c) => c.roomNumber },
    { header: 'Capacity', accessor: (c) => c.capacity },
    { header: 'Current Enrollment', accessor: (c) => c.currentEnrollment || 0 },
    { header: 'Available Seats', accessor: (c) => (c.capacity || 0) - (c.currentEnrollment || 0) },
    { header: 'Academic Year', accessor: (c) => c.academicYear },
    { header: 'Status', accessor: (c) => c.status },
  ];

  const csv = arrayToCSV(classes, columns);
  downloadCSV(csv, 'Classes_Export');
};

// Default export with all functions
export default {
  exportStudents,
  exportTeachers,
  exportFees,
  exportAttendance,
  exportExamResults,
  exportClasses,
};
