const bcrypt = require("bcryptjs");
const Admin = require("../Models/Admin");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const insertadmin = async (req, res) => {
  const { password, ...data } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newadmin = new Admin({
      ...data,
      password: hashedpassword,
    });

    const result = await newadmin.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({
        success: true,
        message: "error in inserting admin",
        error: err.message,
      });
  }
};
// const login = async (req, res) => {
//   const { email, password } = req.body; // Include role in the destructuring
//   try {
//     // Check if all fields are provided
//     if (!email || !password ) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please provide all fields" });
//     }

//     // Find the admin by email
//     const admin = await Admin.findOne({ email });
    
//     if (!admin) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Email not found" });
//     }

//     // Compare the provided password with the stored hashed password
//     const match = await bcrypt.compare(password, admin.password);
//     if (!match) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Password does not match" });
//     }
//     const tokenExpiryDuration = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
//     if (admin.lastLoginToken && admin.lastLoginTime && Date.now() - admin.lastLoginTime < tokenExpiryDuration) {
//       return res.status(403).json({
//         success: false,
//         message: "Already logged in on another browser. Please log out from there first.",
//       });
//     }

//     // Generate a JWT token
//     const token = jwt.sign(
//       { id: admin._id }, // Include role in the token payload if needed
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     admin.lastLoginToken = token;
//     admin.lastLoginTime = Date.now();
//     await admin.save();
//     // Set cookie options
//     const options = {
//       expires: new Date(Date.now() + 2592000000), // 30 days
//       httpOnly: true,
//       sameSite: "None",
//     };

//     // Send response with token and admin details
//     res.cookie("token", token, options).json({
//       success: true,
//       token,
//       admin,
//     });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ success: false, message: "Server error: " + err.message });
//   }
// };


const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Password does not match" });
    }

    const tokenExpiryDuration = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
    // Check if last login time is set and not expired
    if (admin.lastLoginToken && admin.lastLoginTime) {
      const timeElapsed = Date.now() - admin.lastLoginTime;
      if (timeElapsed < tokenExpiryDuration) {
        return res.status(403).json({
          success: false,
          message: "Already logged in on another browser. Please log out from there first.",
        });
      } else {
        // Expired session, reset login fields
        admin.lastLoginToken = null;
        admin.lastLoginTime = null;
        await admin.save();
      }
    }

    // Generate a new JWT token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Update last login fields with the new session info
    admin.lastLoginToken = token;
    admin.lastLoginTime = Date.now();
    await admin.save();

    const options = {
      expires: new Date(Date.now() + 2592000000), // 30 days
      httpOnly: true,
      sameSite: "None",
    };

    res.cookie("token", token, options).json({
      success: true,
      token,
      admin,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
};
const logout = async (req, res) => {
  try {
    const { id } = req.body;
    // Clear the session cookies
    res.clearCookie("connect.sid"); // Clear the session ID cookie
    res.clearCookie("token"); // Clear the JWT cookie
    
    // Optionally, clear the lastLoginToken from the database if you want to allow a new login
    const adminId = id; // Assuming you're using middleware to set req.user
    if (adminId) {
      await Admin.findByIdAndUpdate(adminId, { lastLoginToken: null });
    }

    return res.status(200).json({ success: true, message: "Successfully logged out" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
  // res.clearCookie("connect.sid"); // Name of the session ID cookie
  // res.clearCookie("token"); // Name of the session ID cookie
  // res.status(200).json({ status: true, message: "Successfully logged out" });
};

const updateAdmin = async (req, res) => {
  const updatedata = req.body;
  const id = updatedata.id;
  try {
    // console.log(updatedata.oldData)

    const result = await Admin.updateOne(
      { _id: id },
      { $set: updatedata.oldData }
    );
    if (!result) {
      res.status(404).json({ success: false, message: "Admin not found" });
    }
    res.status(201).json({ success: true, result: result });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "error in updating the Admin",
        error: err.message,
      });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = req.query.search;

    const query = {
      deleted_at: null,
    };
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const result = await Admin.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await Admin.find(query).countDocuments();
    res.status(200).json({ success: true, result, count });
  } catch (error) {
    res.status(500).json({ success: false, message: "error inserting Admin" });
  }
};
const getSingleAdmin = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await Admin.findOne({ _id: id });
    if (!result) {
      res.status(404).json({ success: false, message: "Admin not found" });
    }
    res.status(201).json({ success: true, result: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "error fetching Admin" });
  }
};

module.exports = {
  insertadmin,
  login,
  logout,
  updateAdmin,
  getSingleAdmin,
  getAllAdmin,
};
