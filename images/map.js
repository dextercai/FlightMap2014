var client = [];
var oldclient = [];
var step = 0;
window.onresize = function () {
    $("#iCenter").height($(window).height());
    $("#iCenter").width($(window).width() - 300);
    $("#listpolit").height($(window).height());

};
var mapObj;
//初始化地图对象，加载google地图
function mapInit() {
    $("#iCenter").height($(window).height());
    mapObj = new AMap.Map("iCenter", {
        //二维地图显示视口
        view: new AMap.View2D({
            center: new AMap.LngLat(116.397428, 39.90923), //地图中心点
            zoom: 5 //地图显示的缩放级别
        }),
        //初始化时，加载google地图 
        layers: [new AMap.TileLayer({
                tileUrl: "http://mt{1,2,3,0}.google.cn/vt?lyrs=s@164&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil" //取图地址
            })]
    });
//地图类型切换
    mapObj.plugin(["AMap.MapType"], function () {
        var type = new AMap.MapType({defaultType: 1, showRoad: true});
        mapObj.addControl(type);
    });
    mapObj.plugin(["AMap.Scale"], function () {
        scale = new AMap.Scale();
        mapObj.addControl(scale);
    });
    mapObj.plugin(["AMap.ToolBar"], function () {
        toolBar = new AMap.ToolBar();
        mapObj.addControl(toolBar);
    });
    window.onresize();
    startTime();
}
function refresh() {
    oldclient = client;
    client = [];
    $.get("/whazzup.txt", function (data) {
        var arr = data.split("\n");
        
        var startplan = 0;
        var endplan = 0;
        var clients = 0;
        var i = 8;
        while (i < 100) {
            if (arr[i] == "!SERVERS") {
                break;
            }
			if (arr[i] == "" ) {
			}else{
                console.log(arr[i]);
                client.push(arr[i].split(':'));
                
			}
            i++;
        }
        if (arr[5].indexOf("CLIENTS") > 0) {
            clients = arr[5].substr(arr[5].indexOf("S") + 3);
            $("#onlinepc").html(clients);
        }
        mapObj.clearMap();
        $("#al").empty();
        $("#pl").empty();
        setclient();
    });
}
function setclient() {
    qid = '';
    quser = '';
    qadmin = '';
    qx = 0;
    qy = 0;
    qhigh = '';
    qpspeed = '';
    qpstart = '';
    qphigh = '';
    qpend = '';
    qtalk = '';
    qplan = '';
    for (var n = 0; n < client.length; n++) {
		var iconimg = "images/plane_N.png";
        qid = client[n][0]; //ID
        quser = client[n][1]; // userid
        qadmin = client[n][3]; //POLIT ATC
        qx = client[n][6];
        qy = client[n][5];
        if (!qx || !qy) {
            continue;
        }
        qhigh = client[n][7]; //height
        qspeed = client[n][8]; // speed
        qplane = client[n][9]; // plane type
        qpspeed = client[n][10]; // plan speed
        qpstart = client[n][11]; //plan start icao
        qphigh = client[n][12]; //plan alt
        qpend = client[n][13]; //plan end icao
		qpt = client[n][14];
        qtalk = client[n][17]; //talk code
        qplan = client[n][30];//plan text
        if (qadmin == 'ATC') {
            $("#al").append("<dd class=all><a href='javascript:void(0)' onclick='infowin(" + n + ")'>" + qid + "</a></dd>");
            iconimg = "images/Tower.png";
			var range = ""
        var seat =client[n][0].substring(client[n][0].length - 3)
        switch (seat)
        {
        case "OBS":
        range = 0;
        break;
        case "TWR":
        range = 40;
        break;
        case "DEL":
        range = 40;
        break;
        case "GND":
        range = 40;
        break;
        case "DEP":
        range = 50;
        break;
        case "APP":
        range = 100;
        break;
        case "CTR":
        range = 200;
        break;
        default:
        range = 30
        }
        var circle = new AMap.Circle({
        center: new AMap.LngLat(client[n][6], client[n][5]),// 圆心位置
        radius: eval(range*1852), //半径
        strokeColor: "#F00", //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 1, //线粗细度
        fillColor: "#DFFFFF", //填充颜色
        fillOpacity: 0.05//填充透明度
		});
		circle.setMap(mapObj);
        } else {
            $("#pl").append("<dd class=all><a href='javascript:void(0)' onclick='infowin(" + n + ")'>" + qid + "</a></dd>");
            for (var m = 0; m < oldclient.length; m++) {
                if (oldclient[m][0] === client[n][0]) {
					if (client[n][14] == "YHC"){
						iconimg = "images/plane_" + at(oldclient[m][6], oldclient[m][5], qx, qy) + "_YHC.png";
					}else{
						iconimg = "images/plane_" + at(oldclient[m][6], oldclient[m][5], qx, qy) + ".png";
					}   
                }
            }
        }
		
        eval('var marker_i_'
                + n
                + ' = new AMap.Marker({ position:new AMap.LngLat(' + qx + ',' + qy + '),offset: new AMap.Pixel(-10,-34),icon : "' + iconimg + '"});');
        eval('marker_i_' + n + '.setMap(mapObj);');
        eval('AMap.event.addListener(marker_i_' + n + ', "click" ,function() {' + 'infopl("' + n + '");});');
        eval('AMap.event.addListener(marker_i_' + n + ', "click" ,function() {' + 'infowin("' + n + '");});');
		eval('AMap.event.addListener(marker_i_' + n + ', "click" ,function() {' + 'rtlineonmap("' + n + '");});');
    }

}



