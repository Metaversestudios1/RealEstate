import React, { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { LiaSitemapSolid } from "react-icons/lia";
import { MdOutlineEventAvailable } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa6";

const Hierarchy = () => {
  const [hierarchy, setHierarchy] = useState(null);
  const [loader, setLoader] = useState(false);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    fetchAgentHierarchy();
  }, 
[id]);
  
 
  const fetchAgentHierarchy = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getSingleAgent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: id }),
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
      (sub) => String(sub.superior) === String(agent._id)
    );
    // console.log("All Agents:", allAgents);
    // console.log("Current Agent:", agent);
    // console.log("Immediate Subordinates:", immediateSubordinates);
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
          // console.log(rankDetails);
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
          
            <>
             
                
                
                
              <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4 w-full mt-4">
                {/*For hierarchy of agents*/}
                {hierarchy ? (
                  renderHierarchy(hierarchy)
                ) : (
                  <p>Loading hierarchy...</p>
                )}
              </div>
            </>
        
      
        </div>
      )}
    </div>
  );
};

export default Hierarchy;
