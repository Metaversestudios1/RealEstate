const Client = require("../Models/ClientModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cloudinary = require("cloudinary").v2;
const path = require("path");
const Property = require("../Models/PropertyModel");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
 
// Helper function to upload images
const uploadImage = (buffer, originalname, mimetype) => {
  return new Promise((resolve, reject) => {
    // Ensure only image files are processed
    if (!mimetype.startsWith("image")) {
      return reject(new Error("Only image files are supported"));
    }

    // Generate the public ID for Cloudinary upload
    const fileNameWithoutExtension = path.basename(originalname, path.extname(originalname)); // Use extname to get the correct filename without extension
    const publicId = `${fileNameWithoutExtension}`;

    const options = {
      resource_type: "image",
      public_id: publicId,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    // Convert the buffer to a data URI for upload
    const dataURI = `data:${mimetype};base64,${buffer.toString("base64")}`;
    
    // Perform the upload to Cloudinary
    cloudinary.uploader.upload(dataURI, options, (error, result) => {
      if (error) {
        return reject(new Error(`Cloudinary upload failed: ${error.message}`));
      }
      resolve(result); // Resolve with the result from Cloudinary
    });
  });
};
 

const insertClient = async (req, res) => {
  try {
    const { password, ...data } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new agent
    const newClient = new Client({ ...data, password: hashedPassword });
    await newClient.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error inserting Client",
        error: err.message,
      });
  }
};

const updateClient = async (req, res) => {
  const updatedata = req.body;
  const id = updatedata.id;
  try {
    // console.log(updatedata.oldData)

    const result = await Client.updateOne(
      { _id: id },
      { $set: updatedata.data }
    );
    if (!result) {
      res.status(404).json({ success: false, message: "Client not found" });
    }
    res.status(201).json({ success: true, result: result });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "error in updating the Client",
        error: err.message,
      });
  }
};

const getAllClient = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = req.query.search;

    const query = {
      deleted_at: null,
    };
    if (search) {
      query.clientname = { $regex: search, $options: "i" };
    }

    const result = await Client.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await Client.find(query).countDocuments();
    res.status(200).json({ success: true, result, count });
  } catch (error) {
    res.status(500).json({ success: false, message: "error inserting Client" });
  }
};
const getSingleClient = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await Client.findOne({ _id: id });
    if (!result) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    res.status(201).json({ success: true, result: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "error fetching Client" });
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await Client.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "error fetching Client" });
  }
};

const clientlogin = async (req, res) => {
  const { client_id, password } = req.body;
  try {
    if (!client_id || !password) {
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    const client = await Client.findOne({ client_id });
    if (!client) {
      return res.status(404).json({ success: false, message: "Client ID not found" });
    }

    const match = await bcrypt.compare(password, client.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: client._id, username: client.clientname, role: 'client' },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { expiresIn: "30d", httpOnly: true, sameSite: "None" })
      .json({ success: true, token, user: client });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
};
  
const getNextclientId = async (req,res) => {
    try {
      const lastclient = await Client.findOne({ deleted_at:null }).sort({ client_id: -1}).exec();  
      if (!lastclient) {
          return res
          .status(201)
          .json({ success: true,client_id:900001 });
      }
      return res
      .status(201)
      .json({ success: true,client_id:parseInt(lastclient.client_id) + 1});
     
    } catch (err) {
      // Handle any potential errors
      console.error("Error retrieving last client_id:", err);
      throw new Error("Could not retrieve Client ID.");
    }
  };

   
const updateClientDetails = async (req, res) => {
  const { id, adhaar_id, pan_id, bank_details } = req.body;

  try {
    let photo = null;

    // Check for uploaded photo file
    if (req.files && req.files["photo"] && req.files["photo"][0].buffer) {
      const photoFile = req.files["photo"][0];
      // Upload the image using the helper function
      const uploadResult = await uploadImage(photoFile.buffer, photoFile.originalname, photoFile.mimetype);
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
    const result = await Client.updateOne({ _id: id }, { $set: updateFields });

    if (result.nModified === 0) {
      return res.status(404).json({
        success: false,
        message: "Client not found or no changes made",
      });
    }

    res.status(200).json({ success: true, message: "Client data updated successfully" });
  } catch (err) {
    console.error("Error updating Client data:", err);
    res.status(500).json({
      success: false,
      message: "Error updating data: " + err.message,
    });
  }
}
  
const getClientNotification = async (req, res) => {
  const { client_id } = req.body;

  try {
    // Fetch agent details to get notificationCount and notificationStatus
    const client = await Client.findById(client_id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const { notificationCount, notificationStatus } = client;

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

const offClientNotification = async (req, res) => {
  const { client_id } = req.body;

  try {
   

    // Update notificationCount and notificationStatus for the agent
    const result = await Client.updateOne(
      { _id: client_id }, // Find the agent by agent_id
      {
        $set: {
          notificationCount: 0, // Set the new notificationCount
          notificationStatus: '0' // Set the new notificationStatus
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: 'Client not found or no changes made' });
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

module.exports = {
  insertClient,
  updateClient,
  getAllClient,
  getSingleClient,
  deleteClient,
  getNextclientId,
  clientlogin,
  updateClientDetails,
  offClientNotification,
  getClientNotification
};
