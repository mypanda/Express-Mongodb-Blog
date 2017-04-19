# nodejs基础与博客开发.md
```
process.stdin.resume();

process.stdin.on('data',function  (chunck) {
	console.log(chunck);
	
});
```
```
var a,b;

process.stdout.write('请输入a的值: ');

process.stdin.on('data',function(chuck) {
	if (!a) {
		a = Number(chuck.toString());
		process.stdout.write('请输入b的值: ');
	}else{
		b = Number(chuck.toString());
		process.stdout.write( '结果是: ' + (a + b) );
		process.exit();
	};
});
```

### Buffer类

	* 一个用于更好的操作二进制数据的类
		* 我们在操作文件或者网络数据的时候，其实操作的就是二进制数据流，Node为我们提供了一个更加方便的去操作这种数据流的类Buffer，他是一个全局的类
	* new Buffer(size);
		* 这里是字符长度，不是字符串的长度
		* size [Number]创建一个Buffer对象，并为这个对象分配一个大小
		* 当我们为一个Buffer独享分配空间以后，其程度是固定的，不能更改
	* new Buffer(array);
	* new Buffer(string,[encoding]);
```
//数字
var bf = new Buffer(5);
console.log(bf);
//随机填充五个字节
//显示是十六进制

bg[6] = 10;
//值不变

bf[1] = 10;
//第二位变化
```
```
//数组
var bf = new Buffer([1,2,3]);
console.log(bf);
//<Buffer 01 02 03>

bf[10] = 10;
console.log(bf);
//<Buffer 01 02 03>
//也是不变的
```
```
//字符串
//编码默认是utf-8
var bf = new Buffer('panda','utf-8');
console.log(bf);
//<Buffer 70 61 6e 64 61>
```
```
//字节长度
var bf = new Buffer('panda','utf-8');
for(var i = 0; i<bf.length;i++){
	console.log(bg[i]);
}
//
112
97
110
100
97
//这是二进制

//console.log(bf[i].toString(16));//70 61 6e 64 61
//console.log(String.fromCharCode( bf[i] ));//p a n d a
```
```
//字节长度,英文一样，中文不一样
var str1 = 'panda';
var bf1 = new Buffer(str1);

console.log(str1.length);//5
console.log(bf1.length);//5

var str2 = '熊猫的';
var bf2 = new Buffer(str2);

console.log(str2.length);//3
console.log(bf2.length);//9
```

### Buffer的方法

	* buf.length	buffer的bytes字节大小
	* buf[index]	获取或者设置在指定index索引位置的8位字节内容
	* buf.write(string,[offset],[length],[encodeing])	根据参数offset偏移量和指定的encoding编码方式，将参数string数据写入到buffer
	* buf.toString([encoding],[start],[end])	根据encoding参数(默认是utf-8)返回一个解码的string类型
	* buf.toJson()	返回一个JSON表示的Buffer实例，JSON.stringify将会默认调用来字符串序列化这个Buffer的实例
	* buf.slice([start],[end])	返回一个新的Buffer，这个buffer将会和老的buffer引用相同的内存地址，注意：修改这个新的buffer实例slice切片，也会改变原来的buffer
	* buf.copy(targetBuffer,[targetStart],[sourceStart],[sourceEnd])	进行Bufffer的拷贝
Buffer类方法(静态方法)
	* Buffer.isEncoding(encoding)	如果给定的编码encoding是有效的，返回true，否则返回false,
	* Buffer.isBuffer(obj)	测试obj是不是一个Buffer
	* Buffer.byteLength(string,[encoding])	将会返回这个字符串真实的byte长度,encoding默认是utf-8
	* Buffer.concat(list,[toatlLength])	返回一个保存这将传入buffer数组中所有buffer对象拼接在一起的buffer对象
