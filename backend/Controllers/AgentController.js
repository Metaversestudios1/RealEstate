const Agent = require("../Models/AgentModel");
const Site = require("../Models/SiteModel");
const Rank = require("../Models/RankModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const path = require("path");
 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
 
// Helper function to upload images
const uploadImage = (buffer, originalname, mimetype) => {
  return new Promise((resolve, reject) => {
    if (!mimetype.startsWith("image")) {
      return reject(new Error("Only image files are supported"));
    }
    const fileNameWithoutExtension = path.basename(originalname);
    const publicId = `${fileNameWithoutExtension}`;
    const options = {
      resource_type: "image",
      public_id: publicId,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };
 
    const dataURI = `data:${mimetype};base64,${buffer.toString("base64")}`;
    cloudinary.uploader.upload(
      dataURI,
      options,
      (error, result) => {
        if (error) {
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
        resolve(result);
      }
    );
  });
};
 
 
const getNextAgentId = async (req, res) => {
  try {
    const lastAgent = await Agent.findOne({ deleted_at: null })
      .sort({ agent_id: -1 })
      .exec();

    if (!lastAgent) {
      return res.status(404).json({ success: true, agent_id: 100001 });
    }
    return res
      .status(404)
      .json({ success: true, agent_id: parseInt(lastAgent.agent_id) + 1 });
  } catch (err) {
    console.error("Error retrieving last agent id:", err);
    throw new Error("Could not retrieve rank id.");
  }
};
const insertAgent = async (req, res) => {
  try {
    const { password, ...data } = req.body;
    const rank = req.body.rank;
    const superior = req.body.superior;

    const rank_res = await Rank.findOne({ _id: rank }); // Assuming rank is stored in superior agent's data

    if (!rank_res) {
      return res.status(400).json({
        success: false,
        message: "Rank not found for superior agent",
      });
    }
    let hierarchyId;
    if (rank_res.level === 1) {
      let isUnique = false;
      while (!isUnique) {
        hierarchyId = Math.floor(1000 + Math.random() * 9000).toString();
        const existingAgent = await Agent.findOne({ hierarchy: hierarchyId });
        if (!existingAgent) {
          isUnique = true; // Unique ID found
        }
      }
    } else if(superior){
      const superior_res = await Agent.findById({ _id: superior });
      if (!superior_res) {
        return res.status(400).json({
          success: false,
          message: "Superior agent not found",
        });
      }
      hierarchyId = superior_res.hierarchy;
    } 
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAgentData = {
      ...data,
      password: hashedPassword,
      ...(hierarchyId && { hierarchy: hierarchyId }), // Only add hierarchy if it exists
    };
    const newAgent = new Agent(newAgentData);
    await newAgent.save();

    res
      .status(201)
      .json({ success: true, message: "Agent inserted successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error inserting Agent",
      error: err.message,
    });
  }
};

const updateAgent = async (req, res) => {
  try {
    const { id, propertyIds, oldData } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Agent ID is required" });
    }

    // If propertyIds are present, it indicates the user is assigning properties
    if (propertyIds && Array.isArray(propertyIds)) {
      const result = await Agent.updateOne(
        { _id: id },
        { $set: { properties: propertyIds } }
      );

      if (!result.matchedCount) {
        return res
          .status(404)
          .json({ success: false, message: "Agent not found" });
      }

      return res
        .status(200)
        .json({
          success: true,
          message: "Properties assigned successfully",
          result,
        });
    }

    // Otherwise, it is a general agent data update
    if (oldData) {
      const result = await Agent.updateOne({ _id: id }, { $set: oldData });

      if (!result.matchedCount) {
        return res
          .status(404)
          .json({ success: false, message: "Agent not found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Agent updated successfully", result });
    }

    return res.status(400).json({ success: false, message: "Invalid request" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error updating the agent",
      error: err.message,
    });
  }
};

const getAllAgent = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = req.query.search;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null; // Get startDate from query
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null; // Get endDate from query

    const query = {
      deleted_at: null,
    };
    if (search) {
      query.agentname = { $regex: search, $options: "i" };
    }

    console.log(startDate);
    console.log(endDate);
    if (startDate && endDate) {
      query.commissions = {
        $elemMatch: {
          date: {
            $gte: new Date(startDate), // Include all payments on the start date
            $lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)), // Exclude the next day
          },
        },
      };
    }

    const result = await Agent.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await Agent.find(query).countDocuments();
    res.status(200).json({ success: true, result, count });
  } catch (error) {
    res.status(500).json({ success: false, message: "error inserting Agent" });
  }
};
const getSingleAgent = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await Agent.findOne({ _id: id });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Agent not found" });
    }
    res.status(201).json({ success: true, result: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "error fetching Agent" });
  }
};

const deleteAgent = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await Agent.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Agent not found" });
    }
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "error fetching Agent" });
  }
};

