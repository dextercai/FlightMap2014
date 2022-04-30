适用于FSD联飞服务端的地图，使用AMap API 1.3，最后完成时间2014年

算是个人最古早的半商业开发成品。代码无加密与混淆，所有基本逻辑均在`map.js`中。

由于AMapAPI 1.3，即高德API，可能需要申请一个Key，并修改`Index.html`中的L8。具体见下

```
<script language="javascript" src="http://webapi.amap.com/maps?v=1.3&key=KEY"></script>
```

本项目不提供后续更新，按照MIT许可进行开源。如需相关技术咨询，欢迎联系。

## TIPS

请注意，在2013年设计初期，本项目中关于机头朝向的实现方式定为：根据前后两次经纬度差，计算八个方向的机头朝向。

## 预览

![snap.png](https://github.com/dextercai/FlightMap2014/blob/main/snap.png)]