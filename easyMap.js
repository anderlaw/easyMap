var easyMap = {};
(function (AMap) {
    var map = null;

    //创建地图对象及组件配置
    easyMap.create = function (selector,ops) {
        ops = ops ? ops : {
            zoom:10,
            resizeEnable:true
        };
        map = new AMap.Map(selector,ops);
        return map;
    };
    // 组件配置
    easyMap.plugin = function (ops) {
        // ops : ['toolbar','overview','scale'],只提供三种。
        var pluginsBox = {
            'toolbar':'AMap.ToolBar',
            'overview':'AMap.OverView',
            'scale':'AMap.Scale'
        };
        var pluginToPop = [];
        var len = ops.length;
        for(var k=0;k<len;k++){
            pluginToPop.push(pluginsBox[ops[k]])
        }
        AMap.plugin(pluginToPop,function(){
            if(!map) throw '请先创建地图对象，再加载插件';
            for(var i=0;i<len;i++){
                var currentKey = ops[i];
                switch (currentKey){
                    case 'toolbar':
                        map.addControl(new AMap.ToolBar());
                        break;
                    case 'overview':
                        map.addControl(new AMap.OverView({isOpen:true}));
                        break;
                    case 'scale':
                        map.addControl(new AMap.Scale());
                        break;
                }
            }
        })
    };


    // 自动提示初始化。只能初始化单个表单格子。
    easyMap.smartTip = function (selector) {
        AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function () {
            //输入提示。
            var autoFill =  new AMap.Autocomplete({
                input:selector
            });
            // 查询类
            var placeSearch = new AMap.PlaceSearch({
                map:map
            });
            AMap.event.addListener(autoFill,'select',_select);
            function _select(e) {
                placeSearch.setCity(e.poi.adcode);
                placeSearch.search(e.poi.name);//关键字查询
            }
        });
    };
    // 关键字搜索提示
    easyMap.keySearch = function (selector) {
        return new Promise(function (resolve,reject) {
            AMap.plugin(['AMap.PlaceSearch'],function () {
                // 查询类
                var placeSearch = new AMap.PlaceSearch({
                    pageSize:5,
                    pageIndex:1,
                    map:map,
                    panel:selector
                });
                resolve(placeSearch);
                // 在返回的promise对象里.then  进行操作（setCity设置城市，search多关键字搜索，空格或者|分开）
            });
        });

    };

    easyMap.createMarker = function (resource,modified) {
        // 假设资源的数据格式 {id:1,name:'标记1',title:'重要',position:[120,30]};
        var tip = false;
        var currentMarker = new AMap.Marker({
            map:map,
            position:resource.position,
            draggable:modified,
            extData:{id:resource.id},
            title:resource.title,
            clickable:true,
            animation:"AMAP_ANIMATION_DROP"
        });
        // 添加点击事件
        currentMarker.on('click',function () {
            tip = !tip;
            var geoPosition = this.getPosition();
            // this.G下面是options的内容
            var title = this.G.title;
            map.setCenter(geoPosition);
            if(tip){
                this.setLabel({
                    offset:new AMap.Pixel(20, 20),
                    content:'位置:['+ geoPosition.lng +','+ geoPosition.lat +']<br/> Title:'+title
                });
            }else{
                this.setLabel({
                    content:''
                });
            }
        });
        return currentMarker;
    };
    easyMap.addMarkers = function (overlays,modified) {
        // overlays : 数组;
        var markerBox = []; // 临时数组用于保存 创建的标记点
        if(!map) throw '请先创建地图对象再添加标记点！';
        modified = modified ? true : false;
        overlays = overlays ? overlays : [
            {id:1,name:'标记1',title:'重要',position:[120,30]},
            {id:2,name:'标记2',title:'不重要',position:[121,31]},
            {id:3,name:'标记3',title:'重要',position:[120.2,29]},
            {id:4,name:'标记4',title:'重要',position:[119.8,30]}
        ];
        var sourceLen = overlays.length;
        for(var i=0;i<sourceLen;i++){
            markerBox.push(easyMap.createMarker(overlays[i],modified));
        }
        // 设置合适的视图
        map.setFitView();
        function remove() {
            map.remove(markerBox);
        }
        function reload() {
            map.add(markerBox);
        }
        return {
            markers:markerBox,
            remove:remove,
            reload:reload
        }
    };

    // 注销地图对象
    easyMap.destroy = function () {
        map.destroy();
    };
    // remove所有的覆盖物
    easyMap.clear = function () {
        map.clearMap();
    };
    //建议 添加覆盖物后调用。
    easyMap.fitView = function () {
        map.setFitView();
    };
    easyMap.setCity = function (cityName) {
        // cityName:'北京'
        map.setCity(cityName)
    }
}(AMap));
