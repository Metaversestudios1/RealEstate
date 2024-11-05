const {
  insertRank,
  updateRank,
  getAllRank,
  getSingleRank,
  deleteRank,
} = require("../Controllers/RankController");
const express = require("express");
const router = express.Router();

router.post("/insertRank", insertRank);
router.put("/updateRank", updateRank);
router.get("/getAllRank", getAllRank);
router.post("/getSingleRank", getSingleRank);
router.delete("/deleteRank", deleteRank);

module.exports = router;
