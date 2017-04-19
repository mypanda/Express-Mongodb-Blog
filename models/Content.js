//这是做增删改查的操作
//Schema是定义数据表的结构

var mongoose = require('mongoose');
var contentsSchema = require('../schemas/contents');


//Content，对应schema上面的引用
module.exports = mongoose.model('Content',contentsSchema);