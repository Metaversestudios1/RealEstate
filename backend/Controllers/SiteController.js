const PropertyModel = require("../Models/PropertyModel");
const Site = require("../Models/SiteModel");
const Rank = require("../Models/RankModel");
const bcrypt = require("bcrypt");
const Agent = require("../Models/AgentModel");
// const insertSite = async (req, res) => {
//   try {
//     const newSite = new Site(req.body);
//     await newSite.save();
//     res.status(201).json({ success: true });
//   } catch (err) {
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "Error inserting Site",
//         error: err.message,
//       });
//   }
// };

const insertSite = async (req, res) => {
  try {
    const { propertyId } = req.body; // Assuming site_name is the unique identifier

    // Check if the site already exists
    const existingSite = await Site.findOne({ propertyId });

    if (existingSite) {
      // If the site exists, increment the visitCount
      existingSite.site_count += 1;
      await existingSite.save();

      return res.status(200).json({
        success: true,
        message: "Site visit count incremented",
        visitCount: existingSite.site_count,
      });
    } else {
      // If the site does not exist, create a new site with visitCount of 1
      const newSite = new Site({
        ...req.body,
        visitCount: 1, // Initialize visitCount to 1 for the new site
      });

      // Save the new site to the database
      await newSite.save();

      return res.status(201).json({
        success: true,
        siteId: newSite._id,
        site_count: newSite.site_count,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error inserting Site",
      error: err.message,
    });
  }
};

const updateSite = async (req, res) => {
  const updatedata = req.body;
  const id = updatedata.id;
  const paidAmount = updatedata.data.propertyDetails.amountPaid;
  const reaminingAmount = updatedata.data.propertyDetails.balanceRemaining;
const index = updatedata.data.index;
console.log(paidAmount);

  // Remove 'payments' from updatedata if it exists
  const { payments, ...restData } = updatedata.data; // Exclude 'payments' field

  try {
    // First, update other fields except 'payments'
    const updateFields = await Site.updateOne(
      { _id: id },
      { $set: restData } // Only update fields except 'payments'
    );

    if (updateFields.nModified === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No fields updated, or site not found",
        });
    }

    // Next, push the new payment to the 'payments' array
    const updatePayments = await Site.updateOne(
      { _id: id },
      { $push: { payments: { amount: paidAmount, date: new Date() } } } // Push new payment
    );

    if (updatePayments.nModified === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Unable to update payments" });
    }

    const agentId = updatedata.data.agentId; // Get the agent ID associated with this site

    const agent = await Agent.findById(agentId).populate("rank"); // Assuming the rank has commissionRate

const hierarchy = agent.hierarchy;
    if (!agent || !agent.rank) {
      return res
        .status(404)
        .json({ success: false, message: "Agent or rank not found" });
    }
    const commission = agent.rank.commissionRate;
    const agentLevel = agent.rank.level; // Assuming this gives you the level
    const getCommissionBasedOnLevel = async (level) => {
      let totalCommission = 0;

      for (let i = level; i >= 1; i--) {
        // Access commission rate for the current level
        const commissionRate = agent.rank.commissionRate; // Adjust based on your data structure
        const getcommition = await getcommitionrate(i);
        if (getcommition !== undefined) {
          // Check if the commission rate exists
          totalCommission += Number(getcommition); // Add commission rate to total
        } else {
          console.log(`Commission rate for level ${i} is not defined.`);
        }
      }
      return totalCommission;
    };

    // Calculate total commission based on level
    const totalCommissionFromLevels = await getCommissionBasedOnLevel(
      agentLevel
    );
    const commissionRate = totalCommissionFromLevels / 100;
    // console.log(commissionRate)
    const commissionDeduction = paidAmount * commissionRate;
    const tdsDeduction =commissionDeduction * 0.05;
    console.log(commissionDeduction);
    const updateAgent = await Agent.updateOne(
          { 
        _id: agentId, 
        hierarchy: hierarchy // Ensure hierarchy matches as well
      },
      {
        $push: {
          commissions: {
            siteId: id, // Include the site ID for reference
            amount: commissionDeduction,
            percentage: totalCommissionFromLevels,
            balanceRemaining: reaminingAmount,
            date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
            tdsDeduction:tdsDeduction,
            index:index
          },
        },
        // $inc: { totalCommission: -commissionDeduction } // Deduct from totalCommission
      }
    );

  
    const getlowerlevelcommition = async (level) => {
      let totalCommission = 0;
      const highestLevel = await getHigherLevel();
      console.log(highestLevel);
      for (let i = level; i <= highestLevel; i++) {
        // Access commission rate for the current level
        const commissionRatelower = agent.rank.commissionRate; // Adjust based on your data structure
        const getcommitionlower = await getcommitionrate(i);

        const commissionRatelowers = getcommitionlower / 100;

        const commissionDeductionlower = paidAmount * commissionRatelowers;
        const tdsDeductionlower  = commissionDeductionlower*0.05;
        const getagentid = await getAgentId(i);

        if (getagentid != null && agentId === getagentid.toString()) {
          console.log(`Ignoring update for agent ID: ${getagentid} as it matches the provided agent ID.`);
          continue; // Skip to the next iteration of the loop
      }else{
        const updateAgent = await Agent.updateOne(
          { 
            _id: getagentid, 
            hierarchy: hierarchy // Ensure hierarchy matches as well
          },
          {
            $push: {
              commissions: {
                siteId: id, // Include the site ID for reference
                amount: commissionDeductionlower,
                percentage: getcommitionlower,
                balanceRemaining: reaminingAmount,
                date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
                index:index,
                tdsDeduction:tdsDeductionlower,
              },
            },
            // $inc: { totalCommission: -commissionDeduction } // Deduct from totalCommission
          }
        );
      }
    }
      // return totalCommission;
    };
    const getlowercommition = await getlowerlevelcommition(agentLevel);

    if (updateAgent.nModified === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Unable to update agent's commission",
        });
    }

    res
      .status(201)
      .json({ success: true, message: "Site updated successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in updating the site",
      error: err.message,
    });
  }
};

