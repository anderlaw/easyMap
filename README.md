# easyMap
A map plugin using gaode-map(a map provider in china),help you creating map descriptions fast

如果对您有帮助，欢迎start一下哦！
## before start 
你应该申请高德地图key密钥，使用script标签预先加载到页面，里面的key仅做测试用。强烈建议您申请自己的key，不花钱的。<script type="text/javascript"src="http://webapi.amap.com/maps?v=1.3&key=36a7ea407ccfb046b14579fe1b05fce5"></script>

导入easyMap.js文件，在上述两个依赖下编辑自己的js代码。

easyMap 暴露一个全局对象easyMap,所有的方法都在此对象之下。
## api简介
创建地图对象： ``easyMap.create(selector)``,返回地图对象。需要对容器元素设置样式高度,可以调用对象的原生方法对地图进一步配置。

加载插件，提供的插件有 toolbar工具条、overview鹰眼、scale比例尺 `easyMap.plugin(['toolbar','scale'])`

智能提示并搜索，绑定一个搜索框，输入内容自动补充，点击执行搜索操作。`easyMap.smartTip(selector)`，必须绑定input类型的元素，用于输入预期搜索的文字。

关键字搜索（带图片文字等信息提示）`easyMap.keySearch(selector)`，此selector是指定显示搜索结果提示的容器id。返回的是promisse对象。
`var searchTool = easyMap.keySearch('container');
searchTool.then(function(middleObj){
  middleObj.setCity('');// 设置需要限制的城市，如果不设限，可以忽略。
  middleObj.search('吃喝玩乐 | 宾馆');//进行关键字搜索 多关键字 用 | 隔开。
  // 搜索提示结果 会显示在 搜索结果提示容器里，在容器里进行点击相关操作。
})
`

添加标注点，`
easyMap.addMarkers(data,draggable);
// data 数据格式:[{name:'foo',position:[123,34]},{name:'sos',position:[120,40]}...],其中position是必须项，其他根据需要。
`,
返回一个对象，markers属性：包含刚刚创建的marker点数组，remove:方法移除刚创建的标注点，reload:载入刚刚创建的marker点。
必须在创建地图对象后再添加标记点。

工具类：
`easyMap.destroy()`注销地图对象
`easyMap.clear()`清除标记点（覆盖物）
`easyMap.fitView()` 根据覆盖物（标记点）进行视图的调整
`easyMap.setCity('北京')` 设置地图中心显示城市。
