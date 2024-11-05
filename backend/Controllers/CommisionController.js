const Commision = require("../Models/CommisionModel");
const bcrypt = require("bcrypt");
const insertCommision = async (req, res) => {
  try {
    const newCommision = new Commision(req.body);
    await newCommision.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error inserting Commision",
        error: err.message,
      });
  }
};

const updateCommision = async (req, res) => {
  const updatedata = req.body;
  const id = updatedata.id;
  try {
    const result = await Commision.updateOne(
      { _id: id },
      { $set: updatedata.oldData }
    );
    if (!result) {
      res.status(404).json({ success: false, message: "Commision not found" });
    }
    res.status(201).json({ success: true, result: result });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "error in updating the Commision",
        error: err.message,
      });
  }
};

const getAllCommision = async (req, res) => {
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

    const result = await Commision.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await Commision.find(query).countDocuments();
    res.status(200).json({ success: true, result, count });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "error inserting Commision" });
  }
};
const getSingleCommision = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await Commision.findOne({ _id: id });
    if (!result) {
      res.status(404).json({ success: false, message: "Commision not found" });
    }
    res.status(201).json({ success: true, result: result });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "error fetching Commision" });
  }
};

const deleteCommision = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await Commision.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Commision not found" });
    }
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "error fetching Commision" });
  }
};
module.exports = {
  insertCommision,
  updateCommision,
  getAllCommision,
  getSingleCommision,
  deleteCommision,
};
