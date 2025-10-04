import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import axios from '../../utils/axiosInstance';

const COLORS = ['#22c55e', '#ef4444'];

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        // Fetch today's classes
        const todayRes = await axios.get('/api/v1/teachers/classes/today');
        setClasses(todayRes.data.data || []);
        // Fetch attendance summary for the first class (past 7 days)
        if (todayRes.data.data && todayRes.data.data[0]) {
          const classId = todayRes.data.data[0]._id;
          const attRes = await axios.get(`/api/v1/attendance/class/${classId}/summary?days=7`);
          setAttendanceSummary(attRes.data.data.daily || []);
          setPieData(attRes.data.data.pie || []);
        }
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Teacher Dashboard</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Today's Classes</h3>
            <ul className="list-disc ml-6">
              {classes.map(cls => (
                <li key={cls._id}>{cls.name}</li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-2">Attendance (Last 7 Days)</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={attendanceSummary}>
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="present" fill="#22c55e" name="Present" />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                  <Bar dataKey="late" fill="#facc15" name="Late" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Present/Absent Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherDashboard;