```
//buf.write();
//buf.write(要写入的字符串,从Buffer对象的第几位开始填入,要写入Buffer对象的字符串长度,字符串写入的编码);
var str = 'panda';
console.log(new Buffer(str));//对比<Buffer 70 61 6e 64 61>
var bf1 = new Buffer(5);
var bf2 = new Buffer(3);

bf1.write( str );
bf2.write( str );
console.log(bf1);//<Buffer 70 61 6e 64 61>
console.log(bf2);//<Buffer 70 61 6e>
```
```
//更多参数1
//offset,写入从buffter对象的第几位开始写入
var str = 'panda';
var bf = new Buffer(5);
bf.write( str, 1 );
console.log(new Buffer(str));
//对比<Buffer 70 61 6e 64 61>
console.log(bf);
//<Buffer a8 61 6e 64 61>
//前面的第一位是随机
```
```
//更多参数2
var str = 'panda';
var bf = new Buffer(5);
bf.write( str, 1 ,3);
console.log(new Buffer(str));
//<Buffer a8 70 61 6e 0>
console.log(bf);
//<Buffer 70 61 6e 64 61>
//第三个参数是写多少位到Buffer中
//后面还是随机填充
```
```
//buf.toString();
//buf.write(字符串写入的编码,从字符串的第几位开始,第几位结束);不包含结束位置
var bf = new Buffer('panda');
console.log( str.toString() );
//panda
console.log( str.toString('utf-8',1 ,3 ) );
//an


//中文
var bf = new Buffer('熊猫的');
console.log( bf.toString('utf-8',1) );
//口猫的
//截取乱码
```
```
//buf.toJSON();
var bf = new Buffer('panda');
console.log(bf.toJSON());
//{ type: 'Buffer', data: [ 112, 97, 110, 100, 97 ] }
```
```
//buf.slice()	新的旧的buffer引用相同的内存地址，改一个另一个也改
var bf = new Buffer('panda');

console.log(bf);
//<Buffer 70 61 6e 64 61>

var bf2 = bf.slice();
console.log(bf2);
//<Buffer 70 61 6e 64 61>

var bf3 = bf.slice(3);
console.log(bf3);
//<Buffer 64 61>

var bf4 = bf.slice(3,4);
console.log(bf4);
//<Buffer 64>
```
```
//buf.copy();	拷贝前提两个都是，buffer对象
var bf = new Buffer('panda');
console.log(bf);
//<Buffer 70 61 6e 64 61>

var bf1 = new Buffer(10);
bf.copy(bf1);
console.log(bf1);
//<Buffer 70 61 6e 64 61 00 00 00 e8 10>

bf1[0] = 2;
console.log(bf);
//<Buffer 70 61 6e 64 61>
console.log(bf1);
//<Buffer 02 61 6e 64 61 00 00 00 a8 66>

bg.copy(bf1,1);
console.log(bg1);
//<Buffer 70 70 61 6e 64 61 00 00 01 74>
//从buffer第1位开始插入

bg.copy(bf1,1,2,4);
console.log(bg1);
//<Buffer 70 6e 64 64 02 00 00 00 01 74>
//从buffer第一位开始插入，拷贝原来buffer的2-4位
```
```
//类方法
isEncoding
consolog.log(Buffer.isEncoding('utf-8'));//true
consolog.log(Buffer.isEncoding('gbk'));//false
consolog.log(Buffer.isEncoding('hex'));//true

//isbuffer
var bf = new Buffer();
var arr = new Array(1,2);

console.log(bf.isBuffer());//true
console.log(arr.isBuffer());//false

//byteLength

var str1 = 'panda';
console.log(str1.length);
//5
console.log(Buffer.byteLength(str1));
//5

var str2 = '熊猫';
console.log(str2.length);
//2
console.log(Buffer.byteLength(str2));
//6

console.log(Buffer.byteLength(str2,'ascii'));
//2

//Buffer.concat(arr);
var str1 = 'panda';
var str2 = '熊猫';

var list = [new Buffer(str1) , new Buffer(str2)];
console.log(list);
//[ <Buffer 70 61 6e 64 61>, <Buffer e7 86 8a e7 8c ab> ]

var bf = Buffer.concat(list,11);//5+6,或者通过程序计算长度
console.log(bf.toString());
//panda熊猫
```
```
process.stdout.write('请输入: ');
process.stdin.resume();
process.stdin.on('data',function(chuck){
	console.log(chuck);
});
//<Buffer 61 0d 0a>
//0a是回车

chuck.toString();
//a
```

### 文件系统模块

