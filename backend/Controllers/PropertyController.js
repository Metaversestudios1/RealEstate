const Property = require("../Models/PropertyModel");
const Site = require("../Models/SiteModel");
const Agent = require("../Models/AgentModel");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const path = require('path');
const Client = require("../Models/ClientModel");


dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadImage = (buffer, originalname, mimetype) => {
  return new Promise((resolve, reject) => {
    if (!mimetype || typeof mimetype !== "string") {
      return reject(new Error("MIME type is required and must be a string"));
    }

    if (!mimetype.startsWith("image")) {
      return reject(new Error("Only image files are supported"));
    }

    const fileNameWithoutExtension = path.basename(originalname);
    const publicId = `${fileNameWithoutExtension}`;
    const options = {
      resource_type: "image", // Only images are allowed
      public_id: publicId,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    const dataURI = `data:${mimetype};base64,${buffer.toString("base64")}`;

    cloudinary.uploader.upload(
      dataURI,
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          return reject(
            new Error(`Cloudinary upload failed: ${error.message}`)
          );
        }
        resolve(result);
      }
    );
  });
};



const insertProperty = async (req, res) => {
  const { sites } = req.body; // Extract site numbers from request body
  let siteInsertions = [];

  if (req.files && req.files.length > 0) {
    console.log("req.files is present");
    const photos = []; // Array to store the image information

    try {
      const pData = req.body;

      // Loop through each file and upload it to Cloudinary (or other service)
      for (const file of req.files) {
        const { originalname, buffer, mimetype } = file;
        if (!mimetype || typeof mimetype !== "string") {
          console.error("Invalid MIME type:", mimetype);
          return res.status(400).json({ success: false, message: "Invalid MIME type" });
        }

        // Upload file to Cloudinary (or your chosen service)
        const uploadResult = await uploadImage(buffer, originalname, mimetype);
        if (!uploadResult) {
          return res.status(500).json({ success: false, message: "File upload error" });
        }

        // Store each uploaded image's details in the photos array
        photos.push({
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
          originalname: originalname,
          mimetype: mimetype,
        });
      }

      // Create new Property with multiple image information
      const newProperty = new Property({
        ...pData,
        photos: photos, // Save all uploaded images
      });

      await newProperty.save();

      // Handle site insertion if the "sites" field is present
      // if (sites) {
      //   for (let i = 0; i < sites; i++) {
      //     const newSite = new Site({
      //       propertyId: newProperty._id, // Link site with the newly created property
      //     });
      //     await newSite.save();
      //   }
      // }
      if (sites) {
        const lastSite = await Site.findOne().sort({ createdAt: -1 });   
       let currentCount = lastSite ? lastSite.site_count : 0; 
   
       for (let i = 0; i < sites; i++) { // Loop for the number of sites specified
         currentCount += 1; // Increment for each new site      
         const newSite = new Site({
           propertyId: newProperty._id, // Link site with the newly created property
           site_count: currentCount,      // Set site_count to the calculated value
         });
     
         await newSite.save(); // Save the new site
       }
     }
      
     await Agent.updateMany(
      {}, // Select all agents
      {
        $inc: { notificationCount: 1 }, // Increment notificationCount by 1
        $set: { notificationStatus: "1" } // Set notificationStatus to "1"
      }
    );
     await Client.updateMany(
      {}, // Select all agents
      {
        $inc: { notificationCount: 1 }, // Increment notificationCount by 1
        $set: { notificationStatus: "1" } // Set notificationStatus to "1"
      }
    );
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Error inserting Property with multiple files:", error.message);
      res.status(500).json({
        success: false,
        message: "Error inserting Property",
        error: error.message,
      });
    }
  } else {
    console.log("req.files is not present");
    try {
      const PropertyData = req.body;

      // Create new Property without image information
      const newProperty = new Property({
        ...PropertyData,
      });

      await newProperty.save();
      if (sites) {
         const lastSite = await Site.findOne().sort({ createdAt: -1 });   
        let currentCount = lastSite ? lastSite.site_count : 0; 
    
        for (let i = 0; i < sites; i++) { // Loop for the number of sites specified
          currentCount += 1; // Increment for each new site      
          const newSite = new Site({
            propertyId: newProperty._id, // Link site with the newly created property
            site_count: currentCount,      // Set site_count to the calculated value
          });
      
          await newSite.save(); // Save the new site
        }
      }
      await Agent.updateMany(
        {}, // Select all agents
        {
          $inc: { notificationCount: 1 }, // Increment notificationCount by 1
          $set: { notificationStatus: "1" } // Set notificationStatus to "1"
        }
      );
      await Client.updateMany(
        {}, // Select all agents
        {
          $inc: { notificationCount: 1 }, // Increment notificationCount by 1
          $set: { notificationStatus: "1" } // Set notificationStatus to "1"
        }
      );
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Error inserting Property without files:", error.message);
      res.status(500).json({
        success: false,
        message: "Error inserting Property",
        error: error.message,
      });
    }
  }
};


// const insertProperty = async (req, res) => {
//   console.log(req.body);
//   const { sites } = req.body;  // Extract site numbers from request body
//   let siteInsertions = [];
//   const photos = []; // Array to store the image information

//   if (req.file) {
//     console.log("req.file is present");
//     const { originalname, buffer, mimetype } = req.file;
//     if (!mimetype || typeof mimetype !== 'string') {
//       console.error("Invalid MIME type:", mimetype);
//       return res.status(400).json({ success: false, message: "Invalid MIME type" });
//     }

//     try {
//       const pData = req.body;
//       // Upload file to Cloudinary
//       const uploadResult = await uploadImage(buffer, originalname,mimetype);
//       if (!uploadResult) {
//         return res.status(500).json({ success: false, message: "File upload error" });
//       }
    
