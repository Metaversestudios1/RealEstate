import React, {
  useState,
  useContext,
  useInsertionEffect,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { IoMdSettings } from "react-icons/io";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";
import getUserFromToken from "./utils/getUserFromToken";

const Navbar = ({ toggleSideBar }) => {
  const { setAuth } = useContext(AuthContext);
  const [settingDropdown, setSettingDropdown] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState("");
  const [notifications, setNotifications] = useState([]);

  const userInfo = getUserFromToken();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    let route;
    if (userInfo.role === "client") {
      route = "getClientNotification";
    } else {
      route = "getAgentNotification";
    }
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/${route}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Send cookies with the request
        body: JSON.stringify({ [`${userInfo.role}_id`]: userInfo.id }),
      }
    );
    const response = await res.json();
    console.log(response);
    if (response.success) {
      setNotifications(response.data);
      setNotificationCount(response.data.length);
    }
  };
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      // Perform logout logic (e.g., API call to logout)
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/logout`,
        {
          method: "POST",
          credentials: "include", // Send cookies with the request
        }
      );
      const response = await res.json();
      if (response.success) {
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
        Cookies.remove("jwt");
        setAuth({ isAuthenticated: false, user: null });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCloseNotification = async () => {
    setNotificationCount("0");
    let route;
    if (userInfo.role === "client") {
      route = "offClientNotification";
    } else {
      route = "offAgentNotification";
    }
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/${route}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Send cookies with the request
        body: JSON.stringify({ [`${userInfo.role}_id`]: userInfo.id }),
      }
    );
    const response = await res.json();
    if (response.success) {
      setNotifications([]);
    }
  };

  const handleOpenNotification = () => {
    setOpenNotification(!openNotification);
  };

  function timeDifference(timestamp) {
    console.log(timestamp);
    const now = new Date();
    const givenTime = new Date(timestamp);
    const difference = Math.abs(now - givenTime); // Difference in milliseconds

    const minutes = Math.floor(difference / 1000 / 60); // Convert to minutes
    const hours = Math.floor(minutes / 60); // Convert to hours if applicable

    if (hours >= 1) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }
  }
  return (
    <header className="flex flex-wrap justify-start  z-50 w-full text-sm shadow-lg">
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
        className="relative w-full bg-white border border-gray-200  px-4 flex items-center justify-between py-3"
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
          id="navbar-collapse-with-animation"
          className="hs-collapse  overflow-hidden transition-all duration-300 "
        ></div>
        <div className="flex items-center justify-center gap-2">
          <div className="relative font-[sans-serif] w-max mx-10">
            <button
              onClick={handleOpenNotification}
              type="button"
              id="dropdownToggle"
              className="w-10 h-10 flex items-center justify-center rounded-full text-white border-none outline-none bg-blue-600 hover:bg-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18px"
                className="cursor-pointer fill-[#fff]"
                viewBox="0 0 371.263 371.263"
              >
                <path
                  d="M305.402 234.794v-70.54c0-52.396-33.533-98.085-79.702-115.151.539-2.695.838-5.449.838-8.204C226.539 18.324 208.215 0 185.64 0s-40.899 18.324-40.899 40.899c0 2.695.299 5.389.778 7.964-15.868 5.629-30.539 14.551-43.054 26.647-23.593 22.755-36.587 53.354-36.587 86.169v73.115c0 2.575-2.096 4.731-4.731 4.731-22.096 0-40.959 16.647-42.995 37.845-1.138 11.797 2.755 23.533 10.719 32.276 7.904 8.683 19.222 13.713 31.018 13.713h72.217c2.994 26.887 25.869 47.905 53.534 47.905s50.54-21.018 53.534-47.905h72.217c11.797 0 23.114-5.03 31.018-13.713 7.904-8.743 11.797-20.479 10.719-32.276-2.036-21.198-20.958-37.845-42.995-37.845a4.704 4.704 0 0 1-4.731-4.731zM185.64 23.952c9.341 0 16.946 7.605 16.946 16.946 0 .778-.12 1.497-.24 2.275-4.072-.599-8.204-1.018-12.336-1.138-7.126-.24-14.132.24-21.078 1.198-.12-.778-.24-1.497-.24-2.275.002-9.401 7.607-17.006 16.948-17.006zm0 323.358c-14.431 0-26.527-10.3-29.342-23.952h58.683c-2.813 13.653-14.909 23.952-29.341 23.952zm143.655-67.665c.479 5.15-1.138 10.12-4.551 13.892-3.533 3.773-8.204 5.868-13.353 5.868H59.89c-5.15 0-9.82-2.096-13.294-5.868-3.473-3.772-5.09-8.743-4.611-13.892.838-9.042 9.282-16.168 19.162-16.168 15.809 0 28.683-12.874 28.683-28.683v-73.115c0-26.228 10.419-50.719 29.282-68.923 18.024-17.425 41.498-26.887 66.528-26.887 1.198 0 2.335 0 3.533.06 50.839 1.796 92.277 45.929 92.277 98.325v70.54c0 15.809 12.874 28.683 28.683 28.683 9.88 0 18.264 7.126 19.162 16.168z"
                  data-original="#000000"
                ></path>
              </svg>
            </button>
            {notificationCount != 0 && (
              <span class="absolute inset-0 object-right-top -mr-6 left-6 -top-2">
                <div class="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-green-800 text-white">
                  {notificationCount}
                </div>
              </span>
            )}
            {openNotification && (
              <div
                id="dropdownMenu"
                className="absolute  block right-0 shadow-2xl  bg-white py-4 z-[1000] min-w-full rounded-lg w-[410px] max-h-[500px] overflow-auto mt-2"
              >
                <div className="flex justify-between items-center  ">
                  <div className="font-bold text-lg px-5">Notifications:</div>
                  <button
                    type="button"
                    onClick={() => {
                      handleOpenNotification();
                      handleCloseNotification();
                    }}
                    className=" bg-white rounded-md p-2 m-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  >
                    <span class="sr-only">Close menu</span>
                    <svg
                      class="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <ul className="divide-y">
                  {notifications.length !== 0 ? (
                    notifications.map((item, index) => {
                      return (
                        <li className="p-1 flex items-center hover:bg-gray-50 cursor-pointer">
                          <div className="ml-6">
                            <p className="text-lg font-bold  mt-2">
                              {index + 1}. {item?.propertyname}
                            </p>
                            <p className="text-sm text-gray-500 ml-6">
                              {item?.description}
                            </p>
                            <p className="text-xs text-blue-600 leading-3 mt-2 ml-6">
                              {timeDifference(item?.createdAt)}
                            </p>
                          </div>
                          <hr className="" />
                        </li>
                      );
                    })
                  ) : (
                    <h1 className="ml-5">No new notifications</h1>
                  )}
                </ul>
              </div>
            )}
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
                  <div className="py-1 text-sm font-semibold">
                    Username: {userInfo?.role}
                  </div>
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
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
