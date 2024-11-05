import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";

const EditAgent = () => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const initialState = {
    adhaar_id: "",
    pan_id: "",
    photo: null, // Store the file object directly
    bank_details: {
      ifsc: "",
      acc_type: "",
      acc_holder_name: "",
      branch: "",
      acc_no: "",
      bank_name: "",
    },
  };
  const [data, setData] = useState(initialState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getSingleAgent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      }
    );

    const responseData = await response.json();
    console.log(responseData);
    if (responseData.success) {
      // Destructure bank_details with default values to prevent undefined errors
      const {
        adhaar_id,
        pan_id,
        photo,
        bank_details = {
          ifsc: "",
          acc_type: "",
          acc_holder_name: "",
          branch: "",
          acc_no: "",
          bank_name: "",
        },
      } = responseData.result;

      setData({
        adhaar_id,
        pan_id,
        photo,
        bank_details,
      });
    } else {
      toast.error("Failed to fetch agent data");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in data.bank_details) {
      setData((prevData) => ({
        ...prevData,
        bank_details: { ...prevData.bank_details, [name]: value },
      }));
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first file selected
    setData({ ...data, photo: file }); // Store the file object
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("id", id); // Add the agent ID directly to formData
    formData.append("adhaar_id", data.adhaar_id);
    formData.append("pan_id", data.pan_id);

    // Append bank details fields individually
    formData.append("bank_details[ifsc]", data.bank_details.ifsc);
    formData.append("bank_details[acc_type]", data.bank_details.acc_type);
    formData.append(
      "bank_details[acc_holder_name]",
      data.bank_details.acc_holder_name
    );
    formData.append("bank_details[branch]", data.bank_details.branch);
    formData.append("bank_details[acc_no]", data.bank_details.acc_no);
    formData.append("bank_details[bank_name]", data.bank_details.bank_name);

    // Append photo if available
    if (data.photo) {
      formData.append("photo", data.photo); // Append the file object
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/updateAgentDetails`, // Send request to the updated endpoint
        {
          method: "PUT",
          body: formData, // Send formData directly
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success("Agent updated Successfully!", {
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
          navigate("/profile")
        }, 1500);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating agent data:", error);
      alert("An error occurred while updating agent data.");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  console.log(data);
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
          <div className="text-2xl font-bold mx-2 my-8 px-4">
            Edit agent details
          </div>
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
        <div className="w-[70%] m-auto my-10">
          <form id="agentform">
            <div className="grid grid-cols-2 gap-5 ">
              <div className="">
                <div className="my-2">
                  <label
                    htmlFor="adhaar_id"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Adhaar id
                  </label>
                  <input
                    name="adhaar_id"
                    value={data.adhaar_id}
                    onChange={handleChange}
                    type="text"
                    id="adhaar_id"
                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                    placeholder="Enter adhaar number"
                  />
                </div>

                <div className="my-2">
                  <label
                    htmlFor="pan_id"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Pan id
                  </label>
                  <input
                    name="pan_id"
                    value={data.pan_id}
                    onChange={handleChange}
                    type="text"
                    id="pan_id"
                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                    placeholder="Enter the pan card number"
                  />
                </div>

                <div className="my-2">
                  <label
                    htmlFor="acc_holder_name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Account holder name
                  </label>
                  <input
                    name="acc_holder_name"
                    value={data.bank_details.acc_holder_name}
                    onChange={handleChange}
                    type="text"
                    id="acc_holder_name"
                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                    placeholder="Enter Acc holder name"
                  />
                </div>
                <div className="my-2">
                  <label
                    htmlFor="acc_no"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Account number
                  </label>
                  <input
                    name="acc_no"
                    value={data.bank_details.acc_no}
                    onChange={handleChange}
                    type="text"
                    id="acc_no"
                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                    placeholder="Enter Acc number"
                  />
                </div>
                <div className="my-2">
                  <label
                    htmlFor="photo"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Photo
                  </label>
                  <input
                    type="file"
                    id="photo"
                    onChange={handleFileChange}
                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                    accept="image/*"
                  />
                </div>
              </div>
              <div>
                <div className="my-2">
                  <label
                    htmlFor="acc_type"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Acc type
                  </label>
                  <input
                    name="acc_type"
                    value={data.bank_details.acc_type}
                    onChange={handleChange}
                    type="text"
                    id="acc_type"
                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                    placeholder="Enter Acc type"
                  />
                </div>
                <div className="my-2">
                  <label
                    htmlFor="ifsc"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    IFSC code
                  </label>
                  <input
                    name="ifsc"
                    value={data.bank_details.ifsc}
                    onChange={handleChange}
                    type="text"
                    id="ifsc"
                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                    placeholder="Enter IFSC code"
                    required
                  />
                </div>
                <div className="my-2">
                  <label
                    htmlFor="branch"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Branch
                  </label>
                  <input
                    name="branch"
                    value={data.bank_details.branch}
                    onChange={handleChange}
                    type="text"
                    id="branch"
                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                    placeholder="Enter Branch name"
                  />
                </div>

                <div className="my-2">
                  <label
                    htmlFor="bank_name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Bank name
                  </label>
                  <input
                    name="bank_name"
                    value={data.bank_details.bank_name}
                    onChange={handleChange}
                    type="text"
                    id="bank_name"
                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                    placeholder="Enter bank name"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
            UPDATE
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default EditAgent;
