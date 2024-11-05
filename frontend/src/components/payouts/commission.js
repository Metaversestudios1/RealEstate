import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";
import * as XLSX from "xlsx";

const Commission = () => {
  const [loader, setLoader] = useState(false);
  const [commission, setcommission] = useState([]); // Initialize as an empty array

  const navigate = useNavigate();

  const [agent, setAgent] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    // You can set initial values to empty or a specific date format
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format to YYYY-MM-DD

    setStartDate(formattedDate); // Optional: Set a specific date
    setEndDate(formattedDate); // Optional: Set to the same date
  }, []); // Empty dependency array to run only once on mount

  // Call fetchOldData when startDate or endDate changes
  useEffect(() => {
    if (startDate && endDate) {
      fetchOldData();
    }
  }, [startDate, endDate]);
  const fetchsite = async (id) => {
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
            //console.log(result.result)       
             const propertyName = await fetchPropertyName(result.result.propertyId)
             //console.log('property name',propertyName);
             return propertyName;
       } else {
          console.error("No data found for the given parameter.");
        }
      } catch (error) {
        console.error("Failed to fetch old data:", error);
      }
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
        //console.log('property name',propertyName.result.propertyname)
       return propertyName.result.propertyname;
    } else {
      return "-"; // Return "Unknown" if data is not present
    }
  };

  const fetchOldData = async () => {
    console.log("Fetching data from", startDate, "to", endDate);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getAllAgent?startDate=${startDate}&endDate=${endDate}`
      );
      const result = await response.json();
      if (result.success && result.result) {
        if (result.success && result.result) {
            const allAgent = result.result;
            const start = new Date(startDate); // Define startDate and endDate as needed
            const end = new Date(endDate);
      
            const allAgentsWithFilteredCommissions = await Promise.all(
              result.result.map(async (agent) => {
                const updatedCommissions = await Promise.all(
                  (agent.commissions || []).map(async (commission) => {
                    const commissionDate = new Date(commission.date);
                    const normalizedCommissionDate = new Date(
                      commissionDate.getFullYear(),
                      commissionDate.getMonth(),
                      commissionDate.getDate()
                    );
                    const normalizedStartDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                    const normalizedEndDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      
                    // Filter by date range
                    if (normalizedCommissionDate >= normalizedStartDate && normalizedCommissionDate <= normalizedEndDate) {
                      const siteId = commission.siteId;
      
                      // Fetch property name if siteId exists
                      if (siteId) {
                        const propertyName = await fetchsite(siteId);
                        console.log(propertyName);
                        return { ...commission, propertyName }; // Add property name to each commission
                      }
                    }
      
                    return null; // Return null for commissions outside the date range
                  })
                );
      
                // Filter out null values from commissions array
                const filteredCommissions = updatedCommissions.filter((commission) => commission !== null);
                return { ...agent, commissions: filteredCommissions }; // Replace commissions with updated array
              })
            );
      
            setAgent(allAgentsWithFilteredCommissions);
          
           // setPayments(allPayments); // Set payments state
          } else {
            console.error("No data found for the given parameter.");
          }

      } else {
        console.error("No data found for the given parameter.");
      }
    } catch (error) {
      console.error("Failed to fetch old data:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

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
          <div className="text-2xl font-bold mx-2 my-8 px-4">Booking Amounts</div>
        </div>
      </div>
      <div className="flex justify-center">
        {/* Date Filters */}
        <div className={`flex items-center`}>
          <label htmlFor="fromDate">From Date:</label>
          <input
            type="date"
            value={startDate}
            id="startDate"
            onChange={(e) => setStartDate(e.target.value)} // Update state on change
            className={`text-black border-[1px] rounded-lg bg-white p-2 m-5`}
          />
        </div>
        <div className={`flex items-center`}>
          <label htmlFor="toDate">To Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)} // Update state on change
            className={`text-black border-[1px] rounded-lg bg-white p-2 m-5`}
   />
        </div>
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
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                    Property Name
                  </th>
                  <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                    Agent Name
                  </th>
                  <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                    Agent Id
                  </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                    Commission Amount
                  </th>
                  <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Commission Percentage(%)
                  </th>
                 
                  <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                    TDS deduction
                  </th>
                  <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                    Commission Date 
                  </th>
                </tr>
              </thead>

              <tbody>
          {agent.flatMap((agents) => 
            agents.commissions.map((commissions, index) => (
              <tr key={`${commissions._id}-${index}`}>      
               <td className="border border-gray-300 px-4 py-2">{commissions.propertyName}</td>
                <td className="border border-gray-300 px-4 py-2">{agents.agentname}</td>
                <td className="border border-gray-300 px-4 py-2">{agents.agent_id}</td>
                <td className="border border-gray-300 px-4 py-2">{commissions.amount}</td>
                <td className="border border-gray-300 px-4 py-2">{commissions.percentage} % </td>
                <td className="border border-gray-300 px-4 py-2">{commissions.tdsDeduction}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(commissions.date).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default Commission;
