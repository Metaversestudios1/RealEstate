import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate ,useParams} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";

const AddProperty = () => {
  const [loader, setLoader] = useState(false);
  const [mobileValid, setMobileValid] = useState("");
  const [error, setError] = useState("");
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();

  const initialState = {
    propertyname: "",
    description: "",
    address: "",
    sites: "",
    photos: [],  
  };
  const [oldData, setOldData] = useState(initialState);
  useEffect(() => {
    fetchOldData();
  }, []);
  const fetchOldData = async (e) => {
    console.log('ok');
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getSingleProperty`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }
    );
    const response = await res.json();
    console.log(response.result);
    if (response.success) {
      setOldData({
        ...oldData,
        propertyname: response.result.propertyname,
        description: response.result.description,
        address: response.result.address,
        sites: response.result.sites,
        photos: response.result.photos,
      });
    }
  };
  const validatepropertyform = () => {
    $.validator.addMethod(
      "validPhone",
      function (value, element) {
        return this.optional(element) || /^\d{10}$/.test(value);
      },
      "Please enter a valid 10-digit phone number."
    );
    // Initialize jQuery validation
    $("#propertyform").validate({
      rules: {
        propertyname: {
          required: true,
        },
        description: {
          required: true,
        },
        address: {
          required: true,
        },
        sites: {
          required: true,
        },
      },
      messages: {
        propertyname: {
          required: "Please enter property name",
        },
        description: {
          required: "Please enter description",
        },
        address: {
          required: "Please enter address",
        },
        sites: {
          required: "Please enter Number of sites",
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
    return $("#propertyform").valid();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the name includes nested object oldData
    setOldData({ ...oldData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Handle multiple files
    if (files.length > 10) {
      alert("You can only upload a maximum of 10 images.");
      e.target.value = ""; // Reset the input
      return;
    }
    setOldData({ ...oldData, photos: files });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatepropertyform()) {
      return;
    }
    // console.log(oldData);
    try {
  setLoader(true);
      const formData = new FormData();
      Object.keys(oldData).forEach((key) => {
        if (key === "photos") {
          oldData.photos.forEach((file) => formData.append("photos", file)); // Append all selected files
        } else {
          formData.append(key, oldData[key]);
        }
      });
      formData.append("id", id); // Append the `id` field separately

      // Send the request with FormData
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updateProperty`, {
        method: "PUT",
        body: formData, // Directly pass formData
      });
    
     
      const response = await res.json();
      if (response.success) {
        toast.success("Property updated Successfully!", {
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
         navigate("/properties");
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
          <div className="text-2xl font-bold mx-2 my-8 px-4">Edit Property</div>
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
          <form id="propertyform">
            <div className="my-2">
              <label
                htmlFor="propertyname"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Property Name
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="propertyname"
                value={oldData.propertyname}
                onChange={handleChange}
                type="text"
                id="propertyname"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="eg.ABC View Heights"
                required
              />
            </div>
            <div className="my-2">
              <label
                htmlFor="sites"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Number of Sites
              </label>              <input
              disabled
                name="sites"
                value={oldData.sites}
                type="number"
                id="sites"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Enter total sites (e.g., 25)"
              />
            </div>
            <div className="my-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Description
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <textarea
                name="description"
                value={oldData.description}
                onChange={handleChange}
                type="text"
                id="description"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="lorem ipsum..."
                required
              />
            </div>

            <div className="my-2">
              <label
                htmlFor="address"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Address
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <textarea
                name="address"
                value={oldData.address}
                onChange={handleChange}
                type="text"
                id="address"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="1234 Elm Street, xyz land"
                required
              />
            </div>
            
            <div className="my-2">
              <label
                htmlFor="address"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Property Image
                {/* Display old photos with eye icon */}
  {oldData.photos && oldData.photos.length > 0 && (
    <div className="mt-4 flex space-x-4">
      {oldData.photos.map((photo, index) => (
        <div key={index} className="flex items-center">
          {/* Eye icon to open image in a new tab */}
          <FaEye
            className="text-gray-700 cursor-pointer"
            onClick={() => window.open(photo.url, "_blank")} // Open image in new tab
            title={`View Image ${index + 1}`}
          />
        </div>
      ))}
    </div>
  )}
              </label>
              <input
                name="photos"
                // value={oldData.photos}
                onChange={handleFileChange}
                type="file"
                id="photos"
                accept="image/*" 
                multiple
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="1234 Elm Street, xyz land"
                
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

export default AddProperty;
