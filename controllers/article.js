const express = require('express');
const router = express.Router();
const moment = require('moment');
const tags = require('../services/Tags');
const article = require('../services/Article');

//添加文章
router.get('/add', function (req, res, next) {

    tags.getTagsList(function (err, tags) {
        res.render('admin/backend/article/addarticle', {tagList: tags, path: '/article/add', open: 'article'});
    });
});

//添加文章处理
router.post('/addarticle', function (req, res, next) {
    // 前端传来的body
    let title = req.body.title;
    let content = req.body.content;
    let brief = req.body.brief;
    let tagid = req.body.tagid;
    article.addArticle(title, content, brief, tagid, function (err, results) {
        if (err) {

            res.json({status: 0, msg: '添加失败'});
        }
        res.json({status: 1, msg: '添加成功'});
    });
});

//文章列表
router.get('/articles', function (req, res, next) {

    //每页显示的记录数
    let pageSizes = 10;
    //当前页
    let pageNow = req.query.page ? req.query.page : 1;
    //获取总文章数量
    article.articleCount(function (err, count) {
        //获取文章列表
        article.articleList(pageSizes, pageNow, function (err, articleList) {

            if (err) {

                return next(err);
            }
            for (let i = 0; i < articleList.length; i++) {
                articleList[i].pubtime = moment(articleList[i].pubtime).format('YYYY-MM-DD HH:mm:ss');
                console.log(articleList[i].tag);
            }
            //计算总页数
            let totalPage = parseInt((count + pageSizes - 1) / pageSizes);

            res.render('admin/backend/article/index', {
                articleList: articleList,
                totalCount: count,
                totalPage: totalPage,
                currentPage: pageNow,
                path: '/article/articles',
                open: 'article'
            });
        });
    });
});
//根据文章id查询文章
router.get('/queryById', function (req, res, next) {

    let id = req.query.id;
    article.articleById(id, function (err, article) {

        if (err) {

            return next(err);
        }
        article[0].pubtime = moment(article[0].pubtime).format('YYYY年MM月DD日');
        res.json({article: article[0]})
    });
});
//更新文章
router.get('/updateArticle', function (req, res, next) {

    let id = req.query.id;

    article.articleById(id, function (err, article) {

        tags.getTagsList(function (err, tags) {

            if (err) {

                return next(err);
            }
            res.render('admin/backend/article/update', {
                tagList: tags,
                article: article[0],
                path: '/article/articles',
                open: 'article'
            });
        });
    });
});
//更新文章处理
router.post('/updatearticledone', function (req, res, next) {

    let id = req.body.id;
    let title = req.body.title;
    let content = req.body.content;
    let brief = req.body.brief;
    let tagid = req.body.tagid;
    article.articleUpdate(id, title, content, brief, tagid, function (err, result) {

        if (err) {

            res.json({status: 0, msg: '更新失败'});
        }
        res.json({status: 1, msg: '更新成功'});
    });
});

module.exports = router;