#### File System 文件系统模块
	* 该模块是核心模块,需要使用 require('fs')导入后使用
	* 该模块提供了操作文件的API
	* fs.open(path,flags,[mode],callback)
		* 异步打开一个文件
	* fs.openSync(path,flags,[mode])
		* fs.open()的同步版
	* fs.read(fd,buffer,offset,length,position,callback)
		* 从指定文件标识fd读取文件数据
	* fs.readSync(fd,buffer,offset,length,position)
		* fs.read()的同步版本 返回bytesRead的个数
	* fs.write(fd,buffer,offset,length,[position],callback)
		* 通过文件标识fd,向指定文件中写入buffer
	* fs.write(fd,data,[position,[encoding],],callback)
		* 把data写入到文档中通过指定的fd,如果data不是buffer对象的实例则会把值强制转化成一个字符串
	* fs.writeSync(fd,buffer,offset,length,[position])
		* fs.write()的同步版本
	* fs.writeSync(fd,buffer,[position,[encoding]])
		* fs.write()的同步版本
	* fs.close(fd,callback)
		* 关闭打开的一个文件
	* fs.closeSync(fd)
		* 关闭文件的同步版本
	* fs.writeFile(filename,data,[options],callback)
		* 异步将数据写入文件，如果文件不存在则创建，如果文件原先存在，会被替换，data可以是string，也可以是一个原生buffer
	* fs.writeFileSync(filename,data,[options])
		* fs.writeFile()同步版本,没有回掉也不需要
	* fs.appendFile(filename,data,[options])
		* 异步将数据添加在文件尾部，如果文件不存在则创建，data可以是string，也可以是一个原生buffer
	* fs.appendFileSync(filename,data,[options])
		* fs.appendFile()同步版本
	* fs.readFile(filename,[options],callback)
		* 异步读取全部文件的内容
	* fs.readFileSync(filename,[options])
		* fs.readFile同步版本
	* fs.exists(path,callback)
		* 检查指定路径的文件或者目录是否存在
	* fs.existsSync(path)
		* fs.exists同步版本
	* fs.unlink(path,callback)
		* 删除一个文件
	* fs.unlinkSync(path)
		* fs.unlink同步版本
	* fs.rename(oldPath,newPath,callback)
		* 重命名
	* fs.renameSync(oldPath,newPath)
		* fs.rename同步模式
	* fs.stat(path,callback)
		* 读取文件信息
	* fs.statSync(path)
		* fs.statSync()同步版本
	* fs.watch(filename，[options],[listener])
		* 观察指定路径的改变,和rename路径可以使文件或者目录
	* fs.mkdir(path,[mode],callback)
		* 创建文件夹
	* fs.mkdirSync(path,[mode])
		* fs.mkdir的同步版本
	* fs.readdir(path,callback)
		* 读取文件夹
	* fs.readdirSync(path)
		* fs.readdir同步版本
	* fs.rmdir(path,callback)
		* 删除文件夹
	* fs.rmdirSync(path)
		* fs.rmkdir的同步版本
```
/* 
* fs.open(path,flags,[mode],callback);
* path	打开文件的路径
* flags	打开文件的方式	读/写
* mode	设置文件的模式，读/写/执行
* callback 回调
*	err 打开失败错误保存在err里面,成功err为null
*	fd 被打开文件的标识,和定时器返回的数字，差不多意思，就是一个标识
* */

var fs = require('fs');
fs.open('./1.txt','r',function(err,fd){
	console.log(err);
	console.log(fd);
});
//null
//3

var fs = require('fs');
fs.open('./2.txt','r',function(err,fd){
	if(err){
		console.log('文件打开失败');
	}else{
		console.log('文件打开成功');
	}
});
//文件打开失败
//2.txt不存才，所以失败了
```
```
//同步，和异步的区别
var fs = require('fs');

fs.open('./1.txt','r',function(err,fd){
	console.log(fd);
});
console.log('ok');

var fd = fs.openSync('./1.txt','r');
console.log(fd);

/*
ok
4
3
*/
```
```
/*
*	fs.read(fd,buffer,offset,length,position,callback);
*	fd ：通过open成功打开一个文件的编号
*	buffer ：buffer对象
*	offset ：添加到buffer的第几位
*	length : 内容长度
*	position : 读取文件的长度，默认""或者0或者不填
*	callback : (err,newBfLength,newBf) ->
**/

//fs.read()
var fs = require('fs');
fs.open('1.txt','r',function(err,fd){
	if(err){
		console.log('文件打开失败');
	}

	var bf = new Buffer('12345678');
	console.log(bf);
	fs.read(fd,bf1,0,function(err){
		console.log(bf1);
	});
})
```

