const {
    getAllAgentsWithoutPagination,
    getAllSitesWithoutPagination,

  } = require("../Controllers/CommonController");
  const express = require("express");
  const router = express.Router();

  router.get("/getAllSitesWithoutPagination", getAllSitesWithoutPagination);
  router.get("/getAllAgentsWithoutPagination", getAllAgentsWithoutPagination);

  module.exports = router;
  