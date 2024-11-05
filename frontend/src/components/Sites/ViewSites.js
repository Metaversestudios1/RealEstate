import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";
import * as XLSX from "xlsx";
import Modal from "react-modal";

const AddPropertyDetails = () => {
  const [loader, setLoader] = useState(false);
  const [payments, setPayments] = useState([{ amount: 0 }]);
  const [clients, setClients] = useState([]);
  const [agents, setAgents] = useState([]);
  const [totalValue, settotalValue] = useState(0);
  const [siteid, setsiteid] = useState([]);
  const [clientName, setClientName] = useState("");
  const [agentName, setAgentName] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [error, setError] = useState("");
  const params = useParams();
  const [commission, setCommission] = useState([]);
  const { id } = params;
  const navigate = useNavigate();
  const [remainingBalance, setRemainingBalance] = useState(totalValue);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const initialState = {
    agentId: "",
    clientId: "",
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
  };
  const [data, setData] = useState(initialState);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentRes, clientRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getSingleAgent`),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getAllClient`),
        ]);

        const [agentData, clientData] = await Promise.all([
          agentRes.json(),
          clientRes.json(),
        ]);
        console.log(agentData.result);
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
        setPayments(result.result?.payments);
        const propertyName = await fetchPropertyName(result.result?.propertyId);
        const propertyDetails = result.result?.propertyDetails || {};
        const saleDeedDetails = result.result?.saleDeedDetails || {};
        const fetchedClientId = result.result?.clientId;
        const fetchedAgentId = result.result?.agentId;
        setRemainingBalance(result.result?.propertyDetails.balanceRemaining);

        setData({
          clientId: fetchedClientId,
          agentId: fetchedAgentId,
          propertyDetails: {
            totalValue: propertyDetails.totalValue || "",
            amountPaid: propertyDetails.amountPaid || "",
            balanceRemaining: propertyDetails.balanceRemaining || "",
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
        });
        fetchClientAndAgentNames(fetchedClientId, fetchedAgentId);
      } else {
        console.error("No data found for the given parameter.");
      }
    } catch (error) {
      console.error("Failed to fetch old data:", error);
    }
  };

  const fetchClientAndAgentNames = async (clientId, agentId) => {
    try {
      const clientResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getSingleClient`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: clientId }),
        }
      );
      const clientResult = await clientResponse.json();
      if (clientResult.success) {
        setClientName(clientResult.result?.clientname); // Adjust based on the response structure
      }

      const agentResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getSingleAgent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: agentId }),
        }
      );
      const agentResult = await agentResponse.json();
      if (agentResult.success) {
        setAgentName(agentResult.result); // Adjust based on the response structure
      }
    } catch (error) {
      console.error("Error fetching client and agent names:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

//   function downloadExcel() {
//     const table = document.getElementById("sitetable");
//     const allDataRows = [];

//     if (!table) {
//         console.error("Table not found.");
//         return;
//     }

//     const headers = Array.from(table.querySelectorAll("thead th"));
//     if (headers.length === 0) {
//         console.error("No headers found in the table.");
//         return;
//     }

//     // Process each row in the table body
//     const rows = table.querySelectorAll("tbody tr");
//     rows.forEach((row) => {
//         const rowData = {};
//         const cells = row.querySelectorAll("td");

//         // Capture data only for columns that have headers
//         for (let index = 0; index < headers.length; index++) {
//             const columnHeader = headers[index]?.innerText || `Column${index + 1}`;

//             if (cells[index]) {
//                 // Handle payments column
//                 if (columnHeader.toLowerCase() === "payments" && cells[index].querySelector(".payments")) {
//                     const payments = cells[index].querySelectorAll(".payments div");
//                     let paymentDetails = [];

//                     payments.forEach((payment, idx) => {
//                         const amount = payment.querySelector(".amount")?.innerText || "N/A";
//                         const date = payment.querySelector(".date")
//                             ? new Date(payment.querySelector(".date").innerText).toLocaleDateString()
//                             : "N/A";

//                         paymentDetails.push(`Payment ${idx + 1}:\n  Amount: ${amount}\n  Date: ${date}`);
//                     });

//                     rowData["Payments"] = paymentDetails.join("\n\n"); // Use double line breaks for clearer spacing
//                 }
//                 // Handle commission column
//                 else if (columnHeader.toLowerCase() === "commission") {
//                     const commission = cells[index]?.innerText.trim() || "N/A";
//                     rowData["Commission"] = commission; // Add commission to row data
//                 } else {
//                     rowData[columnHeader] = cells[index]?.innerText.trim() || "N/A";
//                 }
//             }
//         }

//         if (Object.keys(rowData).length > 0) {
//             allDataRows.push(rowData);
//         }
//     });

//     // Add two blank rows at the beginning of the data if needed
//     if (allDataRows.length >= 2) {
//         allDataRows.splice(1, 0, {}); // Insert a blank row at the second position
//     }

//     const worksheet = XLSX.utils.json_to_sheet(allDataRows);
//     const workbook = XLSX.utils.book_new();

//     // Adjust column widths, especially for the "Payments" and "Commission" columns
//     worksheet["!cols"] = headers.map((header, index) => {
//         const headerLower = header.innerText.toLowerCase();
//         return headerLower === "payments" || headerLower === "commission" ? { wch: 40 } : { wch: 20 };
//     });

//     XLSX.utils.book_append_sheet(workbook, worksheet, "Site Report");
//     XLSX.writeFile(workbook, "Sitereport.xlsx");
// }

  
function downloadExcel() {
  const table = document.getElementById("sitetable"); // Your table ID
  const allDataRows = []; // This will hold all the table rows data

  // Get all rows from the table body (skip the header)
  const rows = table.querySelectorAll("tbody tr"); // Adjust selector if your table structure is different

  rows.forEach((row) => {
    const rowData = {};
    const cells = row.querySelectorAll("td"); // Get all cells in the current row
    const totalCells = cells.length;

    // Loop through cells except the last two
    for (let index = 0; index < totalCells ; index++) {
      if (index === 10) {
        continue; // Skip this iteration for the 12th column (index 11)
      }
      // Assuming you have predefined column headers
      const columnHeader =
        table.querySelectorAll("thead th")[index].innerText; // Get header name
      rowData[columnHeader] = cells[index].innerText; // Set the cell data with the header name as key
    }
    allDataRows.push(rowData); // Add row data to allDataRows array
  });

  // Create a new workbook and a worksheet
  const worksheet = XLSX.utils.json_to_sheet(allDataRows);
  const workbook = XLSX.utils.book_new();

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Site Report");

  // Generate Excel file and prompt for download
  XLSX.writeFile(workbook, "payoutsreport.xlsx");
}
  const fetchCommission = async (index) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getAgentCommition`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, index }), // Ensure 'id' is defined and passed correctly
        }
      );

      const result = await response.json();
      if (result.success) {
        console.log(result.result);
        setCommission((prev) => ({ ...prev, [index]: result.result }));
      } else {
        console.error("Failed to fetch commission data:", result.message);
      }
    } catch (error) {
      console.error("Error fetching commission data:", error);
    }
  };

  const renderAgentDataInTable = (agents, index) => {
    return <></>;
  };

  useEffect(() => {
    payments.forEach((payment, index) => {
      if (payment.amount > 0) {
        fetchCommission(index); // Only fetch if payment amount is greater than 0
      }
    });
  }, [payments]);

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
          <div className="text-2xl font-bold mx-2 my-8 px-4">Site details</div>
        </div>
      </div>
      <div className="flex justify-between">
        {/* <NavLink to="/sites/addSite/">
          <button className="bg-blue-800 text-white p-3 m-5 text-sm rounded-lg">
            Add New
          </button>
        </NavLink> */}

        <div className="flex">
          <button
            onClick={downloadExcel}
            className="bg-blue-800 text-white p-3 m-5 text-sm rounded-lg"
          >
            Download Excel
          </button>
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
        <div className="w-[100%] m-auto my-10">
          <div className="relative overflow-x-auto m-5 mb-0">
            <table
              id="sitetable"
              className="w-full text-sm text-left rtl:text-right border-2 border-gray-300"
            >
              <thead className="text-xs uppercase bg-gray-200">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Property Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Client Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Agent Name
                  </th>
                  {/* <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Site Number
                </th> */}
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Total Value
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Amount Paid
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Balance Remaning
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Payments
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Payments Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Payments Date
                  </th>{" "}
                  <th style={{ display: 'none' }}> Commissions</th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Commissions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Deed Number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Execution Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Buyer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Sale Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Witnesses
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    seller
                  </th>
                </tr>
              </thead>

              <tbody>
                {" "}
                {payments.map((payment, index) => {
                  const paymentFound = payment.amount > 0;
                  const commissionData = commission[index]; // Get commission data for this index

                  // fetchCommission(index);
                  return (
                    <tr className="bg-white">
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                      >
                        {propertyName}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                      >
                        {clientName}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                      >
                        {agentName?.agentname}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                      >
                        {data.propertyDetails.totalValue}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                      >
                        {data.propertyDetails.amountPaid}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300 w-[300px]"
                      >
                        {data.propertyDetails.balanceRemaining}
                      </td>
                      <td className="border px-2 py-1">
                        {`Payment ${index + 1}`}
                      </td>
                      <td className="border px-2 py-1">
                        {payment.amount || "N/A"}
                      </td>
                      <td className="border px-2 py-1">
                        {payment.date
                          ? new Date(payment.date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      



    <td style={{ display: 'none' }}
    key={index}
    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
  >
    {/* Render commission data */}
    {commissionData ? (
      <div>
        {commissionData.map((commission, idx) => (
          <div key={idx}>
            {/* Display agent name and agent ID directly from the commission object */}
            <div className="mb-2">
              <br />
              <h3 className="text-lg font-bold mb-2">
                {idx === 0 ? (
                  <h3 className="text-lg font-bold mb-2">
                    Booking Agent Commission
                  </h3>
                ) : (
                  idx === 1 && (
                    <h3 className="text-lg font-bold mb-2">
                      Other Agent Commission
                    </h3>
                  )
                )}
              </h3>
              <strong>Agent Name:</strong>{" "}
              {commission.agentname} <br />
              <strong>Agent ID:</strong>{" "}
              {commission.agent_id}
            </div>
            Amount: {commission.amount}, Percentage:{" "}{commission.percentage} %,
            TDS Deduction: {commission.tdsDeduction}, Percentage: 5%
             Date:{" "}
            {commission.date?.split("T")[0]}
            <br />
          </div>
        ))}
      </div>
    ) : (
      <span>No commission data</span>
    )}
  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300">
      <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded">
        View Commission Details
      </button>

      {/* Modal for commission details */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Commission Details"
        className="bg-white p-6 rounded shadow-lg max-w-lg mx-auto my-10 border  max-h-[80vh] overflow-x-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-2xl font-bold mb-4">Commission Details</h2>
        {commissionData ? (
          <div>
            {commissionData.map((commission, idx) => (
              <div key={idx} className="mb-4">
                {idx === 0 && <h3 className="text-lg font-bold mb-2">Booking Agent Commission</h3>}
                {idx === 1 && <h3 className="text-lg font-bold mb-2">Other Agent Commission</h3>}
                
                <div><strong>Agent Name:</strong> {commission.agentname}</div>
                <div><strong>Agent ID:</strong> {commission.agent_id}</div>
                <div><strong>Amount:</strong> {commission.amount}</div>
                <div><strong>Percentage:</strong> {commission.percentage}%</div>
                <div><strong>TDS Deduction:</strong> {commission.tdsDeduction} %</div>
                <div><strong>Date:</strong> {commission.date?.split("T")[0]}</div>
              </div>
            ))}
          </div>
        ) : (
          <span>No commission data available</span>
        )}

        <button onClick={closeModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </Modal>
    </td>

                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                      >
                        {data.saleDeedDetails.deedNumber}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                      >
                        {data.saleDeedDetails.executionDate}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                      >
                        {data.saleDeedDetails.buyer}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                      >
                        {data.saleDeedDetails.saleAmount}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                      >
                        {data.saleDeedDetails.witnesses}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                      >
                        {data.saleDeedDetails.seller}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPropertyDetails;
