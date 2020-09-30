const User = require("../models/user");

/**
 * 根据用户名字获取用户信息
 * @param name
 * @param callback
 * @returns {*}
 */
exports.getUserInfo = function (name, callback) {

    if (name.length === 0) {
        return callback(null, []);
    }
    User.find({username: name}, callback);
};