```
/* 
*	fs.write
*	fs.write(fd,buffer,offset,length,[position],callback)
*	fd:打开的文件
*	buffer:要写入的数据
*	offset:buffer对象中要写入的数据的起始位置
*	length:要写入buffer数据的长度
*	postion:fd的起始位置
*	callback:(error,写入数据的长度,返回的buffer) ->
**/
var fs = require('fs');
fs.open('1.txt','r+',function(err,fd){
	if(err){
		console.log('文件打开失败');
	}
	
	/*
	var bf = new Buffer('123');
	console.log(bf);
	fs.read(fd,bf,0,3,0,function(err){
		console.log(bf1);
	});
	*/

	fs.write(fd,'1234',5,'utf-8');

})
```
```
/*
*	向一个文件中写入数据，如果文件不存在，则新建，如果文件存在，会被覆盖
*/
var fs = require('fs')
var filename = '2.txt'
fs.writeFile(filename,'hello',function(){
	console.log(arguments);
})
```
```
/*
*	向一个文件中尾部追加数据，如果文件不存在，则新建
*/
var fs = require('fs')
var filename = '2.txt'
fs.appendFile(filename,'aahello',function(){
	console.log(arguments);
})
```
```
var fs = require('fs')
var filename = '2.txt'
fs.exists(filename,function(isExists){
	console.log(isExists);//false
	if(!isExists){
		fs.writeFile(filename,'panda',function(err){
			if(err){
				console.log('出错了');
			}else{
				console.log('创建新文件成功');
			}
		})
	}else{
		fs.appendFile(filename,'love',function(err){
			if(err){
				console.log('新内容追加出错了');
			}else{
				console.log('新文件追加成功');
			}	
		})
	}
})
```
```
//同步模式
if(!fs.existsSync(filename)){
	fs.writeFileSync(filename,'panda'));
	console.log('创建新文件成功');
}else{
	fs.appendFileSync(filename,'love'));
	console.log('新文件追加成功');
}

//在做读取的操作
```
```
//fs.readFile
fs.readFile('2.txt',function(err,data){//fs.unlink删除文件
	if(err){
		console.log('文件读取失败')
	}else{
		console.log(data.toString());
	}
})
```
```
//fs.rename()
fs.rename('2.txt',2.new.txt,function(err){

})
```
```
//文件信息
fs.stat('2.new.txt',function(err,info){
	
})
```
```
//fs.watch监听讲解的时候这个不稳定
var fs = require('fs');
var filename = '1.txt'
fs.watch(filename,function(ev,fileName){
	if(fileName){
		console.log(fileName+" is "+ev);
	}else{
		console.log('...');
	}
});
```
```
//fs.mkdir 创建文件夹
fs.mkdir('./1',function(err){});

//fs.rmdir 创建文件夹
fs.rmdir('./1',function(err){});
```
```
//fs.readdir
fs.readdir('../blog node',function(err,fileList){
	console.log(fileList);//目录下面的文件，文件夹
});
```
```
//文件系统demo
var fs = require('fs');
fs.readdir('../blog node',function(err,fileList){
	fileList.forEach(function(f){
		fs.stat(f,function(err,info){
			switch (info.mode){
				case 16822:
					console.log('[文件夹] '+ f);
					break;
				case 33206:
					console.log('[文件] '+ f);
					break;
				default:
					console.log('[其他类型] ' + f);
					break;
			}
		})
	})
})
```

### 前端项目自动化
* 前端自动化demo
```
//前端自动化demo

var projectData = {
	'name' : 'panda',
	'fileData' : [
		{
			'name' : 'css',
			'type' : 'dir'
		},
		{
			'name' : 'js',
			'type' : 'dir'
		},
		{
			'name' : 'images',
			'type' : 'dir'
		},
		{
			'name' : 'index.html',
			'type' : 'file',
			'content' : '<html>\n<head>\n\t<title>Default</title>\n</head>\n<body>\n\t<h1>这是默认首页</h1>\n</body>\n</html>'
		}
	]
}

var fs = require('fs');

if (projectData.name) {
	fs.mkdirSync(projectData.name);


	var fileData = projectData.fileData;

	if (fileData && fileData.forEach) {

		fileData.forEach(function(f){

			f.path = projectData.name + '/' + f.name;

			f.content = f.content || '';

			switch(f.type){

				case 'dir':
					fs.mkdirSync(f.path);
					break;

				case 'file':
					fs.writeFileSync(f.path,f.content);
					break;

				default:
					break;
			}
		})
	};
};
```
* 监听文件

