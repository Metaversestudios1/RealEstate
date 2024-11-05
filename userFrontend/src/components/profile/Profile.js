import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getUserFromToken from "../utils/getUserFromToken";

const Profile = () => {
  const userInfo = getUserFromToken();
  const [loader, setLoader] = useState(false);
  const [clients, setClients] = useState([]);
  const [agent, setAgent] = useState(null); // Change to object to hold agent details
  const [rank, setRank] = useState(null); // State to hold rank details
  const params = useParams();
  const [superiorAgent, setSuperiorAgent] = useState(null); // State for superior agent name

  const { id } = params;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true); // Set loader to true while fetching data
      try {
        if (userInfo.role === "client") {
          // Fetch client-specific data
          const clientRes = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/getSingleClient`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: userInfo.id }), // Send client ID to fetch specific client
            }
          );
          const clientData = await clientRes.json();
          if (clientData.success) {
            setClients(clientData.result); // Set client data in the same state (to avoid changing too much code)
          }
        } else if (userInfo.role === "agent") {
          // Fetch agent-specific data
          const [agentRes] = await Promise.all([
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getSingleAgent`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: userInfo.id }), // Send agent ID to fetch specific agent
            }),
          ]);

          const agentData = await agentRes.json();
          if (agentData.success) {
            setAgent(agentData.result); // Set agent details

            // Fetch the rank details
            if (agentData.result.rank) {
              const rankRes = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/api/getSingleRank`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: agentData.result.rank }), // Send rank ID to fetch specific rank
                }
              );

              const rankData = await rankRes.json();
              if (rankData.success) setRank(rankData.result); // Set rank details

              if (agentData.result.superior) {
                const superiorRes = await fetch(
                  `${process.env.REACT_APP_BACKEND_URL}/api/getSingleAgent`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: agentData.result.superior }), // Pass superior agent ID
                  }
                );
                const superiorData = await superiorRes.json();
                if (superiorData.success)
                  setSuperiorAgent(superiorData.result.agentname); // Set superior agent's name
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoader(false); // Always turn loader off at the end
      }
    };

    fetchData();
  }, [id, userInfo.role]); // Make sure role is included in the dependency array

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="flex items-center ">
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
        <div className="flex items-center">
          <IoIosArrowRoundBack
            onClick={handleGoBack}
            className="bg-[#032e4e] text-white rounded-sm text-[40px] cursor-pointer shadow-xl ml-5"
          />

          <div className="flex items-center">
            <div className="text-2xl font-bold mx-2 my-8 px-4">
              {userInfo.role === "agent" ? "Agent" : "Client"}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <NavLink to={`/edit${userInfo.role}/${userInfo.id}`}>
          <button className="bg-blue-800 text-white px-5 py-3 mx-5 text-sm rounded-lg">
            Edit
          </button>
        </NavLink>
      </div>
      {loader ? (
        <div className="absolute w-[80%] h-[40%] flex justify-center items-center">
          <div
            className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : userInfo.role === "agent" ? (
        <div className="w-[70%] m-auto my-2">
          <form id="siteform">
            <label>
              <b className="underline">Agent profile</b>
            </label>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center mt-3">
              {agent && (
                <>
                  <div>
                    <label
                      htmlFor="agentName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Agent Name</b>: {agent.agentname}
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="agentId"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Agent ID</b>: {agent.agent_id}
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="rank"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Rank</b>: {rank ? rank.name : "Loading..."}{" "}
                      {/* Display rank name */}
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="rank"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Commision Rate</b> :{" "}
                      {rank ? rank.commissionRate : "Loading..."} %{" "}
                      {/* Display rank name */}
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="rank"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Level</b>: {rank ? rank.level : "Loading..."}{" "}
                      {/* Display rank name */}
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="clients"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Clients </b>: {agent.clients?.length || "None"}
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="properties"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Properties</b>: {agent.properties?.length || "None"}
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="superior"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Referal Agent</b> : {superiorAgent || "None"}
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="superior"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Adhaar card</b> : {agent?.adhaar_id || "N/A"}
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="superior"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Pan card</b> : {agent?.pan_id || "N/A"}
                    </label>
                  </div>
                  <div>
                    <div className="font-bold underline">Bank Details:</div>
                    <div className="grid gap-6 mb-6 md:grid-cols-2 items-center mt-3">
                      <div>
                        {" "}
                        <b>Account type</b> :{" "}
                        {agent?.bank_details?.acc_type || "N/A"}{" "}
                      </div>
                      <div>
                        {" "}
                        <b>Account number</b> :{" "}
                        {agent?.bank_details?.acc_no || "N/A"}
                      </div>
                      <div>
                        {" "}
                        <b>Bank name</b> :{" "}
                        {agent?.bank_details?.bank_name || "N/A"}
                      </div>
                      <div>
                        {" "}
                        <b>IFSC code</b> : {agent?.bank_details?.ifsc || "N/A"}
                      </div>
                      <div>
                        {" "}
                        <b>Bank branch</b> :{" "}
                        {agent?.bank_details?.branch || "N/A"}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="w-[70%] m-auto my-10">
          <form id="siteform">
            <label>
              <b>Client profile</b>
            </label>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center mt-3">
              {clients && (
                <>
                  <div>
                    <label
                      htmlFor="agentName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Client Name</b>: {clients.clientname}
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="agentId"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Client ID</b>: {clients.client_id}
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="rank"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Contact number</b>: {clients.contactNumber}{" "}
                      {/* Display rank name */}
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="rank"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Email</b> : {clients.email}
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="rank"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Address</b>: {clients.address}
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="clients"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Budget</b>: {clients.budget}
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="properties"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Date of birth</b>: {clients.dateOfBirth?.split("T")[0]}
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="superior"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Pan Number</b> : {clients?.pan_id}
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="superior"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      <b>Adhaar Number</b> : {clients?.adhaar_id}
                    </label>
                  </div>
                  <br></br>
                  <div>
                    <div className="font-bold underline">Bank Details:</div>
                    <div className="grid gap-6 mb-6 md:grid-cols-2 items-center mt-3">
                      <div>
                        {" "}
                        <b>Account type</b> :{" "}
                        {clients?.bank_details?.acc_type || "N/A"}{" "}
                      </div>
                      <div>
                        {" "}
                        <b>Account number</b> :{" "}
                        {clients?.bank_details?.acc_no || "N/A"}
                      </div>
                      <div>
                        {" "}
                        <b>Bank name</b> :{" "}
                        {clients?.bank_details?.bank_name || "N/A"}
                      </div>
                      <div>
                        {" "}
                        <b>IFSC code</b> :{" "}
                        {clients?.bank_details?.ifsc || "N/A"}
                      </div>
                      <div>
                        {" "}
                        <b>Bank branch</b> :{" "}
                        {clients?.bank_details?.branch || "N/A"}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Profile;
