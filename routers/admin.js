//1.加载express
var express = require('express');

//2.使用路由
var router = express.Router();
//9.引入用户表model
var User = require('../models/User');
//16。引入分类模型
var Category = require('../models/Category');
//26 引入内容模型
var Content = require('../models/Content');

//4.测试
// router.get('/user',function( req,res,next ) {
// 	res.send('user');
// });

//5.admin统一管理，不是管理员的话不让进入
router.use(function(req,res,next) {
	if (!req.userInfo.isAdmin) {

		//当前用户是非管理员
		res.send('对不起，只有管理员才可以进入后台管理！');
		return false;
	};
	next();
});

//6.后台首页
router.get('/',function(req,res,next) {
	//测试
	// res.send('后台首页');
	res.render('admin/index',{
		userInfo:req.userInfo
	});
});


//7.用户管理
router.get('/user',function(req,res,next) {

	/* 
	* 8.从数据库中读取所有的用户数据
	* 9.limit(Number)：限制获取的数据条数
	* 10.skip(2);忽略数据的条数
	* 
	* 每页显示两条
	* 1 : 1-2 skip:0 ->当前页-1 * limit
	* 2 : 3-4 skip:2
	**/

	var page = Number(req.query.page || 1);
	var limit = 10;
	var pages = 0;

	//11.统计数据的总条数
	User.count().then(function(count) {

		//12.限制
		// 计算总页数
		pages = Math.ceil( count/limit );
		//取值不能超过pages
		page = Math.min( page,pages );
		//取值不能小于1
		page = Math.max( page,1 );

		var skip = (page - 1)*limit;

		User.find().limit(limit).skip(skip).then(function( users ) {
			//8.1传递数据上
			res.render('admin/user_index',{
				userInfo:req.userInfo,
				users:users,

				count:count,
				pages:pages,
				page:page,
				limit:limit

			});
		});
	});

	//10.
	// User.find().limit(limit).skip(skip).then(function( users ) {
	// 	//8.1传递数据上
	// 	res.render('admin/user_index',{
	// 		userInfo:req.userInfo,
	// 		users:users,
	// 		page:page
	// 	});
	// });

	//7.1用户
	// res.render('admin/user_index',{
	// 	userInfo:req.userInfo
	// });
});

//13.分类首页
router.get('/category',function(req,res,next) {

	// res.render('admin/category_index',{
	// 	userInfo:req.userInfo
	// });

	// 18.
	var page = Number(req.query.page || 1);
	var limit = 10;
	var pages = 0;

	//11.统计数据的总条数
	Category.count().then(function(count) {

		//12.限制
		// 计算总页数
		pages = Math.ceil( count/limit );
		//取值不能超过pages
		page = Math.min( page,pages );
		//取值不能小于1
		page = Math.max( page,1 );

		var skip = (page - 1)*limit;

		/*
		* 21.查询的数据的排序
		*	sort()
		*	传一个的对象,
		*	1:升序
		*	-1:降序
		*/
		Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function( categorise ) {
			//8.1传递数据上
			res.render('admin/category_index',{
				userInfo:req.userInfo,
				categorise:categorise,

				count:count,
				pages:pages,
				page:page,
				limit:limit

			});
		});
	});
});

//14.分类添加
router.get('/category/add',function(req,res) {

	res.render('admin/category_add',{
		userInfo:req.userInfo
	});
});

//15.分类保存
router.post('/category/add',function(req,res) {

	//17.req.body就是post数据
	var name = req.body.name || '';

	if (name=='') {
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'名称不能为空'
		});
		return false;
	}

	//数据库中是否有相同分类名称
	Category.findOne({
		name:name
	}).then(function(result) {
		if (result) {

			//数据库中已经存在该分类
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'分类已经存在'
			});

			//不在走then这个方法了
			return Promise.reject();
		}else{
			//数据库不存在该分类，可以保存
			return new Category({
				name:name
			}).save();
		}
	}).then(function(newCategory) {
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'分类保存成功',
			url:'/admin/category'
		})
	});
});

// 19.分类的修改
router.get('/category/edit',function(req,res) {

	//获取要修改的分类信息，并且用表单的形式展现出来
	var id = req.query.id || '';

	Category.findOne({
		_id:id
	}).then(function(category) {
		if (!category) {
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'分类信息不存在'
			});
		}else{
			res.render('admin/category_edit',{
				userInfo:req.userInfo,
				category:category
			});
		};
	});
});

