const {
  insertAgent,
  updateAgent,
  getAllAgent,
  getSingleAgent,
  deleteAgent,
  agentlogin,
  getAllAgentproperty,
  getNextAgentId,
  getAgentCommition,
  updateAgentDetails,
  getNotification,
  offNotification,
  updatestatus
} = require("../Controllers/AgentController");
const express = require("express");
const router = express.Router();
const multer = require('multer');
 
// Configure multer storage and file handling
const storage = multer.memoryStorage();
 
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only certain files are allowed!'), false);
    }
  }
});
 
router.post("/insertAgent", insertAgent);
router.put("/updateAgent", updateAgent);
router.get("/getAllAgent", getAllAgent);
router.post("/getSingleAgent", getSingleAgent);
router.delete("/deleteAgent", deleteAgent);
router.post("/agentlogin", agentlogin);
router.get("/getAllAgentproperty", getAllAgentproperty);
router.get("/getNextAgentId", getNextAgentId);
router.post("/getAgentCommition", getAgentCommition);
router.put("/updateAgentDetails", upload.fields([{ name: 'photo', maxCount: 1 }]), updateAgentDetails);
 
router.post("/getNotification", getNotification);
router.post("/offNotification", offNotification);
router.post("/updatestatus/:id", updatestatus);







module.exports = router;
