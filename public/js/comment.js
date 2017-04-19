var prepage = 10;
var page = 1;
var pages = 0;
var comments = [];

//提交评论
$('#messageBtn').on('click',function() {
	$.ajax({
		type:'post',
		url:'/api/comment/post',
		data:{
			contentid:$('#contentId').val(),
			content:$('#messageContent').val()
		},
		success:function(responseData) {
			$('#messageContent').val("");
			comments = responseData.data.reverse();
			renderComment();
		}
	});
});

//每次页面重载的时候获取一下改文章的所有评论
$.ajax({
	url:'/api/comment',
	data:{
		contentid:$('#contentId').val()
	},
	success:function(responseData) {
		comments = responseData.data.reverse();
		renderComment();
	}
});

//上一页，事件委托
$('#pager').delegate('a','click',function() {
	if ( $(this).parent().hasClass('previous') ) {
		//上一页
		page--;
		
	}else{
		// 下一页
		page++;
	};
	renderComment();
});


//渲染评论页面
function renderComment() {

	//分页的实现
	var pages = Math.max(Math.ceil(comments.length / prepage),1);
	var start = Math.max( 0,(page - 1) * prepage );
	var end = Math.min( start + prepage,comments.length );

	var $lis = $('#pager li');
	$lis.eq(1).html( page + ' / ' + pages );


	//上一页上一页
	if (page <= 1) {
		page = 1;
		$lis.eq(0).html('<span>没有上一页了</span>');
	}else{
		$lis.eq(0).html('<a href="javascript:;">上一页</a>');
	};
	if (page >= pages) {
		page = pages;
		$lis.eq(2).html('<span>没有下一页了</span>');
	}else{
		$lis.eq(2).html('<a href="javascript:;">下一页</a>');
	};

	//评论数
	$('#messageCount').html(comments.length);

	//判断是否有评论
	if (comments.length  == 0 ) {
		$('#noComments').html('<div class="col s12 m12">还没有留言!</div>');
		$('#pager').hide();
		$('#messageList').hide();
	}else{
		$('#pager').show();
		$('#messageList').show();
		$('#noComments').html('');
		//评论
		var html = '';
		for (var i = start; i < end; i++) {
			html += `
			<li class="collection-item avatar">
				<i class="material-icons circle cyan">comment</i>
				<span class="title">${comments[i].username}</span>
				<span class="right">${formatDate(comments[i].postTime)}</span>
				<p>${comments[i].content}</p>
			</li>`;
		};
		
		$('#messageList').html(html);
	};
}

//时间格式
function formatDate(d) {
	var date1 = new Date(d);
	return `${date1.getFullYear()}年${date1.getMonth() + 1}月${date1.getDate()}日 ${date1.getHours()}:${date1.getMinutes()}:${date1.getSeconds()}`;
}