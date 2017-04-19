var express = require('express');
var router = express.Router();
// 5.引入数据库model
var User = require('../models/User');
//10.引入Content
var Content = require('../models/Content');

//4.统一返回格式,初始化
var responseData;

router.use(function( req,res,next ) {
	responseData = {
		code:0,
		message:''
	}
	next();
});

//1.测试
router.get('/user',function( req,res,next ) {
	res.send('api-user');
});


/*
* 3.用户注册
*	
* 注册逻辑
*	1.用户名不能为空
*	2.密码不能为空
*	3.两次密码必须一致
*
* 	4.用户是否已经注册
* 		数据库查询
**/
router.post('/user/register',function(req,res,next) {

	var username = req.body.username;
	var password = req.body.password;
	var repassword = req.body.repassword;

	//用户名不能为空
	if( username == ''){
		responseData.code = 1;
		responseData.message = '用户名不能为空';
		//转化成json返回给前端
		res.json(responseData);
		return;
	}

	//密码不能为空
	if( password == ''){
		responseData.code = 2;
		responseData.message = '密码不能为空';
		//转化成json返回给前端
		res.json(responseData);
		return;
	}

	//两次输入的密码不一致
	if ( password != repassword) {
		responseData.code = 3;
		responseData.message = '两次输入的密码不一致';
		//转化成json返回给前端
		res.json(responseData);
		return;
	};

	//用户名是否已经被注册,如果数据库中已经存在和我们要注册的用户名同名的数据，表示该用户名已经被注册
	//findOne()第一个参数是条件
	//findOne()返回一个promise对象
	//findOne()返回用户数据
	//es6 promise对象
	User.findOne({
		username:username
	}).then(function( userInfo ) {
		if ( userInfo ) {
			// 表示数据库中有数据
			responseData.code = 4;
			responseData.message = '用户名已经被注册了';
			//转化成json返回给前端
			res.json(responseData);
			return;
		}

		//保存用户注册信息到数据库中
		var user = new User({
			username:username,
			password:password
		});

		//返回一个promise对象，就可以继续then
		return user.save();
	}).then(function( newUserInfo ) {

		//注册成功
		responseData.message = '注册成功';
		//转化成json返回给前端
		res.json(responseData);
	});
});


//登录
router.post('/user/login',function(req,res,next) {
	var username = req.body.username;
	var password = req.body.password;

	//用户名不能为空
	if ( username == '' || password == '') {
		responseData.code = 1;
		responseData.message = '用户名和密码不能为空';
		res.json(responseData);
		return false;
	};

	//查询数据库中相同用户名和密码的记录是否存在，如果存在则登录
	User.findOne({
		username:username,
		password:password
	}).then(function( userInfo ) {
		if ( !userInfo ) {
			responseData.code = 2;
			responseData.message = '用户名或密码错误';
			res.json( responseData );
			return false;
		};

		//用户名和密码是正确的
		responseData.message = '登录成功';
		//返回用户信息
		responseData.userInfo = {
			_id:userInfo._id,
			username:userInfo.username
		};
		//发送一个cookies信息
		req.cookies.set('userInfo',JSON.stringify({
			_id:userInfo._id,
			username:userInfo.username
		}));

		res.json(responseData);
		return false;
	});
});

//退出
router.get('/user/logout',function(req,res,next) {
	req.cookies.set('userInfo',null);
	res.json(responseData);
});



// 12.指定文章的全部评论
router.get('/comment',function(req,res) {
	var contentId = req.query.contentid || '';

	Content.findOne({
		_id:contentId
	}).then(function(content) {
		responseData.data = content.comments;
		res.json(responseData);
	})
});

// 11.评论提交
router.post('/comment/post',function(req,res) {

	//内容的id
	var contentId = req.body.contentid || '';
	var postData = {
		username:req.userInfo.username,
		postTime:new Date(),
		content:req.body.content
	};

	//查询当前这篇内容的信息
	Content.findOne({
		_id:contentId
	}).then(function(content) {
		content.comments.push(postData);
		return content.save();
	}).then(function(newContent) {
		responseData.message = '评论成功';
		responseData.data = newContent.comments;
		res.json(responseData);
	})
});

//2.导出模块
module.exports = router;