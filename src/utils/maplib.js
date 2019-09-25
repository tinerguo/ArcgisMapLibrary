/* eslint-disable no-invalid-this */
/* eslint-disable no-undef */
//todo:根据坐标list地图绘制面
function ondrawplaneLocator(GIS,rings, wkid, fillColor, lineWidth, lineColor, lineStyle) {

    lineStyle = lineStyle || esri.symbol.SimpleLineSymbol.STYLE_SOLID;
    var polygon = new GIS.Polygon(new GIS.SpatialReference({wkid:wkid}));
    polygon.addRing(rings);
    let polygonsymbol;

    if (lineWidth === 0) {
        polygonsymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, null, new dojo.Color(fillColor));
    } else {
        polygonsymbol = new esri.symbol.SimpleFillSymbol(
            esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.symbol.SimpleLineSymbol(lineStyle,
                new dojo.Color(lineColor), lineWidth),
            new dojo.Color(fillColor));
    }
    let graphic = new GIS.graphic(polygon, polygonsymbol);
    return graphic;
}
//绘制测站数据
function ondrawPointLocator(page,GIS,map,layer,type,arr,iconUrl,iconW,iconH,ParamsDes,ParamsKey){
    var amEvent = page.amEvent;
    let nameParam = ParamsKey || {
        id:'id',
        name:'name',
        x:'x',
        y:'y',
        value:'value'
    };
    let that = this;

    for (let i = 0; i < arr.length; i++) {
        let pointObj = arr[i];
        pointObj.ParamsKey = ParamsKey;
        pointObj.nameParam = nameParam;
        if (ParamsDes){
            pointObj.ParamsDes = ParamsDes;
        }
        let geometry = new GIS.Point(pointObj[nameParam.x], pointObj[nameParam.y]);
        let picURL = '';
        if (typeof iconUrl === 'function'){
            picURL = iconUrl(pointObj[nameParam.value]);
        } else {
            picURL = iconUrl;
        }


        let picSymbol = new GIS.PictureMarkerSymbol(picURL, iconW, iconH);
        // eslint-disable-next-line new-cap
        //,infoTemplate
        let picGraphic = new GIS.graphic(geometry, picSymbol, pointObj);
        layer.add(picGraphic);
        amEvent.setStations(type+'_'+pointObj[nameParam['id']],picGraphic);
        // let loc = map.toScreen(picGraphic.geometry);
        // map.infoWindow.setFeatures([picGraphic]);
        // map.infoWindow.show(loc);
    }

    dojo.connect(layer, 'onMouseMove', function(evt) {
        var g = evt.graphic;
        var point = map.toScreen(g.geometry);
        map.setMapCursor('pointer');
        page.mapMouseOver.x = point.x+10;
        page.mapMouseOver.y = point.y+10;
        page.mapMouseOver.currentObj = g.attributes;
        page.$emit('mapMove',g.attributes);
    });
    dojo.connect(layer, 'onMouseOut', function() {
        var timer = setTimeout(function(){
            page.mapMouseOver.x = 10000;
            clearTimeout(timer);
            timer = null;
            map.setMapCursor('default');
        },300);
    });
    dojo.connect(layer, 'onClick', function (evt) {
        var graphic = evt.graphic;


        if (page.mdata.clickWinType === 'custom'){
            page.$emit('mapClick',graphic.attributes);
        } else if (page.mdata.clickWinType === 'infoTemplate'){
            let num = sum(1,1000);
            let infoTemplate = new GIS.InfoTemplate('${'+nameParam['name']+'}','<div class="yq_win'+num+'"></div>');
            graphic.setInfoTemplate(infoTemplate);
            page.$emit('mapClick',graphic.attributes,'yq_win'+num
            );
        } else {
            let ParamsDes = graphic.attributes.ParamsDes;
            let content = '<table>';
            for (let key in graphic.attributes){
                if (key === 'paramsSetting'){
                    continue;
                }
                if (ParamsDes){
                    if (!ParamsDes[key]){
                        continue;
                    }
                    content += '<tr><th>'+ParamsDes[key]+'</th><td>'+graphic.attributes[key]+'</td></tr>';
                } else {
                    content += '<tr><th>'+key+'</th><td>'+graphic.attributes[key]+'</td></tr>';
                }
            }
            content += '</table>';
            graphic.setInfoTemplate(new GIS.InfoTemplate('${'+nameParam['name']+'}','<div class="popupwin yq_win'+sum(1,1000)+'">'+content+'</div>'));
        }
    });

}
function sum (m,n){
    var num = Math.floor(Math.random()*(m - n) + n);
    return num;
}


