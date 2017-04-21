// 1.加载express
var express = require('express');
//6.加载模板
var swig = require('swig');
//15.记载mongoose模板
var mongoose = require('mongoose');
//18.加载body-parser，用来处理post提交过来的数据
var bodyParser = require('body-parser');
//20.加载cookies
var cookies = require('cookies');
//2.创建app应用 == http.createServer
var app = express();
//23.引入User的model
var User = require('./models/User');

//13.设置静态文件托管
app.use('/public',express.static( __dirname + '/public' ));

//7.定义当前应用所使用的的模板引擎
app.engine('html',swig.renderFile);

//11.是否设置缓存
swig.setDefaults({cache:false});
//27.默认的HTML是转义的,就是转化成html字符串,fasle会把html标签解析，，，
//{% autoescape false %}{{content.content}}{% endautoescape %}指定不转义
swig.setDefaults({ autoescape: true });

//8.设置模板文件的放置目录
app.set('views','./views');

//9.注册模板引擎
app.set('view engine','html');

// 19.body-parser设置
app.use( bodyParser.urlencoded({extended:true}) );
// 21.cookies设置
app.use(function(req,res,next) {
	req.cookies = new cookies(req,res);

	//22.解析登录用户的cookies信息
	req.userInfo = {};
	if ( req.cookies.get('userInfo')) {
		try{
			req.userInfo = JSON.parse(req.cookies.get('userInfo'));

			//24.获取当前用户的类型,是否是管理员
			User.findById(req.userInfo._id).then(function(userInfo) {
				req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
				// 25.防止报错
				next();
			});
		}catch(e){
			// 26.防止报错
			next();
		};
	}else{
		next();
	};
});

/*
//4.匹配一个路由
app.get('/',function(req,res,next) {

	//5.前后端分离
	// res.send('<h1>欢迎观临我的博客</h1>');

	//10.模板引擎的方法,上面就被替换了,读取./views目录下的指定文件，解析返回给客户端
	res.render('index');
});
*/
//14.根据不同模块的划分
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

// 16.链接数据库
mongoose.connect('mongodb://localhost:27017/blog',function(err) {
	if (err) {
		console.log(err)
	}else{
		console.log('mongodb is ok！！！');

		// 17.数据库联机成功才创建应用
		//3.监听http请求
		app.listen(8081);
	};
});