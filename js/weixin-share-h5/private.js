//百度分享
function BaiduShare(obj) {
    window._bd_share_config = {
        "common": {
            "bdSnsKey": {},
            "bdText": obj.text,
            "bdMini": "2",
            "bdMiniList": false,
            "bdPic": obj.pic,
            "bdStyle": "0",
            "bdSize": "32"
        },
        "share": {},
        "image": {
            "viewList": ["tsina", "weixin", "sqq", "qzone"],
            "viewText": "分享到：",
            "viewSize": "32"
        },
        "selectShare": {
            "bdContainerClass": null,
            "bdSelectMiniList": ["tsina", "weixin", "sqq", "qzone"]
        }
    };
    with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~ ( - new Date() / 36e5)];
}
//微信分享
function shareApp(obj){
	var config = {
			url:location.href,
            title:obj.title,
            desc:obj.text,
            img:obj.pic,
            img_title:'乐视行车记录仪',
            from:'乐视行车记录仪'
	};
	var share_obj = new nativeShare('nativeShare',config);
	//微信app分享的设置
	$("#share_img").get(0).src=obj.pic;
	$("title").text(obj.text);
	//end	
}
//qq、微信的app打开时，点击微信显示箭头图片
function showShare(){
	var na=navigator.appVersion;
	if((na.match(/QQ/gi)&&na.match(/QQ/gi).length==2)||na.match(/MicroMessenger/gi)){
		//qq、微信的app打开
		$(".weixin,.weixin_timeline,.qq").bind('click',function(){
			document.getElementById('mcover').style.display="block";
		});
	}
}
//绑定tab标签
function bindTab() {
    $("a div.tab_text").on('click',function(item) {
        $("a div.active").each(function(i, n) {
            $(n).removeClass("active");
        });
        $(this).addClass("active");
        if(this.id=="tab0"){
        	$("#ul0").show();
        	$("#ul1").hide();
        }else{
        	$("#ul0").hide();
        	$("#ul1").show();
        }
    });
}
//关闭fix下载
function closeDownload() {
    $('#downLoad_le').hide();
}
function back() {
    //alert("back");
}
//根据id请求播放URL
function playUrl(id) {
    var params = {
        OS: config.browser.osType(),
        platform: config.browser.platformType()
    }
    var param = {
        id: id,
        params: JSON.stringify(params)
    };
    $.ajax({
        url: "api/resource/playUrl.do",
        method: "POST",
        dataType: "JSON",
        data: param,
        async:false,
        success: function(result) {
        	if(result.code == 200){
                var obj = result.obj;
                if (obj) {
                    var url = obj.mainUrl ? obj.mainUrl: obj.cdnUrl;
                	url = url + '&format=1&expect=3&jsonp=?';
                	$.getJSON(url,function(data){  
                		var list = data.nodelist, i=0, itemSrc = list[i].location;
                		//播放列表和当前播放索引保存到全局
                		window.playerConfig={list:list,index:0};
                		//一个过期mainUrl地址，用于测试
                		//itemSrc="http://play.g3proxy.lecloud.com/vod/v2/MjQwLzEvNzIvbGV0di11dHMvMjAvdmVyXzAw%E2%80%A6yid=0&tss=ios&payff=0&pip=a3eb8cb80c8707a74016343dab9427c6&cvid=0&vtype=51";
                		//先播放第一个地址
                		itemSrc ? $($("video").get(0)).attr("src", itemSrc) : "";
                		$("#video_player")[0].play();
                    });
                }        		
        	}else{
        		alert(result.msg);
        	}
        }
    });
}
function callback(){
	
}

