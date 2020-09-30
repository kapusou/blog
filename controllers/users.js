const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('暂无页面');
});

module.exports = router;