```
//node新版本有毛病
var fs = require('fs');
var filedir = './src';

fs.watch(filedir,function(ev,file){
	//console.log(file+' - '+ev);//这里不需要判断file是否有内容，有可能是删除
	//只要有一个文件发生变化，我们需要对这个文件夹的所有文件惊醒读取，然后合并
	fs.readdir(filedir,function(err,dataList){
		var arr = [];
		dataList.forEach(function(f){
			if (f) {
				var info = fs.statSync(filedir + '/' + f);
				// console.log(info);
				// console.log(f);

				if (info.mode == 33206) {
					arr.push(filedir + '/' + f);
				};
			};
		});
		// console.log(arr);

		//读取数组的文件内容，并合并
		var content = '';

		arr.forEach(function(f){
			var c = fs.readFileSync(f);
			// console.log(c.toString());//buffer

			content += c.toString();
		});
		// console.log(content);

		fs.writeFile('./src/panda.js',content);
	})
})
```

### 使用node进行web开发

* 用户通过浏览器发送一个http的请求到指定主机
* 服务器接收到该请求，对该请求进行分析和处理
* 服务器处理完成以后，返回对象的数据到用于机器
* 浏览器接收服务器返回的数据，并根据接收到进行分析和处理

#### http模块
* var http = require('http');
* var server = http.createServer([requestListener])
	* 创建并返回一个HTTP服务器对象
	* requestListener 监听到客户端连接的回调函数
* server.listen(port,[hostname],[callback])
	* 监听客户端连接请求，至少有党调用listen方法后，服务才开始工作
	* port 监听端口
	* hostname 主机名(IP域名)
	* backlog 连接等待的最大长度
	* callback 调用listen方法并成功开启监听以后，会触发一个listen事件，callback讲作为该事件的执行函数
* listen事件
	* 当server调用listen方法并成功开始监听以后触发
* error事件
	* 当服务开始失败的时候触发事件
	* 参数err 具体的错误对象
* request事件
	* 当有客户端发送请求到该主机和端口的请求的时候触发
	* 参数request http.incomingMessage的一个实例，通过他我们可以获取到这次请求的一些信息，比如头信息，数据等
		* httpVersion	使用的http协议的版本
		* headers	请求头中的数据
		* url	请求的地址
		* method	请求方式
	* 参数response http.ServerResponse的一个实例，通过他我们可以向该次请求的客户端输出返回响应
		* write(chunk,[encoding])	发送一个数据块到响应正文中
		* end(chunk,[encoding])		当所有的正文和头信息发送完成以后调用该方法告诉服务器数据已经全部完成发送完成，这个方法在每次完成信息发送以后必须调用，并且是最后调用
		* statusCode	该属性用来设置返回的状态码
		* setHeader(name,value)		设置返回头信息
		* writeHead(statusCode,[reasonPhrase],[headers])	这个方法只能在当前请求中使用一次，并且必须在response.end()之前调用		

##### demo
```
//搭建一个http服务器,用于处理用户的发送的请求,需要使用node提供的一个模块http

//加载http模块
var http = require('http');

//通过http的createServer创建返回一个web服务器对象
var server = http.createServer(function(request,response){
	// console.log('ok');

	// response.write('你好');

	//自定义头信息,不是标准的头信息
	response.serHeader('my','panda');

	//状态码，状态自定义信息，返回头信息
	response.writeHead(200,'I Love Panda',{
		//'Content-Type':'text/html'
		'Content-Type':'text/plain;charset=utf-8'
	});

	response.write('<h1>hello</h1>');
	response.end('');//第一个参数，默认调用write之后，在调用end
});

//捕获错误信息
server.on('error',function(){
	console.log(arguments);
});

//
server.on('listening',function(){
	console.log('listening...');
});

//监听客户端发送的请求,requset可以写在creatServer里面
server.on('request',function(req,res){
	console.log('有客户端请求了!');
	// console.log(req.httpVersion);
	// console.log(req.headers);
	// console.log(req.url);
	// console.log(req.method);
});

//不填写随机一个端口
server.listen(8080,'localhost');

//server.address()	随机分配的地址
console.log(server.address());
```