function at(x1, y1, x2, y2) {
    var s = "";
    var fx = changeTwoDecimal(x2 - x1);
    var fy = changeTwoDecimal(y2 - y1);
    if (fy < -180.0) {
        fy += 360.0;
    }
    if (fy > 180.0) {
        fy -= 360.0;
    }
    if (fx > 0) {
        s = "E";
    } else if (fx < 0) {
        s = "W";
    }
    if (fy > 0) {
        s += "N";
    } else if (fy < 0) {
        s += "S";
    }

    if (fx == 0 && fy == 0) {
        s = "N";
    }
	return s;
	
}
function infowin(n) {
    var info = [];
    if (client[n][3] == "ATC"){
     info.push("<table width=\"400\" border=\"1\" align=\"left\"><tr><td width=\"72\" bgcolor=\"#999999\">ID</td><td width=\"59\">" + client[n][1] + "</td><td width=\"40\" bgcolor=\"#999999\">管制席位</td><td width=\"67\">" + client[n][0] + "</td><td width=\"54\" bgcolor=\"#999999\">类型</td><td width=\"68\">管制</td></tr><tr><td bgcolor=\"#999999\">管制频率</td><td colspan=\"5\"><span id=\"ac_wave2\"></span></td></tr></table>");            
     }else{
     info.push("<table width=\"400\" border=\"1\" align=\"left\"><tr><td width=\"72\" bgcolor=\"#999999\">ID</td><td width=\"59\">" + client[n][1] + "</td><td width=\"40\" bgcolor=\"#999999\">呼号</td><td width=\"67\">" + client[n][0] + "</td><td width=\"54\" bgcolor=\"#999999\">类型</td><td width=\"68\">飞行员</td></tr><tr><td bgcolor=\"#999999\">出发</td><td>" + client[n][11] + "</td><td bgcolor=\"#999999\">到达</td><td>" + client[n][13] + "</td><td bgcolor=\"#999999\">高度</td><td>" + client[n][7] + "</td></tr><tr><td bgcolor=\"#999999\">地速</td><td>" + client[n][8] + "</td><td bgcolor=\"#999999\">机型</td><td>" + client[n][9] + "</td><td bgcolor=\"#999999\">应答机</td><td>" + client[n][17] + "</td></tr><tr><td height=\"48\" bgcolor=\"#999999\">计划航路</td><td colspan=\"5\">" + client[n][30] + "</td></tr></table>");        
     }

    inforWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(10, -23),
        content: info.join("<br/>"),
        size: new AMap.Size(420, 130)
    });
    mapObj.setCenter(new AMap.LngLat(client[n][6], client[n][5]));
    inforWindow.open(mapObj, new AMap.LngLat(client[n][6], client[n][5]));
    infopl(n);
}
function infopl(n) {
    $('#politmsg').hide();
    $('#atcmsg').hide();
    if (client[n][3] == "ATC") {
        $('#pc_txt').text('管制信息');
        $('#ac_id').text(client[n][1]);
        $.post("?c=index&a=getosdata", {id: client[n][1]}, function (data) {
            var obtxt;
            switch (Number(data.oblevel)) {
                case 1:
                    obtxt = '<img src=images/Icon/o1.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;地面';
                    break;
                case 2:
                    obtxt = '<img src=images/Icon/o2.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;放行';
                    break;
                case 3:
                    obtxt = '<img src=images/Icon/o3.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;塔台';
                    break;
                case 4:
                    obtxt = '<img src=images/Icon/o4.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;离场';
                    break;
                case 5:
                    obtxt = '<img src=images/Icon/o5.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;区调';
                    break;
                case 6:
                    obtxt = '<img src=images/Icon/o6.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;进近';
                    break;
                case 7:
                    obtxt = '<img src=images/Icon/o7.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;离场机场';
                    break;
                case 8:
                    obtxt = '<img src=images/Icon/o8.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;进场机场';
                    break;
                case 9:
                    obtxt = '<img src=images/Icon/o9.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;全席';
                    break;
                default:
                    obtxt = '无';
            }
            $('#ac_call').html(obtxt);
            $('#ac_title').html('');
            if (data.obtitle > 0) {
                $('#ac_title').html("<font color=red>管制级别：<img src=images/Icon/ot" + data.obtitle + ".jpg />" + data.obtitle + "级</font>");
                if (data.obwave == "") {
                    $('#ac_wave').html("<font color=red>未设置</font>");
                    $('#ac_wave2').html("<font color=red>未设置</font>");
                } else {
                    $('#ac_wave').html("<font color=red><b>" + data.obwave + "</b></font>");
                    $('#ac_wave2').html("<font color=red><b>" + data.obwave + "</b></font>");
                }
            }
            if (data.obtitle == 7) {
                $('#ac_title').html("<font color=red>管制级别：<img src=images/Icon/ot" + data.obtitle + ".jpg />特级</font>");
            }
        });
        $('#atcmsg').show();
    } else {
        $('#pc_id').text(client[n][1]);
        $('#pc_call').text(client[n][0]);
        $("#pc_img").attr("src", "images/plane/final.png");
        $('#pc_txt').text('机组信息');
        var planetype = ['DHC8D', 'E50P300', '77', '320', '738', '748', '744', 'MD11', 'A321', 'A332', 'A343', 'A346', 'A333', 'ATR72', 'DASH8', 'E190', 'B752', 'TU154', 'A380', 'B763', '739', '300', 'L1011', 'MD82', 'DH8D', 'B117', 'B0998', 'CONC'];
        var pplanet = client[n][9];
        for (var i in planetype) {
            if (pplanet.indexOf(planetype[i]) > -1) {
                $("#pc_img").attr("src", "images/plane/" + planetype[i] + ".jpg");
                break;
            }
        }
        $.post("?c=index&a=getosdata", {id: client[n][1]}, function (data) {
            var leveltxt;
            switch (Number(data.level)) {
                case 1:
                    leveltxt = '<img src=images/Icon/1.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;学员';
                    break;
                case 2:
                    leveltxt = '<img src=images/Icon/2.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;观察员';
                    break;
                case 3:
                    leveltxt = '<img src=images/Icon/2.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;见习副驾驶';
                    break;
                case 4:
                    leveltxt = '<img src=images/Icon/3.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第二副驾驶';
                    break;
                case 5:
                    leveltxt = '<img src=images/Icon/3.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第一副驾驶';
                    break;
                case 6:
                    leveltxt = '<img src=images/Icon/4.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;见习机长';
                    break;
                case 7:
                    leveltxt = '<img src=images/Icon/4.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单飞机长';
                    break;
                case 8:
                    leveltxt = '<img src=images/Icon/4.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;带队机长';
                    break;
                case 9:
                    leveltxt = '<img src=images/Icon/4.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="red">教员A</font>';
                    break;
				case 10:
                    leveltxt = '<img src=images/Icon/4.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="red">教员B</font>';
                    break;
				case 11:
                    leveltxt = '<img src=images/Icon/4.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="red">教员C</font>';
                    break;
				case 12:
                    leveltxt = '<img src=images/Icon/4.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="red">检查员</font>';
                    break;
				case 18:
                    leveltxt = '<img src=images/Icon/6.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;教员';
                    break;
                case 20:
                    leveltxt = '<img src=images/Icon/6.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;监察员';
                    break;
                default:
                    leveltxt = '新人';
            }
            if (data.title) {
                if (data.title == '监察员') {
                    $('#pc_title').html('职位：<img src=images/Icon/6.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;监察员');
                } else if ((data.title).indexOf("教员") > 0) {
                    $('#pc_title').html('职位：<img src=images/Icon/s1.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.title);
                } else {
                    $('#pc_title').html('职位：<img src=images/Icon/5.jpg /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.title);
                }
            } else {
                $('#pc_title').html('');
            }
            $('#level').html(leveltxt);
            $('#fly').text(Math.floor(data.fly / 60) + '小时' + Math.floor(data.fly % 60) + '分钟');
            var olhour = Math.floor(data.online / 60);
            var olyear = Math.floor(olhour / 8760); //算出年数
            var olday = Math.floor(olhour % 8760 / 24); //算出天数
            var oltime = olyear + '年' + olday + '天' + (olhour - olyear * 8760 - olday * 24) + '小时';
            $('#online').text(oltime);
            $('#night').text(Math.floor(data.night / 60) + '小时' + Math.floor(data.night % 60) + '分钟');
        });
        $('#pc_x').text(changeTwoDecimal(client[n][6]));
        $('#pc_y').text(changeTwoDecimal(client[n][5]));
        $('#pc_height').text(client[n][7]);
        $('#pc_speed').text(client[n][8]);
        $('#pc_type').text(client[n][9]);
        $('#pc_talk').text(client[n][17]);
        $('#pc_start').text(client[n][11]);
        $('#pc_end').text(client[n][13]);
        $('#pc_alt_speed').text(client[n][10]);
        $('#pc_alt').text(client[n][12]);
        $('#pc_plan').text(client[n][30]);
        $('#politmsg').show();
        $('#pc_pintai').text(client[n][14]);
    }

}
changeTwoDecimal = function changeTwoDecimal(floatvar)
{
    var f_x = parseFloat(floatvar);
    if (isNaN(f_x))
    {
        alert('function:changeTwoDecimal->parameter error');
        return false;
    }
    var f_x = Math.round(floatvar * 100) / 100;
    return f_x;
};
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month 
        "d+": this.getDate(), //day 
        "h+": this.getHours(), //hour 
        "m+": this.getMinutes(), //minute 
        "s+": this.getSeconds(), //second 
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
        "S": this.getMilliseconds() //millisecond 
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
function startTime() {
    refresh();
    var now = new Date();
    var nowStr = now.format("hh:mm:ss");
    $("#lasttime").text(nowStr);
    setTimeout('startTime()', 30000);
}


//输入提示
function autoSearch() {
    var keywords = document.getElementById("keyword").value;
    var auto;
    //加载输入提示插件
    AMap.service(["AMap.Autocomplete"], function () {
        var autoOptions = {
            city: "" //城市，默认全国
        };
        auto = new AMap.Autocomplete(autoOptions);
        //查询成功时返回查询结果
        if (keywords.length > 0) {
            auto.search(keywords, function (status, result) {
                autocomplete_CallBack(result);
            });
        }
        else {
            document.getElementById("result1").style.display = "none";
        }
    });
}

//输出输入提示结果的回调函数
function autocomplete_CallBack(data) {
    var resultStr = "";
    var tipArr = data.tips;
    if (tipArr && tipArr.length > 0) {
        for (var i = 0; i < tipArr.length; i++) {
            resultStr += "<div id='divid" + (i + 1) + "' onmouseover='openMarkerTipById(" + (i + 1)
                    + ",this)' onclick='selectResult(" + i + ")' onmouseout='onmouseout_MarkerStyle(" + (i + 1)
                    + ",this)' style=\"font-size: 13px;cursor:pointer;padding:5px 5px 5px 5px;\"" + "data=" + tipArr[i].adcode + ">" + tipArr[i].name + "<span style='color:#C1C1C1;'>" + tipArr[i].district + "</span></div>";
        }
    }
    else {
        resultStr = " π__π 亲,人家找不到结果!<br />要不试试：<br />1.请确保所有字词拼写正确<br />2.尝试不同的关键字<br />3.尝试更宽泛的关键字";
    }
    document.getElementById("result1").curSelect = -1;
    document.getElementById("result1").tipArr = tipArr;
    document.getElementById("result1").innerHTML = resultStr;
    document.getElementById("result1").style.display = "block";
}

//输入提示框鼠标滑过时的样式
function openMarkerTipById(pointid, thiss) {  //根据id打开搜索结果点tip 
    thiss.style.background = '#CAE1FF';
}

//输入提示框鼠标移出时的样式
function onmouseout_MarkerStyle(pointid, thiss) {  //鼠标移开后点样式恢复 
    thiss.style.background = "";
}

//从输入提示框中选择关键字并查询
function selectResult(index) {
    if (index < 0) {
        return;
    }
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        document.getElementById("keyword").onpropertychange = null;
        document.getElementById("keyword").onfocus = focus_callback;
    }
    //截取输入提示的关键字部分
    var text = document.getElementById("divid" + (index + 1)).innerHTML.replace(/<[^>].*?>.*<\/[^>].*?>/g, "");
    var cityCode = document.getElementById("divid" + (index + 1)).getAttribute('data');
    document.getElementById("keyword").value = text;
    document.getElementById("result1").style.display = "none";
    //根据选择的输入提示关键字查询
    mapObj.plugin(["AMap.PlaceSearch"], function () {
        var msearch = new AMap.PlaceSearch();  //构造地点查询类
        AMap.event.addListener(msearch, "complete", placeSearch_CallBack); //查询成功时的回调函数
        msearch.setCity(cityCode);
        msearch.search(text);  //关键字查询查询
    });
}

//定位选择输入提示关键字
function focus_callback() {
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        document.getElementById("keyword").onpropertychange = autoSearch;
    }
}

