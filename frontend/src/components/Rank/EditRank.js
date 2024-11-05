import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";

const EditRank = () => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const initialState = {
    name: "",
    commissionRate: "",
    description: "",
    level: "",
  };
  const [oldData, setOldData] = useState(initialState);
  useEffect(() => {
    fetchOldData();
  }, []);

  const fetchOldData = async (e) => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getSingleRank`,
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
        name: response.result.name,
        commissionRate: response.result.commissionRate,
        description: response.result.description,
        level: response.result.level,
      });
    }
  };
  const validaterankform = () => {
    $("#rankform").validate({
      rules: {
        name: {
          required: true,
        },
        commissionRate: {
          required: true,
        },
        level: {
          required: true,
        },
      },
      messages: {
        name: {
          required: "Please enter name",
        },
        commissionRate: {
          required: "Please enter commission rate",
        },
        level: {
          required: "Please enter level",
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
    return $("#rankform").valid();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the name includes nested object oldData
    setOldData({ ...oldData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validaterankform()) {
      return;
    }

    try {
      setLoader(true);
      const updatedata = { id, oldData };
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/updateRank`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedata),
        }
      );
      const response = await res.json();
      if (response.success) {
        toast.success("Rank is updated Successfully!", {
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
          navigate("/ranks");
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
          <div className="text-2xl font-bold mx-2 my-8 px-4">Edit Rank</div>
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
          <form id="rankform">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Rank name <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="name"
                value={oldData?.name}
                onChange={handleChange}
                type="text"
                id="name"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Enter rank name"
              />
            </div>
            <div>
              <label
                htmlFor="commissionRate"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Commission Rate
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="commissionRate"
                value={oldData?.commissionRate}
                onChange={handleChange}
                type="text"
                id="commissionRate"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Enter commission rate"
              />
            </div>

            <div>
              <label
                htmlFor="level"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Level
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="level"
                value={oldData?.level}
                onChange={handleChange}
                type="text"
                id="level"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Enter level of rank"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Description
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <textarea
                name="description"
                value={oldData?.description}
                onChange={handleChange}
                type="text"
                id="description"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Enter description"
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

export default EditRank;
