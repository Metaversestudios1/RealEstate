import React, { useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import getUserFromToken from "./utils/getUserFromToken";
import { IoHomeOutline } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
const Sidebar = ({ sidebar, toggleSideBar }) => {
  const userInfo = getUserFromToken();
  return (
    <>
      <div
        className={`h-full bg-[#2a9adb] flex-col w-[240px] overflow-y-auto overflow-x-hidden ${
          sidebar ? "hidden" : "flex"
        } md:block`}
      >
        <div
          id="docs-sidebar"
          className={`bg-[#2a9adb]  hs-overlay   [--auto-close:lg] start-0 z-[60]  border-gray-200 pt-7 pb-10 overflow-y-auto sidebar
          }`}
        >
          <div className="px-6">
            <a
              className="flex-none text-xl font-semibold text-white"
              href="/"
              aria-label="Brand"
            >
              {userInfo.username}
            </a>
          </div>
          <nav
            className="hs-accordion-group p-3 w-full flex flex-col flex-wrap mt-8"
            data-hs-accordion-always-open
          >
            <ul className="space-y-1.5">
              <li
                className=" hover:scale-105 transition-transform duration-200 "
                onClick={toggleSideBar}
              >
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#0472ff] rounded-lg"
                      : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:text-black hover:bg-white"
                  }
                >
                  <LuLayoutDashboard />
                  Dashboard
                </NavLink>
              </li>
              <li className="hs-accordion " id="users-accordion ">
              <NavLink
                to={"/profile"}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-x-3.5  text-sm text-white bg-[#0472ff] rounded-lg"
                    : "flex items-center gap-x-3.5  text-sm text-white rounded-lg hover:text-black hover:bg-white transition-all duration-200 hover:scale-105"
                }
              >
                <button
                  type="button"
                  className="justify-between active:bg-gray-100 hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-gray-100 hover:text-black transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center">
                    <svg
                      className="size-4 mr-4"
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Profile
                  </div>
                </button>
                </NavLink>
              </li>
              {userInfo.role === "agent" && (
                <li className="hs-accordion" id="users-accordion">
                <NavLink
                  to="/properties"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3.5  text-sm text-white bg-[#0472ff] rounded-lg"
                      : "flex items-center gap-x-3.5  text-sm text-white rounded-lg hover:text-black hover:bg-white transition-all duration-200 hover:scale-105"
                  }
                >
                    <button
                      type="button"
                      className="w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-black"
                    >
                      <div className="flex items-center">
                        <IoHomeOutline className="mr-4" />
                        Properties
                      </div>
                    </button>
                    </NavLink>
                  </li>
              )}
  
              <li className="hs-accordion" id="users-accordion">
              <NavLink
                to="/sites"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-x-3.5  text-sm text-white bg-[#0472ff] rounded-lg"
                    : "flex items-center gap-x-3.5  text-sm text-white rounded-lg hover:text-black hover:bg-white transition-all duration-200 hover:scale-105"
                }
              >
                  <button
                    type="button"
                    className="w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-black"
                  >
                    <div className="flex items-center">
                      <IoHomeOutline className="mr-4" />
                      Sites
                    </div>
                  </button>
                  </NavLink>
                </li>

              {/*userInfo.role==="agent" && <li className="hs-accordion " id="users-accordion ">
              <NavLink
              to="/clients"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-x-3.5  text-sm text-white bg-[#0472ff] rounded-lg"
                  : "flex items-center gap-x-3.5  text-sm text-white rounded-lg hover:text-black hover:bg-white transition-all duration-200 hover:scale-105"
              }
            >
                <button

                  type="button"
                  className="justify-between active:bg-gray-100 hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-gray-100 hover:text-black transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center">
                    <svg
                      className="size-4 mr-4"
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Clients
                  </div>
                </button>
                </NavLink>
              </li>*/}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
