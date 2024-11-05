const {
  insertClient,
  updateClient,
  getAllClient,
  getSingleClient,
  deleteClient,
  clientlogin,
  getNextclientId,
  updateClientDetails,
  getClientNotification,
offClientNotification
} = require("../Controllers/ClientController");
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
router.post("/insertClient", insertClient);
router.put("/updateClient", updateClient);
router.get("/getAllClient", getAllClient);
router.post("/getSingleClient", getSingleClient);
router.delete("/deleteClient", deleteClient);
router.get("/getNextclientId", getNextclientId);
router.post("/clientlogin", clientlogin);
router.put("/updateClientDetails", upload.fields([{ name: 'photo', maxCount: 1 }]), updateClientDetails);
router.post("/getClientNotification", getClientNotification);
router.post("/offClientNotification", offClientNotification);
module.exports = router;