#### url模块
* require('url');
	* 对url格式的字符串进行解析，返回一个对象
* 根据不同的url进行处理，返回不一样的数据
* 使用fs模块实现nodeJS代码和html的分离
* get请求的数据处理
* post请的数据处理
	* post发送的数据会被写入缓冲区，需要通过request的data事件和end事件来进行数据拼接处理
* querystring模块
	* parse();将一个query string反列化为一个对象
* demo
```
var http = require('http');
var url = require('url');

var server = http.createServer(function (req,res) {

	//url访问的地址
	var urlStr = url.parse( req.url );
	// console.log(urlStr);

	switch(urlStr.pathname){
		case '/':
			res.writeHead(200,{ 'Content-type':'text/html;charset=utf-8' });
			res.write('首页');
			res.end();
			break;
		case '/user':
			res.writeHead(200,{ 'Content-type':'text/html;charset=utf-8' });
			res.write('用户')
			res.end();
			break;
		default:
			res.writeHead(404,{ 'Content-type':'text/html;charset=utf-8' });
			res.write('页面吃掉了！！')
			res.end();
			break;
	}

	// var str = url.parse('http://www.baidu.com:8000/a/index.html?b=2#p=1');
	// console.log(str);
	/*
	protocol: 'http:',
	slashes: true,
	auth: null,
	host: 'www.baidu.com',
	port: 8000,
	hostname: 'www.baidu.com',
	hash: '#p=1',
	search: '?b=2',
	query: 'b=2',
	pathname: '/a/index.html',
	path: '/a/index.html?b=2',
	href: 'http://www.baidu.com/a/index.html?b=2'
	*/
});

server.listen(8888,'localhost');
```

* 行为和表现分离

```
/*
目录
|- server.js
|- html
  |- index.html
  |- user.html
  |- err.html
*/
const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer();

var htmlDir = __dirname + '/html/';//这里注意路径

server.on('request',function (req,res) {

	var urlStr = url.parse( req.url );

	switch(urlStr.pathname){
		case '/':
			// 首页
			sendData( htmlDir + 'index.html', req, res );
			break;
		case '/user':
			// 用户
			sendData( htmlDir + 'user.html', req, res );
			break;
		default:
			//其他
			sendData( htmlDir + 'err.html', req, res );
			break;

	}
});

function sendData (file,req,res) {
	fs.readFile( file,function  (err,data) {
		if (err) {
			res.writeHead(404,{
				'COntent-Type':'text/html;chartset=utf-8'
			});
			res.end('<h1>没想到吧，页面被处理了！！！</h1>');
		}else{
			res.writeHead(200,{
				'COntent-Type':'text/html;chartset=utf-8'
			});
			res.end(data);
		};
	})
}

server.listen(8888,'localhost');
```
* querystring模块方法对get和post提交的数据进行处理

```
/*
GET
因为数据在url中。所以把url的对象解析成对象就可以了，
1.记载模块
const querystring = require('querystring');
2.处理url成对象
urlStr = url.parse( req.url );
3.处理url数据为对象
querystring.parse( urlStr.query );

POST
1.先从缓冲区一点一点读取数据，拼接到字符串
var str = '';
req.on('data',function(chunk){
	str += chunk;
});
2.接收完毕，得到一个字符串，然后在处理
req.on('end',function() {
	console.log(querystring.parse(str));
});

*/
const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');//处理get请求的一个对象

const server = http.createServer();

var htmlDir = __dirname + '/html/';//这里注意路径

server.on('request',function (req,res) {

	var urlStr = url.parse( req.url );

	switch(urlStr.pathname){
		case '/':
			// 首页
			sendData( htmlDir + 'index.html', req, res );
			break;
		case '/user':
			// 用户
			sendData( htmlDir + 'user.html', req, res );
			break;
		case '/login':
			// 用户提交数据
			sendData( htmlDir + 'login.html', req, res );
			break;
		case '/login/check':
			// 处理提交数据
			// console.log(req.method);
			//get
			// console.log(querystring.parse(urlStr.query));

			//post
			var str = '';
			req.on('data',function(chunk){
				str += chunk;
			});
			req.on('end',function() {
				console.log(querystring.parse(str));
			});
			break;
		default:
			//其他
			sendData( htmlDir + 'err.html', req, res );
			break;

	}
});

function sendData (file,req,res) {
	fs.readFile( file,function  (err,data) {
		if (err) {
			res.writeHead(404,{
				'COntent-Type':'text/html;chartset=utf-8'
			});
			res.end('<h1>没想到吧，页面被处理了！！！</h1>');
		}else{
			res.writeHead(200,{
				'COntent-Type':'text/html;chartset=utf-8'
			});
			res.end(data);
		};
	})
}

server.listen(8888,'localhost');
```


