const {
  insertProperty,
  updateProperty,
  getAllProperty,
  getSingleProperty,
  deleteProperty,
  getsinglePropertyID,
  deletePropertyPhoto,
} = require("../Controllers/PropertyController");
const express = require("express");
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Only image files are allowed!'), false); // Reject the file
    }
  }
}).array('photos', 10);

router.post("/insertProperty", upload, insertProperty);
router.put("/updateProperty",upload, updateProperty);
router.get("/getAllProperty", getAllProperty);
router.post("/getSingleProperty", getSingleProperty);
router.delete("/deleteProperty", deleteProperty);
router.get('/getsinglePropertyID',getsinglePropertyID);
router.delete('/deletePropertyPhoto',deletePropertyPhoto);


module.exports = router;
