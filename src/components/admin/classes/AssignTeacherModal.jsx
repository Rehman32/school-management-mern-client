import { useEffect, useState } from "react";

/**
 * Props
 * - open, onClose, onSave (async, receives { teacherId, subjectId, classId })
 * - teachers: [{_id, fullName, email}]
 * - subjects, classes arrays
 * - default values optional
 * - isDark
 */
export default function AssignTeacherModal({ open, onClose, onSave, teachers = [], subjects = [], classes = [], initial = null, isDark }) {
  const [teacherId, setTeacherId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) {
      setTeacherId(initial.teacher?._id || initial.teacher || "");
      setSubjectId(initial.subject?._id || initial.subject || "");
      setClassId(initial.class?._id || initial.class || "");
    } else {
      setTeacherId("");
      setSubjectId("");
      setClassId("");
    }
  }, [initial, open]);

  const submit = async (e) => {
    e.preventDefault();
    if (!teacherId || !subjectId || !classId) return alert("Please choose teacher, subject and class");
    setLoading(true);
    try {
      await onSave({ teacherId, subjectId, classId });
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  const input = isDark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-slate-300 text-slate-900";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`w-full max-w-md rounded-lg border p-4 ${isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200"}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Assign Teacher</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm mb-1 block">Teacher</label>
            <select className={`w-full rounded border px-3 py-2 ${input}`} value={teacherId} onChange={(e)=>setTeacherId(e.target.value)} required>
              <option value="">Select teacher</option>
              {teachers.map(t => <option key={t._id} value={t._id}>{t.fullName} {t.email ? `— ${t.email}` : ""}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm mb-1 block">Subject</label>
            <select className={`w-full rounded border px-3 py-2 ${input}`} value={subjectId} onChange={(e)=>setSubjectId(e.target.value)} required>
              <option value="">Select subject</option>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm mb-1 block">Class</label>
            <select className={`w-full rounded border px-3 py-2 ${input}`} value={classId} onChange={(e)=>setClassId(e.target.value)} required>
              <option value="">Select class</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.grade}{c.section ? ` - ${c.section}` : ""}{c.name ? ` (${c.name})` : ""}</option>)}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className={`px-3 py-1 rounded ${isDark?"bg-slate-800 border border-slate-700":"bg-slate-100 border border-slate-200"}`}>Cancel</button>
            <button type="submit" className={`px-4 py-2 rounded text-white bg-indigo-600`}>{loading ? "Saving..." : "Assign"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