//输出关键字查询结果的回调函数
function placeSearch_CallBack(data) {
    //清空地图上的InfoWindow和Marker
    windowsArr = [];
    marker = [];
    mapObj.clearMap();
    var resultStr1 = "";
    var poiArr = data.poiList.pois;
    var resultCount = poiArr.length;
    for (var i = 0; i < resultCount; i++) {
        resultStr1 += "<div id='divid" + (i + 1) + "' onmouseover='openMarkerTipById1(" + i + ",this)' onmouseout='onmouseout_MarkerStyle(" + (i + 1) + ",this)' style=\"font-size: 12px;cursor:pointer;padding:0px 0 4px 2px; border-bottom:1px solid #C1FFC1;\"><table><tr><td><img src=\"http://webapi.amap.com/images/" + (i + 1) + ".png\"></td>" + "<td><h3><font color=\"#00a6ac\">名称: " + poiArr[i].name + "</font></h3>";
        resultStr1 += TipContents(poiArr[i].type, poiArr[i].address, poiArr[i].tel) + "</td></tr></table></div>";
        addmarker(i, poiArr[i]);
    }
    mapObj.setFitView();
}

//鼠标滑过查询结果改变背景样式，根据id打开信息窗体
function openMarkerTipById1(pointid, thiss) {
    thiss.style.background = '#CAE1FF';
    windowsArr[pointid].open(mapObj, marker[pointid]);
}

