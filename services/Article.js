module.exports = {
    addArticle,
    articleList,
    articleSearchList,
    articleCount,
    articleById,
    articleUpdate,
    articleNew,
    articleTagCount,
    articleArchives,
    articleViewsUpdate,
    articleGoodUpdate,
    articleBadUpdate,
    upAndDown
};

const Article = require("../models/article");
const db = require("../models/mysql");
const moment = require('moment');

// 添加文章
function addArticle(title, content, brief, tagid, callback) {

    let newRecord = {};
    newRecord.title = title;
    newRecord.content = content;
    newRecord.pubtime = moment().format('YYYY-MM-DD HH:mm:ss');
    newRecord.date = moment().format('YYYY年MM月');
    newRecord.brief = brief;   // 简要
    newRecord.tag_id = tagid;
    Article.create(newRecord, function (err, results) {

        return callback(err, results);
    });
}

// 文章列表
function articleList(pageSize, pageNow, callback) {

    //计算偏移量
    let offset = pageSize * (pageNow - 1);

    Article.find().limit(pageSize).offset(offset).order('-pubtime').all(function (err, articles) {

        return callback(err, articles);
    });
}

// 文章列表
function articleSearchList(param, callback) {

    let pageSize = param.pageSize;
    let pageNow = param.pageNow;
    let tagid = param.tagid;
    let date = param.date;
    let key = param.key;
    // 计算偏移量
    let offset = pageSize * (pageNow - 1);
    let sql = "SELECT t1.*,t2.logo FROM article as t1 LEFT JOIN tags as t2 on t1.tag_id = t2.id WHERE 1=1 ";
    if (key) {
        sql += " AND t1.title like '%" + key + "%'";
    }
    if (tagid) {
        sql += " AND t1.tag_id = " + tagid;
    }
    if (date) {
        sql += " AND t1.date = '" + date + "'";
    }
    sql += " order by t1.pubtime desc";
    sql += " LIMIT " + offset + "," + pageSize + "";
    db.driver.execQuery(sql, function (err, articles) {

        console.log(err);
        return callback(err, articles);
    });
}

// 文章总记录数
function articleCount(callback) {

    Article.count(function (err, count) {

        return callback(err, count);
    });
}

// 根据id查询文章
function articleById(id, callback) {

    Article.find({id: id}, function (err, article) {

        return callback(err, article);
    });
}

// 更新文章
function articleUpdate(id, title, content, brief, tagid, callback) {

    Article.find({id: id}, function (err, article) {

        article[0].title = title;
        article[0].content = content;
        article[0].brief = brief;
        article[0].tag_id = tagid;
        article[0].save(function (err, result) {

            return callback(err, result);
        });
    });
}

// 最新文章  按时间排序  5篇文章
function articleNew(callback) {

    Article.find().limit(5).order('-pubtime').all(function (err, articles) {

        return callback(err, articles);
    });
}

// 文章分类数统计
function articleTagCount(callback) {

    db.driver.execQuery(
        "SELECT t2.tagname,t2.id,count(*) as nums FROM article as t1 left join tags as t2 on t1.tag_id = t2.id GROUP BY t1.tag_id",

        function (err, data) {

            return callback(err, data);

        });
}

// 文章存档统计
function articleArchives(callback) {


    Article.aggregate(['date'], {}).count().groupBy('date').get(function (err, data) {

        return callback(err, data);
    });
}

// 更新文章的浏览数数
function articleViewsUpdate(id, callback) {

    Article.find({id: id}, function (err, article) {

        article[0].hits = parseInt(article[0].hits + 1);
        article[0].save(function (err, result) {

            return callback(err, result);
        });
    });
}

// 更新文章的点赞数
function articleGoodUpdate(id, callback) {

    Article.find({id: id}, function (err, article) {

        article[0].good = parseInt(article[0].good + 1);
        article[0].save(function (err, result) {

            return callback(err, result);
        });
    });
}

// 更新文章的踩数
function articleBadUpdate(id, callback) {

    Article.find({id: id}, function (err, article) {

        article[0].bad = parseInt(article[0].bad + 1);
        article[0].save(function (err, result) {

            return callback(err, result);
        });
    });
}

//获取 上一篇和下一篇
function upAndDown(id, callback) {
    //上一篇
    db.driver.execQuery("SELECT * FROM article as t1 WHERE t1.id < '" + id + "' order by id desc limit 0,1 ", function (err, up) {
        //下一篇
        db.driver.execQuery("SELECT * FROM article as t1 WHERE t1.id > '" + id + "' order by id desc limit 0,1 ", function (err, down) {
            let result = [up, down];
            return callback(err, result);
        });
    });
}

