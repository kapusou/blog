const db = require('./mysql');

const Tag = require('./tags');

const article = {

    id: {type: 'serial', key: true}, //主键
    title: String,
    content: {type: 'text'},
    pubtime: {type: 'date', time: true},
    date: String,
    brief: {type: 'text'},
    tag_id: {type: 'integer'},
    hits: {type: 'integer', defaultValue: 0},    // 默认值0
    bad: {type: 'integer', defaultValue: 0},
    good: {type: 'integer', defaultValue: 0},
    image: String
};

// 定义数据库模型
const Article = db.define('article', article);

Article.hasOne('tag', Tag, {autoFetch: true});

module.exports = Article;



