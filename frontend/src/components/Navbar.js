import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { CgLogOut } from "react-icons/cg";
import { IoMdSettings } from "react-icons/io";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";
import { AuthContext } from "../context/AuthContext";
import getUserFromToken from "./utils/getUserFromToken";

const Navbar = ({ toggleSideBar }) => {
  const { setAuth } = useContext(AuthContext);
  const [settingDropdown, setSettingDropdown] = useState(false);
  const navigate = useNavigate();
  const userInfo = getUserFromToken();
  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json", // Set content type to JSON
          },
          body: JSON.stringify({ id: userInfo.id }), // Include user ID in the request body
        // Send cookies with the request
        }
      );
      const response = await res.json();
      if (response.success) {
        Cookies.remove("jwt");
        toast.success("Logout Successfully", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setAuth({ isAuthenticated: false, user: null });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="flex flex-wrap justify-start z-50 w-full text-sm shadow-lg">
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
      <nav
        className="relative w-full bg-white border border-gray-200 px-4 flex items-center justify-between py-3"
        aria-label="Global"
      >
        <div className="flex items-center ">
          <div className="md:hidden" onClick={toggleSideBar}>
            <button
              type="button"
              className="hs-collapse-toggle size-8 flex justify-center items-center text-sm font-semibold rounded-full border border-gray-200 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
              data-hs-collapse="#navbar-collapse-with-animation"
              aria-controls="navbar-collapse-with-animation"
              aria-label="Toggle navigation"
            >
              <svg
                className="hs-collapse-open:hidden flex-shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
              <svg
                className="hs-collapse-open:block hidden flex-shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18" />
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setSettingDropdown(true)}
          onMouseLeave={() => setSettingDropdown(false)}
        >
          <div className="flex items-center justify-center text-xl font-semibold cursor-pointer">
            <IoMdSettings className="text- pr-1  mt-[2px]  text-black" />
            <div className="text-lg">Setting</div>
            {settingDropdown ? (
              <FaAngleDown className="text-end text-sm mt-1 mx-4" />
            ) : (
              <FaAngleRight className="text-end text-sm mt-1 mx-4" />
            )}
          </div>
          {settingDropdown && (
            <div className="absolute text-white flex items-center shadow-lg bg-gradient-to-r from-[#4c4f6a] to-[#767ca3]  rounded-md border-[1px] right-3 p-4 min-w-80">
              <div className="w-2/3 mx-2">
                <div className="py-1 text-sm font-semibold">Username: Admin</div>
                <div className="py-1 text-sm font-semibold">Email: {userInfo.email}</div>
              </div>
              <div className="w-1/3  ml-5">
                <button
                  onClick={handleLogout}
                  className="flex items-center text-[16px] px-4 py-2 font-medium text-white bg-gray-800 rounded-full hover:scale-110 transform transition-transform duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