const agentlogin = async (req, res) => {
  const { agent_id, password } = req.body;
  try {
    if (!agent_id || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all fields" });
    }

    const agent = await Agent.findOne({ agent_id });
    if (!agent) {
      return res
        .status(404)
        .json({ success: false, message: "Agent ID not found" });
    }

    const match = await bcrypt.compare(password, agent.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: agent._id, username: agent.agentname, role: "agent" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .cookie("token", token, {
        expiresIn: "30d",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      }).json({ success: true, token, user: agent });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("connect.sid"); // Name of the session ID cookie
  res.clearCookie("token"); // Name of the session ID cookie
  res.status(200).json({ status: true, message: "Successfully logged out" });
};
const getAllAgentproperty = async (req, res) => {
  try {
    let propertyId;
    if (req.query.pid) {
      propertyId = req.query.pid;
    } else {
      const siteId = req.query.sid; // Property ID from the query parameter

      // Validate the site ID
      if (!siteId) {
        return res
          .status(400)
          .json({ success: false, message: "Site ID is required." });
      }

      const site = await Site.findById(siteId);

      if (!site) {
        return res
          .status(404)
          .json({ success: false, message: "Site not found." });
      }
      propertyId = site.propertyId;
    } // Assuming the property ID is stored as propertyId in SITE collection
    const query = {
      deleted_at: null,
      properties: { $in: [propertyId] }, // Check if the properties array contains the specified property ID
    };

    // Fetch agents matching the query
    const result = await Agent.find(query);
    // Get the count of documents matching the query
    const count = await Agent.countDocuments(query);
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          count,
          message: "No agents found for the given property ID.",
        });
    }

    // Send the response
    res.status(200).json({ success: true, result, count });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res
      .status(500)
      .json({ success: false, message: "Error retrieving agents" });
  }
};
const getAgentCommition = async (req, res) => {
  try {
    // Extract `site_id` and `index` from the request body
    const { id, index } = req.body;

    if (!id || index === undefined) {
      return res.status(400).json({ message: "Site ID and index are required" });
    }

    // Find agents that have commissions matching `index` and `siteId`
    const agents = await Agent.find({ 'commissions.index': index, 'commissions.siteId': id });

    // Map and filter the specific commission data with agent details
    const commissions = agents.flatMap(agent =>
      agent.commissions
        .filter(comm => comm.index === index && comm.siteId.toString() === id)
        .map(comm => ({
          ...comm.toObject(),
          agentname: agent.agentname,
          agent_id: agent.agent_id,
        }))
    );

    // Check if commissions were found and return the result
    if (commissions.length > 0) {
      return res.json({ success: true, result: commissions });
    } else {
      return res.json({ success: false, message: 'No commission found for this index and siteId.' });
    }
  } catch (error) {
    console.error("Error fetching commission records:", error);
    res.status(500).json({ success: false, message: "Error retrieving agents" });
  }
};

const updateAgentDetails = async (req, res) => {
  const { id, adhaar_id, pan_id, bank_details } = req.body;
 
  try {
    let photo = null;
 
    // Check for uploaded photo file
    if (req.files && req.files["photo"] && req.files["photo"][0].buffer) {
      const photoFile = req.files["photo"][0];
      // Upload the image using the helper function
      const uploadResult = await uploadImage(
        photoFile.buffer,
        photoFile.originalname,
        photoFile.mimetype
      );
      photo = {
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
        originalname: photoFile.originalname,
        mimetype: photoFile.mimetype,
      };
    }
 
    // Prepare update fields
    const updateFields = {
      adhaar_id,
      pan_id,
      bank_details,
    };
 
    if (photo) {
      updateFields.photo = photo; // Add photo if it's available
    }
 
    // Update the agent in the database
    const result = await Agent.updateOne({ _id: id }, { $set: updateFields });
 
    if (result.nModified === 0) {
      return res.status(404).json({
        success: false,
        message: "Agent not found or no changes made",
      });
    }
 
    res
      .status(200)
      .json({ success: true, message: "Agent data updated successfully" });
  } catch (err) {
    console.error("Error updating agent data:", err);
    res.status(500).json({
      success: false,
      message: "Error updating data: " + err.message,
    });
  }
};
 
const getNotification = async (req, res) => {
  const { agent_id } = req.body;

  try {
    // Fetch agent details to get notificationCount and notificationStatus
    const agent = await Agent.findById(agent_id, 'notificationCount notificationStatus');
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }

    const { notificationCount, notificationStatus } = agent;

    // Check if notificationStatus is 1
    if (notificationStatus === "1") {
      // Fetch properties ordered by creation date in descending order, limited by notificationCount
      const properties = await Property.find()
        .sort({ createdAt: -1 }) // Descending order by creation date
        .limit(notificationCount);

      return res.status(200).json({
        success: true,
        data: properties,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "No new notifications",
      });
    }
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

const offNotification = async (req, res) => {
  const { agent_id } = req.body;

  try {
   

    // Update notificationCount and notificationStatus for the agent
    const result = await Agent.updateOne(
      { _id: agent_id }, // Find the agent by agent_id
      {
        $set: {
          notificationCount: 0, // Set the new notificationCount
          notificationStatus: '0' // Set the new notificationStatus
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: 'Agent not found or no changes made' });
    }

    return res.status(200).json({ success: true, message: 'Notification status updated successfully' });
  } catch (error) {
    console.error("Error updating notification status:", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating notification status",
      error: error.message,
    });
  }
};

const updatestatus  = async (req, res) => {
  try {
    
    const { status } = req.body;
    const newstatus = status === 1 ? "0" : "1";
    const { id }= req.params;
    console.log(status);
    console.log(id)
    const updatedRecord = await Agent.findByIdAndUpdate(
      id,
      { status: newstatus },
      { new: true } // Return the updated record
    );

    if (!updatedRecord) {
      throw new Error("Record not found");
    }

    return res.status(200).json({success: true, result: updatedRecord });; // Return response
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating status", error: err.message });
  }

}

// Usage within another function (like insertAgent

module.exports = {
  insertAgent,
  updateAgent,
  getAllAgent,
  getAllAgentproperty,
  getSingleAgent,
  deleteAgent,
  agentlogin,
  getNextAgentId,
  getAgentCommition,
  updateAgentDetails,
  getNotification,
  offNotification,
  updatestatus,
};