// 19.分类的修改保存
router.post('/category/edit',function(req,res) {

	//get的到请求的id
	var id = req.query.id || '';

	//获取post提交的数据
	var name = req.body.name || '';

	Category.findOne({
		_id:id
	}).then(function(category) {
		if (!category) {
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'分类信息不存在'
			});
			return Promise.reject();
		}else{
			
			//当用户没有做任何修改的提交的时候
			if ( name == category.name) {
				res.render('admin/success',{
					userInfo:req.userInfo,
					message:'修改成功',
					url:'/admin/category'
				});
				return Promise.reject();
			}else{
				//要修改的分类名称是否已经在数据库中存在
				return Category.findOne({
					_id:{$ne:id},
					name:name
				});
			};
		};
	}).then(function(sameCategory) {
		if (sameCategory) {
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'数据库已经存在同名分类'
			});
			return Promise.reject();
		}else{
			return Category.update({
				_id:id
			},{
				name:name
			});
		};
	}).then(function() {
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'修改成功',
			url:'/admin/category'
		});
	});
});

// 20.分类的删除
router.get('/category/delete',function(req,res) {
	
	//获取要删除的分类ID
	var id = req.query.id || '';

	Category.remove({
		_id:id
	}).then(function() {
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'删除成功',
			url:'/admin/category'
		});
	});
});

//22.内容首页
router.get('/content',function(req,res) {
	
	//28.内容首页
	var page = Number(req.query.page || 1);
	var limit = 10;
	var pages = 0;

	//统计数据的总条数
	Content.count().then(function(count) {

		//限制
		// 计算总页数
		pages = Math.ceil( count/limit );
		//取值不能超过pages
		page = Math.min( page,pages );
		//取值不能小于1
		page = Math.max( page,1 );

		var skip = (page - 1)*limit;

		/*
		*	查询的数据的排序
		*	sort()
		*	传一个的对象,
		*	1:升序
		*	-1:降序
		*/

		/*	29.populate('category')
		*	是多个表的查询
		*	这个参数是contens的category字段
		**/
		Content.find().sort({addTime:-1}).limit(limit).skip(skip).populate(['category','user']).then(function( contents ) {
			//传递数据上
			res.render('admin/content_index',{
				userInfo:req.userInfo,
				contents:contents,

				count:count,
				pages:pages,
				page:page,
				limit:limit

			});
		});
	});
});

//23.内容添加页面
router.get('/content/add',function(req,res) {
	
	// 24.
	Category.find().sort({_id:-1}).then(function(categorise) {
		//23.1
		res.render('admin/content_add',{
			userInfo:req.userInfo,
			categorise:categorise
		});
	});
});


//25.内容保存
router.post('/content/add',function(req,res) {
	// console.log(req.body);

	if (req.body.category == '') {
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'分类内容不能为空'
		});
		return false;
	};

	if (req.body.title == '') {
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'内容标题不能为空'
		});
		return false;
	};
	
	
	//27添加内容
	new Content({
		category:req.body.category,
		title:req.body.title,
		user:req.userInfo._id.toString(),
		description:req.body.description,
		content:req.body.content
	}).save().then(function() {
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'内容保存成功',
			url:'/admin/content'
		});
	});
});

//30	修改内容
router.get('/content/edit',function(req,res) {

	var id = req.query.id || '';

	//33
	var categorise = [];

	//32
	Category.find().sort({_id:-1}).then(function(result) {
		// 34
		categorise = result;
	
		//31,,这里做了修改,复制粘贴，然后又调整了一下
		return Content.findOne({
			_id:id
		}).populate('category');
		//这里关联第二个表

	}).then(function(content) {
		if (!content) {
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'内容不存在'
			});

			return Promise.reject();
		}else{
			res.render('admin/content_edit',{
				userInfo:req.userInfo,
				categorise:categorise,
				content:content
			});
		};
	});
});


//35.保存修改内容
router.post('/content/edit',function(req,res) {
	var id = req.query.id || '';

	if (req.body.category == '') {
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'分类内容不能为空'
		});
		return false;
	};

	if (req.body.title == '') {
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'内容标题不能为空'
		});
		return false;
	};

	/* ************这里的逻辑和那个很多的逻辑差不多，现在不做修改,直接保存*************** */
	Content.update({
		_id:id
	},{
		category:req.body.category,
		title:req.body.title,
		description:req.body.description,
		content:req.body.content
	}).then(function() {
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'内容保存成功',
			url:'/admin/content/edit?id=' + id
		});
	});

});


//36内容的删除
router.get('/content/delete',function(req,res) {
	var id = req.query.id || '';

	Content.remove({
		_id:id
	}).then(function() {
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'删除成功',
			url:'/admin/content'
		});
	});
});
//3.导出对象
module.exports = router;