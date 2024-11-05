import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { GoKebabHorizontal } from "react-icons/go";
import "react-toastify/dist/ReactToastify.css";
import { MdEdit } from "react-icons/md";
import * as XLSX from "xlsx";
import getUserFromToken from "../utils/getUserFromToken";

const Sites = () => {
  const userInfo = getUserFromToken();
  const [sites, setSites] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [noData, setNoData] = useState(false);
  const [loader, setLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Default page size
  const [paginatedSites, setPaginatedSites] = useState([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [activePropertyId, setActivePropertyId] = useState(null); // For kebab menu popup
  const params = useParams();
  const [filter, setfilter] = useState("");
  const { id } = params;
  const fetchClient = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getSingleClient`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userInfo?.id }),
      }
    );
    const response = await res.json();
    return response?.result;
  };
  const fetchClientName = async (id) => {
    const nameRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getSingleClient`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ id }),
      }
    );
    const clientName = await nameRes.json();
    return (clientName?.success && clientName?.result?.clientname) || "-";
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
    return (propertyName?.success && propertyName?.result?.propertyname) || "-";
  };

  const fetchAgentData = async (agentId) => {
    const agentRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getSingleAgent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: agentId }),
      }
    );
    const agentData = await agentRes.json();
    if (agentData.success) {
      return agentData.result;
    } else {
      return null; // Handle no agent data found
    }
  };

  const fetchAllSites = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getAllSitesWithoutPagination`
    );
    const siteData = await res.json();
    if (siteData.success) {
      return siteData.result;
    }
    return [];
  };
  const fetchData = async () => {
    setLoader(true);
    setSites([]);

    try {
      if (userInfo.role === "agent") {
        // Agent specific logic
        const agentData = await fetchAgentData(userInfo.id);

        if (
          agentData &&
          agentData.properties &&
          agentData.properties.length > 0
        ) {
          const agentProperties = agentData.properties.map(
            (property) => property
          );

          const allSites = await fetchAllSites();

          let sitesForAgent = [];
          console.log(allSites);
          agentProperties.forEach((property) => {
            const matchingSites = allSites.filter(
              (site) => site.propertyId === property
            );
            sitesForAgent = [...sitesForAgent, ...matchingSites];
          });

          let filteredSites = sitesForAgent;

          if (filter === "recent") {
            filteredSites = filteredSites.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
          } else if (filter === "oldest") {
            filteredSites = filteredSites.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
          } else if (filter === "Available") {
            filteredSites = filteredSites.filter(
              (site) => site.status === "Available"
            );
          } else if (filter === "Booked") {
            filteredSites = filteredSites.filter(
              (site) => site.status === "Booked"
            );
          } else if (filter === "Completed") {
            filteredSites = filteredSites.filter(
              (site) => site.status === "Completed"
            );
          }

          const sitesWithDetails = await Promise.all(
            filteredSites.map(async (site) => {
              let propertyName = "-";
              let clientName = "-";
              if (site.propertyId) {
                propertyName = await fetchPropertyName(site.propertyId);
              }
              if (site.clientId) {
                clientName = await fetchClientName(site.clientId);
              }

              return {
                ...site,
                propertyName,
                clientName,
              };
            })
          );
          setSites(sitesWithDetails);
          setCount(sitesWithDetails.length);
          setNoData(sitesWithDetails.length === 0);
          updatePaginatedSites();
        }
      } else if (userInfo.role === "client") {
        // Client specific logic
        const clientData = await fetchClient();
        if (clientData && clientData.bookedProperties) {
          const bookedProperties = clientData.bookedProperties; // This should be an array of booked property IDs

          // Fetch all sites
          const allSites = await fetchAllSites();
          console.log(allSites);
          let sitesForClient = [];
          // Filter sites that match the booked property IDs or where the client_id matches the userInfo.id
          const matchingSites = allSites.filter((site) => {
            return (
             ( bookedProperties === site.propertyId) ||
              (site.clientId === userInfo.id)
            ); // Only return sites that match either condition
          });
          console.log(matchingSites);
          sitesForClient = [...sitesForClient, ...matchingSites];
          let filteredSites = sitesForClient;

          // Apply filters based on the selected filter criteria
          if (filter === "recent") {
            filteredSites = filteredSites.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
          } else if (filter === "oldest") {
            filteredSites = filteredSites.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
          } else if (filter === "Available") {
            filteredSites = filteredSites.filter(
              (site) => site.status === "Available"
            );
          } else if (filter === "Booked") {
            filteredSites = filteredSites.filter(
              (site) => site.status === "Booked"
            );
          } else if (filter === "Completed") {
            filteredSites = filteredSites.filter(
              (site) => site.status === "Completed"
            );
          }

          // Fetch property names for the filtered sites
          const sitesWithDetails = await Promise.all(
            filteredSites.map(async (site) => {
              let propertyName = "-";
              let clientName = "-";
              if (site.propertyId) {
                propertyName = await fetchPropertyName(site.propertyId);
              }
              if (site.clientId) {
                clientName = await fetchClientName(site.clientId);
              }

              return {
                ...site,
                propertyName,
                clientName,
              };
            })
          );
          setSites(sitesWithDetails);
          setCount(sitesWithDetails.length);
          setNoData(sitesWithDetails.length === 0);
          updatePaginatedSites();
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoader(false);
    }
  };
  // const fetchCommission = async()=>{
  //   const res = await fetch(
  //     `${process.env.REACT_APP_BACKEND_URL}/api/getAllAgent`
  //   );
  //   const siteData = await res.json();
  // }
  // Fetch data when component mounts or relevant dependencies change

  const fetchCommssion = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getSingleAgent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userInfo?.id }),
      }
    );
    const response = await res.json();
    if (response.success) {
      setCommissions(response.result.commissions);
    }
  };
  useEffect(() => {
    fetchData();
    fetchCommssion();
    // fetchCommission()
  }, [currentPage, search, filter, pageSize]);
  const updatePaginatedSites = () => {
    const filteredSites = sites.filter((site) => {
      const siteName = site.propertyName ? site.propertyName.toLowerCase() : ""; // Safeguard for undefined
      const includesSearchTerm = siteName.includes(search.toLowerCase());

      return includesSearchTerm; // Only return sites that match the search term
    });

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    if (filteredSites.length === 0) {
      setNoData(false);
      setPaginatedSites([]); // Clear paginatedSites when no results are found
    } else {
      setPaginatedSites(filteredSites.slice(startIndex, endIndex));
    }
  };

  // Update paginated data when sites, currentPage, or pageSize change
  useEffect(() => {
    updatePaginatedSites();
  }, [sites, currentPage, pageSize]);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === "next") return prev + 1;
      if (direction === "prev") return Math.max(prev - 1, 1);
      return prev; // Return current page if no direction is specified
    });
  };
  // const handleKebabClick = (propertyId) => {
  //   // Toggle the kebab menu for the clicked row
  //   setActivePropertyId(activePropertyId === propertyId ? null : propertyId);
  // };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    updatePaginatedSites(); // Call this to update the filtered sites immediately
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "search") {
      setSearch(value);
      setCurrentPage(1);
    }
    if (name === "filter") {
      setfilter(value);
      setCurrentPage(1);
    }
    if (name === "pageSize") {
      setPageSize(parseInt(value, 10)); // Convert value to a number
      setCurrentPage(1);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const permissionOfDelete = window.confirm(
      `Are you sure you want change status of the site ${newStatus}?`
    );
    if (permissionOfDelete) {
      let projectOne = sites.length === 1;
      if (count === 1) {
        projectOne = false;
      }
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/updatesitestatus/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          }
        );
        const response = await res.json();
        if (response.success) {
          if (newStatus === "Completed") {
            toast.success(`Site Completed Successfully!`, {
              position: "top-right",
              autoClose: 3000,
            });
          } else {
            toast.success(
              `Property booked Successfully! Now you can Add your Payment Details`,
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
          }

          if (projectOne) {
            fetchData();
          }
        }
      } catch (error) {
        console.error("Error updating status:", error);
        alert("Error updating status");
      }
    }
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
      for (let index = 1; index < totalCells - 2; index++) {
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
    XLSX.writeFile(workbook, "Sitereport.xlsx");
  }

  const startIndex = (currentPage - 1) * pageSize;

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
        <div className="text-2xl font-bold mx-2 my-8 px-4">Sites List</div>
      </div>
      <div className="flex justify-between">
        {/* <NavLink to="/sites/addSite/">
          <button className="bg-blue-800 text-white p-3 m-5 text-sm rounded-lg">
            Add New
          </button>
        </NavLink> */}

        <div className={`flex `}>
          <input
            placeholder="Search "
            type="text"
            name="search"
            value={search}
            onChange={handleSearchChange}
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
        <div className={` flex `}>
          <select
            type="text"
            name="filter"
            value={filter}
            onChange={handleChange}
            className={`text-black border-[1px] rounded-lg bg-white p-2 m-5`}
          >
            <option value="">select filter</option>
            <option value="recent">Recent</option>
            <option value="oldest">Oldest</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Completed">Completed</option>
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
        <div className="absolute h-full w-full top-64  flex justify-center items-center">
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
      <div className="relative overflow-x-auto m-5 mb-0">
        {paginatedSites.length > 0 && (
          <table
            id="sitetable"
            className="w-full text-sm text-left rtl:text-right border-2 border-gray-300"
          >
            <thead className="text-xs uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Sr no.
                </th>
                {
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Client name
                  </th>
                }
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Property Name
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Payments
                </th>
                {(userInfo.role === "agent" || userInfo.role === "Agent") && (
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Commisions
                  </th>
                )}
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  total amount
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Amount Paid
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Site Staus
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedSites.map((item, index) => (
                <tr key={item?._id} className="bg-white">
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                  >
                    {startIndex + index + 1}
                  </td>

                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                  >
                    {item?.clientName}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                  >
                    {item?.propertyName}
                  </td>
                  <td
                    scope="row"
                    className={`px-6 py-4 font-medium text-gray-900  border-2 border-gray-300`}
                  >
                    <div
                      className={`${
                        item?.payments?.length !== 0 &&
                        "grid grid-cols-2 gap-4 justify-between"
                      }`}
                    >
                      {item?.payments?.length !== 0
                        ? item?.payments.map((payment, index) => (
                            <div
                              key={index}
                              className="border-[1px] border-gray-700 p-2 "
                            >
                              <div className="">Payment {index + 1}:</div>
                              <div>Amount: {payment?.amount}</div>
                              <div>Date: {payment?.date?.split("T")[0]}</div>
                            </div>
                          ))
                        : "N/A"}
                    </div>
                  </td>
                  {(userInfo.role === "agent" || userInfo.role === "Agent") && (
                    <td
                      scope="row"
                      className={` px-6 py-4 font-medium text-gray-900  border-2 border-gray-300`}
                    >
                      <div
                        className={`${
                          item?.payments?.length !== 0 &&
                          "grid grid-cols-2 gap-4 justify-between"
                        }`}
                      >
                        {commissions.length !== 0
                          ? commissions
                              .filter(
                                (commission) => commission.siteId === item._id
                              ) // Match siteId
                              .map((commission, index) => (
                                <div
                                  key={index}
                                  className="border-[1px] border-gray-700 p-2"
                                >
                                  <div className="">
                                    Commission {index + 1}:
                                  </div>
                                  <div>Amount: {commission?.amount}</div>
                                  <div>
                                    Percentage: {commission?.percentage}
                                  </div>
                                  <div>
                                    Date: {commission?.date?.split("T")[0]}
                                  </div>
                                </div>
                              ))
                          : "N/A"}
                      </div>
                    </td>
                  )}

                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                  >
                    {item?.propertyDetails?.totalValue}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                  >
                    {item?.propertyDetails?.totalValue -
                      item?.propertyDetails?.balanceRemaining}
                  </td>
                  {/* <td
                    scope="row"
                    className={`${
                      item?.payments?.length != 0 && "grid grid-cols-2 gap-4 justify-between"
                    } px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300`}
                  >
                      {item?.payments?.length != 0
                      ? item?.payments.map((payment, index) => {
                          return (
                            <div className="border-[1px] border-gray-700 p-2 ">
                              <div className="">Payment {index + 1}:-</div>
                              <div>Amount: {payment?.amount}</div>
                              <div>Date: {payment?.date?.split("T")[0]}</div>
                            </div>
                          );
                        })
                      : "N/A"}
                  </td>
*/}
                  <td className="px-6 py-4 border-2 border-gray-300">
                    <button
                      className={`text-white font-bold py-2 px-4 rounded ${
                        item?.status === "Available"
                          ? "bg-green-500 hover:bg-green-600"
                          : item?.status === "Booked"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : item?.status === "Completed"
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "bg-gray-500 hover:bg-gray-600" // default case if none match
                      }`}
                    >
                      {item?.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {noData && (
        <div className="text-center text-xl">
          Currently! There are no site in the storage.
        </div>
      )}

      {paginatedSites.length > 0 && (
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
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1} // Disable if loader is true
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900"
            >
              Prev
            </button>
            <button
              onClick={() => handlePageChange("next")}
              disabled={paginatedSites.length < pageSize}
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

export default Sites;
