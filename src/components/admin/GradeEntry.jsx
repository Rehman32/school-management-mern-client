import React, { useState } from 'react';

export default function GradeEntry({ students = [], onChange }) {
  const [grades, setGrades] = useState({});

  const handleChange = (studentId, value) => {
    setGrades(prev => ({ ...prev, [studentId]: value }));
    if (onChange) onChange({ ...grades, [studentId]: value });
  }

  return (
    <div className="overflow-auto bg-white p-4 rounded shadow">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Student</th>
            <th className="px-4 py-2 text-left">Marks</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id} className="border-b">
              <td className="px-4 py-2">{s.fullName}</td>
              <td className="px-4 py-2">
                <input type="number" className="input input-bordered w-24" onChange={e => handleChange(s._id, Number(e.target.value))} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
