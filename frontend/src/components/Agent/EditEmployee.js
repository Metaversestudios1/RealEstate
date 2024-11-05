import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation"; // Import the validation plugin
import { FaAngleDown } from "react-icons/fa6";

const EditEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loader, setLoader] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const employeeType = [
    {
      id: 1,
      type: "Full time",
    },
    {
      id: 2,
      type: "Part time",
    },
    {
      id: 3,
      type: "Freelancer",
    },
  ];
  const initialState = {
    name: "",
    personal_email: "",
    password: "",
    company_email: "",
    contact_number: "",
    role: "",
    photo: null,
    document: null,
    department: "",
    designation: "",
    employee_type: "",
    shift_timing: "",
    permanent_address: "",
    current_address: "",
    work_location: "",
    joining_date: "",
    team_lead: "",
    projects_assigned: [],
    date_of_birth: "",
    marriage_anniversary: "",
    nationality: "",
    gender: "",
    experience: "",
    hobbies: "",
    education: "",
    skills: "",
    bank_details: {
      acc_no: "",
      ifsc_code: "",
      acc_holder_name: "",
      bank_name: "",
      branch: "",
    },
    relative_name: "",
    relative_contact: "",
    relative_relation: "",
  };

  const [oldData, setOldData] = useState(initialState);

  useEffect(() => {
    fetchOldData();
    fetchRoles();
    fetchDepartments();
    fetchEmployees();
    fetchProjects();
    validateEmployeeForm(); // Initialize validation on mount
  }, [id]);

  useEffect(() => {
    // Re-initialize validation on data change
    validateEmployeeForm();
  }, [oldData]);

  const fetchProjects = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}//api/getproject`);
    const response = await res.json();
    if (response.success) {
      setProjects(response.result);
    }
  };
  const fetchEmployees = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}//api/getemployee`);
    const response = await res.json();
    if (response.success) {
      setEmployees(response.result);
    }
  };
  const fetchRoles = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}//api/getrole`);
    const response = await res.json();
    if (response.success) {
      setRoles(response.result);
    }
  };

  const fetchOldData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}//api/getesingleemployee`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      const result = await response.json();
      if (result.success) {
        const formatDate = (dateString) => {
          if (dateString) {
            const date = new Date(dateString);
            return date.toISOString().split("T")[0]; // Convert to yyyy-mm-dd format
          }
          return ""; // Return empty if dateString is null/undefined
        };
        setOldData({
          ...oldData,
          name: result.data[0]?.name,
          personal_email: result.data[0]?.personal_email,
          company_email: result.data[0]?.company_email,
          contact_number: result.data[0]?.contact_number,
          relative_contact: result.data[0]?.relative_contact,
          relative_name: result.data[0]?.relative_name,
          relative_relation: result.data[0]?.relative_relation,
          role: result.data[0]?.role,
          photo: result.data[0]?.photo,
          document: result.data[0]?.document,
          department: result.data[0]?.department,
          designation: result.data[0]?.designation,
          employee_type: result.data[0]?.employee_type,
          shift_timing: result.data[0]?.shift_timing,
          permanent_address: result.data[0]?.permanent_address,
          current_address: result.data[0]?.current_address,
          work_location: result.data[0]?.work_location,
          joining_date: formatDate(result.data[0]?.joining_date),
          team_lead: result.data[0]?.team_lead,
          projects_assigned: result.data[0]?.projects_assigned,
          date_of_birth: formatDate(result.data[0]?.date_of_birth),
          marriage_anniversary: formatDate(
            result.data[0]?.marriage_anniversary
          ),
          nationality: result.data[0]?.nationality,
          gender: result.data[0]?.gender,
          experience: result.data[0]?.experience,
          hobbies: result.data[0]?.hobbies,
          education: result.data[0]?.education,
          skills: result.data[0]?.skills,
          bank_details: {
            acc_no: result.data[0]?.bank_details?.acc_no,
            ifsc_code: result.data[0]?.bank_details?.ifsc_code,
            acc_holder_name: result.data[0]?.bank_details?.acc_holder_name,
            bank_name: result.data[0]?.bank_details?.bank_name,
            branch: result.data[0]?.bank_details?.branch,
          },
        });
      } else {
        console.error("No data found for the given parameter.");
      }
    } catch (error) {
      console.error("Failed to fetch old data:", error);
    }
  };
  const fetchDepartments = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}//api/getalldepartment`);
    const response = await res.json();
    if (response.success) {
      setDepartments(response.result);
    }
  };
  const validateEmployeeForm = () => {
    // Add custom validation method for phone number
    $.validator.addMethod(
      "validPhone",
      function (value, element) {
        return this.optional(element) || /^\d{10}$/.test(value);
      },
      "Please enter a valid 10-digit phone number."
    );

    // Add custom validation method for experience
    $.validator.addMethod(
      "validExperience",
      function (value, element) {
        return this.optional(element) || /^\d+(\.\d{1,2})?$/.test(value);
      },
      "Please enter a valid experience in years (e.g., 1, 2, 1.2, 1.11)."
    );

    // Initialize jQuery validation
    $("#employeeform").validate({
      rules: {
        name: {
          required: true,
        },
        personal_email: {
          required: true,
          email: true,
        },
        password: {
          required: true,
        },
        contact_number: {
          required: true,
          validPhone: true, // Apply custom phone number validation
        },
        role: {
          required: true,
        },
        relative_contact: {
          required: true,
          validPhone: true,
        },
        experience: {
          validExperience: true, // Apply custom experience validation
        },
      },
      messages: {
        name: {
          required: "Please enter name",
        },
        personal_email: {
          required: "Please enter email",
          email: "Please enter a valid email address",
        },
        password: {
          required: "Please enter password",
        },
        contact_number: {
          required: "Please enter contact details",
          validPhone: "Phone number must be exactly 10 digits", // Custom error message
        },
        relative_contact: {
          required: "Please enter contact details",
          validPhone: "Phone number must be exactly 10 digits",
        },
        role: {
          required: "Please select a role",
        },
        experience: {
          validExperience:
            "Please enter a valid experience in years (e.g., 1, 2, 1.2, 1.11).",
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
    return $("#employeeform").valid();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the name includes nested object properties
    if (name.includes("bank_details.")) {
      const [parent, child] = name.split(".");

      setOldData((prevState) => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: value,
        },
      }));
    } else {
      setOldData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmployeeForm()) {
      return;
    }
    const formData = new FormData();

    formData.append("oldData", JSON.stringify(oldData));

    // Append the employee ID
    formData.append("id", id);

    // Append the photo if it's selected
    if (oldData.photo) {
      formData.append("photo", oldData.photo);
    }
    if (oldData.document) {
      formData.append("document", oldData.document);
    }

    setLoader(true);
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}//api/updatemployee`, {
      method: "PUT",
      body: formData,
    });
    const res = await response.json();
    if (res.success) {
      toast.success("Employee is updated Successfully!", {
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
        navigate("/employees");
      }, 1500);
    } else {
      setError(response.message);
    }
  };
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setOldData((prevState) => ({
      ...prevState,
      projects_assigned: checked
        ? [...prevState.projects_assigned, value]
        : prevState.projects_assigned.filter((id) => id !== value),
    }));
  };
  const handleGoBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setOldData({ ...oldData, [e.target.name]: file });
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
          <div className="text-2xl font-bold mx-2 my-8 px-4">Edit Employee</div>
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
          <form id="employeeform">
            <h4 className="font-bold my-3">Personal Information: </h4>

            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Full Name<span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="name"
                  value={oldData?.name}
                  onChange={handleChange}
                  type="text"
                  id="name"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="John"
                  required
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
                  name="contact_number"
                  value={oldData?.contact_number}
                  onChange={handleChange}
                  type="text"
                  id="contact"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="123-45-678"
                  required
                />
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div className="">
                <label
                  htmlFor="personal_email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Email address
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="personal_email"
                  value={oldData?.personal_email}
                  onChange={handleChange}
                  type="email"
                  id="personal_email"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="john.doe@company.com"
                  required
                />
              </div>
              <div className="">
                <label
                  htmlFor="company_email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Company Email address
                </label>
                <input
                  name="company_email"
                  value={oldData?.company_email}
                  onChange={handleChange}
                  type="email"
                  id="company_email"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="john.doe@company.com"
                />
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div className="">
                <label
                  htmlFor="photo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Profile Picture
                </label>
                <input
                  name="photo"
                  onChange={handleFileChange}
                  type="file"
                  id="photo"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="Enter the task completion time"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="date_of_birth"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Date of Birth
                </label>
                <input
                  name="date_of_birth"
                  value={oldData?.date_of_birth}
                  onChange={handleChange}
                  type="date"
                  id="date_of_birth"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>

            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="hobbies"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Hobbies
                </label>
                <input
                  name="hobbies"
                  value={oldData?.hobbies}
                  onChange={handleChange}
                  type="text"
                  id="hobbies"
                  placeholder="hobbies"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Gender
                </label>
                <input
                  name="gender"
                  value={oldData?.gender}
                  onChange={handleChange}
                  type="text"
                  id="gender"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="marriage_anniversary"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Marriage Anniversary
                </label>
                <input
                  name="marriage_anniversary"
                  value={oldData?.marriage_anniversary}
                  onChange={handleChange}
                  type="date"
                  id="marriage_anniversary"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>

              <div>
                <label
                  htmlFor="nationality"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Nationality
                </label>
                <input
                  name="nationality"
                  value={oldData?.nationality}
                  onChange={handleChange}
                  type="text"
                  id="nationality"
                  placeholder="nationality"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>

            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div className="">
                <label
                  htmlFor="permanent_address"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Permanent Address
                </label>
                <textarea
                  name="permanent_address"
                  value={oldData?.permanent_address}
                  onChange={handleChange}
                  type="text"
                  rows={3}
                  id="permanent_address"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
              <div className="">
                <label
                  htmlFor="current_address"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Current Address
                </label>
                <textarea
                  name="current_address"
                  value={oldData?.current_address}
                  onChange={handleChange}
                  type="text"
                  rows={3}
                  id="current_address"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>
            <h4 className="font-bold my-3">Relative/Spouse Information: </h4>

            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="relative_name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Relative name
                </label>
                <input
                  name="relative_name"
                  value={oldData?.relative_name}
                  onChange={handleChange}
                  type="text"
                  id="relative_name"
                  placeholder="relative name"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
              <div>
                <label
                  htmlFor="relative_relation"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Relative relation
                </label>
                <input
                  name="relative_relation"
                  value={oldData?.relative_relation}
                  onChange={handleChange}
                  type="text"
                  id="relative_relation"
                  placeholder="relative relation"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="relative_contact"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Relative contact
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="relative_contact"
                  value={oldData?.relative_contact}
                  onChange={handleChange}
                  type="text"
                  id="relative_contact"
                  placeholder="relative contact"
                  required
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>
            <h4 className="font-bold my-3">Employment Details: </h4>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div className="">
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Role<span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <select
                  name="role"
                  value={oldData?.role}
                  onChange={handleChange}
                  required
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                >
                  <option value="">Select a role</option>
                  {roles.map((option) => {
                    return (
                      <option
                        key={option._id}
                        value={option._id}
                        selected={option._id === oldData.role}
                        className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                      >
                        {option.role}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="">
                <label
                  htmlFor="department"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Department
                </label>
                <select
                  name="department"
                  value={oldData?.department}
                  onChange={handleChange}
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                >
                  <option value="">Select a Department.</option>
                  {departments.map((option) => {
                    return (
                      <option
                        key={option?._id}
                        value={option?._id}
                        selected={option._id === oldData.department}
                        className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                      >
                        {option?.department_name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="designation"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Designation
                </label>
                <input
                  name="designation"
                  value={oldData?.designation}
                  onChange={handleChange}
                  type="text"
                  placeholder="designation"
                  id="designation"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>

              <div className="">
                <label
                  htmlFor="employee_type"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Employee type
                </label>
                <select
                  name="employee_type"
                  value={oldData?.employee_type}
                  onChange={handleChange}
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                >
                  <option value="">Select an employee type.</option>
                  {employeeType.map((option) => {
                    return (
                      <option
                        key={option?.id}
                        value={option?.type}
                        selected={option.type === oldData.employee_type}
                        className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                      >
                        {option?.type}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="projects_assigned"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Projects Assigned
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                    }}
                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black w-full p-2.5 flex justify-between items-center"
                  >
                    Select Projects
                    <FaAngleDown className="text-end" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 bg-white border border-gray-300 rounded-sm shadow-lg w-full">
                      {projects.map((item) => (
                        <div
                          key={item._id}
                          className="p-2  bg-gray-200 text-gray-900 text-sm  focus:ring-blue-500 focus:border-black block w-full"
                        >
                          <input
                            type="checkbox"
                            id={`project-${item._id}`}
                            value={item._id}
                            checked={oldData?.projects_assigned.includes(
                              item._id
                            )}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                          />
                          <label
                            htmlFor={`project-${item._id}`}
                            className="text-gray-900 text-sm"
                          >
                            {item.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="team_lead"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Team Lead
                </label>
                <select
                  name="team_lead"
                  value={oldData?.team_lead}
                  onChange={handleChange}
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                >
                  <option value="">Select a Lead.</option>
                  {employees.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                      className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="work_location"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Work Location
                </label>
                <input
                  name="work_location"
                  value={oldData?.work_location}
                  onChange={handleChange}
                  type="text"
                  id="work_location"
                  placeholder="work location"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>

              <div>
                <label
                  htmlFor="joining_date"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Joining Date
                </label>
                <input
                  name="joining_date"
                  value={oldData?.joining_date}
                  onChange={handleChange}
                  type="date"
                  id="joining_date"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>

            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="experience"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Experience
                </label>
                <input
                  name="experience"
                  value={oldData?.experience}
                  onChange={handleChange}
                  type="text"
                  id="experience"
                  placeholder="experience"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>

              <div>
                <label
                  htmlFor="education"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Education
                </label>
                <input
                  name="education"
                  value={oldData?.education}
                  onChange={handleChange}
                  type="text"
                  id="education"
                  placeholder="education"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="skills"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Skills
                </label>
                <input
                  name="skills"
                  value={oldData?.skills}
                  onChange={handleChange}
                  type="text"
                  id="skills"
                  placeholder="skills"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
              <div>
                <label
                  htmlFor="shift_timing"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Shift Timing
                </label>
                <input
                  name="shift_timing"
                  onChange={handleChange}
                  type="text"
                  id="shift_timing"
                  value={oldData?.shift_timing}
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="Ex. 9-6, 10-7"
                />
              </div>
              </div>
              <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div className="">
                <label
                  htmlFor="document"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Documents
                </label>
                <input
                  name="document"
                  onChange={handleFileChange}
                  type="file"
                  id="photo"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>
            <h4 className="font-bold my-3">Bank details: </h4>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="acc_no"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Account Number
                </label>
                <input
                  name="bank_details.acc_no"
                  value={oldData?.bank_details?.acc_no}
                  onChange={handleChange}
                  type="text"
                  id="acc_no"
                  placeholder="account number"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>

              <div>
                <label
                  htmlFor="ifsc_code"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  IFSC Code
                </label>
                <input
                  name="bank_details.ifsc_code"
                  value={oldData?.bank_details?.ifsc_code}
                  onChange={handleChange}
                  type="text"
                  id="ifsc_code"
                  placeholder="IFSC code"
                  className="bg-gray-200  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="acc_holder_name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Account holder name
                </label>
                <input
                  name="bank_details.acc_holder_name"
                  value={oldData?.bank_details?.acc_holder_name}
                  onChange={handleChange}
                  type="text"
                  id="acc_holder_name"
                  placeholder="account holder name"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>

              <div>
                <label
                  htmlFor="bank_name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Bank Name
                </label>
                <input
                  name="bank_details.bank_name"
                  value={oldData?.bank_details?.bank_name}
                  onChange={handleChange}
                  type="text"
                  id="bank_name"
                  placeholder="bank name"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="branch"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Branch
                </label>
                <input
                  name="bank_details.branch"
                  value={oldData?.bank_details?.branch}
                  onChange={handleChange}
                  type="text"
                  id="branch"
                  placeholder="branch"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>

            {error && <p className="text-red-900  text-[17px] mb-5">{error}</p>}
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

export default EditEmployee;
