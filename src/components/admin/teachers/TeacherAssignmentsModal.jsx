import { useEffect, useState } from "react";
import { X, Plus, Trash2, Edit } from "lucide-react";
import { getAssignments, createAssignment, updateAssignment, deleteAssignment } from "../../../api/teacherApi";
import { listSubjects } from "../../../api/subjectApi";
import { listClasses } from "../../../api/classApi";

export default function TeacherAssignmentsModal({ open, onClose, teacher, isDark, onChange }) {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ subjectId: "", classId: "" });
  const [editing, setEditing] = useState(null);

  const load = async () => {
    if (!teacher) return;
    setLoading(true);
    try {
      const res = await getAssignments(teacher._id);
      setAssignments(res.data || []);
    } catch (err) {
      setError(err?.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    load();
    listSubjects().then(r => setSubjects(r.data || [])).catch(()=>{});
    listClasses().then(r => setClasses(r.data || [])).catch(()=>{});
    // eslint-disable-next-line
  }, [open, teacher]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateAssignment(teacher._id, editing._id, { subjectId: form.subjectId, classId: form.classId });
        setEditing(null);
      } else {
        await createAssignment(teacher._id, { subjectId: form.subjectId, classId: form.classId });
      }
      setForm({ subjectId: "", classId: "" });
      await load();
      onChange?.();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to save assignment");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (a) => {
    setEditing(a);
    setForm({ subjectId: a.subject?._id || a.subject, classId: a.class?._id || a.class });
  };

  const handleDelete = async (a) => {
    if (!confirm("Delete this assignment?")) return;
    try {
      await deleteAssignment(teacher._id, a._id);
      await load();
      onChange?.();
    } catch (err) {
      setError("Failed to delete assignment");
    }
  };

  if (!open || !teacher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={`w-full max-w-2xl rounded-2xl overflow-auto ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
        <div className={`p-4 flex items-center justify-between border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
          <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Manage Assignments — {teacher.fullName}</h3>
          <button onClick={onClose} className={`p-2 rounded ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`}><X /></button>
        </div>

        <div className="p-4 space-y-4">
          {error && <div className="text-sm text-red-600">{error}</div>}

          {/* list */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>Current Assignments</h4>
              <button onClick={() => { setEditing(null); setForm({ subjectId: "", classId: "" }); }} className="flex items-center gap-2 text-sm text-blue-600">
                <Plus /> Add New
              </button>
            </div>

            {loading ? (
              <div className={`p-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Loading...</div>
            ) : assignments.length === 0 ? (
              <div className={`p-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>No assignments</div>
            ) : (
              <ul className="space-y-2">
                {assignments.map(a => (
                  <li key={a._id} className={`flex items-center justify-between p-3 rounded ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
                    <div>
                      <div className={`${isDark ? "text-gray-100" : "text-gray-900"} font-medium`}>
                        {a.subject?.name || a.subject} — {a.class?.grade || a.class?.name}{a.class?.section ? ` - ${a.class.section}` : ""}
                      </div>
                      <div className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>{a.createdAt ? new Date(a.createdAt).toLocaleString() : ""}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(a)} className="p-2 rounded bg-indigo-600 text-white"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(a)} className="p-2 rounded bg-rose-600 text-white"><Trash2 size={14} /></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* add/edit form */}
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
            <div>
              <label className={`block text-sm mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Subject</label>
              <select required value={form.subjectId} onChange={(e) => setForm(f => ({ ...f, subjectId: e.target.value }))} className={`w-full px-3 py-2 rounded ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}>
                <option value="">Select subject</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
              </select>
            </div>
            <div>
              <label className={`block text-sm mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Class</label>
              <select required value={form.classId} onChange={(e) => setForm(f => ({ ...f, classId: e.target.value }))} className={`w-full px-3 py-2 rounded ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}>
                <option value="">Select class</option>
                {classes.map(c => <option key={c._id} value={c._id}>{c.grade} {c.section ? `- ${c.section}` : c.name}</option>)}
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3">
              {editing && <button type="button" onClick={() => { setEditing(null); setForm({ subjectId: "", classId: "" }); }} className={`px-4 py-2 rounded ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>Cancel</button>}
              <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-blue-600 text-white">{saving ? "Saving..." : editing ? "Update Assignment" : "Add Assignment"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}