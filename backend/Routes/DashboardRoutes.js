const express = require('express');
const {  getclientcount,
    getsitecount,
    getagentcount,
    getPropertyCount,
    getrankcount,
    getrankcount5
} = require("../Controllers/DashBoardController");

const router = express.Router();

router.get('/getclientcount', getclientcount);
router.get('/getsitecount', getsitecount);
router.get('/getPropertyCount', getPropertyCount);
router.get('/getagentcount', getagentcount);
router.get('/getrankcount', getrankcount);
router.get('/getrankcount5', getrankcount5);




module.exports = router;

