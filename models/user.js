const db = require('./mysql');

const user = {

    id: {type: 'serial', key: true}, //  设为主键
    username: String,
    password: String,
    created_at: {type: 'integer', defaultValue: 0},
    updated_at: {type: 'integer', defaultValue: 0}
};
const User = db.define('user', user);

module.exports = User;