//添加查询结果的marker&infowindow   
function addmarker(i, d) {
    var lngX = d.location.getLng();
    var latY = d.location.getLat();
    var markerOption = {
        map: mapObj,
        icon: "http://webapi.amap.com/images/" + (i + 1) + ".png",
        position: new AMap.LngLat(lngX, latY)
    };
    var mar = new AMap.Marker(markerOption);
    marker.push(new AMap.LngLat(lngX, latY));

    var infoWindow = new AMap.InfoWindow({
        content: "<h3><font color=\"#00a6ac\">  " + (i + 1) + ". " + d.name + "</font></h3>" + TipContents(d.type, d.address, d.tel),
        size: new AMap.Size(300, 0),
        autoMove: true,
        offset: new AMap.Pixel(0, -30)
    });
    windowsArr.push(infoWindow);
    var aa = function (e) {
        infoWindow.open(mapObj, mar.getPosition());
    };
    AMap.event.addListener(mar, "mouseover", aa);
}

//infowindow显示内容
function TipContents(type, address, tel) {  //窗体内容
    if (type == "" || type == "undefined" || type == null || type == " undefined" || typeof type == "undefined") {
        type = "暂无";
    }
    if (address == "" || address == "undefined" || address == null || address == " undefined" || typeof address == "undefined") {
        address = "暂无";
    }
    if (tel == "" || tel == "undefined" || tel == null || tel == " undefined" || typeof address == "tel") {
        tel = "暂无";
    }
    var str = "  地址：" + address + "<br />  电话：" + tel + " <br />  类型：" + type;
    return str;
}
function keydown(event) {
    var key = (event || window.event).keyCode;
    var result = document.getElementById("result1")
    var cur = result.curSelect;
    if (key === 40) {//down
        if (cur + 1 < result.childNodes.length) {
            if (result.childNodes[cur]) {
                result.childNodes[cur].style.background = '';
            }
            result.curSelect = cur + 1;
            result.childNodes[cur + 1].style.background = '#CAE1FF';
            document.getElementById("keyword").value = result.tipArr[cur + 1].name;
        }
    } else if (key === 38) {//up
        if (cur - 1 >= 0) {
            if (result.childNodes[cur]) {
                result.childNodes[cur].style.background = '';
            }
            result.curSelect = cur - 1;
            result.childNodes[cur - 1].style.background = '#CAE1FF';
            document.getElementById("keyword").value = result.tipArr[cur - 1].name;
        }
    } else if (key === 13) {
        var res = document.getElementById("result1");
        if (res && res['curSelect'] !== -1) {
            selectResult(document.getElementById("result1").curSelect);
        }
    } else {
        autoSearch();
    }
}
