//client/pages/register.jsx
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      toast.success("Registration Successful . Now Login");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed.");
      console.error(err);
    }
  };

  return (
    <div className="flex bg-gray-100 justify-center items-center h-[calc(100vh-64px)]">
      <div className="border rounded-lg shadow-md bg-white p-8 w-full max-w-md">
        <h2 className="text-center font-bold text-gray-900 text-2xl mb-6">
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block font-bold text-sm text-gray-700 mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none px-3 py-2 text-gray-700 border rounded w-full leading-tight focus:outline-none focus:border-sky-600 focus:shadow-outline"
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              onChange={handleChange}
              required
              value={formData.name}
            />
          </div>
          <div className="mb-4">
            <label
              className="block font-bold text-sm text-gray-700 mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none px-3 py-2 text-gray-700 border rounded w-full leading-tight focus:outline-none focus:border-sky-600 focus:shadow-outline"
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              value={formData.email}
            />
          </div>
          <div className="mb-4">
            <label
              className="block font-bold text-sm text-gray-700 mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none px-3 py-2 text-gray-700 border rounded w-full leading-tight focus:outline-none focus:border-sky-600 focus:shadow-outline"
              id="password"
              name="password"
              type="password"
              placeholder="********"
              onChange={handleChange}
              required
              value={formData.password}
            />
          </div>
          <div className="mb-4">
            <label
              className="block font-bold text-sm text-gray-700 mb-2"
              htmlFor="role"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              onChange={handleChange}
              value={formData.role}
              className="shadow appearance-none px-3 py-2 text-gray-700 border rounded w-full leading-tight"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Register
            </button>
            <Link
              to="/login"
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
