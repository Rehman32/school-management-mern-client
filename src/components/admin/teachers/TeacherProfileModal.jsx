//TeacherProfileModal.jsx

import {
  Mail,
  Phone,
  User,
  Calendar,
  MapPin,
  BookOpen,
  GraduationCap,
  Award,
  School,
  X,
} from "lucide-react";
import { listAssignments } from '../../../api/assignmentApi';
import { useEffect,useState } from "react";
export default function TeacherProfileModal({
  open,
  onClose,
  teacher,
  isDark,
  onManageAssignments, // <-- added prop
}) {

    const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(()=>{
    if(open && teacher){
      const fetchAssignments = async() =>{
        setIsLoading(true);
        setError(null);
        try{
          const response = await listAssignments({teacherId : teacher._id});
          setAssignments(response.data);
        }catch (err){
          console.error("Failed to load teacher assignments");
          setError("Failed to load Assignments");

        }finally{
          setIsLoading(false);
        }


      };
      fetchAssignments();
    }
  },[open,teacher]);

  if (!open || !teacher) return null;

  const assignedSubjects = assignments.map(a=>a.subject?.name).filter(Boolean);
  const assignedClasses = assignments.map(a=>{
    const className=a.class?.name || a.class?.grade;
    const section = a.class?.section;
       return className ? `${className}${section ? ' - ' + section : ''}` : null;
  }).filter(Boolean);

  
  const subjectsDisplay = assignedSubjects.length > 0 ? assignedSubjects.join(", ") : "No subjects assigned";
  const classesDisplay = assignedClasses.length > 0 ? assignedClasses.join(", ") : "No classes assigned";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Teacher Profile</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => { onManageAssignments?.(); }} className="px-3 py-2 rounded bg-gradient-to-r from-green-500 to-green-600 text-white">Manage Assignments</button>
              <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500" }`}><X size={20} /></button>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 text-center mb-6">
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
              {teacher.photo ? (
                <img src={teacher.photo} alt={teacher.fullName} className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <User className={`w-12 h-12 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
              )}
            </div>
            <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{teacher.fullName}</h3>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>ID: {teacher._id}</p>
          </div>

          {/* Contact */}
          <div>
            <div className="flex items-center mb-2">
              <Mail className={`w-5 h-5 mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Email</span>
            </div>
            <p className={`ml-7 ${isDark ? "text-gray-200" : "text-gray-900"}`}>{teacher.email || "Not provided"}</p>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Phone className={`w-5 h-5 mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Phone</span>
            </div>
            <p className={`ml-7 ${isDark ? "text-gray-200" : "text-gray-900"}`}>{teacher.phone || "Not provided"}</p>
          </div>

          {/* Qualifications & Experience */}
          <div>
            <div className="flex items-center mb-2">
              <GraduationCap className={`w-5 h-5 mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Qualifications</span>
            </div>
            <p className={`ml-7 ${isDark ? "text-gray-200" : "text-gray-900"}`}>{(teacher.qualifications || teacher.qualification || []).length ? (teacher.qualifications || teacher.qualification || []).join(", ") : "Not provided"}</p>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Award className={`w-5 h-5 mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Experience</span>
            </div>
            <p className={`ml-7 ${isDark ? "text-gray-200" : "text-gray-900"}`}>{teacher.experience ?? 0} Years</p>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <BookOpen className={`w-5 h-5 mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Subjects</span>
            </div>
            <p className={`ml-7 ${isDark ? "text-gray-200" : "text-gray-900"}`}>{subjectsDisplay || "No subjects assigned"}</p>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <School className={`w-5 h-5 mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Classes</span>
            </div>
            <p className={`ml-7 ${isDark ? "text-gray-200" : "text-gray-900"}`}>{classesDisplay || "No classes assigned"}</p>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center mb-2">
              <MapPin className={`w-5 h-5 mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Address</span>
            </div>
            <p className={`ml-7 ${isDark ? "text-gray-200" : "text-gray-900"}`}>{teacher.address || "Not provided"}</p>
          </div>

          <div className="flex justify-end gap-4 mt-8 md:col-span-2">
            <button onClick={onClose} className={`px-4 py-2 rounded-lg ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>Close</button>
            <button onClick={() => { onClose(); /* parent should handle editing flow if desired */ }} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
