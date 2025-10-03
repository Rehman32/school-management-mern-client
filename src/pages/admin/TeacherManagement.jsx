import { useEffect, useState } from "react";
import { listSubjects } from "../../api/subjectApi";
import { listClasses } from "../../api/classApi";

import {
  listTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherById,
} from "../../api/teacherApi";
import TeacherFormModal from "../../components/admin/teachers/TeacherFormModal";
import TeacherProfileModal from "../../components/admin/teachers/TeacherProfileModal";
import TeacherAssignmentsModal from "../../components/admin/teachers/TeacherAssignmentsModal";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

export default function TeacherManagement({ isDark }) {
  const defaultQuery = { page: 1, limit: 10, search: "", status: "" };
  const [query, setQuery] = useState(defaultQuery);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTeacher, setActiveTeacher] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [subjectsList, setSubjectsList] = useState([]);
  const [classesList, setClassesList] = useState([]);

  const [showAssignments, setShowAssignments] = useState(false);
  const [assignmentTeacher, setAssignmentTeacher] = useState(null);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const sRes = await listSubjects();
        setSubjectsList(sRes?.data || []);
        const cRes = await listClasses();
        setClassesList(cRes?.data || []);
      } catch (err) {
        console.error("Failed to load subject/class options", err);
      }
    };
    loadOptions();
  }, []);

  const fetchData = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await listTeachers({
        page: query.page,
        limit: query.limit,
        search: query.search || undefined,
        status: query.status || undefined,
      });

      const payload = res || {};
      const items =
        payload?.data ??
        payload?.rows ??
        payload?.items ??
        (Array.isArray(payload) ? payload : []);
      const m =
        payload?.meta ??
        payload?.meta ??
        (typeof payload === "object" && payload?.total !== undefined
          ? { page: query.page, total: payload.total, totalPages: Math.ceil((payload.total || 0) / query.limit), limit: query.limit }
          : { page: query.page, totalPages: 1, total: Array.isArray(items) ? items.length : 0, limit: query.limit });

      setRows(items);
      setMeta(m);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.limit, query.search, query.status]);

  const onAdd = () => {
    setEditing(null);
    setShowForm(true);
  };
  const onEdit = async (id) => {
    try {
      const res = await getTeacherById(id);
      setEditing(res.data);
      setShowForm(true);
    } catch (e) {
      setError("Failed to load teacher");
    }
  };
  const openAssignmentsFor = (teacher) => {
    setAssignmentTeacher(teacher);
    setShowAssignments(true);
  };

  const closeAssignments = () => {
    setAssignmentTeacher(null);
    setShowAssignments(false);
  };

  const onView = async (id) => {
    try {
      const res = await getTeacherById(id);
      setActiveTeacher(res.data);
      setShowProfile(true);
    } catch (e) {
      setError("Failed to load teacher");
    }
  };
  const onDelete = async (id) => {
    if (!confirm("Delete this teacher? (soft delete)")) return;
    try {
      await deleteTeacher(id);
      setSuccess("Teacher deleted");
      fetchData();
    } catch (e) {
      setError("Failed to delete teacher");
    }
  };

  const onSubmit = async (values) => {
    try {
      if (editing?._id) {
        await updateTeacher(editing._id, values);
        setSuccess("Teacher updated");
      } else {
        await createTeacher(values);
        setSuccess("Teacher created");
      }
      setShowForm(false);
      setEditing(null);
      fetchData();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to save teacher");
    }
  };

  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => { setSuccess(""); setError(""); }, 4000);
      return () => clearTimeout(t);
    }
  }, [success, error]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`border-b p-6 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Teacher Management</h1>
            <p className={`mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Manage teacher records, assignments, and profiles.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onAdd} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
              <Plus size={16} /> Add Teacher
            </button>
            <button className="px-3 py-2 rounded bg-emerald-600 text-white/90 hover:bg-emerald-500">Import</button>
            <button className="px-3 py-2 rounded bg-fuchsia-600 text-white/90 hover:bg-fuchsia-500">Export</button>
          </div>
        </div>
      </div>

      {(success || error) && (
        <div className={`mx-6 mt-4 p-4 rounded-xl ${success ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-700" : "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-700"}`}>
          <div className="flex items-center">
            {success ? <Check className="h-5 w-5 text-green-500 mr-2" /> : <AlertCircle className="h-5 w-5 text-red-500 mr-2" />}
            <span className={`${success ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>{success || error}</span>
          </div>
        </div>
      )}

      <div className={`mx-6 mt-6 p-6 rounded-2xl shadow-sm ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border`}>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDark ? "text-gray-400" : "text-gray-400"}`} />
            <input value={query.search} onChange={(e) => setQuery(q => ({ ...q, search: e.target.value, page: 1 }))} placeholder="Search by name, email, phone..." className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-colors ${isDark ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-gray-50 border-gray-300 text-gray-900"}`} />
          </div>

          <div className="flex items-center gap-3">
            <select value={query.status} onChange={(e)=> setQuery(q=>({...q, status: e.target.value, page:1}))} className={`px-3 py-2 rounded ${isDark ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-gray-50 border-gray-300 text-gray-900"}`}>
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select value={query.limit} onChange={(e)=> setQuery(q=>({...q, limit: parseInt(e.target.value), page:1}))} className={`px-3 py-2 rounded ${isDark ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-gray-50 border-gray-300 text-gray-900"}`}>
              {[10,20,50].map(n => <option key={n} value={n}>{n} / page</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className={`mx-6 mt-6 rounded-2xl shadow-sm overflow-hidden ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={`${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-500"}`}>Teacher</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-500"}`}>Email</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-500"}`}>Phone</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-500"}`}>Subjects</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-500"}`}>Status</th>
                <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-500"}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}>
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-6 text-center text-gray-400">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-6 text-center text-gray-400">No teachers found</td></tr>
              ) : rows.map((t) => (
                <tr key={t._id} className={`${isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"} transition-colors`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.fullName)}&background=1f2937&color=fff`} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <div className={`${isDark ? "text-gray-100" : "text-gray-900"} font-medium`}>{t.fullName}</div>
                        <div className={`${isDark ? "text-gray-400" : "text-gray-500"} text-xs`}>{t.qualifications?.[0] || ""}</div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 4 ${isDark ? "text-gray-300": "text-gray-800"}`}>{t.email || "-"}</td>
                  <td className={`px-6 py-4 4 ${isDark ? "text-gray-300": "text-gray-800"}`}>{t.phone || "-"}</td>
                  <td className={`px-6 py-4 4 ${isDark ? "text-gray-300": "text-gray-800"}`}>{t.subjects?.length || 0}</td>
                  <td className={`px-6 py-4 4 ${isDark ? "text-gray-300": "text-gray-800"}`}>{t.status}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onView(t._id)} className={`px-2 py-1 rounded ${isDark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}>View</button>
                      <button onClick={() => onEdit(t._id)} className="px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500">Edit</button>
                      <button onClick={() => onDelete(t._id)} className="px-2 py-1 rounded bg-rose-600 text-white hover:bg-rose-500">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {meta.totalPages > 1 && (
          <div className={`flex items-center justify-between px-6 py-3 border-t ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
            <div className={`${isDark ? "text-gray-400" : "text-gray-700"} text-sm`}>Showing page {meta.page} of {meta.totalPages} • {meta.total} total</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setQuery(q => ({ ...q, page: Math.max(1, q.page - 1) }))} disabled={meta.page <= 1} className={`p-2 rounded ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}><ChevronLeft size={16} /></button>
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setQuery(q => ({ ...q, page: p }))} className={`px-3 py-1 rounded ${meta.page === p ? "bg-blue-500 text-white" : isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}>{p}</button>
              ))}
              <button onClick={() => setQuery(q => ({ ...q, page: Math.min(meta.totalPages, q.page + 1) }))} disabled={meta.page >= meta.totalPages} className={`p-2 rounded ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <TeacherFormModal
          open={showForm}
          onClose={() => { setShowForm(false); setEditing(null); }}
          defaultValues={editing}
          onSubmit={onSubmit}
          subjectsList={subjectsList}
          classesList={classesList}
          isDark={isDark}
        />
      )}

      {showProfile && activeTeacher && (
        <TeacherProfileModal
          open={showProfile}
          onClose={() => { setShowProfile(false); setActiveTeacher(null); }}
          teacher={activeTeacher}
          isDark={isDark}
          onManageAssignments={() => openAssignmentsFor(activeTeacher)}
        />
      )}

      {showAssignments && assignmentTeacher && (
        <TeacherAssignmentsModal
          open={showAssignments}
          onClose={closeAssignments}
          teacher={assignmentTeacher}
          isDark={isDark}
          onChange={() => { fetchData(); if (assignmentTeacher && activeTeacher && assignmentTeacher._id === activeTeacher._id) { /* refresh active teacher if needed */ } }}
        />
      )}
    </div>
  );
}