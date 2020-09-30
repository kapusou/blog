const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');             // swig模块也是模板处理模块，也可以使用

const routes = require('./controllers/index');
const users = require('./controllers/users');
const admin = require('./controllers/admin');
const tag = require('./controllers/tag');
const article = require('./controllers/article');
const app = express();

// 设置渲染引擎
// 注：(设置模板文件存放的目录，第一个参数是views，第二个参数是目录)
app.set('views', path.join(__dirname, 'views'));

// 设置模板的后缀是html
// 注：(第一个参数:模板引擎的名称，同时也是模板文件的后缀，第二个参数表示用于解析处理模板内容的方法)
app.engine('html', ejs.renderFile);

// 注册所使用的模板引擎，第一个参数必须是 view engine,第二个参数是app.engine   ---在这里是html
// 这个方法定义的模板引擎的名称（第一个参数）是一致的
app.set('view engine', 'html');

// 图标
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// 中间件 处理post提交数据为json格式，必须在路由之前
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 根据不同的功能划分模块
app.use('/', routes);    // 若前面没有加载js文件模块可以写成：app.use('/', require(./routes));
app.use('/users', users);
app.use('/admin', admin);
app.use('/tag', tag);
app.use('/article', article);

// 捕获404并转发到错误处理程序
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 错误处理程序
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
        next();
    });
}

// app.use(function (err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });

module.exports = app;