# nodeJS博客开发

### 学前要求

* node安装与运行
	* 会安装nodejs，搭建node环境
	* 会运行node执行node程序
* node基础模块的使用
	* Buffer:二进制数据处理模块
	* Event:事件模块
	* fs:文件系统模块
	* Net:网络模块
	* http:http模块
	* ...
	* https://nodejs.org/dist/latest-v4.x/docs/api
* npm(node包管理工具)的使用
	* 可以发布，创建自己的模块
* 前台目录结构
```
|-前台
	|- 首页内容聚合
	|- 列表页
		|- 分类列表
	|- 内容页
		|- 评论
	|- 注册
	|- 退出

|-后台
	|- 登录
	|- 分类管理
		|- 分类列表
		|- 添加分类
		|- 修改分类
		|- 删除分类
		|- 查看分类下所有博文
	|- 内容管理
		|- 内容列表
			|- 所有内容
			|- 搜分类查看
		|- 添加内容
		|- 修改内容
		|- 删除内容
		|- 查看内容下所有的评论
	|- 评论管理
		|- 评论列表
			|- 所有的评论
			|- 查看指定博文的评论
		|- 删除评论
```


### 技术框架介绍

* nodeJS
	* 版本:v5.1.0
	* 基础核心开发语言
* Express
	* 版本:^4.14.0
	* 一个简洁而灵活的nodeJS Web应用框架，提供一系列强大的特性特性帮助我们创建各种web应用
* Mongodb
	* 版本:3.2.4

* 第三方模块&中间件
	* bodyParse
		* 解析post请求的数据
	* cookie
		* 读/写cookie
	* swig
		* 模板解析引擎
	* mongooes
		* 操作mongodb数据
	* markdown
		* markdown语法解析生成模块

* 项目初始化
	* 项目初始化
		* npm init
	* 依赖模块的安装
		* 推荐使用`cnpm`下载
* 安装的包
```
"dependencies": {
  "body-parser": "^1.15.2",
  "cookies": "^0.6.1",
  "express": "^4.14.0",//npm install -g express@4.14.0
  "markdown": "^0.5.0",
  "mongoose": "^4.5.7",//mongoose
  "swig": "^1.4.2"
}
```

* 项目目录结构
```
|- db			数据库储存目录
|- models 		数据库模型文件目录
|- node_modules node第三方模块目录
|- public 		公共文件目录( css,js,images,...)
|- routers		路由目录文件
|- schemas		数据库结构文件( schema )目录
|- views		模板视图文件目录
|- app.js 		应用(启动)入口文件
|- package.json
```

* 创建应用，监听端口
```
var express = require('express');
var app = express();
app.listen(8081);
```
* 用户访问
	* localhost:8081访问
* 路由绑定
	* 通过app.get()或app.post()等方法可以把url路径和一个或者n个函数进行绑定
		* app.get('/',function(req,res,next){})
		* req：request对象，保存客户端请求相关的一些数据 == http.request
		* res：response对象，服务端输出对象，提供一些服务端输出相关的一些方法 == http.response
		* next: 用于执行写一个和路径匹配的函数
* 内容输出
	* 通过res.send(string)发送内容到客户端
* 模板的使用
	* 后端逻辑和页面表现分离 - 前后端分离
* 模板的配置
	* var swig = require('swig');
	* app.engine('html',swig.renderFile);
		* 定义模板引擎，使用swig.renderFile方法解析后缀为html的文件
		* 第一个参数，模板引擎的名称，同时也是模板文件的后缀
		* 第二个参数，表示，用于解析处理模板内容的方法
	* html文件
	* app.set('views','./views');
		* 设置模板存放的目录,
		* 第一个参数，必须是views。第二个参数是存放的目录
	* app.set('view engine','html')
		* 注册所使用的模板引擎
		* 第一个参数必须是`view engine`,第二个参数和app.engine这个方法定义的模板引擎的名称（第一个参数）是一致的
	* swig.setDefaults({cache:false});
		* 设置是否缓存
	* res.render();
		* 这是模板方法
		* 发送数据到客户端的方法
		* 第一个参数是模板文件，相对与目录的文件`.html`默认不用写.html
		* 第二个参数，传递给模板使用的数据
