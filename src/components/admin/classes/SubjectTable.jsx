//SubjectTable.jsx
export default function SubjectTable({ rows, isDark, onEdit, onDelete }) {
  const table = isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900";
  const th = isDark ? "text-slate-300" : "text-slate-600";
  const tr = isDark ? "hover:bg-slate-800/60" : "hover:bg-slate-50";

  return (
    <div className={`overflow-hidden rounded-xl border ${isDark ? "border-slate-800" : "border-slate-200"}`}>
      <table className={`w-full text-left text-sm ${table}`}>
        <thead className={`${isDark ? "bg-slate-900/80" : "bg-slate-50"}`}>
          <tr>
            <th className={`px-4 py-3 ${th} font-semibold`}>Name</th>
            <th className={`px-4 py-3 ${th} font-semibold`}>Code</th>
            <th className={`px-4 py-3 ${th} font-semibold`}>Description</th>
            <th className={`px-4 py-3 ${th} font-semibold text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan="4" className="px-4 py-8 text-center opacity-70">No subjects found</td></tr>
          )}
          {rows.map((s) => (
            <tr key={s._id} className={`border-t ${isDark ? "border-slate-800" : "border-slate-200"} ${tr}`}>
              <td className="px-4 py-3">{s.name}</td>
              <td className="px-4 py-3">{s.code}</td>
              <td className="px-4 py-3">{s.description || "-"}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 justify-end">
                  <button onClick={() => onEdit(s)} className={`px-3 py-1.5 rounded-lg text-sm ${isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-100 hover:bg-slate-200"}`}>Edit</button>
                  <button onClick={() => onDelete(s)} className="px-3 py-1.5 rounded-lg text-sm bg-red-600 hover:bg-red-500 text-white">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
