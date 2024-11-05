import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";

const AddSite = () => {
  const [loader, setLoader] = useState(false);
  const [description, setDescription] = useState([]);
  const [SiteStatus, setStatus] = useState([]);
  const [propertyName, setPropertyName] = useState("");
  const [properties, setProperties] = useState([]); 
  const [error, setError] = useState("");
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();

  const initialState = {
    propertyId: "",
    siteNumber: "",
    description: "",
    status: "",
  };
  const [data, setData] = useState(initialState);
  useEffect(() => {
     fetchData();
  }, [id]);
  const fetchData = async () => {
    try {
      let feturl;
  
      if (id) {
        // If the ID is present in the URL, fetch data for that specific user
        feturl = `${process.env.REACT_APP_BACKEND_URL}/api/getsinglePropertyID?id=${id}`;
      } else {
        // If no ID in URL, fetch all properties
        feturl = `${process.env.REACT_APP_BACKEND_URL}/api/getAllProperty`;
      }
  
      const propertyRes = await fetch(feturl, {
        method: "get",
        headers: { "Content-Type": "application/json" },
      });
  
      const propertyData = await propertyRes.json();
  
      if (propertyData.success) {
        setProperties(propertyData.result);
        // Check if ID is present and set the selected property accordingly
        if (id) {   
          const firstProperty = propertyData.result[0]; // Assuming the response contains the properties in an array
        setPropertyName(firstProperty._id);
        setData((prevData) => ({
          ...prevData,
          propertyId: firstProperty._id, // Set the propertyId here
        }));
          // Store the name separately
        } else {
          // If no ID, reset the selected property
          // setData((prevData) => ({
          //   ...prevData,
          //   propertyId: null, // or any default value you want to set
          // }));
          setProperties(propertyData.result);
          setPropertyName(""); // Reset the property name
        }
      }
      setLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const validatesiteform = () => {
    $.validator.addMethod(
      "validPhone",
      function (value, element) {
        return this.optional(element) || /^\d{10}$/.test(value);
      },
      "Please enter a valid 10-digit phone number."
    );
    // Initialize jQuery validation
    $("#siteform").validate({
      rules: {
        propertyId: {
          required: true,
        },
        siteNumber: {
          required: true,
        },
        status: {
          required: true,
        },
        
      },
      messages: {
        propertyId: {
          required: "Please enter Property",
        },
        siteNumber: {
          required: "Please enter site number",
        },
        status: {
          required: "Please select site status",
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

    // Return validation status
    return $("#siteform").valid();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
       // Check if the name includes nested object properties
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatesiteform()) {
      return;
    }
    try {
      setLoader(true);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/insertSite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (response.success) {
        toast.success("New Site is added Successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          navigate("/sites");
        }, 1500);
      } else {
        setLoader(false);
        setError(response.message);
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
        </div>
        <div className="flex items-center">
          <div className="text-2xl font-bold mx-2 my-8 px-4">Add Sites</div>
        </div>
      </div>
      {loader ? (
        <div className="absolute w-[80%] h-[40%] flex justify-center items-center">
          <div
            className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] "
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : (
        <div className="w-[50%] m-auto my-10">
          <form id="siteform">
          <div className="my-2">
          <label
            htmlFor="propertyId"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
          >
            Property
          </label>
          <select
                name="propertyId"
                id="propertyId"               
                onChange={handleChange} // This updates the ID in state when a new option is selected
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              >
                 { !id && <option value="">Select a property.</option> }
                {/* Map through properties to create dropdown options */}
                {properties.map((property) => (
                  <option
                   key={property._id} // Assuming each property has a unique ID
                   value={property._id} // The ID of the property
                   disabled={property._id === setPropertyName} // Disable the option if it is selected
                   selected={property._id === setPropertyName} // Check if this option should be selected
              
                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                  >
                    {property.propertyname} {/* Display the name of the property */}
                  </option>
                ))}
              </select>
        </div>
        <div className="my-2">
              <label
                htmlFor="siteNumber"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Site Number
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="siteNumber"
                value={data.siteNumber}
                onChange={handleChange}
                type="text"
                id="siteNumber"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Eg A-904"
                required
              />
            </div>
            <div className="my-2">
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Site Status
              </label>
              <select
                name="status"
                value={data?.status}
                id="status"
                onChange={handleChange}
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              >
                <option value="">Select Status for site.</option>
               
                    <option
                      key="Booked"
                      value="Booked"
                      className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                    >
                      Booked
                    </option>
                  
                    <option
                      key="Available"
                      value="Available"
                      className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                    >
                      Available
                    </option>

              </select>
            </div>
            <div className="my-2">
              <label
                htmlFor="clientId"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Site Description 
              </label>
              <textarea
                name="description"
                value={data.description}
                onChange={handleChange}
                type="text"
                id="description"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Lorem ipsum"
                required
              />
            </div>

          

            <button
              type="submit"
              onClick={handleSubmit}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              ADD
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddSite;
