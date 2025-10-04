// adminMainContent.jsx
import React, { useState, useEffect } from 'react';

import AdminDashboardStats from './AdminDashboardStats';
import StudentList from '../../pages/admin/StudentManagement';
import TeacherManagement from '../../pages/admin/TeacherManagement';
import ClassManagement from '../../pages/admin/ClassManagement';
import AttendanceManagement from '../../pages/admin/AttendanceManagement';
import FeesManagement from '../../pages/admin/FeesManagement';
import AcademicsManagement from '../../pages/admin/AcademicsManagement';
import TimetableManagement from '../../pages/admin/TimetableManagement';
import SettingsManagement from '../../pages/admin/SettingsPage';

const MainContent = ({ isDark, activeTab, setActiveTab }) => {


  // Render content based on activeTab
  let content = null;
  if (activeTab === "overview") {
    content = <AdminDashboardStats isDark={isDark} />;
  } else if (activeTab === "students") {
    content = <StudentList isDark={isDark} />;
  } else if (activeTab === "teachers") {
    content = <TeacherManagement isDark={isDark} />;
  }else if(activeTab === "classes"){
    content=<ClassManagement isDark={isDark} />
  } else if (activeTab === 'attendance'){
    content=<AttendanceManagement isDark={isDark}/>
  } else if (activeTab === 'academics'){
    content=<AcademicsManagement isDark={isDark}/>
  } else if (activeTab === 'fees'){
    content=<FeesManagement isDark={isDark}/>
  } else if (activeTab === 'timetable'){
    content=<TimetableManagement isDark={isDark}/>
  } else if (activeTab === 'settings'){
    content=<SettingsManagement isDark={isDark}/>
  
  }else {
    content = (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        Coming soon...
      </div>
    );
  }

  return (
    <main
      className={`p-6 min-h-screen transition-colors duration-200 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {content}
    </main>
  );
};

export default MainContent;
