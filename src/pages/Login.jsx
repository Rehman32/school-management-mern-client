//client/pages/login.js

import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
   const {login} =useAuth();
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login',formData);
        const {token}=res.data;
        login(token);
        toast.success("Login Successful");
    } catch (error) {
        toast.error(error.response?.data?.msg || 'Login Falied');
        console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="flex justify-center items-center h-[calc(100vh-64px)]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold text-sm mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email "
              name="email"
              type="email"
              onChange={handleChange}
              value={formData.email}
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-8">
            <label className="block font-bold text-gray-700 text-sm mb-2">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded px-3 py-2 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="passowrd"
              name="password"
              type="password"
              placeholder="********"
              onChange={handleChange}
              value={formData.password}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
            <Link
              to="/register"
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
