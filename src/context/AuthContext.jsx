//client/src/context/authContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from '../utils/axiosInstance';
import { useNavigate } from "react-router-dom";
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(sessionStorage.getItem("role") || null);
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);
  const navigate =useNavigate();
  // axiosInstance adds Authorization from sessionStorage on each request via interceptor
    
  
  const login = async (userToken) => {
    setToken(userToken);
    sessionStorage.setItem('token', userToken);

    try {
      const res = await axios.get('/me');
      setUser(res.data.user);
      setRole(res.data.user.role);
      sessionStorage.setItem('role', res.data.user.role);
    //redirect based on role
    if(res.data.user.role === 'admin'){
      navigate('/admin');
    }else if(res.data.user.role === 'teacher'){
      navigate('/teacher');
    }else if(res.data.user.role === 'student'){
      navigate('/student');
    }
    else{
      navigate('login');
      console.error('Role is not defined ...')
    }
   
  } catch (err) {
    console.error('Error fetching user info:', err);
  }
};


  const logout = () =>{
    setUser(null);
    setRole(null);
    setToken(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const authData = {user, token, role , login, logout};

  return(
    <AuthContext.Provider value={authData}>
        {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