const getcommitionrate = async (level) => {
  try {
    const commissionData = await Rank.findOne({ level: level });
    return commissionData.commissionRate;
  } catch (error) {
    console.error("Error fetching commission rates:", error);
  }
};

const getAgentId = async (level) => {
  try {
      // Find the rank based on the provided commission rate
      const commissionData = await Rank.findOne({ level: level });
      
      // Check if commissionData is found
      if (!commissionData) {
          console.error(`No rank found for level rate: ${level}`);
          throw new Error(`Rank not found for level rate: ${level}`);
      }

      const rankID = commissionData._id;

      // Find the agent based on the rank ID
      const agent = await Agent.findOne({ rank: rankID });

      // Check if agent is found
      if (!agent) {
          console.warn(`No agent found for rank ID: ${rankID}. Skipping this level.`);
          return null; // Return null to indicate no agent found for this level
      }

      return agent._id; // Return the found agent's ID
  } catch (error) {
      console.error(`Error in getAgentId: ${error.message}`);
      throw error; // Rethrow the error for further handling if needed
  }
};

const getHigherLevel  = async()=>{
  try {
    const ranks = await Rank.find(); // Fetch all rank records

    if (ranks.length === 0) return null; // Return null if no records found

    // Use Math.max to find the highest level
    const highestLevel = Math.max(...ranks.map(rank => rank.level));
    return highestLevel;
} catch (error) {
    console.error("Error fetching ranks:", error);
    throw error; // Rethrow the error for handling
}
}

// const updateSite = async (req, res) => {
//   const updatedata = req.body;
//   const id = updatedata.id;
//   const paidAmount = updatedata.data.propertyDetails.amountPaid;
//   console.log(paidAmount);
//   console.log(updatedata.data)
//   try {
//     const { ...restData } = updatedata.data;
//     const result = await Site.updateOne(
//       { _id: id },
//       {
//         $set: restData, // Update other fields
//         $push: { payments: { amount: paidAmount, date: new Date() } } // Correctly add new payment to payments array
//    }
//     );