//根据id请求播放详情
function playDetail(id) {
    var param = {
        id: id
    };
    $.ajax({
        url: "api/resource/findResourceById.do",
        method: "POST",
        dataType: "JSON",
        data: param,
        async:false,
        success: function(result) {
            var obj = result.obj;
            if (obj) {
                obj.thumbnail ? $("#player_img").attr("src", obj.thumbnail) : "";
                obj.title ? $("#title").text(obj.title) : "";
                $.isNumeric(obj.browseCount) ? $("#browseCount").text(obj.browseCount) : "";
                obj.location ? $("#location").text(obj.location) : "";
                //obj.user.username ? $("#username").text(obj.user.username) : "";
                obj.user.photo ? $("#photo").attr("src", obj.user.photo) : "";
                //全局的请求类型（是否是视频，是的话会显示播放按钮），会在点击播放之后有不同显示
                player.type = obj.type;
                //详情图，会在点击播放之后有不同显示
                player.pic = obj.imageurlDetail;
                //在请求详情的时候初始化播放部分
                initPlayer();
                //设置分享的样式
                var shareObj={
                	title:obj.title||"",
                	name:obj.user.username||"",
                	pic:obj.thumbnail||"",
                	isVideo:player.type == 1
                }
                shareObj.text="我正观看"+shareObj.name+ " @乐视行车记录仪 "+(shareObj.isVideo?"视频":"图片")+"分享“"+shareObj.title+"”，非常精彩，转发不谢！#乐视车联#",
                BaiduShare(shareObj);
                shareApp(shareObj);               
            }
        }
    });
}
//在请求详情的时候初始化播放部分
function initPlayer(){
	//缩略图开始要显示
    $("#player_img").show();
    //播放器点击请求详情后隐藏，只有点击播放才会显示
    document.getElementById("video_player").pause();
    $("#video_player").hide();
    //默认播放按钮是隐藏，视频的时候显示，图片的时候隐藏
    if (player.type == 1) {
    	//视频
        $("#img_container").show();
    }else{
    	$("#img_container").hide();
    	
    }
}
//点击播放图片
function clickImg() {
    if (player.type == 1) {
        //点击图片播放后，默认图片和播放按钮隐藏，播放组件显示并播放
        $("#player_img").hide();
        $("#img_container").hide();
        $("#video_player").show();
        //要在点击的时候再获取地址
		playUrl(id);
        //document.getElementById("video_player").play();
    } else {
        window.open(player.pic,'_self','width=100%');
    }
}
//绑定缩略图和播放按钮的播放功能
function bindClickImg() {
	$("#player_img").on('click',clickImg);
	$("#img_container").on('click',clickImg);
}
//请求播放列表
function getList(id) {
    var params = {
    	classifyId: 1,
        rows: 5
    }
    var param = {
        params: JSON.stringify(params)
    };
    $.ajax({
        url: "api/resource/findResourcesByParam.do",
        method: "POST",
        dataType: "JSON",
        data: param,
        success: function(result) {
            var rows = result.rows,item;
            for(var i=0;i<5;i++){
            	item=$($("#ul0 li")[i]);
            	if(rows&&rows[i]){
	            	item.show();
	            	item.find('.list_img').attr("name",rows[i].id+":"+rows[i].user.uid);
	            	item.find('.listTitle').text(rows[i].title);
	            	item.find('.listNameAdd').text(rows[i].user.username+"  "+(rows[i].location?rows[i].location:""));
	            	item.find('small').attr("style","background-image: url("+rows[i].thumbnail+");");
	            	item.find('.listTime').text("浏览："+rows[i].browseCount);
	            	item.find('.listGoodNumber').text(rows[i].upCount);
            	}else{
            		item.hide();
            	}
            }
        }
    });
}
//请求TA的播放列表
function getShareList(id, userId) {
	var params = {
	    rows: 5,
	    userId:userId,
	    share:true
	}
	var param = {
		params: JSON.stringify(params)
	};
    $.ajax({
        url: "api/resource/findResourcesShareByParam.do",
        method: "POST",
        dataType: "JSON",
        data: param,
        success: function(result) {
        	var rows = result.rows,item;
            for(var i=0;i<5;i++){
            	item=$($("#ul1 li")[i]);
            	if(rows&&rows[i]){
            		item.show();
	            	item.find('.list_img').attr("name",rows[i].id+":"+rows[i].user.uid);
	            	item.find('.listTitle').text(rows[i].title);
	            	item.find('.listNameAdd').text(rows[i].user.username+"  "+(rows[i].location?rows[i].location:""));
	            	item.find('small').attr("style","background-image: url("+rows[i].thumbnail+");");
	            	item.find('.listTime').text("浏览："+rows[i].browseCount);
	            	item.find('.listGoodNumber').text(rows[i].upCount);
            	}else{
            		item.hide();
            	}
            }
        }
    });
}
//绑定列表项的点击事件
function bindClickListImg(){
	$(".list_img").parent().on('click',function(){
		var ids=$(this).children(".list_img").attr("name").split(":");
		window.id=ids[0];
		window.userId=ids[1];
		/*playDetail(id);
		//点击列表直接播放
		$("#player_img").click();
		if(window.location.href.indexOf("#pos")<=-1){
			window.location.href += "#pos"
		}else{
			window.location.href=window.location.href;
		}*/
		window.location.href=window.location.href.split("?")[0]+"?id="+id+"&userId="+userId;
	});
}
//绑定播放错误事件
function bindPlayer(){
	$("#video_player")[0].onerror=function(){
		if(playerConfig.index+1<3){
			var newSrc=playerConfig.list[++playerConfig.index].location;
			//一个过期mainUrl地址，用于测试
			//newSrc="http://play.g3proxy.lecloud.com/vod/v2/MjQwLzEvNzIvbGV0di11dHMvMjAvdmVyXzAw%E2%80%A6yid=0&tss=ios&payff=0&pip=a3eb8cb80c8707a74016343dab9427c6&cvid=0&vtype=51";
			newSrc? $($("video").get(0)).attr("src", newSrc) : "";
    		$("#video_player")[0].play();
		}
	}
}


