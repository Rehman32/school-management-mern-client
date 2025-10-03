import { useEffect, useState } from "react";

export default function ClassFormModal({ open, onClose, onSubmit, initialData, isDark }) {
  const [values, setValues] = useState({ name: "", grade: "", section: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setValues({
        name: initialData.name || "",
        grade: initialData.grade || "",
        section: initialData.section || "",
      });
    } else {
      setValues({ name: "", grade: "", section: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to save class");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  const pane = isDark ? "bg-slate-900 text-slate-100 border-slate-700" : "bg-white text-slate-900 border-slate-200";
  const input = isDark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400" : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className={`w-full max-w-lg rounded-xl border ${pane} shadow-xl`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <h3 className="text-lg font-semibold">{initialData ? "Edit Class" : "Add Class"}</h3>
          <button onClick={onClose} className="opacity-70 hover:opacity-100">✕</button>
        </div>

        <form onSubmit={submit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block mb-1 text-sm opacity-80">Class Name</label>
              <input
                className={`w-full rounded-lg border px-3 py-2 outline-none ${input}`}
                name="name" value={values.name} onChange={handleChange} placeholder="e.g., Science, Homeroom"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm opacity-80">Grade</label>
              <input
                className={`w-full rounded-lg border px-3 py-2 outline-none ${input}`}
                name="grade" value={values.grade} onChange={handleChange} placeholder="e.g., 8"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm opacity-80">Section</label>
            <input
              className={`w-full rounded-lg border px-3 py-2 outline-none ${input}`}
              name="section" value={values.section} onChange={handleChange} placeholder="e.g., A"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose}
              className={`px-4 py-2 rounded-lg border ${isDark ? "border-slate-600 hover:bg-slate-800" : "border-slate-300 hover:bg-slate-100"}`}>
              Cancel
            </button>
            <button disabled={loading}
              className={`px-4 py-2 rounded-lg text-white ${loading ? "opacity-60" : ""} ${isDark ? "bg-indigo-600 hover:bg-indigo-500" : "bg-indigo-600 hover:bg-indigo-500"}`}>
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
