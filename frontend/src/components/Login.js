
import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";

const Login = () => {
  const ref = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [passEye, setPassEye] = useState("");
  const { setAuth } = useContext(AuthContext);
  const token = Cookies.get("jwt");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, []);
  const validateLoginForm = () => {
    $("#loginform").validate({
      rules: {
        email: {
          required: true,
          email: true,
        },
        password: {
          required: true,
        },
      },
      messages: {
        email: {
          required: "Please enter your email",
          email: "Please enter a valid email address",
        },
        password: {
          required: "Please enter your password",
        },
      },
      errorElement: "div",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback"); // Add error class
        error.insertAfter(element.parent()); // Insert error message after input's parent container
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid").removeClass("is-valid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass("is-invalid").addClass("is-valid");
      },
    });
  
    return $("#loginform").valid();
  };


  

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
          if (!validateLoginForm()) {
            return;
          }
          console.log(process.env.REACT_APP_BACKEND_URL);
          setLoading(true);
          const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
          });
          const response = await res.json();
          console.log(response)
          if (response.success) {
            setLoading(false);
            setError("");
            toast.success("You are logged in Successfully!", {
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
            const redirectPath = localStorage.getItem('redirectAfterLogin') || '/dashboard';
          localStorage.removeItem('redirectAfterLogin');
            setTimeout(() => {
              navigate(redirectPath);
            }, 1500);
          } else {
            setLoading(false);
            setError(response.message);
            toast.error(response.message, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              className: "custom-toast-error", // Apply custom error class
          });
          }
        } catch (error) {
          console.error("Error during login:", error);
        }
    }
  return (
    <div >

<ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
 
      <div className="flex w-full flex-wrap relative">
        <div className="flex w-full flex-col md:w-1/2 lg:w-1/3">
          <div className="my-auto flex flex-col justify-center px-6 pt-8 sm:px-24 md:justify-start md:px-8 md:pt-0 lg:px-12">
            <p className="text-center text-3xl font-bold">Admin</p>
            <p className="mt-2 text-center">Login to access your account.</p>
            <form className="flex flex-col pt-3 md:pt-8" id="loginform">
              <div className="flex flex-col pt-4">
                <div className="relative flex items-center overflow-hidden rounded-lg border focus-within:border-transparent focus-within:ring-2 transition focus-within:ring-blue-600">
                  <span className="inline-flex items-center border-r border-gray-300 bg-white px-3 text-sm text-gray-500 shadow-sm">
                    <svg
                      width="15"
                      height="15"
                      fill="currentColor"
                      viewBox="0 0 1792 1792"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z"></path>
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full flex-1 appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400  focus:outline-none"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="mb-12 flex flex-col pt-4">
                <div className="relative flex items-center overflow-hidden rounded-lg border focus-within:border-transparent focus-within:ring-2 transition focus-within:ring-blue-600">
                  <span className="inline-flex items-center border-r border-gray-300 bg-white px-3 text-sm text-gray-500 shadow-sm">
                    <svg
                      width="15"
                      height="15"
                      fill="currentColor"
                      viewBox="0 0 1792 1792"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z"></path>
                    </svg>
                  </span>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full flex-1 appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400  focus:outline-none"
                    placeholder="Password"
                  />
                </div>
              </div>
              <button
                onClick={handleSubmit}
                type="submit"
                className="w-full rounded-lg bg-blue-700 px-4 py-2 text-center text-base font-semibold text-white shadow-md transition ease-in hover:bg-blue-600 focus:outline-none focus:ring-2"
              >
                <span className="w-full">Login</span>
              </button>
            </form>
          </div>
        </div>
        <div className="">
          <img
            className="h-screen w-full object-cover opacity-90"
            src="https://readymadeui.com/signin-image.webp"
            alt="login-image"
            />
        </div>
      </div>
    </div>
  );
};

export default Login;
