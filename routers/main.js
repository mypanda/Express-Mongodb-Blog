//1.引入express
var express = require('express');
//8.引入分类model
var Category = require('../models/Category');
//11.引入内容model
var Content = require('../models/Content');
var markdown = require( "markdown" ).markdown;
//2.创建路由
var router = express.Router();


//17。导航栏通用
var data;
router.use(function(req,res,next) {
	data = {
		//从下面提取的
		userInfo:req.userInfo,
		categories:[]
	}

	Category.find().then(function(categories) {
		data.categories = categories
		next();
	})
});

/*
*	5.设置首页路由
* 	9.首页
**/
router.get('/',function( req,res,next ) {
	//6. res.send('main-user');
	
	//10.文章
	// data = {
	// 	// userInfo:req.userInfo,
	// 	//12分类
	// 	category:req.query.category || '',
	// 	// categories:[],
	// 	contents:'',
	// 	count:0,
	// 	page : Number(req.query.page || 1),
	// 	limit : 10,
	// 	pages : 0
	// };
	data.category = req.query.category || '';
	data.contents = "";
	data.count = 0;
	data.page = Number(req.query.page || 1);
	data.limit = 10;
	data.pages = 0;
	// 14
	var where = {};
	//13
	if (data.category) {
		where.category = data.category
	}

	//8.查询分类///////这里改造了
	// .... Category.find().then(function(categories) {

		// console.log(categories);

		// .... data.categories = categories;

		//读取总页数
		//15分类的统计条数
		// .... return Content.where(where).count();
		Content.where(where).count().then(function(count) {
		
		data.count = count;
		// 计算总页数
		data.pages = Math.ceil( data.count/data.limit );
		//取值不能超过pages
		data.page = Math.min( data.page,data.pages );
		//取值不能小于1
		data.page = Math.max( data.page,1 );
		var skip = (data.page - 1) * data.limit;

		return Content.find().where(where).limit(data.limit).skip(skip).populate(['category','user']).sort({addTime:-1});

	}).then(function(contents) {
		data.contents = contents;
		//7.分配模板数据,第二个参数是模板使用的数据
		res.render('main/index',data);
	});
});

//16.详情页
router.get('/view',function(req,res,next) {
	var categoryId = req.query.categoryid || '';
	Content.findOne({
		_id:categoryId
	}).then(function(content) {
		data.content = content;

		//17。增加阅读数量
		content.views++;
		return content.save();
	}).then(function() {
		//markdown转html
		data.content.content = markdown.toHTML(data.content.content);
		res.render('main/view',data);
	});
});

//4.导出模块
module.exports = router;