const {
  insertSite,
  updateSite,
  getAllSite,
  getSingleSite,
  deleteSite,
  updatesitestatus
} = require("../Controllers/SiteController");
const express = require("express");
const router = express.Router();

router.post("/insertSite", insertSite);
router.put("/updateSite", updateSite);
router.get("/getAllSite", getAllSite);
router.post("/getSingleSite", getSingleSite);
router.delete("/deleteSite", deleteSite);

router.post('/updatesitestatus/:id',updatesitestatus);

module.exports = router;
