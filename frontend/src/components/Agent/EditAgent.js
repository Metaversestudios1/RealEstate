import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";
import { FaAngleDown } from "react-icons/fa6";

const EditAgent = () => {
  const [loader, setLoader] = useState(false);
  const [agentID, setAgentID] = useState("");
  const [property, setProperty] = useState([]);
  const [agents, setAgents] = useState([]);
  const [clients, setClients] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();

  const initialState = {
    agentname: "",
    agent_id: "",
    password: "",
    rank: "",
    clients: [],
    properties: [],
    superior:"",
  };
  const [oldData, setOldData] = useState(initialState);

  useEffect(() => {
    fetchOldData();
    fetchproperty();
    fetchClients();
    fetchRank();
    fetchAllAgents();
  }, []);

  const fetchAllAgents = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getAllAgent`);
      const response = await res.json();
      if (response.success) {
        setAgents(response.result); // Set agents data from API response
      }
    } catch (error) {
      console.error("Failed to fetch agents:", error);
    }
  };
  const fetchOldData = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getSingleAgent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }
    );
    const response = await res.json();
    if (response.success) {
      setOldData({
        ...oldData,
        agentname: response.result.agentname,
        agent_id: response.result.agent_id,
        password: response.result.password,
        rank: response.result.rank,
        clients: response.result.clients || [], // Ensure clients is an array
        properties: response.result.properties || [], // Ensure properties is an array
        superior: response.result.superior || "", // Ensure the superior agent is fetched correctly
   
      });
    }
  };
  
  const fetchRank = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getAllRank`
    );
    const response = await res.json();
    if (response.success) {
      setRanks(response.result);
    }
  };

  const fetchproperty = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getAllProperty`
    );
    const response = await res.json();
    if (response.success) {
      setProperty(response.result);
    }
  };

  const fetchClients = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getAllClient`
    );
    const response = await res.json();
    if (response.success) {
      setClients(response.result);
    }
  };

  // Handle clients and properties separately
  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;

    if (type === "clients") {
      setOldData((prevState) => ({
        ...prevState,
        clients: checked
          ? [...prevState.clients, value]
          : prevState.clients.filter((id) => id !== value),
      }));
    } else if (type === "properties") {
      setOldData((prevState) => ({
        ...prevState,
        properties: checked
          ? [...prevState.properties, value]
          : prevState.properties.filter((id) => id !== value),
      }));
    }
  };

  const validateagentform = () => {
    // Initialize jQuery validation
    $("#agentform").validate({
      rules: {
        agentname: {
          required: true,
        },
        agent_id: {
          required: true,
        },
        password: {
          required: true,
        },
        rank: {
          required: true,
        },
        clients: {
          required: true,
        },
        properties: {
          required: true,
        },
      },
      messages: {
        agentname: {
          required: "Please enter agent name",
        },
        agent_id: {
          required: "Please enter agent id",
        },
        password: {
          required: "Please enter password",
        },
        rank: {
          required: "Please enter rank",
        },
        clients: {
          required: "Please select a client",
        },
        properties: {
          required: "Please select properties",
        },
      },
      errorElement: "div",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        error.insertAfter(element);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid").removeClass("is-valid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass("is-invalid").addClass("is-valid");
      },
    });

    return $("#agentform").valid();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOldData({ ...oldData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateagentform()) {
      return;
    }
    try {
      setLoader(true);
      const updatedata = { id, oldData };
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/updateAgent`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedata),
        }
      );
      const response = await res.json();
      if (response.success) {
        toast.success("Agent is updated successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate("/agents");
        }, 1500);
      } else {
        setLoader(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <>
      <div className="flex items-center ">
        <ToastContainer autoClose={2000} />
        <div className="flex items-center">
          <IoIosArrowRoundBack
            onClick={handleGoBack}
            className="bg-[#032e4e] text-white rounded-sm text-[40px] cursor-pointer shadow-xl ml-5"
          />
        </div>
        <div className="flex items-center">
          <div className="text-2xl font-bold mx-2 my-8 px-4">Edit Agent</div>
        </div>
      </div>
      {loader ? (
        <div className="absolute w-[80%] h-[40%] flex justify-center items-center">
          <div
            className="animate-spin h-8 w-8 border-4 border-current border-e-transparent rounded-full"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="w-[70%] m-auto my-10">
          <form id="agentform">
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
            <div className="">
              <label htmlFor="rank" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                Rank
              </label>
              <select
                name="rank"
                value={oldData.rank}
                onChange={handleChange}
                disabled
                className="bg-gray-200 border text-gray-900 text-sm rounded-lg p-2.5 w-full"
              >
                <option value="">Select a rank.</option>
                {ranks.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
              <div>
                <label
                  htmlFor="agent_id"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Agent id <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="agent_id"
                  value={oldData?.agent_id}
                  type="text"
                  id="agent_id"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                  readOnly
                />
              </div>
             
              <div>
                <label
                  htmlFor="agentname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Agent name{" "}
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="agentname"
                  value={oldData?.agentname}
                  onChange={handleChange}
                  type="text"
                  id="agentname"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                  placeholder="Enter Agent name"
                />
              </div>
              <div>
                <label htmlFor="agentname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                Referal Agent <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <div>
                <select
      name="superior"
      value={oldData.superior} // Bind selected value
      onChange={handleChange} 
      disabled // Handle change to update the state
      className="bg-gray-200 border text-gray-900 text-sm rounded-lg p-2.5 w-full"
    >
      <option value="">Select a referal agent</option>
      {agents.map((agent) => (
        <option key={agent._id} value={agent._id}>
          {agent.agentname}
        </option>
      ))}
    </select>
              </div>
              </div>
              
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5"
            >
              ADD
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default EditAgent;
