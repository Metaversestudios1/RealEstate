const Project = require("../Models/ProjectModel");
const bcrypt = require("bcrypt");
const insertProject = async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error inserting Project",
        error: err.message,
      });
  }
};

const updateProject = async (req, res) => {
  const updatedata = req.body;
  const id = updatedata.id;
  try {
    const result = await Project.updateOne(
      { _id: id },
      { $set: updatedata.oldData }
    );
    if (!result) {
      res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(201).json({ success: true, result: result });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "error in updating the Project",
        error: err.message,
      });
  }
};

const getAllProject = async (req, res) => {
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

    const result = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await Project.find(query).countDocuments();
    res.status(200).json({ success: true, result, count });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "error inserting Project" });
  }
};
const getSingleProject = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await Project.findOne({ _id: id });
    if (!result) {
      res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(201).json({ success: true, result: result });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "error fetching Project" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await Project.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "error fetching Project" });
  }
};
module.exports = {
  insertProject,
  updateProject,
  getAllProject,
  getSingleProject,
  deleteProject,
};
