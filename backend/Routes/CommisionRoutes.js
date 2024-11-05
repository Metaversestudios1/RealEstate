const {
    insertCommision,
  updateCommision,
  getAllCommision,
  getSingleCommision,
  deleteCommision,
} = require("../Controllers/CommisionController");
const express = require("express");
const router = express.Router();

router.post("/insertCommision", insertCommision);
router.put("/updateCommision", updateCommision);
router.get("/getAllCommision", getAllCommision);
router.post("/getSingleCommision", getSingleCommision);
router.delete("/deleteCommision", deleteCommision);

module.exports = router;