export function mapLibs(page){
    // eslint-disable-next-line no-invalid-this
    this.map = page.map;
    this.GIS = page.GIS;
    this.page = page;
    this.mapLayers = page.mapLayers;
    this.defaultSetting = page.defaultSetting;
    this.debugger = this.defaultSetting.debugger;
}

mapLibs.prototype = {
    drowGeoJsonPolygon(rings, wkid, fillColor, lineWidth, lineColor, lineStyle){
        lineStyle = lineStyle || esri.symbol.SimpleLineSymbol.STYLE_SOLID;
        var polygon = new this.GIS.Polygon(new this.GIS.SpatialReference({wkid:wkid}));
        polygon.addRing(rings);
        let polygonsymbol;

        if (lineWidth === 0) {
            polygonsymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, null, new dojo.Color(fillColor));
        } else {
            polygonsymbol = new esri.symbol.SimpleFillSymbol(
                esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                new esri.symbol.SimpleLineSymbol(lineStyle,
                    new dojo.Color(lineColor), lineWidth),
                new dojo.Color(fillColor));
        }
        let graphic = new this.GIS.graphic(polygon, polygonsymbol);
        return graphic;
    },
    /**
     * 定位中心位置
     * @param {*} geometry
     * @param {*} type
     */
    mapCenter(geometry,type){
        setTimeout(function(){
            if (type === 'polygon'){
                this.map.centerAt(geometry.getExtent().getCenter(),this.defaultSetting.level);
            } else {
                this.map.centerAt(
                    new this.GIS.Point(geometry.x, geometry.y, new this.GIS.SpatialReference({ wkid: this.map.spatialReference.wkid }))
                );
            }
        }.bind(this),400);

    },
    /**
     * 关闭所有地图窗口
     */
    closeAllMapPopWin(){
        this.map.infoWindow.closeAll();
    },
    /**
     * 情况临时图层
     */
    clearMap(){
        this.mapLayers['tempLayer'].layer.clear();
    },
    /**
     * 绘制点
     * @param {} feature
     */
    drowPoint:function(layer){
        let feature = layer.feature;
        let symbol = new this.GIS.SimpleMarkerSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_SOLID,//style
            26,//size
            new this.GIS.SimpleLineSymbol(//outline
                esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                new dojo.Color([247, 34, 101]),
                2),
            new dojo.Color([207, 34, 171,0.1]));//color

        let ParamsDes = feature.attributes['paramsSetting'].ParamsDes[layer.layerId];
        let content = '<table>';
        for (let key in feature.attributes){
            if (key === 'paramsSetting'){
                continue;
            }
            if (ParamsDes){
                if (!ParamsDes[key]){
                    continue;
                }
                content += '<tr><th>'+ParamsDes[key]+'</th><td>'+feature.attributes[key]+'</td></tr>';
            } else {
                content += '<tr><th>'+key+'</th><td>'+feature.attributes[key]+'</td></tr>';
            }
        }
        content += '</table>';
        if (this.debugger){
            content += '<div>图层id:'+feature.attributes['paramsSetting'].id+'</div>';
            content += '<div>二级图层id:'+layer.layerId+'</div>';
        }


        let infoTemplate = new this.GIS.InfoTemplate(feature.attributes['NAME'],'<div class="yq_win popupwin-content">'+content+'</div>');
        let locationGraphic = new this.GIS.graphic(feature.geometry, symbol,{},infoTemplate);
        this.page.mapLayers['tempLayer'].layer.add(locationGraphic);


        this.map.infoWindow.closeAll();
        this.map.infoWindow.setFeatures([locationGraphic]);
        this.map.infoWindow.show(feature.geometry);
    },
    /**
     * 绘制线
     * @param {} feature
     */
    drowPolyline:function(layer){

        let feature = layer.feature;
        let linesymbol = new this.GIS.SimpleLineSymbol(
            this.GIS.SimpleLineSymbol.STYLE_SOLID,
            new dojo.Color([255,0,0,1]
            ),
            4);
        let ParamsDes = feature.attributes['paramsSetting'].ParamsDes[layer.layerId];
        let content = '<table>';
        for (let key in feature.attributes){
            if (key === 'paramsSetting'){
                continue;
            }
            if (ParamsDes){
                if (!ParamsDes[key]){
                    continue;
                }
                content += '<tr><th>'+ParamsDes[key]+'</th><td>'+feature.attributes[key]+'</td></tr>';
            } else {
                content += '<tr><th>'+key+'</th><td>'+feature.attributes[key]+'</td></tr>';
            }

        }
        content += '</table>';
        if (this.debugger){
            content += '<div>图层id:'+feature.attributes['paramsSetting'].id+'</div>';
            content += '<div>二级图层id:'+layer.layerId+'</div>';
        }
        let infoTemplate = new this.GIS.InfoTemplate(feature.attributes['NAME'],'<div class="yq_win popupwin-content">'+content+'</div>');

        let locationGraphic = new this.GIS.graphic(feature.geometry, linesymbol,{},infoTemplate);
        this.page.mapLayers['tempLayer'].layer.add(locationGraphic);

        this.map.infoWindow.closeAll();
        this.map.infoWindow.setFeatures([locationGraphic]);
        this.map.infoWindow.show(feature.geometry.getExtent().getCenter());

    },
    /**
     * 绘制面
     * @param {} feature
     */
    drowPolygon:function(layer){
        let feature = layer.feature;
        let synfilsymbol = new this.GIS.SimpleFillSymbol(
            this.GIS.SimpleFillSymbol.STYLE_SOLID,
            new this.GIS.SimpleLineSymbol(
                this.GIS.SimpleLineSymbol.STYLE_SOLID,
                new dojo.Color([255,0,0,1]),
                4
            ),
            new dojo.Color([255,255,0,0.25])
        );
        let ParamsDes = feature.attributes['paramsSetting'].ParamsDes[layer.layerId];
        let content = '<table>';
        for (let key in feature.attributes){
            if (key === 'paramsSetting'){
                continue;
            }
            if (ParamsDes){
                if (!ParamsDes[key]){
                    continue;
                }
                content += '<tr><th>'+ParamsDes[key]+'</th><td>'+feature.attributes[key]+'</td></tr>';
            } else {
                content += '<tr><th>'+key+'</th><td>'+feature.attributes[key]+'</td></tr>';
            }

        }
        content += '</table>';
        if (this.debugger){
            content += '<div>图层id:'+feature.attributes['paramsSetting'].id+'</div>';
            content += '<div>二级图层id:'+layer.layerId+'</div>';
        }
        let infoTemplate = new this.GIS.InfoTemplate(feature.attributes['NAME'],'<div class="yq_win popupwin-content">'+content+'</div>');

        let locationGraphic = new this.GIS.graphic(feature.geometry, synfilsymbol,{},infoTemplate);
        this.page.mapLayers['tempLayer'].layer.add(locationGraphic);

        this.map.infoWindow.closeAll();
        this.map.infoWindow.setFeatures([locationGraphic]);
        this.map.infoWindow.show(feature.geometry.getExtent().getCenter());
    },
    drowStation(feature){
        let symbol;
        symbol = new this.GIS.SimpleMarkerSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_SOLID,//style
            26,//size
            new this.GIS.SimpleLineSymbol(//outline
                esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                new dojo.Color([247, 34, 101]),
                2),
            new dojo.Color([207, 34, 171,0.1]));//color
        let content = '<table>';
        let ParamsDes = feature.attributes['ParamsDes'];
        let nameParam = feature.attributes['nameParam'];
        for (let key in feature.attributes){
            console.log(key,feature.attributes[key]);
            if (key === 'nameParam'){
                continue;
            }
            if (key === 'ParamsDes'){
                continue;
            }
            if (key === 'ParamsKey'){
                continue;
            }
            if (ParamsDes){
                if (ParamsDes[key] === undefined){
                    continue;
                }
                content += '<tr><th>'+ParamsDes[key]+'</th><td>'+feature.attributes[key]+'</td></tr>';
            } else {
                content += '<tr><th>'+key+'</th><td>'+feature.attributes[key]+'</td></tr>';
            }
        }
        content += '</table>';
        let infoTemplate = new this.GIS.InfoTemplate(feature.attributes[nameParam['name']],'<div class="yq_win popupwin-content">'+content+'</div>');
        let locationGraphic = new this.GIS.graphic(feature.geometry, symbol,{},infoTemplate);
        this.page.mapLayers['tempLayer'].layer.add(locationGraphic);


        this.map.infoWindow.closeAll();
        this.map.infoWindow.setFeatures([locationGraphic]);
        this.map.infoWindow.show(feature.geometry);
    }
};

export default {
    ondrawplaneLocator,
    ondrawPointLocator,
    mapLibs
};


