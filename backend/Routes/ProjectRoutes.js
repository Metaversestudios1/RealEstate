const {
  insertProject,
  updateProject,
  getAllProject,
  getSingleProject,
  deleteProject,
} = require("../Controllers/ProjectController");
const express = require("express");
const router = express.Router();

router.post("/insertProject", insertProject);
router.put("/updateProject", updateProject);
router.get("/getAllProject", getAllProject);
router.post("/getSingleProject", getSingleProject);
router.delete("/deleteProject", deleteProject);

module.exports = router;