* 静态文件托管目录
	* app.use('/public',express.static( __dirname + '/public'));
	* 在public目录下划分并存好相关的静态资源


* 模块划分
	* 根据功能划分模块
		* 前台模块
		* 后台模块
		* APi模块
	* 使用app.use()进行模板的划分
		* 第一个参数是路由
		* app.use('/admin',require('./routers/admin'))
		* app.use('/api',require('./routers/api'))
		* app.use('/',require('./routers/main'))


```
//app.js
// 1.加载express
var express = require('express');
//6.加载模板
var swig = require('swig');

//2.创建app应用 == http.createServer
var app = express();

//13.设置静态文件托管
app.use('/public',express.static( __dirname + '/public' ));

//7.定义当前应用所使用的的模板引擎
app.engine('html',swig.renderFile);

//11.是否设置缓存
swig.setDefaults({cache:false});

//8.设置模板文件的放置目录
app.set('views','./views');

//9.注册模板引擎
app.set('view engine','html');


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

//3.监听http请求
app.listen(8081);
```

* 前台路由+模板
	* main模块
		<pre>
		/view			内容页
		/				首页
		</pre>
	* api模块
		<pre>
		/				首页
		/register		用户注册
		/login			用户登录
		/conmment		用户评论
		/comment/post 	评论提交
		</pre>
	* admin 模块
		<pre>
		/				首页
		用户管理
		/user			用户列表
		分类管理
		/category		分类列表
		/category/add 	分类添加
 		/category/edit 	分类修改
		/category/dalete分类删除
		文章内容管理
		/article		内容列表
		/article/add 	内容添加
		/article/edit 	内容修改
		/article/delete 内容删除
		评论内容管理
		/comment 		评论列表
		/comment/delete 评论删除
		</pre>
* 功能模块的开发顺序
	* 用户
	* 栏目
	* 内容
	* 评论
* 编码顺序
	* 通过Schema定义设计数据存储结构
	* 功能逻辑
	* 页面展示

* 定义数据结构schemas
	* [http://mongoosejs.com/docs/guide.html](http://mongoosejs.com/docs/guide.html)
	* user.js  require('mongoose');
	* app.js  var mongoose = require('mongoose');
	* app.js  链接数据库 mongoose.connect();
		* connect第一个参数是地址mongodb://localhost:27018/blog
		* 回调函数 function(err){ if(err){ console.log('连接失败') } }


* mongoose的使用
	* 开启mongodb数据库
		* 开启mongod --dbpath=数据文件保存的路径
		* [www.mongodb.com](https://www.mongodb.com)
		* [www.mongodb.org/dl/win32](https://www.mongodb.org/dl/win32)
		* [mongode v3.2.4 只有64位](http://downloads.mongodb.org/win32/mongodb-win32-x86_64-3.2.4-signed.msi)
		* 默认端口是27017
		* mongod --dbpath=C:\Users\Administrator\Desktop\node-blog\db --port=27018
	* 数据保存
		* 使用mongoose操作数据库
		* [mongoosejs.com](http://mongoosejs.com)
	* 创建model
		* 通过Schema创建模型类
		* mongoose.model('模型名称',Schema);
	* 可视化管理mongodb
		* Robomongo 0.9.0-RC7
	* [官网api](http://mongoosejs.com/docs/api.html#model-js)
		* model.js倒数第二行
		* model.findOne();静态方法
		* model#save();对象方法new 之后使用
* body-parser
	* var bodyParser = require('body-parser');
		* 加载body-parser，用来处理post提交过来的数据
	* app.use( bodyParser.urlencoded({extended:true}) );
		* 设置
	* 默认会在req上面增加一个body属性，post过来的数据绑定到req.body上面
	* github搜索 body-parser
* cookies
	* var cookies = require('cookies');
		* 加载cookies
	* app.use(function(req,res,next) { req.cookies = new cookies(req,res); });
		* 添加req.cookies属性，
		* 用new cookies ,传入req,res
		* req.cookies get,set方法，设置获取cookies
* app.use()
	* 相当于每次请求一个网页都会执行的函数，constructor构造函数