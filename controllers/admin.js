const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

    res.render('admin/login', {error: ''});

});

// 管理员
router.post('/login', function (req, res, next) {

    let username = req.body.username;
    let password = req.body.password;

    if (username === 'admin' && password === '666666') {
        res.render('admin/backend/index', {path: '', open: ''});
    } else {
        res.render('admin/login', {error: '输入的账号或者密码错误'});
    }
});

module.exports = router;
