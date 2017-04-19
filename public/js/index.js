$(function() {

	//启动初始化
	(function init() {

		//统一格式
		$register = $('#register');
		$login = $('#login');
		$userInfo = $('#userInfo');

		//隐藏注册panel
		$register.hide();
		// $userInfo.hide();
	})();
	
	//登录到注册
	$login.find('a').on('click',function() {
		$login.hide();
		$register.show();
	});

	//注册到登陆
	$register.find('a').on('click',function() {
		$register.hide();
		$login.show();
	});

	//注册
	$register.find('button[type="submit"]').on('click',function() {
		return false;
	});
	$register.find('button[type="submit"]').on('click',function() {

		//通过ajax提交数据
		$.ajax({
			type:'post',
			url:'/api/user/register',
			data:{
				username:$register.find('[name="username"]').val(),
				password:$register.find('[name="password"]').val(),
				repassword:$register.find('[name="repassword"]').val()
			},
			dataType:'json',
			success:function(result) {
				$register.find('p.warning').html(result.message);

				if (!result.code) {
					//注册成功
					setTimeout(function() {
						$register.hide();
						$login.show();
					},1000);
				};
			}
		});	
	});

	//登录
	$login.find('button[type="submit"]').on('click',function() {
		return false;
	});
	$login.find('button[type="submit"]').on('click',function() {
		//通过ajax提交数据
		$.ajax({
			type:'post',
			url:'/api/user/login',
			data:{
				username:$login.find('[name="username"]').val(),
				password:$login.find('[name="password"]').val(),
			},
			dataType:'json',
			success:function(result) {
				$login.find('p.warning').html(result.message);

				if (!result.code) {
					//登录成功
					setTimeout(function() {
						// 用模板的就不用隐藏panel，直接刷新页面
						window.location.reload();
						/*
						$login.hide();
						$userInfo.show();

						//显示登录用户的信息
						$userInfo.find('#username').html( result.userInfo.username );
						$userInfo.find('#info').html( '欢迎观临我的博客' );
						*/
					},1000);
				};
			}
		});
	});

	//退出
	$('#logout').on('click',function() {
		$.ajax({
			url:'/api/user/logout',
			success:function(result) {
				if( !result.code ){
					window.location.reload();
				}
			}
		})
	})
});