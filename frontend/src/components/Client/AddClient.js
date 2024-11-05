import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";

const AddClient = () => {
  const [loader, setLoader] = useState(false);
  const [mobileValid, setMobileValid] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const initialState = {
    clientname: "",
    email: "",
    address: "",
    contactNumber: "",
    client_id: "",
    bookedProperties: "",
    preferredPropertyType: "",
    notes: "",
    budget: "",
    panNumber: "",
    dateOfBirth: "",
    gender: "",
    occupation: "",

  };
  const [data, setData] = useState(initialState);
  const [client_id, setclientID] = useState("");
  const [property, setproperty] = useState([]);

  console.log(property);

  useEffect(() => {
    fetchclientID();
    fetchproperty();
  }, []);

  const fetchclientID = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getNextclientId`
    );
    const response = await res.json();
    console.log(response.client_id);
    if (response.success) {
      setData({ ...data, client_id: response.client_id });
      setclientID(response.client_id);
    }
  };

  const fetchproperty = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getAllProperty`
    );
    const response = await res.json();
    if (response.success) {
      setproperty(response.result);
    }
  };

  const validateclientform = () => {
    $.validator.addMethod(
      "validPhone",
      function (value, element) {
        return this.optional(element) || /^\d{10}$/.test(value);
      },
      "Please enter a valid 10-digit phone number."
    );
    // Initialize jQuery validation
    $("#clientform").validate({
      rules: {
        clientname: {
          required: true,
        },
        email: {
          required: true,
          email: true,
        },
        // address: {
        //   required: true,
        // },
        contactNumber: {
          required: true,
          validPhone: true,
        },
        preferredPropertyType: {
          required: true,
        },

        password: {
          required: true, // Apply custom experience validation
        },
      },
      messages: {
        clientname: {
          required: "Please enter name",
        },
        email: {
          required: "Please enter email",
          email: "Please enter a valid email address",
        },
        address: {
          required: "Please enter address",
        },
        password: {
          required: "Please enter password",
        },
        contactNumber: {
          required: "Please enter phone number",
          validPhone: "Phone number must be exactly 10 digits", // Custom error message
        },
        preferredPropertyType: {
          required: "Please enter preferred Property Type",
        },
        notes: {
          required: "Please enter a Note",
        },
        budget: {
          validExperience: "Please enter a budget",
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
    return $("#clientform").valid();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contactNumber") {
      // Allow empty input (for deletion) or validate if it's a number
      if (value === "" || !isNaN(value)) {
        setData({ ...data, [name]: value });
      } else {
        console.log("Contact number must be a valid number");
      }
    } else {
      // Update state for other fields
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateclientform()) {
      //setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoader(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/insertClient`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const response = await res.json();
      if (response.success) {
        setMobileValid("");
        toast.success("New client is added Successfully!", {
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
          navigate("/clients");
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
          <div className="text-2xl font-bold mx-2 my-8 px-4">Add Client</div>
        </div>
      </div>
      {loader ? (
        <div className="absolute w-[80%] h-[40%] flex justify-center items-center">
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
        <div className="w-[70%] m-auto my-10">
          <form id="clientform">
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="client_id"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Client ID{" "}
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  readOnly
                  name="client_id"
                  value={client_id}
                  onChange={handleChange}
                  type="text"
                  id="client_id"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="John"
                />
              </div>
              <div>
                <label
                  htmlFor="clientname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Client Name{" "}
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="clientname"
                  value={data.clientname}
                  onChange={handleChange}
                  type="text"
                  id="clientname"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="John"
                />
              </div>
            </div>

            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div className="">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Password<span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  type="password"
                  id="password"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="•••••••••"
                />
              </div>
              <div>
                <label
                  htmlFor="contact"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Phone number
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="contactNumber"
                  value={data.contactNumber}
                  onChange={handleChange}
                  type="text"
                  id="contactNumber"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="123-45-678"
                  
                />
                {mobileValid && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {mobileValid}
                  </p>
                )}
              </div>
              <div className="">
                <label
                  htmlFor="personal_email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Email 
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  type="email"
                  id="email"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="john.doe@company.com"
                  
                />
              </div>
              <div>
                <label
                  htmlFor="contact"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  preferred Property Type
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="preferredPropertyType"
                  value={data.preferredPropertyType}
                  onChange={handleChange}
                  type="text"
                  id="preferredPropertyType"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="Residential, Commercial, etc"
                  
                />
                {mobileValid && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {mobileValid}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="contact"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  PAN Number
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="panNumber"
                  value={data.panNumber}
                  onChange={handleChange}
                  type="text"
                  id="panNumber"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="PAN2324SDCF"
                  
                />
              
              </div>
              <div>
                <label
                  htmlFor="contact"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Gender
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="gender"
                  value={data.gender}
                  onChange={handleChange}
                  type="text"
                  id="gender"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="Male/Female/Other"
                  
                />
              </div>
              <div>
                <label
                  htmlFor="occupation"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Occupation
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="occupation"
                  value={data.occupation}
                  onChange={handleChange}
                  type="text"
                  id="occupation"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="Salaried 
                  Employee"
                  
                />
                {mobileValid && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {mobileValid}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="contact"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Date of Birth
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="dateOfBirth"
                  value={data.dateOfBirth}
                  onChange={handleChange}
                  type="date"
                  id="dateOfBirth"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="PAN2324SDCF"
                  
                />
                {mobileValid && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {mobileValid}
                  </p>
                )}
              </div>
             
            </div>
            
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
            
              <div className="">
                <label
                  htmlFor="company_email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                   address
                </label>
                <input
                  name="address"
                  value={data.address}
                  onChange={handleChange}
                  type="address"
                  id="address"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="1234 Elm Street, Suite 567, Springfield, IL, 62704, USA"
                />
              </div>
              {/* <div className="">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  bookedProperties<span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <select
                name="bookedProperties"
                value={data?.bookedProperties}
                onChange={handleChange}
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                
              >
                <option value="">Select a property name</option>
                {property.map((option) => {
                  return (
                    <option
                      key={option._id}
                      value={option._id}
                      className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                    >
                      {option.propertyname}
                    </option>
                  );
                })}
              </select>
              </div> */}
              <div className="">
                <label
                  htmlFor="budget"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Budget
                </label>
                <input
                  name="budget"
                  value={data.budget}
                  onChange={handleChange}
                  type="Number"
                  id="budget"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="$546"
                  
                />
              </div>
                        
            </div>
            {error && <p className="text-red-900  text-[17px] mb-5">{error}</p>}
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

export default AddClient;
