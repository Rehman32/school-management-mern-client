import { useEffect, useState } from "react";
import { listAssignmentsByClass, createAssignmentAPI, deleteAssignmentAPI } from "../../../api/assignmentApi";
import AssignTeacherModal from "./AssignTeacherModal";

/**
 * Props:
 * - classObj { _id, name, grade, section }
 * - isOpen, onClose
 * - isDark
 * - teachersList, subjectsList, classesList (classesList helpful to preselect)
 */
export default function ClassDetailDrawer({ classObj, isOpen, onClose, isDark, teachersList = [], subjectsList = [], classesList = [] }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    if (isOpen && classObj) fetchAssignments();
  }, [isOpen, classObj]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await listAssignmentsByClass(classObj._id);
      setAssignments(res.data || []);
    } catch (err) {
      console.error(err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => setShowAssignModal(true);

  const handleSave = async ({ teacherId, subjectId, classId }) => {
    await createAssignmentAPI({ teacherId, subjectId, classId });
    await fetchAssignments();
  };

  const handleDelete = async (assignment) => {
    if (!confirm("Remove assignment?")) return;
    await deleteAssignmentAPI(assignment._id);
    await fetchAssignments();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-full md:w-1/3 lg:w-1/4 bg-black/40" onClick={onClose} />
      <div className={`h-full p-4 overflow-auto ${isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Class: {classObj.grade} {classObj.section ? `- ${classObj.section}` : ""} {classObj.name ? `(${classObj.name})` : ""}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="mb-4">
          <button onClick={handleAdd} className="px-3 py-2 rounded bg-emerald-600 text-white">Assign Teacher</button>
        </div>

        <div className="space-y-3">
          {loading && <div>Loading…</div>}
          {assignments.length === 0 && !loading && <div className="opacity-70">No assignments for this class yet.</div>}
          {assignments.map(a => (
            <div key={a._id} className={`p-3 rounded border ${isDark ? "border-slate-800" : "border-slate-200"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{a.subject?.name} {a.subject?.code ? `(${a.subject.code})` : ""}</div>
                  <div className="text-sm opacity-70">{a.teacher?.fullName} {a.teacher?.email ? `— ${a.teacher.email}` : ""}</div>
                </div>
                <div className="flex gap-2 items-center">
                  {/* Could add edit capability here - re-open Assign modal with initial */}
                  <button onClick={() => handleDelete(a)} className="px-2 py-1 rounded bg-rose-600 text-white">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <AssignTeacherModal
          open={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          teachers={teachersList}
          subjects={subjectsList}
          classes={classesList}
          onSave={handleSave}
          isDark={isDark}
          initial={{ class: classObj._id }}
        />
      </div>
    </div>
  );
}
