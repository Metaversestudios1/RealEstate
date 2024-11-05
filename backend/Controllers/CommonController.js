const Agent = require("../Models/AgentModel");
const Site = require("../Models/SiteModel");




const   getAllSitesWithoutPagination = async(req, res)=>{
    const sites = await Site.find()
    if(!sites) {
        return res.status(500).json({success: false, message: "Error in fetching"})
    }
    
    return res.status(201).json({success: true, result: sites})

}
const   getAllAgentsWithoutPagination = async(req, res)=>{
    const agent = await Agent.find()
    if(!agent) {
        return res.status(201).json({success: false, message: "Error in fetching"})
    }
    return res.status(201).json({success: true, result: agent})
}


module.exports = {
    getAllAgentsWithoutPagination,
    getAllSitesWithoutPagination,
  };
  