const bcrypt = require("bcrypt");
const RankModel = require("../Models/RankModel");
const insertRank = async (req, res) => {
  const { name, commissionRate, description, level } = req.body;
  if (!name || !commissionRate || !level) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const newRank = new RankModel({
      name,
      commissionRate,
      description,
      level,
    });
    await newRank.save();
    res
      .status(200)
      .json({ success: true, message: "Rank added successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateRank = async (req, res) => {
  const updatedata = req.body;
  const id = updatedata.id;
  try {
    const result = await RankModel.updateOne(
      { _id: id },
      { $set: updatedata.oldData }
    );
    if (!result) {
      res.status(404).json({ success: false, message: "Rank not found" });
    }
    res.status(201).json({ success: true, result });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "error in updating the rank",
      error: err.message,
    });
  }
};

const getAllRank = async (req, res) => {
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

    const result = await RankModel.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await RankModel.find(query).countDocuments();
    res.status(200).json({ success: true, result, count });
  } catch (error) {
    res.status(500).json({ success: false, message: "error inserting Rank" });
  }
};
const getSingleRank = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await RankModel.findOne({ _id: id });
    if (!result) {
      return res.status(404).json({ success: false, message: "Rank not found" });
    }
    return res.status(201).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: "error fetching Rank" });
  }
};

const deleteRank = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await RankModel.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Rank not found" });
    }
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "error fetching Rank" });
  }
};

module.exports = {
  insertRank,
  updateRank,
  getAllRank,
  getSingleRank,
  deleteRank,
};
