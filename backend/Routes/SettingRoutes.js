const { updatesetting, getsetting ,insertsetting} = require('../Controllers/SettingController');
const express = require('express')
const router = express.Router();

router.put('/updatesetting',updatesetting);
router.get('/getAllSetting',getsetting);
router.post('/insertsetting',insertsetting);

module.exports =router;