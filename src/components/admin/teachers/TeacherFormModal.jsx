//  TeacherFormModal.js
import { useEffect, useState } from "react";
import { X } from 'lucide-react';

export default function TeacherFormModal({ open, onClose, defaultValues, onSubmit, isDark }) {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    qualifications: [],
    experience: 0,
    status: "Active",
    dateJoined: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (defaultValues) {
      setValues({
        fullName: defaultValues.fullName || "",
        email: defaultValues.email || "",
        phone: defaultValues.phone || "",
        gender: defaultValues.gender || "",
        dob: defaultValues.dob ? new Date(defaultValues.dob).toISOString().split('T')[0] : "",
        address: defaultValues.address || "",
        qualifications: Array.isArray(defaultValues.qualifications) ? defaultValues.qualifications : (defaultValues.qualification || []),
        experience: defaultValues.experience || 0,
        status: defaultValues.status || "Active",
        dateJoined: defaultValues.dateJoined ? new Date(defaultValues.dateJoined).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setValues({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        dob: "",
        address: "",
        qualifications: [],
        experience: 0,
        status: "Active",
        dateJoined: new Date().toISOString().split('T')[0],
      });
    }
    setError(""); // Reset error state on modal open/close
  }, [defaultValues, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const formattedData = {
      ...values,
      experience: values.experience ? parseInt(values.experience, 10) : 0,
      // CHANGE: Use the singular 'qualification' key to match the backend model
      qualification: Array.isArray(values.qualifications)
        ? values.qualifications.filter(Boolean)
        : (typeof values.qualifications === "string"
            ? values.qualifications.split(",").map((s) => s.trim()).filter(Boolean)
            : []),
      dateJoined: values.dateJoined ? new Date(values.dateJoined).toISOString() : undefined,
    };

    await onSubmit(formattedData);
    onClose();
  } catch (err) {
    setError(err?.message || "Failed to save teacher");
  } finally {
    setLoading(false);
  }
};

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`w-full max-w-3xl rounded-2xl ${isDark ? "bg-gray-800" : "bg-white"} shadow-xl max-h-full overflow-y-auto`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <h2 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{defaultValues ? "Edit Teacher" : "Add New Teacher"}</h2>
          <button onClick={onClose} className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}><X className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded-lg">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* left column */}
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Full Name *</label>
                <input name="fullName" value={values.fullName} onChange={handleChange} required className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`} />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Email</label>
                <input type="email" name="email" value={values.email} onChange={handleChange} className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`} />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Phone</label>
                <input type="tel" name="phone" value={values.phone} onChange={handleChange} className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`} />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Gender</label>
                <select name="gender" value={values.gender} onChange={handleChange} className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* right column */}
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Date of Birth</label>
                <input type="date" name="dob" value={values.dob} onChange={handleChange} className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`} />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Qualifications (comma separated)</label>
                <input type="text" name="qualifications" value={Array.isArray(values.qualifications) ? values.qualifications.join(", ") : values.qualifications} onChange={(e) => setValues(v => ({ ...v, qualifications: e.target.value.split(",").map(s => s.trim()) }))} className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`} />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Experience (years)</label>
                <input type="number" name="experience" min="0" value={values.experience} onChange={handleChange} className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`} />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Status</label>
                <select name="status" value={values.status} onChange={handleChange} className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* address */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Address</label>
            <textarea name="address" value={values.address} onChange={handleChange} rows="3" className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}></textarea>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className={`px-4 py-2 rounded-lg border ${isDark ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700"}`}>Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-blue-600 text-white">{loading ? "Saving..." : defaultValues ? "Update Teacher" : "Add Teacher"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}