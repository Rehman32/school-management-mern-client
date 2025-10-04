import React, { useState } from 'react';

const statusOptions = [
  { label: 'Present', value: 'present', color: 'bg-green-500' },
  { label: 'Absent', value: 'absent', color: 'bg-red-500' },
  { label: 'Late', value: 'late', color: 'bg-yellow-400' },
];

const AttendanceTable = ({ students = [], onToggle, onSave }) => {
  const [attendance, setAttendance] = useState(() =>
    students.reduce((acc, s) => {
      acc[s._id] = 'present';
      return acc;
    }, {})
  );
  const [saving, setSaving] = useState(false);

  const handleToggle = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
    if (onToggle) onToggle(studentId, status);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(attendance);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id} className="border-b dark:border-gray-700">
              <td className="px-4 py-2 font-medium">{student.fullName}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`px-3 py-1 rounded text-white text-xs font-semibold focus:outline-none transition-all duration-150 ${attendance[student._id] === opt.value ? opt.color : 'bg-gray-300 dark:bg-gray-600'}`}
                      onClick={() => handleToggle(student._id, opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>
    </div>
  );
};

export default AttendanceTable;