//       // Create new Property with file information
//       const newProperty = new Property({
//         ...pData,
//         photo: {
//           publicId: uploadResult.public_id,
//           url: uploadResult.secure_url,
//           originalname: originalname,
//           mimetype: req.file.mimetype,
//         },
//       });

//       await newProperty.save();
//       if (sites) {
       
//         for (let i = 0; i < sites; i++) {
//            const newSite = new Site({
//             propertyId: newProperty._id,  // Link site with the newly created property
//           });
//           await newSite.save();
//         }
//       }
//       res.status(201).json({ success: true });
//     } catch (error) {
//       console.error("Error inserting Property:", error.message);
//       res.status(500).json({
//         success: false,
//         message: "Error inserting Property",
//         error: error.message,
//       });
//     }
//   } else {
//     console.log("req.file is not present");
//     try {
//       const PropertyData = req.body;

//       // Create new Property without file information
//       const newProperty = new Property({
//         ...PropertyData,
//       });

//       await newProperty.save();
//       if (sites) {
       
//         for (let i = 0; i < sites; i++) {
//           const newSite = new Site({
//             propertyId: newProperty._id,  // Link site with the newly created property
//           });
//           await newSite.save();
//         }
//       }
//       res.status(201).json({ success: true });
//     } catch (error) {
//       console.error("Error inserting Property without file:", error.message);
//       res.status(500).json({
//         success: false,
//         message: "Error inserting Property",
//         error: error.message,
//       });
//     }
//   }
// };
const updateProperty = async (req, res) => {
  const { id } = req.body; // Form fields will be in req.body
  const oldData = req.body;
  console.log('ok');
  console.log(oldData);

  try {
    // Initialize an array to hold uploaded photo details
    const photos = [];

    // Check if new files are being uploaded
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const { originalname, buffer, mimetype } = file;

        if (!mimetype || typeof mimetype !== "string") {
          return res.status(400).json({ success: false, message: "Invalid MIME type" });
        }

        // Upload the image (assuming you have a function `uploadImage` for this)
        const uploadResult = await uploadImage(buffer, originalname, mimetype);

        if (!uploadResult) {
          return res.status(500).json({ success: false, message: "File upload error" });
        }

        // Push the uploaded image details to the photos array
        photos.push({
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
          originalname: originalname,
          mimetype: mimetype,
        });
      }
    }
console.log(id);
    // If `photos` exist in the old data, merge it with new uploads
    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    const updatedPhotos = [
      ...(existingProperty.photos || []), // Existing photos (if any)
      ...photos, // Newly uploaded photos
    ];

    // Update the property with new/old data and merged photos
    const result = await Property.updateOne(
      { _id: id },
      {
        $set: {
          ...oldData, // Update with the rest of the fields from oldData
          photos: updatedPhotos, // Set updated photos
        },
      }
    );

    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error("Error updating Property with multiple files:", err.message);
    res.status(500).json({
      success: false,
      message: "Error updating Property",
      error: err.message,
    });
  }
};


// const updateProperty = async (req, res) => {
//   const updatedata = req.body;
//   const id = updatedata.id;
//   try {
//     const result = await Property.updateOne(
//       { _id: id },
//       { $set: updatedata.oldData }
//     );
//     if (!result) {
//       res.status(404).json({ success: false, message: "Property not found" });
//     }
//     res.status(201).json({ success: true, result: result });
//   } catch (err) {
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "error in updating the Property",
//         error: err.message,
//       });
//   }
// };

const getAllProperty = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = req.query.search;

    const query = {
      deleted_at: null,
    };

    if (search) {
      query.$or = [
        { propertyname: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    const result = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await Property.find(query).countDocuments();

    res.status(200).json({ success: true, result, count });
  } catch (error) {
    console.error("Error fetching properties:", error);  // Log the actual error
    res.status(500).json({ success: false, message: "error fetching Property", error: error.message });
  }
};
const getSingleProperty = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await Property.findOne({ _id: id });
    if (!result) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    res.status(201).json({ success: true, result: result });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "error fetching Property" });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await Property.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "error fetching Property" });
  }
};
const getsinglePropertyID = async(req,res) => {
  const { id } = req.query; // Destructure id and transactionType from req.query
  try {
      const query = { _id: id }; // Build the query with _id
  
    
      const result = await Property.find(query); // Query the database
      if (!result || result.length === 0) {
          return res.status(404).json({ message: "No property found" });
      }
  
      res.status(201).json({ success: true, result });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
  }
  
}
const deletePropertyPhoto = async(req,res) =>{
  const { propertyId, photoIndex } = req.body;

  try {
    // Find the property by ID
    const property = await Property.findById(propertyId);
    console.log(property);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if photoIndex is valid
    if (photoIndex < 0 || photoIndex >= property.photos.length) {
      return res.status(400).json({ message: 'Invalid photo index' });
    }

    // Get the public ID of the photo to delete from Cloudinary
    const photoPublicId = property.photos[photoIndex].publicId; // Ensure your photo object has a public_id field
    // Delete the photo from Cloudinary
    await cloudinary.uploader.destroy(photoPublicId, (error, result) => {
      if (error) {
        console.error('Cloudinary error:', error);
        return res.status(500).json({ message: 'Failed to delete photo from Cloudinary' });
      }
      console.log('Cloudinary result:', result);
    });

    // Remove the photo from the array
    property.photos.splice(photoIndex, 1);

    // Save the updated property
    await property.save();

    res.status(200).json({ success:true,message: 'Photo deleted successfully', photos: property.photos });
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false, message: 'Server error' });
  }
}
module.exports = {
  insertProperty,
  updateProperty,
  getAllProperty,
  getSingleProperty,
  deleteProperty,
  getsinglePropertyID,
  deletePropertyPhoto,
};
