import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url =
      role === "agent"
        ? `${process.env.REACT_APP_BACKEND_URL}/api/agentlogin`
        : `${process.env.REACT_APP_BACKEND_URL}/api/clientlogin`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ [`${role}_id`]: id, password }),
    });
    const response = await res.json();
    setLoading(false);

    if (response.success) {
      toast.success("Logged In Successfully!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      Cookies.set("jwt", response.token);
      setAuth({ isAuthenticated: true, user: response.user });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="bg-sky-100 flex justify-center items-center h-screen">
      <ToastContainer autoClose={2000} />
      <div className="w-1/2 h-screen hidden lg:block">
        <img
          src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg"
          alt="Login"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="my-4">
            <label className="block text-sm text-gray-900">
              Role <span className="text-red-900">&#x2a;</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border text-sm rounded-lg block w-full p-2.5"
            >
              <option value="">Select a role</option>
              <option value="agent">Agent</option>
              <option value="client">Client</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">ID</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full border rounded-md py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-md py-2 px-3"
            />
          </div>
          <button
            type="submit"
            className="bg-red-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
