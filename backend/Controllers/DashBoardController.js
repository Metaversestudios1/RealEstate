const Agent = require("../Models/AgentModel"); //
const Property = require("../Models/PropertyModel");
const Client = require("../Models/ClientModel");
const Site = require("../Models/SiteModel"); // Import the model
const Rank = require("../Models/RankModel");

const getclientcount = async (req, res) => {
    try {
        const dashboardCount = await Client.countDocuments({ deleted_at: null });
        res.status(200).json({ count: dashboardCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const getsitecount = async(req, res)=>{
    try{
        const status = req.query.status;
        const query = {
          deleted_at: null,
        };
        if (status) {
          query.status = status;
        }
        const sitecount = await Site.countDocuments(query);
        res.status(200).json({success:true,count:sitecount});
    } catch(err){
        res.status(500).json({sucess:false,message:'Server erro',err:err.message});
    }
}
const getPropertyCount = async(req, res)=>{
    try{
        const projectcount = await Property.countDocuments({ deleted_at: null });
        res.status(200).json({success:true,count:projectcount});
    } catch(err){
        res.status(500).json({sucess:false,message:'Server erro',err:err.message});
    }
}
const getagentcount = async(req,res)=>{
    try{
        const agentcount = await Agent.countDocuments({ deleted_at: null,status:1 });
        res.status(200).json({success:true,count:agentcount});
    } catch(err){
        res.status(500).json({sucess:false,message:'Server erro',err:err.message});
    }
}
const getrankcount = async(req,res)=>{
    try{
        const agentcount = await Rank.countDocuments({ deleted_at: null });
        res.status(200).json({success:true,count:agentcount});
    } catch(err){
        res.status(500).json({sucess:false,message:'Server erro',err:err.message});
    }
}
const getrankcount5 = async (req, res) => {
    try {
        const agentcount = await Rank.find({ deleted_at: null })
            .sort({ createdAt: -1 }) // Replace 'createdAt' with the actual field you want to sort by
            .limit(5); // Limit the results to the last 5 documents

        res.status(200).json({ success: true, count: agentcount });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', err: err.message });
    }
};

module.exports={
    getclientcount,
    getsitecount,
    getagentcount,
    getPropertyCount,
    getrankcount,
    getrankcount5,
}
