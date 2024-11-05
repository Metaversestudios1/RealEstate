import React, { useEffect, useState,useRef } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaAngleDown } from "react-icons/fa6";

const AssignProperties = () => {
  const [loader, setLoader] = useState(false);
  const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [properties, setProperties] = useState([]);
  const [propertyIds, setPropertyIds] = useState([]); // To store selected property IDs
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
    fetchAgentData(); 
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPropertyDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]// Fetch the agent's current data
);

  // Fetch all available properties
  const fetchProperties = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getAllProperty`);
    const response = await res.json();
    if (response.success) {
      setProperties(response.result);
    }
  };

  // Fetch agent's assigned properties to pre-populate the checkboxes
  const fetchAgentData = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getSingleAgent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }), // Fetch agent data by ID
    });

    const response = await res.json();
    if (response.success) {
      // Set the assigned property IDs to pre-check those checkboxes
      setPropertyIds(response.result.properties || []); // Ensure properties is an array
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      // If the checkbox is checked, add the value to the propertyIds array
      setPropertyIds((prevIds) => [...prevIds, value]);
    } else {
      // If unchecked, remove the value from the propertyIds array
      setPropertyIds((prevIds) => prevIds.filter((id) => id !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoader(true);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updateAgent`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyIds, id }), // Send the selected property IDs to the backend
      });

      const response = await res.json();
      if (response.success) {
        toast.success("Properties assigned to agent successfully!", {
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
      setLoader(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="flex items-center">
        <ToastContainer autoClose={2000} />
        <div className="flex items-center">
          <IoIosArrowRoundBack
            onClick={handleGoBack}
            className="bg-[#032e4e] text-white rounded-sm text-[40px] cursor-pointer shadow-xl ml-5"
          />
        </div>
        <div className="flex items-center">
          <div className="text-2xl font-bold mx-2 my-8 px-4">Assign Properties</div>
        </div>
      </div>
      {loader ? (
        <div className="absolute w-[80%] h-[40%] flex justify-center items-center">
          <div className="animate-spin h-8 w-8 border-4 border-current border-e-transparent rounded-full" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="w-[70%] m-auto my-10">
          <form id="assignpropertyform" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="properties" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                Properties
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setPropertyDropdownOpen(!propertyDropdownOpen)}
                  className="bg-gray-200 border text-gray-900 text-sm rounded-lg p-2.5 w-full flex justify-between items-center"
                >
                  Select properties
                  <FaAngleDown className="text-end" />
                </button>
                {propertyDropdownOpen && (
                  <div className="absolute top-full left-0 bg-white border rounded-sm shadow-lg w-full">
                    {properties.map((item) => (
                      <div key={item._id} className="p-2 bg-gray-200 text-gray-900 text-sm">
                        <input
                          type="checkbox"
                          id={`property-${item._id}`}
                          value={item._id}
                          checked={propertyIds.includes(item._id)}
                          onChange={handleCheckboxChange}
                          className="mr-2"
                        />
                        <label htmlFor={`property-${item._id}`}>{item.propertyname}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 mt-4"
            >
              Assign Properties
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AssignProperties;
