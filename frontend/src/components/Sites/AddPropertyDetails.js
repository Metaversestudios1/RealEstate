import React, { useEffect, useState,useRef } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";

const AddPropertyDetails = () => {
  const [loader, setLoader] = useState(false);
  const [clients, setClients] = useState([]);
  const [agents, setAgents] = useState([]);
  const [siteid, setsiteid] = useState([]);
  const[totalValue,settotalValue] =useState(0);
  const [sitecount, setsitecount] = useState([]);
  const [payments, setPayments] = useState([{ amount: 0 }]); // Start with the first payment
  const [remainingBalance, setRemainingBalance] = useState(totalValue);
  const [isFirstUpdate, setIsFirstUpdate] = useState(0);
  const [oldamountpaid,setoldamoutpaid]=useState(0);
  const[index,setindex]=useState(0);
  const inputRef = useRef(null);

  // const handlePaymentChange = (index, value) => {
  //   const newPayments = [...payments];
  //   newPayments[index].amount = value;
  //   setPayments(newPayments);

  //   // Calculate remaining balance
  //   const totalPaid = newPayments.reduce((total, payment) => total + Number(payment.amount), 0);
  //   setRemainingBalance(totalValue - totalPaid);
  // }
 
const handleChangeAndValidate = (e, remainingAmount) => {
  const { name, value } = e.target;

  // Call your existing handleChange logic
  handleChange(e);

  // Validate the amount against the remaining amount
  const amount = parseFloat(value) || 0; // Convert the input value to a number

  if (amount > remainingAmount) {
    setError(`Amount cannot exceed remaining amount of ${remainingAmount}`);
  } else {
    setError(""); // Clear error if the validation passes
  }
};

  const [propertyName, setPropertyName] = useState("");
  const [error, setError] = useState("");
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();

  const initialState = {
    agentId: "",
    clientId: "",
    propertyDetailsstatus: "1",
    propertyDetails: {
      totalValue: "",
      amountPaid: "",
      balanceRemaining: "",
    },

    saleDeedDetails: {
      deedNumber: "",
      executionDate: "",
      buyer: "",
      seller: "",
      propertyDescription: "",
      saleAmount: "",
      witnesses: "",
      registrationDate: "",
    },
    payments:{
      amount:"",
      date:"",
    },
    index:""
  };
  const [data, setData] = useState(initialState);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentRes, clientRes] = await Promise.all([
          fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/getAllAgentproperty?sid=${id}`
          ),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getAllClient`),
        ]);

        const [agentData, clientData] = await Promise.all([
          agentRes.json(),
          clientRes.json(),
        ]);
        
        if (agentData.success) setAgents(agentData.result);
        if (clientData.success) setClients(clientData.result);
        setLoader(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchOldData();
  }, [id]);

  const validatesiteform = () => {
    $("#siteform").validate({
      rules: {
        totalValue: {
          required: true,
          number: true, // Ensures that only numbers (including decimals) are allowed
        },
        clientId: {
          required: true,
        },
        agentId: {
          required: true,
        },
        amountPaid: {
          required: true,
          number: true,
        },
        balanceRemaining: {
          required: true,
          number: true,
        },

        saleAmount: {
          number: true,
        },
      },
      messages: {
        totalValue: {
          required: "Please enter total value",
          number: "Please enter a valid number", // Custom message for number validation
        },
        amountPaid: {
          required: "Please enter amount paid",
          number: "Please enter a valid number", // Custom message for number validation
        },
        balanceRemaining: {
          required: "Please enter Balance remaining",
          number: "Please enter a valid number", // Custom message for number validation
        },
        saleAmount: {
          number: "Please enter a valid number", // Custom message for number validation
        },
        agentId: {
          required: "Please select agent",
        },
        clientId: {
          required: "Please select client",
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

    const updatedData = { ...data };
 
    // Check if the name corresponds to propertyDetails
    if (name in updatedData.propertyDetails) {
      updatedData.propertyDetails = {
        ...updatedData.propertyDetails,
        [name]: value, // Update the specific property first
      };
     
     settotalValue(updatedData.propertyDetails.totalAmount);
      const totalValue =
        parseFloat(updatedData.propertyDetails.totalValue) || 0;
  
      const amountPaid =
        parseFloat(updatedData.propertyDetails.amountPaid) || 0;
      
        if (isFirstUpdate==='0') {
          updatedData.propertyDetails.balanceRemaining = totalValue - amountPaid;
          
        } else {
          const currentBalance = updatedData.propertyDetails.amountPaid || 0;
          updatedData.propertyDetails.balanceRemaining = remainingBalance-amountPaid;
        }
    } else if (name in updatedData.saleDeedDetails) {
      updatedData.saleDeedDetails = {
        ...updatedData.saleDeedDetails,
        [name]: value, // Update only the specific property
      };
    } else {
      updatedData[name] = value; // Update top-level property
    }
    updatedData.index = index;
    // Update the state with the modified data
    setData(updatedData);
  };

  const fetchPropertyName = async (id) => {
    const nameRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getSingleProperty`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ id }),
      }
    );
    const propertyName = await nameRes.json();
    if (propertyName && propertyName.success && propertyName.result) {
      console.log(propertyName.result.propertyname);
      setPropertyName(propertyName.result.propertyname);
      return propertyName.result;
    } else {
      return "-"; // Return "Unknown" if data is not present
    }
  };
  const fetchOldData = async () => {
   
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getSingleSite`,
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
        setPayments(result.result?.payments)
        const propertyName = await fetchPropertyName(result.result?.propertyId);        
       
        const propertyDetails = result.result?.propertyDetails || {};
        const saleDeedDetails = result.result?.saleDeedDetails || {};
       
        setsitecount(result.result?.site_count);
        setIsFirstUpdate(result.result?.propertyDetailsstatus);
        const paymentsArray = result.result?.payments || [];
        const totalAmountPaid = paymentsArray.reduce((total, payment) => {
          return total + (payment.amount || 0); // Ensure that the amount is added safely
        }, 0);
        
        setoldamoutpaid(totalAmountPaid);
         setRemainingBalance(result.result?.propertyDetails.balanceRemaining)
        
        settotalValue(result.result?.propertyDetails.totalValue);
         setData({
          clientId: result.result?.clientId,
          agentId: result.result?.agentId,
          propertyDetailsstatus: "1",
          propertyDetails: {
            totalValue: propertyDetails.totalValue || "",
            amountPaid: propertyDetails.amountPaid || "",
            balanceRemaining: propertyDetails.balanceRemaining || "0",
          },
          saleDeedDetails: {
            deedNumber: saleDeedDetails.deedNumber || "",
            executionDate: formatDate(saleDeedDetails.executionDate),
            registrationDate: formatDate(saleDeedDetails.registrationDate),
            seller: saleDeedDetails.seller || "",
            saleAmount: saleDeedDetails.saleAmount || "",
            witnesses: saleDeedDetails.witnesses || "",
            buyer: saleDeedDetails.buyer || "",
           
          },
          index: index || "",
        });
      } else {
        console.error("No data found for the given parameter.");
      }
    } catch (error) {
      console.error("Failed to fetch old data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatesiteform()) {
      return;
    }
    try {
      setLoader(true);
      const updatedata = { id, data };
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/updateSite`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedata),
        }
      );
      const response = await res.json();
      if (response.success) {
        toast.success("Payment details updated Successfully for the site!", {
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

  const renderPaymentFields = () => {
    // Determine how many payments to display
    const numberOfPaymentsToDisplay = payments.length; // Set this to how many payments you want to show
  
    // If there are no payments, return a message or nothing
    if (numberOfPaymentsToDisplay === 0) {
      return <div>No payment records available.</div>;
    }
  
    return payments.slice(0, numberOfPaymentsToDisplay).map((payment, index) => {
      // Check if a payment exists for this index
      const paymentFound = payment.amount > 0; // Assuming amount > 0 indicates a payment exists
  
      return (
        <div key={index} className="space-y-2">
          {/* Display Amount and Date in a single row if payment exists */}
          {paymentFound ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span>Amount:</span>
                <span>{payment.amount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Date:</span>
                <span>{payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          ) : (
            // Display the label and input fields if no payment is found
            <>
              <div className="flex items-center space-x-4">
                <label
                  htmlFor={`payment-${index}`}
                  className="text-sm font-medium text-gray-900 dark:text-black"
                >
                  Payment {index + 1}
                  <span className="text-red-900 text-lg">&#x2a;</span>
                </label>
              </div>
  
              {/* Input fields */}
              <div className="w-full">
                <input
                  type="hidden"
                  name={`payment-${index}`}
                  value={index}
                  id={`payment-${index}`}
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black w-full"
                  required
                />
                <input
                  name="amountPaid"
                  ref={inputRef}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = Number(value);
  
                    // Ensure value is valid
                    if (numValue < 0 || numValue > remainingBalance) {
                      inputRef.current.value = ''; // Clear the input if invalid
                    } else if (value === "" || (numValue >= 1 && !isNaN(numValue))) {
                      handleChange(e); // Call handleChange if valid
                    }
                  }}
                  type="number"
                  id="amountPaid"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                  placeholder="Eg. 1200.."
                  onFocus={() => setindex(index)}
                />
              </div>
            </>
          )}
        </div>
      );
    });
  };
  
//   const renderPaymentFields = () => {
//     return payments.map((payment, index) => {
      
//       // Check if a payment exists for this index
//       const paymentFound = payment.amount > 0; // Assuming amount > 0 indicates a payment exists
//       return (
//         <div key={index} className="space-y-2">
//           {/* Display Amount and Date in a single row */}
//           {index > 0 && (
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <span>Amount:</span> 
//                 <span>{payments[index].amount}</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <span>Date:</span> 
//                 <span>{payments[index].date ? new Date(payments[index - 1].date).toLocaleDateString() : 'N/A'}</span>
//               </div>
//             </div>
//           )}
      
//           {/* Display the label in the same row */}
//           {/* Display the label in the same row */}
// {!paymentFound && (
 
//   <>
//     <div className="flex items-center space-x-4">
//       <label
//         htmlFor={`payment-${index}`}
//         className="text-sm font-medium text-gray-900 dark:text-black"
//       >
//         Payment {index + 1}
//         <span className="text-red-900 text-lg">&#x2a;</span>
//       </label>
//     </div>

//     {/* Input fields */}
//     <div className="w-full">
//       <input
//         type="hidden"
//         name={`payment-${index}`}
//         value={index}
//         id={`payment-${index}`}
//         className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black w-full"
//         required
//       />
//        <input
//         type="hidden"
//         name='index'
//         value={data.index}
//         id="index"
//         className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black w-full"
//         required
//       />
//       <input
//         name="amountPaid"
//           ref={inputRef} //
//       //    onChange={(e) => {
//       //   const value = e.target.value;
//       //   // Ensure the value is greater than 0
//       //   if (value >= 1) {
//       //     handleChange(e); // Only call handleChange if value is valid
//       //   }
//       // }}

//        onChange={(e) => {
//           const value = e.target.value; // Get the raw input value
//           const numValue = Number(value); // Convert to a number for comparison

//           // Check for negative values or values greater than remainingValue
//           if (numValue < 0) {
//             inputRef.current.value = ''; // Clear the input if the value is negative
//           } else if (numValue > remainingBalance) {
//             inputRef.current.value = ''; // Clear the input if it exceeds remaining value
//           } else if (value === "" || (numValue >= 1 && !isNaN(numValue))) {
//             handleChange(e); // Call handleChange if the value is valid
//           }
//         }}
//       // value
//         // onChange={handleChange}
//         type="number"
//         id="amountPaid"
//         className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
//         placeholder="Eg.1200.."
//         onFocus={() => setindex(index)}
//       />
//     </div>
//   </>
// )}

//         </div>
//       );
      
//      });
//   };
  

 
  useEffect(() => {
    if (remainingBalance > 0 && payments.length > 0 && payments[payments.length - 1].amount > 0) {
      setPayments((prevPayments) => [...prevPayments, { amount: 0 }]);
    }
  }, [payments, remainingBalance]);

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
            Site Payment details
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
          <form id="siteform">
            <label>
              <b>{propertyName}</b>   <b>{sitecount}</b>
            </label>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div className="my-2">
                <label
                  htmlFor="clientId"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Clients
                </label>
                <select
                  name="clientId"
                  value={data?.clientId}
                  onChange={handleChange}
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                >
                  <option value="">Select a client.</option>
                  {clients.map((option) => {
                    return (
                      <option
                        key={option?._id}
                        value={option?._id}
                        className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                        selected={option._id === data?.clientId}
                      >
                        {option?.clientname}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="my-2">
                <label
                  htmlFor="agentId"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Agents
                </label>
                <select
                  name="agentId"
                  value={data?.agentId}
                  onChange={handleChange}
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                   disabled={isFirstUpdate === '1'} 
               >
                  {agents.length === 0 ? (
                    <option value="">Assign property to agent first</option> // Show this option when no agents are available
                  ) : (
                    <>
                      <option value="">Select an agent.</option>
                      {agents.map((option) => (
                        <option
                          key={option?._id}
                          value={option?._id}
                          className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                          selected={option._id === data.agentId}
                        >
                          {option?.agentname}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {agents.length === 0 && (
                  <NavLink to={`/agents`}>
                    <button className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
                      <CiEdit className="inline mr-2" /> Assign Properties
                    </button>
                  </NavLink>
                )}
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="totalValue"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Total value
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="propertyDetailsstatus"
                  value={data.propertyDetailsstatus}
                  onChange={handleChange}
                  type="hidden"
                  id="propertyDetailsstatus"
                />
                <input
                  name="totalValue"
                  value={data.propertyDetails.totalValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Ensure the value is greater than 0
                    if (value >= 1) {
                      handleChange(e); // Only call handleChange if value is valid
                    }
                  }}
                  type="number"
                  id="totalValue"
                  disabled={isFirstUpdate === '1'} 
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="Eg.1234.."
                  min="1"
                  required
                />
              </div>
              {payments.length === 0 && ( // Check if the payments array is empty
  <div>
    <label
      htmlFor="amountPaid"
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
    >
      First Payment
      <span className="text-red-900 text-lg ">&#x2a;</span>
    </label>
    <input
      name="amountPaid"
       value={data.propertyDetails.amountPaid}
     ref={inputRef}
      onChange={(e) => {
        const value = e.target.value;
        const numValue = Number(value); // Convert to a number for comparison

        // Check for negative values or values greater than totalValue
        if (numValue < 1) {
          // Prevent invalid input for values less than 1
          inputRef.current.value = ''; // Optionally clear the input
      } else if (numValue > data.propertyDetails.totalValue) {
          // Prevent invalid input for values greater than totalValue
          inputRef.current.value = ''; // Optionally clear the input
      } else {
          handleChange(e); // Call handleChange if the value is valid
      }
      
      }}
      type="number"
      id="amountPaid"
      className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
      placeholder="Eg. 1200.."
      required
      min="1"
    />
  </div>
)}

              <div className="grid gap-6 mb-6 md:grid-cols-1 items-center">
        {renderPaymentFields()} {/* Dynamically render payment fields */}
      </div>
              
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="balanceRemaining"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Balance Remaining
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="balanceRemaining"
                  value={data.propertyDetails.balanceRemaining}
                  onChange={handleChange}
                  type="text"
                  disabled
                  id="balanceRemaining"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="Eg.100.."
                  required
                />
              </div>
            </div>
            <label>
              <b>Sales Deed Details</b>
            </label>
            &ensp; &ensp;
            <br></br>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="deedNumber"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Deed Number
                </label>
                <input
                  name="deedNumber"
                  value={data.saleDeedDetails.deedNumber}
                  onChange={handleChange}
                  type="text"
                  id="deedNumber"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="Eg.ABCD"
                />
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="executionDate"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Execution Date
                </label>
                <input
                  name="executionDate"
                  value={data.saleDeedDetails.executionDate}
                  onChange={handleChange}
                  type="date"
                  id="executionDate"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="Enter execution date"
                />
              </div>
              <div>
                <label
                  htmlFor="buyer"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Buyer
                </label>
                <input
                  name="buyer"
                  value={data.saleDeedDetails.buyer}
                  onChange={handleChange}
                  type="text"
                  id="buyer"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="Eg.MR.John"
                />
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="saleAmount"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Sale Amount
                </label>
                <input
                  name="saleAmount"
                  value={data.saleDeedDetails.saleAmount}
                  onChange={handleChange}
                  type="text"
                  id="saleAmount"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="Eg.200"
                />
              </div>
              <div>
                <label
                  htmlFor="witnesses"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Witnesses
                </label>
                <input
                  name="witnesses"
                  value={data.saleDeedDetails.witnesses}
                  onChange={handleChange}
                  type="text"
                  id="witnesses"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="Jane Smith"
                />
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="seller"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Seller
                </label>
                <input
                  name="seller"
                  value={data.saleDeedDetails.seller}
                  onChange={handleChange}
                  type="text"
                  id="seller"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="MR.John"
                />
              </div>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Update
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddPropertyDetails;
