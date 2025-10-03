import { useEffect, useState } from "react";
import { fetchClasses, createClass, updateClass, deleteClass } from "../../api/classApi";
import { fetchSubjects, createSubject, updateSubject, deleteSubject } from "../../api/subjectApi";
import ClassTable from "../../components/admin/classes/ClassTable";
import ClassFormModal from "../../components/admin/classes/ClassFormModal";
import SubjectTable from "../../components/admin/classes/SubjectTable";
import SubjectFormModal from "../../components/admin/classes/SubjectFormModal";
import ClassDetailDrawer from "../../components/admin/classes/ClassDetailDrawer";
import { listTeachersMinimal } from "../../api/teacherApi"; // we'll add this API function next


export default function ClassManagement({ isDark }) {
  // Tabs
  const [tab, setTab] = useState("classes"); // "classes" | "subjects"

  // Classes state
  const [classRows, setClassRows] = useState([]);
  const [classMeta, setClassMeta] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [classSearch, setClassSearch] = useState("");

  // Subjects state
  const [subjectRows, setSubjectRows] = useState([]);
  const [subjectMeta, setSubjectMeta] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [subjectSearch, setSubjectSearch] = useState("");

  // Modals
  const [openClassModal, setOpenClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [openSubjectModal, setOpenSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

// Drawer & active class
const [activeClass, setActiveClass] = useState(null);
const [detailOpen, setDetailOpen] = useState(false);

// teachers list for dropdowns
const [teachersList, setTeachersList] = useState([]);

  const pane = isDark ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900";
  const card = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const pill = (active) =>
    active
      ? "bg-indigo-600 text-white"
      : isDark
      ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
      : "bg-slate-100 text-slate-700 hover:bg-slate-200";

  // Debounce helper
  const useDebounced = (value, delay = 400) => {
    const [v, setV] = useState(value);
    useEffect(() => {
      const t = setTimeout(() => setV(value), delay);
      return () => clearTimeout(t);
    }, [value, delay]);
    return v;
  };

  const classSearchDeb = useDebounced(classSearch);
  const subjectSearchDeb = useDebounced(subjectSearch);

  const loadClasses = async (page = classMeta.page) => {
  try {
    const res = await fetchClasses({ page, limit: classMeta.limit, search: classSearchDeb });
    setClassRows(res.data); // Corrected: Access res.data directly
    setClassMeta(res.meta); // Corrected: Access res.meta directly
  } catch (error) {
    console.error("Failed to load classes:", error);
  }
};

const loadSubjects = async (page = subjectMeta.page) => {
  try {
    const res = await fetchSubjects({ page, limit: subjectMeta.limit, search: subjectSearchDeb });
    setSubjectRows(res.data); // Corrected: Access res.data directly
    setSubjectMeta(res.meta); // Corrected: Access res.meta directly
  } catch (error) {
    console.error("Failed to load subjects:", error);
  }
};

  useEffect(() => { loadClasses(1); /* eslint-disable-line */ }, [classSearchDeb, classMeta.limit]);
  useEffect(() => { loadSubjects(1); /* eslint-disable-line */ }, [subjectSearchDeb, subjectMeta.limit]);
  
  // Add this useEffect to handle page changes
  useEffect(() => {
    if (tab === "classes") {
      loadClasses();
    } else {
      loadSubjects();
    }
  }, [classMeta.page, subjectMeta.page, tab]);

  // Actions: Class
  const openAddClass = () => { setEditingClass(null); setOpenClassModal(true); };
  const openEditClass = (row) => { setEditingClass(row); setOpenClassModal(true); };
  const saveClass = async (values) => {
    if (editingClass?._id) {
      await updateClass(editingClass._id, values);
    } else {
      await createClass(values);
    }
    await loadClasses();
  };
  const removeClass = async (row) => {
    if (confirm(`Delete class "${row.name}"?`)) {
      await deleteClass(row._id);
      await loadClasses();
    }
  };

  // Actions: Subject
  const openAddSubject = () => { setEditingSubject(null); setOpenSubjectModal(true); };
  const openEditSubject = (row) => { setEditingSubject(row); setOpenSubjectModal(true); };
  const saveSubject = async (values) => {
    if (editingSubject?._id) {
      await updateSubject(editingSubject._id, values);
    } else {
      await createSubject(values);
    }
    await loadSubjects();
  };
  const removeSubject = async (row) => {
    if (confirm(`Delete subject "${row.name}"?`)) {
      await deleteSubject(row._id);
      await loadSubjects();
    }
  };

// load teachers (minimal fields) once on mount
useEffect(() => {
  const loadTeachers = async () => {
    try {
      const res = await listTeachersMinimal({ limit: 1000 });
      // res.data should be an array (see server code); fallback to empty
      setTeachersList(res.data || []);
    } catch (err) {
      console.error("Failed to load teachers list:", err);
      setTeachersList([]);
    }
  };
  loadTeachers();
}, []);


  // Initial load
  useEffect(() => { loadClasses(1); loadSubjects(1); /* eslint-disable-line */ }, []);
  
  return (
    <div className={`p-4 md:p-6 ${pane}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button className={`px-3 py-1.5 rounded-full text-sm ${pill(tab === "classes")}`} onClick={() => setTab("classes")}>Classes</button>
          <button className={`px-3 py-1.5 rounded-full text-sm ${pill(tab === "subjects")}`} onClick={() => setTab("subjects")}>Subjects</button>
        </div>
      </div>

      {/* Search + Actions */}
      <div className={`mb-4 rounded-xl border ${card} p-3 flex items-center justify-between`}>
        {tab === "classes" ? (
          <>
            <input
              value={classSearch} onChange={(e) => setClassSearch(e.target.value)}
              placeholder="Search classes..." className={`w-full max-w-xs rounded-lg border px-3 py-2 outline-none ${isDark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-slate-300 text-slate-900"}`}
            />
            <button onClick={openAddClass} className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white">Add Class</button>
          </>
        ) : (
          <>
            <input
              value={subjectSearch} onChange={(e) => setSubjectSearch(e.target.value)}
              placeholder="Search subjects..." className={`w-full max-w-xs rounded-lg border px-3 py-2 outline-none ${isDark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-slate-300 text-slate-900"}`}
            />
            <button onClick={openAddSubject} className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white">Add Subject</button>
          </>
        )}
      </div>

      {/* Tables */}
      <div className={`rounded-xl border ${card} p-3`}>
        {tab === "classes" ? (
          <>
            <ClassTable
              rows={classRows}
              isDark={isDark}
              onEdit={openEditClass}
              onDelete={removeClass}
              onManage={(c) => { setActiveClass(c); setDetailOpen(true); }}
            />
            {/* Pagination */}
            <div className="flex items-center justify-end gap-2 mt-3">
              <button
                disabled={classMeta.page <= 1}
                onClick={() => loadClasses(classMeta.page - 1)}
                className={`px-3 py-1.5 rounded-lg border text-sm ${isDark ? "border-slate-700 hover:bg-slate-800 disabled:opacity-50" : "border-slate-300 hover:bg-slate-100 disabled:opacity-50"}`}
              >
                Prev
              </button>
              <div className="text-sm opacity-80">Page {classMeta.page} / {classMeta.totalPages || 1}</div>
              <button
                disabled={classMeta.page >= (classMeta.totalPages || 1)}
                onClick={() => loadClasses(classMeta.page + 1)}
                className={`px-3 py-1.5 rounded-lg border text-sm ${isDark ? "border-slate-700 hover:bg-slate-800 disabled:opacity-50" : "border-slate-300 hover:bg-slate-100 disabled:opacity-50"}`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            <SubjectTable
              rows={subjectRows}
              isDark={isDark}
              onEdit={openEditSubject}
              onDelete={removeSubject}
            />
            {/* Pagination */}
            <div className="flex items-center justify-end gap-2 mt-3">
              <button
                disabled={subjectMeta.page <= 1}
                onClick={() => loadSubjects(subjectMeta.page - 1)}
                className={`px-3 py-1.5 rounded-lg border text-sm ${isDark ? "border-slate-700 hover:bg-slate-800 disabled:opacity-50" : "border-slate-300 hover:bg-slate-100 disabled:opacity-50"}`}
              >
                Prev
              </button>
              <div className="text-sm opacity-80">Page {subjectMeta.page} / {subjectMeta.totalPages || 1}</div>
              <button
                disabled={subjectMeta.page >= (subjectMeta.totalPages || 1)}
                onClick={() => loadSubjects(subjectMeta.page + 1)}
                className={`px-3 py-1.5 rounded-lg border text-sm ${isDark ? "border-slate-700 hover:bg-slate-800 disabled:opacity-50" : "border-slate-300 hover:bg-slate-100 disabled:opacity-50"}`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <ClassFormModal
        open={openClassModal}
        onClose={() => setOpenClassModal(false)}
        onSubmit={saveClass}
        initialData={editingClass}
        isDark={isDark}
      />
      <SubjectFormModal
        open={openSubjectModal}
        onClose={() => setOpenSubjectModal(false)}
        onSubmit={saveSubject}
        initialData={editingSubject}
        isDark={isDark}
      />
        {/* Class detail drawer (open when manage clicked) */}
<ClassDetailDrawer
  classObj={activeClass}
  isOpen={detailOpen}
  onClose={() => { setDetailOpen(false); setActiveClass(null); }}
  isDark={isDark}
  teachersList={teachersList}
  subjectsList={subjectRows}
  classesList={classRows}
/>

    </div>
  );
}