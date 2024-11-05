import React, { useEffect, useState } from "react";
import getUserFromToken from "../components/utils/getUserFromToken";
import { NavLink } from "react-router-dom";
import { IoIosArrowRoundForward } from "react-icons/io";

const Home = () => {
  const userInfo = getUserFromToken();
  const [loader, setLoader] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAgent, setTotalAgent] = useState(0);
  const [totalClient, setTotalClient] = useState(0);
  const [totalPropertys, setTotalPropertys] = useState(0);
  const [totalsites, setTotalsites] = useState(0);
  const [totalavailableproperty, setavailableProperty] = useState(0);
  const [totalbookedproperty, setbookedProperty] = useState(0);
  const [availableRanks, setavailablerank] = useState(0);
  const [events, setEvents] = useState([]); // State to hold events
  useEffect(() => {
    setLoader(true);
    // Execute all fetch requests in parallel and only hide loader when all of them are done.
    Promise.all([
      fetchProprtyCount(),
      fetchClientCount(),
      fetchAgentCount(),
      fetchAvailableproperties(),
      fetchbookedproperties(),
      fetchtotalsites(),
      fetchtotalrank(),
      fetchtotalrank5(),
      
    ]).finally(() => {
      setLoader(false);
    });
  }, []);
const fetchProprtyCount = async () =>{
  const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getPropertyCount`);
    const response = await res.json();
    setTotalPropertys(response.count);
   
}
const fetchtotalrank = async () =>{
  const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getrankcount`);
    const response = await res.json();
    setavailablerank(response.count);
   
}

 
  const fetchClientCount = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getclientcount`);
    const response = await res.json();
    setTotalClient(response.count);
  };
  const fetchtotalsites = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getsitecount`);
    const response = await res.json();
    setTotalsites(response.count);
  };
  const fetchAgentCount = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getagentcount`);
    const response = await res.json();
    setTotalAgent(response.count);
  };
  const fetchAvailableproperties = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getsitecount?status=Available`
      );
      const response = await res.json();
      setavailableProperty(response.count);
    } catch (error) {
      console.error("Error fetching available properties:", error);
    }
  };
  const fetchbookedproperties = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getsitecount?status=Booked`
      );
      const response = await res.json();
      setbookedProperty(response.count);
    } catch (error) {
      console.error("Error fetching available properties:", error);
    }
  };
  const fetchtotalrank5 = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getrankcount5`); // Replace with your API endpoint
      const data = await response.json();
      setEvents(data.count); // Set the fetched events to state
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  return (
    <div>
       {loader ? (
        <div className="absolute z-20 h-full w-full md:right-6 flex justify-center items-center">
          <div
            className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row p-3 mb-6 w-full ">
              <div className="flex flex-col flex-1 my-1 mr-4">
                <div className="bg-blue-900 shadow-lg shadow-gray-200 rounded-2xl p-2 ">
                  <NavLink to="/properties">
                    <div className="flex items-center">
                      <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-[#1E88E5] to-voilet-500 rounded-lg">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        <span className="text-2xl text-white text-white font-bold leading-none text-gray-900 sm:text-3xl">
                          {totalPropertys}
                        </span>
                        <h3 className="text-base text-white text-white font-normal text-gray-500">
                          Total Property
                        </h3>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <br></br>
                <div className="bg-blue-900 shadow-lg shadow-gray-200 rounded-2xl p-2 ">
                  <NavLink to="/clients">
                    <div className="flex items-center">
                      <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-[#1E88E5] to-voilet-500 rounded-lg">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        <span className="text-2xl text-white font-bold leading-none text-gray-900 sm:text-3xl">
                          {totalClient}
                        </span>
                        <h3 className="text-base text-white font-normal text-gray-500">
                          Total Client
                        </h3>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="bg-blue-900 shadow-lg shadow-gray-200 rounded-2xl p-2 my-2">
                  <NavLink to="/agents">
                    <div className="flex items-center">
                      <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-[#1E88E5] to-voilet-500 rounded-lg">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        <span className="text-2xl text-white font-bold leading-none text-gray-900 sm:text-3xl">
                        {totalAgent}
                        </span>
                        <h3 className="text-base text-white font-normal text-gray-500">
                          Total Active Agent
                        </h3>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="bg-blue-900 shadow-lg shadow-gray-200 rounded-2xl p-2 my-2">
                  <NavLink to="/ranks">
                    <div className="flex items-center">
                      <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-[#1E88E5] to-voilet-500 rounded-lg">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        <span className="text-2xl text-white font-bold leading-none text-gray-900 sm:text-3xl">
                          {availableRanks}
                        </span>
                        <h3 className="text-base text-white font-normal text-gray-500">
                          Total Ranks 
                        </h3>
                      </div>
                    </div>
                  </NavLink>
                </div>
              </div>
              <div className="flex flex-col flex-1 my-1 mr-4">
                <div className="bg-blue-900 shadow-lg shadow-gray-200 rounded-2xl p-2">
                  <NavLink to="/sites">
                    <div className="flex items-center">
                      <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-[#1E88E5] to-voilet-500 rounded-lg">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        <span className="text-2xl text-white font-bold leading-none text-gray-900 sm:text-3xl">
                          {totalsites}
                        </span>
                        <h3 className="text-base text-white font-normal text-gray-500">
                          Total Sites
                        </h3>
                      </div>
                    </div>
                  </NavLink>
                </div><br></br>
                <div className="flex flex-col flex-1 my-1">
                <div className="bg-blue-900 shadow-lg shadow-gray-200 rounded-2xl p-2">
                  <NavLink to="/sites">
                    <div className="flex items-center">
                      <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-[#1E88E5] to-voilet-500 rounded-lg">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        <span className="text-2xl text-white font-bold leading-none text-gray-900 sm:text-3xl">
                              {totalbookedproperty}
                        </span>
                        <h3 className="text-base text-white font-normal text-gray-500">
                          Booked Site
                        </h3>
                      </div>
                    </div>
                  </NavLink>
                </div>
              </div>  
                {/* <div className="rounded-2xl shadow-lg shadow-gray-200 p-3 mx-1 py-5">
      <div className="flex justify-between items-center">
        <div className="font-bold flex items-center">
          <span className="inline-block mr-2 h-5 w-5 rounded-full bg-[#1E88E5]"></span>
          Ranks And There CommisionRates
        </div>
        <div>
          <IoIosArrowRoundForward className="text-2xl text-white" />
        </div>
      </div>

      <div>
        {events.map((event, index) => (
          <div key={index} className="flex flex-col my-3">
            <div className="flex items-center">
              <div className="mr-2 text-lg"><b> {event.name}</b></div>
              <div className="text-sm font-thin text-lg">Commition Rate :{event.commissionRate}</div>
            </div>
            <div className="text-sm font-thin text-lg">Level: {event.level}</div>
          </div>
        ))}
      </div>
    </div> */}

            </div>
              <div className="flex flex-col flex-1 my-1">
                <div className="bg-blue-900 shadow-lg shadow-gray-200 rounded-2xl p-2">
                  <NavLink to="/sites">
                    <div className="flex items-center">
                      <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-[#1E88E5] to-voilet-500 rounded-lg">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        <span className="text-2xl text-white font-bold leading-none text-gray-900 sm:text-3xl">
                          {totalavailableproperty}
                        </span>
                        <h3 className="text-base text-white font-normal text-gray-500">
                          Total Available Site
                        </h3>
                      </div>
                    </div>
                  </NavLink>
                </div>
              </div>
                   
        </div>
      )}
    </div>
  )
}

export default Home
