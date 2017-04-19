//这是做增删改查的操作
//Schema是定义数据表的结构

var mongoose = require('mongoose');
var categoriesSchema = require('../schemas/categories');


module.exports = mongoose.model('Category',categoriesSchema);