import React, { useEffect, useState } from "react";
import getUserFromToken from "../components/utils/getUserFromToken";
import { NavLink } from "react-router-dom";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";
import { LiaSitemapSolid } from "react-icons/lia";
import { MdOutlineEventAvailable } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa6";

const Home = () => {
  const userInfo = getUserFromToken();
  const [hierarchy, setHierarchy] = useState(null);
  const [loader, setLoader] = useState(true);
  const [totalClient, setTotalClient] = useState(0);
  const [totalClientSites, setTotalClientSites] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalSites, setTotalSites] = useState(0);
  const [totalAvailableSites, setTotalAvailableSites] = useState(0);
  const [totalBookedSites, setTotalBookedSites] = useState(0);

  useEffect(() => {
    setLoader(true); // Start loader before data fetches begin

    const fetchData = async () => {
      try {
        // Define all requests based on the role
        const requests = [
          fetchAgentHierarchy(),
          ...(userInfo.role === "client" ? [fetchClientSites()] : []),
          ...(userInfo.role === "agent"
            ? [fetchPropertyCount(), fetchClientCount()]
            : []),
        ];

        // Await all fetch requests
        await Promise.all(requests);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoader(false); // Turn off loader after all requests are complete
      }
    };

    fetchData();
  }, [userInfo.role]);

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

  const fetchAllSites = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getAllSitesWithoutPagination`
    );
    const siteData = await res.json();
    return siteData.success ? siteData.result : [];
  };

  const fetchClientSites = async () => {
    const clientData = await fetchClient();
    if (clientData && clientData.bookedProperties) {
      const bookedProperties = clientData.bookedProperties;
      console.log(bookedProperties);
      // Fetch all sites and filter for the client’s booked properties
      const allSites = await fetchAllSites();
      console.log(allSites);
      const sitesForClient = allSites.filter((site) => {
        console.log(bookedProperties === site.propertyId ||site.clientId === userInfo.id)
        return ((bookedProperties === site.propertyId) ||
          site.clientId === userInfo.id)
      });
      console.log(sitesForClient);
      setTotalClientSites(sitesForClient.length);
    }
  };

  const fetchPropertyCount = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getSingleAgent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userInfo?.id }),
      }
    );
    const response = await res.json();
    const properties = response.result.properties;
    setTotalProperties(properties.length);

    // Fetch sites for all properties
    await fetchSitesForProperties(properties);
  };

  const fetchSitesForProperties = async (properties) => {
    try {
      let totalSiteCount = 0;
      let availableSiteCount = 0;
      let bookedSiteCount = 0;

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getAllSitesWithoutPagination`
      );
      const response = await res.json();
      const allSites = response.result;
