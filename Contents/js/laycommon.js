var _vipexam = null;
var _veuser = {code:"",user:{"account":"f46354b31ec64c9c96919e12a9bbd610","username":"游客（受限）",collegename:"北京大学"}};
var _jspath = "";
var _img_teacher = "https://video.vipexam.net/img/vepic/teacher/";
var _img_videos = "https://video.vipexam.net/img/vepic/videoimg/";
var _videoplay = "https://video.vipexam.net/";
var _version = new Date().getTime();
var _rangImg = "https://rang.vipexam.org/images/";
var _rangSound = "https://rang.vipexam.org/Sound/";
if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
	window.location.href = "https://www.vipexam.cn/mobile/index.html";
}


layui.extend({
	cookie:'{/}'+_jspath+'/Contents/js/cookie'
}).use(['form','layer','jquery','cookie'], function(){
	var $ = layui.jquery,
		form = layui.form,
		layer = layui.layer;
	_vipexam = $.cookie("vipexam");

	function RequestJson(url, params, callback) {
		var _idx = layer.load(1);
        $.ajax({ type: "post", data: params, url: url, dataType: "json", global: false, success: function (data) { callback && callback(data); }, complete: function () { layer.close(_idx); },error:function (XMLHttpRequest, textStatus, errorThrown){layer.close(_idx);} });
    }
	var _storage = !!_vipexam ? JSON.parse(_vipexam) : _veuser;
	var _vid = _storage.user.account;
	var  collegeName = _storage.user.collegename;
	var _ip = '';
	var _flag = false;
	var _prodcode = 'VE';
	var state = 1;

	var ipValidates = function(){
		var newaccount ="";
		RequestJson("user/verifyIP.action",{ account : _vid},function(data){
			if(data.code == "1"){
				if(_vid != "f46354b31ec64c9c96919e12a9bbd610"){
					if (_vid.length<=8){
						newaccount = _vid.substring(0,2)+"****"+_vid.substring(_vid.length-2);
					} else {
						newaccount = _vid.substring(0,3)+"*****"+_vid.substring(_vid.length-3);
					}
					$("#person").text(newaccount);
					$("#rtbox").hide();
					$("#rtbox2").show();
				}else{
					_veuser.user.collegename = !!data.collegename ? data.collegename : data.user.collegename;
					$.cookie("vipexam", JSON.stringify(_veuser), { path: '/', expires: 7});
					$("#rtbox").show();
					$("#rtbox2").hide();
				}
				_flag = true;
				//首都图书馆
				if("首都图书馆"== data.collegename){
					$('#rtbox').html("<button class='layui-btn layui-btn-sm' id='signinsdtsgdmt'>&nbsp;&nbsp;前往中科多媒体&nbsp;&nbsp;</button><button class='layui-btn layui-btn-sm' id='signinsdtsg'>&nbsp;&nbsp;登 录&nbsp;&nbsp;</button>");
					//首都图书馆
					$("#signinsdtsg").on('click',function(){
						document.location = "http://zkdmt.vipexam.cn/sdtsglogin.html";
					});
					$("#signinsdtsgdmt").on('click',function(){
						document.location = "dmtindex.html";
					});
				}
			}else{
				_ip = data.IP;
				if(document.location.toString().indexOf("sdtsglogin.html") < 0){
					layer.open({type:1,title:false,closeBtn: false,area: '40%;',shade: 0.1,id: 'iplimit',scrollbar:false,
						content: "<div class='iplimit'>亲！非常抱歉。<br>您的IP地址："+_ip+" 不在系统授权范围内，请联系图书馆老师进行添加 ^_^</div>",
						btnAlign: 'c',btn: '我知道了！',
						yes:function(index,layero){
							document.location = "sdtsglogin.html";
						}
					});
				}
			}
		});
	}
	window.invisits =function (special,visits) {
		if(state==1){
			$.ajax({
				type:"get",
				url:"https://rpttwo.cnscisoft.com/selectall/index/Statistic",
				dataType:"json",
				data:{ prodcode: _prodcode, custname: collegeName, special: special, creatwhere: 1, visits: visits }
			})
		}
	}
	if( _storage.user.account == "f46354b31ec64c9c96919e12a9bbd610" ){
		ipValidates();
	}else{
		var  newaccount="";
		if (_vid.length<=8){
			newaccount = _vid.substring(0,2)+"****"+_vid.substring(_vid.length-2);
		} else {
			newaccount = _vid.substring(0,3)+"*****"+_vid.substring(_vid.length-3);
		}
		$("#person").text(newaccount);
		$("#rtbox").hide();
		$("#rtbox2").show();
	}
	/*var roleValidates = function(){
		RequestJson("serviceLife/permissionValidation",function(data){
			if(data.code == "1"){

			}else{
				document.location = "role.html";
			}
		});
	}
	roleValidates();*/
	var loadLogo = function(){
		$.post("logo/collegeLogo.action",function(data){
			if(data.code == "1"){
				$("#logofont").html("欢迎你来自"+data.collegename+"的用户！");
				$(".ve-logo").prepend("<img src='"+data.collegeLogo+"?v="+_version+"' id='logoimage' style='float:left;margin:10px 10px 10px 0;max-width:250px;' alt/>");
				$(".ve-search").removeClass("logo_hide").addClass("logo_show");
				 $("#logoimage").on("click",function(){
					if("首都图书馆"== data.collegename){
					document.location = "dmtindex.html";
					}
				});
			}else{
				if(data.collegename != null && data.collegename !=""){
					$("#logofont").html("欢迎你来自"+data.collegename+"的用户！");
				}
				$(".ve-search").removeClass("logo_show").addClass("logo_hide");
			}
		});
	}
	loadLogo();
	$("#regist").on('click',function(){
		document.location = "register.html";
	});
	$("#signin").on('click',function(){
		document.location = "sdtsglogin.html";
	});
	$("#signinsdtsgdmt").on('click',function(){
		document.location = "dmtindex.html";
	});
	$("#signout").on("click",function(){
		$.cookie("vipexam", null, { path: '/', expires: -1});
		$("#rtbox").show();
		$("#rtbox2").hide();
		_vid="f46354b31ec64c9c96919e12a9bbd610";
		_vipexam=null;
		ipValidates();
	});
	
	form.on('submit(frmLogin)', function(data){
		_vid = $("#username").val();
		ipValidates();
		RequestJson("user/login.action",{account:$("#username").val(),password:$("#password").val()},function(data){
			if(data.code == "1"){
				if(_flag){
					$.cookie("vipexam", JSON.stringify(data), {  path: '/', expires: 7});
					_vipexam = $.cookie("vipexam");
					document.location = "index.html";
				}else{
					layer.msg("抱歉！IP:"+_ip+" 不在系统授权范围内！",{icon:2});
				}
			}else{
				layer.msg(data.msg,{icon:2});
			}
		});
		return false;
	});
	window.isLogout = function(n,msg){
		if(n == "9"){
			layer.msg("便于您使用数据库个性化功能，请使用注册账号登录！",{icon:1,time:3000},function(){document.location = "sdtsglogin.html";});
		}else{
			layer.msg(msg,{icon:2});
		}
	}

	$(".ve-search i").on("click",function(data){
		var _inkey = $(".ve-search input").val();
		if(_inkey == ""){
			layer.msg("请输入检索关键字");
		}else{
			document.location = "all_search.html?keys="+_inkey;
		}
	});

	$(document).keydown(function(e){
		if(e.keyCode == 13){
			$(".ve-search i").triggerHandler('click');
		}
	});
});
