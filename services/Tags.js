module.exports = {
    getTagsList,
    addTag,
    updateTag
};

const Tags = require("../models/tags");
const moment = require('moment');

/**
 * 获取标签列表
 * @param callback
 */
function getTagsList(callback) {

    Tags.find(callback);
}

/**
 * 添加标签
 * @param tagname
 * @param callback
 */
function addTag(tagname, callback) {

    let newRecord = {};
    newRecord.tagname = tagname;
    newRecord.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    Tags.create(newRecord, function (err, results) {

        return callback(err, results);

    });
}

/**
 * 更新标签
 * @param id
 * @param tagname
 * @param callback
 */
function updateTag(id, tagname, callback) {

    Tags.find({id: id}, function (err, tag) {

        tag[0].tagname = tagname;
        tag[0].save(function (err, result) {

            return callback(err, result);
        });
    });
}
