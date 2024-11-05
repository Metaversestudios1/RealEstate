import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoKebabHorizontal } from "react-icons/go";
import * as XLSX from "xlsx";

const Agent = () => {
  const [agents, setAgents] = useState([]);
  const [noData, setNoData] = useState(false);
  const [loader, setLoader] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [activePropertyId, setActivePropertyId] = useState(null);
  useEffect(() => {
    fetchData();
  }, [page, search, pageSize]);

  const fetchData = async () => {
    setLoader(true);
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getAllAgent?page=${page}&limit=${pageSize}&search=${search}`
    );
    const response = await res.json();

    if (response.success) {
      setNoData(false);
      if (response.result.length === 0) {
        setNoData(true);
      }
      const agentsWithDetails = await fetchClientAndPropertyDetails(
        response.result
      );
      console.log(agentsWithDetails);
      setAgents(agentsWithDetails);
      setCount(response.count);
      setLoader(false);
    }
  };

  // Function to fetch client and property names using their IDs
  const fetchClientAndPropertyDetails = async (agents) => {
    const updatedAgents = await Promise.all(
      agents.map(async (agent) => {
        const clientsNames = await fetchNamesByIds(
          agent.clients,
          "/api/getSingleClient"
        );
        const propertiesNames = await fetchNamesByIds(
          agent.properties,
          "/api/getSingleProperty"
        );
        const rankName = await fetchRankById(agent.rank); // Fetch the rank name here
        const superiorAgentName = await fetchSuperiorAgentById(agent.superior);

        return {
          ...agent,
          clients: clientsNames,
          properties: propertiesNames,
          rank: rankName.name, // Update rank with fetched rank name
          commission:rankName.commissionRate,
          superiorAgent: superiorAgentName, // Add the fetched superior agent name
     
        };
      })
    );

    return updatedAgents;
  };

  const fetchRankById = async (rankId) => {
    if (!rankId) return null;
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getSingleRank`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rankId }),
      }
    );
    const response = await res.json();
    console.log(response);
    if (response.success) {
      return response.result; // Assuming the rank name is in `result.rankname`
    }
    return null;
  };

  const fetchSuperiorAgentById = async (superiorId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getSingleAgent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: superiorId }),
      });
      const result = await response.json();
      if (result.success) {
        return result.result.agentname; // Assuming the agent name is stored in result.agent.name
      }
      return null;
    } catch (error) {
      console.error("Error fetching superior agent:", error);
      return null;
    }
  };
  // Helper function to fetch names using IDs
  const fetchNamesByIds = async (ids, apiUrl) => {
    if (!ids || ids.length === 0) return [];
    const promises = ids.map(async (id) => {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}${apiUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const response = await res.json();
      console.log(response);
      if (response.success && apiUrl === "/api/getSingleProperty") {
        return response.result.propertyname; // Assuming the response contains `result.name`
      }
      if (response.success && apiUrl === "/api/getSingleClient") {
        return response.result.clientname; // Assuming the response contains `result.name`
      }
      return null;
    });
    const names = await Promise.all(promises);
    return names.filter((name) => name !== null); // Filter out null values (failed requests)
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    const permissionOfDelete = window.confirm(
      "Are you sure, you want to delete the user"
    );
    if (permissionOfDelete) {
      let agentOne = agents.length === 1;
      if (count === 1) {
        agentOne = false;
      }
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/deleteAgent`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const response = await res.json();
      if (response.success) {
        toast.success("Employee is deleted Successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        if (agentOne) {
          setPage(page - 1);
        } else {
          fetchData();
        }
      }
    }
  };
  const handleKebabClick = (propertyId) => {
    // Toggle the kebab menu for the clicked row
    setActivePropertyId(activePropertyId === propertyId ? null : propertyId);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "search") {
      setSearch(value);
      setPage(1);
    }
    if (name === "pageSize") {
      setPageSize(parseInt(value, 10)); // Convert value to a number
      setPage(1);
    }
  };

  function downloadExcel() {
    const table = document.getElementById("agenttable"); // Your table ID
    const allDataRows = []; // This will hold all the table rows data

    // Get all rows from the table body (skip the header)
    const rows = table.querySelectorAll("tbody tr"); // Adjust selector if your table structure is different

    rows.forEach((row) => {
      const rowData = {};
      const cells = row.querySelectorAll("td, th"); // Get all cells in the current row
      const totalCells = cells.length;

      // Loop through cells excluding the first column (Sr no.) and the last column (Action)
      for (let index = 1; index < totalCells - 2; index++) {
        // Start from index 1 to skip Sr no.
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agent Report");

    // Generate Excel file and prompt for download
    XLSX.writeFile(workbook, "Agentreport.xlsx");
  }

  const handleStatusChange = async (id, newStatus) => {
    let status = "Inactive"; // changed to let
    if (newStatus === 0) {
      status = "Activate";
    }
    const permissionOfDelete = window.confirm(`Are you sure you want to ${status} the Agent?`);
    if (permissionOfDelete) {
      let projectOne = agents.length === 1;
      if (count === 1) {
        projectOne = false;
      }
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updatestatus/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });

        const response = await res.json(); // Awaiting the response to parse it
        if (response.success) {
          toast.success(`Agent ${status} Successfully!`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          if (projectOne) {
            setPage(page - 1);
          } else {
            fetchData();
          }
        }
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status');
      }
    }
  };
  const startIndex = (page - 1) * pageSize;

  return (
    <div className="relative">
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
        <div className="text-2xl font-bold mx-2 my-8 px-4">Agents List</div>
      </div>
      <div className="flex justify-between">
        <NavLink to="/agents/addagent">
          <button className="bg-blue-800 text-white p-3 m-5 text-sm rounded-lg">
            Add New
          </button>
        </NavLink>

        <div className={`flex items-center`}>
          <input
            placeholder="Search "
            type="text"
            name="search"
            value={search}
            onChange={handleChange}
            className={`text-black border-[1px] rounded-lg bg-white p-2 m-5`}
          />
        </div>
        <div className={` flex `}>
          <select
            type="text"
            name="pageSize"
            value={pageSize}
            onChange={handleChange}
            className={`text-black border-[1px] rounded-lg bg-white p-2 m-5`}
          >
            <option value="">select Limit</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
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

      {loader && (
        <div className="absolute h-full w-full -top-24 flex justify-center items-center">
          <div
            className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] "
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}
      <div className="relative overflow-x-auto m-5 mb-0 min-h-[430px]">
        {agents.length > 0 && (
          <table
            id="agenttable"
            className="w-full text-sm text-left rtl:text-right border-2 border-gray-300 "
          >
            <thead className="text-xs uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Sr no.
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Agent Name
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Superior Agent
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Commission Rate(%)
                </th>                
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  agent id
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  rank
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  properties
                </th>

                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Assign Property
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                 Status
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {agents.map((item, index) => (
                <tr key={item?._id} className="bg-white">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                  >
                    {startIndex + index + 1}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                  >
                    {item?.agentname}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                  >
                    {item?.superiorAgent}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                  >
                    {item?.commission} %
                  </th>
                  
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.agent_id}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.rank}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.properties.join(", ") || "N/A"}
                  </td>

                  <td className="px-6 py-4 border-2 border-gray-300">
                    <NavLink to={`/assignproperties/${item._id}`}>
                      <button className=" bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
                        <CiEdit className="inline mr-2" /> Assign Properties
                      </button>
                    </NavLink>
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                  >
                    {item?.status === 0 ? (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleStatusChange(item._id, 0)}
                      >
                        Activate
                      </button>
                    ) : (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleStatusChange(item._id, 1)}
                      >
                        Inactive
                      </button>
                    )}
                    &ensp;
                                        
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300 ">
                    <div className="flex justify-center relative">
                      <GoKebabHorizontal
                        className="text-lg transform rotate-90 cursor-pointer "
                        onClick={() => handleKebabClick(item._id)}
                      />
                      {activePropertyId === item._id && (
                        <div className="absolute z-50 right-12 top-2 mt-2 w-28 bg-white border border-gray-200 shadow-lg rounded-md">
                          <NavLink to={`/hierarchy/${item._id}`}>
                            <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                              <CiEdit className="inline mr-2" /> Hierarchy
                            </button>
                          </NavLink>
                          {/* <button
                            onClick={(e) => handleDelete(e, item._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <MdDelete className="inline mr-2" /> Delete
                          </button> */}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {noData && (
        <div className="text-center text-xl">
          Currently! There are no agents in the storage.
        </div>
      )}

      {agents.length > 0 && (
        <div className="flex flex-col items-center my-10">
          <span className="text-sm text-black">
            Showing{" "}
            <span className="font-semibold text-black">{startIndex + 1}</span>{" "}
            to{" "}
            <span className="font-semibold text-black">
              {Math.min(startIndex + pageSize, count)}
            </span>{" "}
            of <span className="font-semibold text-black">{count}</span> Entries
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={
                agents.length < pageSize || startIndex + pageSize >= count
              }
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agent;