console.log(allSites, properties)
      properties.forEach((property) => {
        const sitesForProperty = allSites.filter(
          (site) => {console.log(site.propertyId === property);return site.propertyId === property}
        );
        totalSiteCount += sitesForProperty.length;
        availableSiteCount += sitesForProperty.filter(
          (site) => site.status === "Available"
        ).length;
        bookedSiteCount += sitesForProperty.filter(
          (site) => site.status === "Booked"
        ).length;
      });

      setTotalSites(totalSiteCount);
      setTotalAvailableSites(availableSiteCount);
      setTotalBookedSites(bookedSiteCount);
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  const fetchClientCount = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getclientcount`
    );
    const response = await res.json();
    setTotalClient(response.count);
  };

  const fetchAgentHierarchy = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getSingleAgent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userInfo.id }),
        }
      );
      const agentData = await response.json();
      const agent = agentData.result;

      let agentRank = "No Rank";
      if (agent.rank) {
        const rankResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/getSingleRank`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: agent.rank }),
          }
        );
        const rankData = await rankResponse.json();
        agentRank = rankData.result.name;
      }

      const allAgentsResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getAllAgent`
      );
      const allAgentsData = await allAgentsResponse.json();
      const allAgents = allAgentsData.result;

      const hierarchyData = await buildHierarchy(
        { ...agent, rank: agentRank },
        allAgents
      );
      setHierarchy(hierarchyData);
    } catch (error) {
      console.error("Error fetching agent hierarchy:", error);
    }
  };

  const buildHierarchy = async (agent, allAgents) => {
    const immediateSubordinates = allAgents.filter(
      (sub) => sub.superior === agent._id
    );

    const subordinatesWithRanks = await Promise.all(
      immediateSubordinates.map(async (sub) => {
        let rankDetails = null;
        if (sub.rank) {
          const rankResponse = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/getSingleRank`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: sub.rank }),
            }
          );
          const rankData = await rankResponse.json();
          rankDetails = rankData.result.name;
        }
        return {
          ...sub,
          rank: rankDetails || "No Rank",
        };
      })
    );

    return {
      ...agent,
      subordinates: subordinatesWithRanks,
    };
  };

  const renderHierarchy = (agent) => (
    <div
      key={agent.agent_id}
      className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4 mb-4"
    >
      <h3 className="font-bold">{agent.agentname}</h3>
      <p>Rank: {agent.rank || "No Rank"}</p>
      {agent.subordinates && agent.subordinates.length > 0 && (
        <div className="ml-6 border-l border-gray-300 pl-4">
          {agent.subordinates.map((sub) => (
            <div key={sub.agent_id} className="pt-2">
              {renderHierarchy(sub)}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      {loader ? (
        <div className="absolute z-20 h-full w-full md:right-6 flex justify-center items-center">
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
        <div className="flex flex-col flex-wrap md:flex-row p-3 mb-6 w-full">
          {/* Property Summary */}
          {userInfo.role === "Agent" || userInfo.role === "agent" ? (
            <>
              <div className="flex gap-2 flex-wrap flex-col md:flex-row  flex-1 my-1">
                <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4 h-24 min-w-64">
                  <NavLink to="/properties">
                    <div className="flex items-center">
                      <div className="inline-flex justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
                        <IoHomeOutline className="text-xl" />
                      </div>
                      <div className="ml-3">
                        <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">
                          {totalProperties}
                        </span>
                        <h3 className="text-base font-normal text-gray-500">
                          Total Properties
                        </h3>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <br />
                {/* Total Sites */}
                <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4 h-24 min-w-64">
                  <NavLink to="/sites">
                    <div className="flex items-center">
                      <div className="inline-flex justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
                        <LiaSitemapSolid className="text-xl" />
                      </div>
                      <div className="ml-3">
                        <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">
                          {totalSites}
                        </span>
                        <h3 className="text-base font-normal text-gray-500">
                          Total Sites
                        </h3>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <br />
                {/* Available Sites */}
                <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4 h-24 min-w-64">
                  <NavLink to="/sites">
                    <div className="flex items-center">
                      <div className="inline-flex justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
                        <MdOutlineEventAvailable className="text-xl" />
                      </div>
                      <div className="ml-3">
                        <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">
                          {totalAvailableSites}
                        </span>
                        <h3 className="text-base font-normal text-gray-500">
                          Available Sites
                        </h3>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <br />
                {/* Booked Sites */}
                <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4 h-24 min-w-64">
                  <NavLink to="/sites">
                    <div className="flex items-center">
                      <div className="inline-flex justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
                        <FaRegBookmark className="text-xl" />
                      </div>
                      <div className="ml-3">
                        <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">
                          {totalBookedSites}
                        </span>
                        <h3 className="text-base font-normal text-gray-500">
                          Booked Sites
                        </h3>
                      </div>
                    </div>
                  </NavLink>
                </div>
              </div>
              <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4 w-full mt-4">
                {/*For hierarchy of agents*/}
                {hierarchy ? (
                  renderHierarchy(hierarchy)
                ) : (
                  <p>Loading hierarchy...</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-2 flex-1 my-1">
              <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
                <NavLink to="/sites">
                  <div className="flex items-center">
                    <div className="inline-flex justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
                      <LiaSitemapSolid className="text-xl" />
                    </div>
                    <div className="ml-3">
                      <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">
                        {totalClientSites}
                      </span>
                      <h3 className="text-base font-normal text-gray-500">
                        Total client Sites
                      </h3>
                    </div>
                  </div>
                </NavLink>
              </div>

              <br /> 
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
