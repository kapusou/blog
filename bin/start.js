#!/usr/bin/env node
/**
 * 个人博客系统
 * 前端页面访问: localhost:3000
 * 后端页面访问：localhost:3000/admin
 */

const app = require('../app');
const debug = require('debug')('blog:server');
const http = require('http');
const server = http.createServer(app);

const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.log('监听端口' + port + '服务已经启动...');

// 判断端口
function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {  // 端口号为空，返回val
        return val;
    }
    if (port >= 0) {    // 端口号不为空，返回port
        return port;
    }
    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // 处理特定的监听错误
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