//     if (result.nModified === 0) {
//       // Check if no document was modified
//       return res.status(404).json({ success: false, message: "Site not found or no changes made" });
//     }
//     res.status(201).json({ success: true, result: result });
//   } catch (err) {
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "error in updating the Site",
//         error: err.message,
//       });
//   }
// };
// const updateSite = async (req, res) => {
//   // const { paymentId, total_payment, first_payment } = req.body; // Assume paymentId is sent in the request body
//   // const remaining_balance = total_payment - first_payment;
//   const updatedata = req.body;
//   //   const id = updatedata.id;
// console.log(req.body);
//   try {
//     // Update the existing payment document
//     const updatedPayment = await Payment.findByIdAndUpdate(
//       paymentId,
//       {
//         total_payment,
//         first_payment,
//         remaining_balance,
//         $push: {
//           payments: { amount: first_payment, date: new Date() }
//         }
//       },
//       { new: true, useFindAndModify: false } // Options to return the updated document
//     );

//     if (!updatedPayment) {
//       return res.status(404).json({ success: false, message: "Payment not found" });
//     }

//     res.json({ success: true, payment: updatedPayment });
//   } catch (err) {
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "error in updating the Site",
//         error: err.message,
//       });
//   }
// };

const getAllSite = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search;
    const id = req.query.id;
    const filter = req.query.filter;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null; // Get startDate from query
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null; // Get endDate from query

    // Build query to match sites
    const query = {
      deleted_at: null, // Ensure we only match non-deleted sites
    };
    let sortCondition = { createdAt: -1 };
    if (filter === "recent") {
      sortCondition = { createdAt: -1 }; // Descending order (newest first)
    } else if (filter === "oldest") {
      sortCondition = { createdAt: 1 }; // Ascending order (oldest first)
    } else if (filter === "Available") {
      query.status = "Available"; // Filter by status 1
    } else if (filter === "Booked") {
      query.status = "Booked"; // Filter by status 0
    } else if (filter === "Completed") {
      query.status = "Completed"; // Filter by status 0
    }
    console.log;
    if (id) {
      query.propertyId = id;
    }
    // If search string is provided, we search within the related property name
    if (search) {
      const properties = await PropertyModel.find({
        propertyname: { $regex: search, $options: "i" },
      }).select("_id"); // Only select property IDs

      // If properties are found, use their IDs in the query
      if (properties.length > 0) {
        const propertyIds = properties.map((property) => property._id);
        query.propertyId = { $in: propertyIds };
      } else {
        // If no matching properties found, return empty result
        return res.status(200).json({ success: true, result: [], count: 0 });
      }
    }    
    if (startDate && endDate) {
      // Set startDate to the start of the day in UTC
      const start = new Date(startDate);
      start.setUTCHours(0, 0, 0, 0);
    
      // Set endDate to the end of the day in UTC
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);
  
      query.payments = {
        $elemMatch: {
          date: {
            $gte: start,
            $lte: end, // Include all payments up to the end of endDate
          },
        },
      };
    }
    

    // Perform the site query with pagination
    const result = await Site.find(query)
      .populate("propertyId", "propertyname") // Populate the propertyname
      .sort(sortCondition)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const count = await Site.find(query).countDocuments();
    res.status(200).json({ success: true, result, count });
  } catch (error) {
    console.error("Error fetching Sites:", error); // Log the actual error
    res
      .status(500)
      .json({
        success: false,
        message: `Error fetching Sites: ${error.message}`,
      });
  }
};

const getSingleSite = async (req, res) => {
  console.log(req.body);
  const { id } = req.body;
  try {
    const result = await Site.findOne({ _id: id });
    if (!result) {
      res.status(404).json({ success: false, message: "Site not found" });
    }
    const count = await Site.countDocuments({ site_name: result.propertyId });

    res.status(201).json({ success: true, result: result, count: count });
  } catch (error) {
    res.status(500).json({ success: false, message: "error fetching Site" });
  }
};

const deleteSite = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await Site.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Site not found" });
    }
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "error fetching Site" });
  }
};
const updatesitestatus = async (req, res) => {
  try {
    console.log(res.body);
    const { id } = req.params;
    const status = req.body.status;
    const Sitenew = await Site.findById(id);
    Sitenew.status = status;
    await Sitenew.save();
    res.status(200).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "error fetching transaction",
        error: err.message,
      });
  }
};
module.exports = {
  insertSite,
  updateSite,
  getAllSite,
  getSingleSite,
  deleteSite,
  updatesitestatus,
};
