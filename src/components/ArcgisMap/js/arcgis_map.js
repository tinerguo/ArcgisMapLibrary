import { loadCss, loadModules } from 'esri-loader';
import {TDTMap} from '@/arcgisWiget/mapTitles/TDTMap';
import {GoogleMap} from '@/arcgisWiget/mapTitles/GoogleMap';
// import {PopupT} from '@/arcgisWiget/mapPopUpWin/PopupExtended';
import EventConst,{AMEvent} from '@/config/EventConst';
import {mapLibs} from '@/utils/maplib';
import {deepObjectMerge} from '@/utils/resolver';
import {settingTemplate} from '@/config/defaultSetting';

export default {
    name: 'ArcgisMap',
    props: {
        config: {
            type: Object,
            default: () => null
        }
    },
    data() {
        return {
            GIS: {}, //gis 构造函数
            gisInst: {}, // gis 实例
            map:{}, //地图
            mapLayers:{},
            amEvent:{},
            gisModules: [

            ],
            mapOrderNum:0,
            mapLibs:{},
            defaultSetting:{}
        };
    },
    watch: {
        /**
        defaultSetting:{
            deep: true, //深度监听
            handler:function(value){
                console.log('defaultSetting',value);
                this.initMap(value);
            }
        }**/
    },
    methods: {
        /**
         * arcgis loader 初始化资源
         */
        init() {

            // 加载css;
            loadCss(!this.defaultSetting.arcgisSDK?window.configs.arcgisApiURL+'js/esri/css/esri.css':this.defaultSetting.arcgisSDK);

            let arcgisConfig = {
                dojoConfig: {
                    parseOnLoad: false,
                    async: true,
                    tlmSiblingOfDojo: false,
                    packages: [
                        window.configs.dojoConfigPackages
                    ]
                }
            };

            if (!this.defaultSetting.arcgisSDK){
                arcgisConfig['url'] = window.configs.arcgisApiURL+'init.js';
            } else {
                arcgisConfig['version'] = this.defaultSetting.arcgisSDK;
            }

            // 加载模块
            loadModules(this.gisModules,arcgisConfig).then(this.loadModules)
                .then(this.initMap);
        },
        /**
         * 资源对象初始化
         * @param {*} args
         */
        loadModules(args) {


            // 注意大小写，3.x 的API感觉有点乱，API文件的开头有大写有小写，注意一定对应起来，
            for (let k in args) {
                let name = this.gisModules[k].split('/').pop();
                this.GIS[name] = args[k];
            }
            this.$ammap.GIS = this.GIS;

            //地图初始化
            GoogleMap(this.GIS);
            TDTMap(this.GIS);
            // PopupT(this.GIS);
        },
        /**
         * 初始化地图
         */
        initMap() {
            this.mapLibs = new mapLibs(
                this
            );
            let map = new this.GIS.map(this.$refs['mapDiv'], {
                center: [this.defaultSetting.x,this.defaultSetting.y],
                zoom: this.defaultSetting.level,
                slider: true,
                logo: false,
                isClickRecenter:true
            });
            // this.gisInst.map = map;
            this.map = map;

            this.map.on('layers-reordered',function(){});

            this.amEvent.setMap(map);
            // this.$ammap.map = map;

            // let extendedPopup = new PT({
            let extendedPopup = new this.GIS.PopupExtended({
                extended: {
                    themeClass: 'light',
                    draggable: true,
                    defaultWidth: this.defaultSetting.popupDefaultWdith,
                    /**
                    defaultWidth: 750,
                    actions: [{
                        text: '按钮1', className: 'defaultAction', title: 'Default action added in extendedPopup properties.',
                        click: function (feature) {
                            alert('clicked feature - ' + feature.attributes);
                        }
                    },{
                        text: '按钮2', className: 'defaultAction', title: 'Default action added in extendedPopup properties.',
                        click: function (feature) {
                            alert('clicked feature - ' + feature.attributes);
                        }
                    }], */
                    hideOnOffClick: false,
                    multiple: true,
                    smallStyleWidthBreak: 768
                },
                highlight: false
                //titleInBody: false,
            }, dojo.create('div'));


            //set the map to use the exteneded popup
            extendedPopup.setMap(this.map);
            this.map.infoWindow = extendedPopup;

            // if (this.defaultSetting.baseMap.visibility){
            this.initBaseMap();
            // }
            // this.$ammap.$emit(EventConst.MAP_INIT_EVENT);

        },
        /**
         * 初始化基础底图
         */
        initBaseMap(){
            //添加谷歌相应地图 影像图、矢量图、遮罩、标注
            if (this.defaultSetting.baseMap.type === 'google' ){

                this.addMapLayer('imagesLayer', {
                    layer: this.baseMapFactory({
                        map:'GG',
                        type:'s'
                    }),
                    order:0
                }, this.defaultSetting.baseMap.defaultshow === 'images');


                this.addMapLayer('terrainsLayer', {
                    layer: this.baseMapFactory({
                        map:'GG',
                        type:'p'
                    }),
                    order:1
                }, this.defaultSetting.baseMap.defaultshow === 'terrains');

                this.addMapLayer('layersLayer', {
                    layer: this.baseMapFactory({
                        map:'GG',
                        type:'m'
                    }),
                    order:2
                }, this.defaultSetting.baseMap.defaultshow === 'layers');

                this.addMapLayer('labelsLayer', {
                    layer: this.baseMapFactory({
                        map:'GG',
                        type:'h'
                    }),
                    order:3
                }, this.defaultSetting.baseMap.labelLayerVisibility);

                let shadeLayer = this.baseMapFactory({
                    map:'GG',
                    type:'shade'
                });
                shadeLayer.opacity = this.defaultSetting.baseMap.shadeLayer.opacity;
                this.addMapLayer('shadeLayer', {
                    layer: shadeLayer,
                    order:4
                }, this.defaultSetting.baseMap.shadeLayer.visibility);

            }
            //添加谷歌相应地图 影像图、矢量图、遮罩、标注
            if (this.defaultSetting.baseMap.type === 'tdt' ){

                this.addMapLayer('imagesLayer', {
                    layer: this.baseMapFactory({
                        map:'TDT',
                        type:'image'
                    }),
                    order:0
                }, this.defaultSetting.baseMap.defaultshow === 'images');

                this.addMapLayer('terrainsLayer', {
                    layer: this.baseMapFactory({
                        map:'TDT',
                        type:'dem'
                    }),
                    order:1
                }, this.defaultSetting.baseMap.defaultshow === 'terrains');

                this.addMapLayer('layersLayer', {
                    layer: this.baseMapFactory({
                        map:'TDT',
                        type:'layer'
                    }),
                    order:2
                }, this.defaultSetting.baseMap.defaultshow === 'layers');

                this.addMapLayer('labelsLayer', {
                    layer: this.baseMapFactory({
                        map:'TDT',
                        type:'anno'
                    }),
                    order:3
                }, this.defaultSetting.baseMap.labelLayerVisibility);


                let shadeLayer = this.baseMapFactory({
                    map:'TDT',
                    type:'shade'
                });
                shadeLayer.opacity = this.defaultSetting.baseMap.shadeLayer.opacity;
                this.addMapLayer('shadeLayer', {
                    layer: shadeLayer,
                    order:4
                }, this.defaultSetting.baseMap.shadeLayer.visibility);
            }

            //添加动态图层
            this.loadSpecialLayers();

            this.addMapLayer('tempLayer', {
                layer: new this.GIS.GraphicsLayer('tempLayer'),
                order:this.mapOrderNum
            }, true);

            this.amEvent.emit(EventConst.MAP_INIT_EVENT,{});

        },
        /**
         * 专题图
         */
        loadSpecialLayers(){

            for (let i =0;i<this.defaultSetting.dynamicLayers.length;i++){
                let tempObj = this.defaultSetting.dynamicLayers[i];
                let tempDynamicLayer = new this.GIS.ArcGISDynamicMapServiceLayer(tempObj.url,
                    {id: tempObj.id});
                tempDynamicLayer.setImageFormat('png32', false);
                this.addMapLayer(tempObj.id, {
                    layer: tempDynamicLayer,
                    order:this.mapOrderNum
                }, tempObj.visibility);


                // eslint-disable-next-line no-shadow
                (function(tempObj,tempDynamicLayer){
                    dojo.connect(tempDynamicLayer, 'onLoad', function (layers) {
                        layers.setVisibleLayers(tempObj.show);
                    });
                })(tempObj,tempDynamicLayer);
            }

            /**
             * 创建geoJSON
             * */
            for (let j =0;j<this.defaultSetting.geojson.length;j++){
                let tempObj = this.defaultSetting.geojson[j];
                let geojsonGraphicsLayer = new this.GIS.GraphicsLayer(tempObj.id);
                this.addMapLayer(tempObj.id, {
                    layer: geojsonGraphicsLayer,
                    order:this.mapOrderNum
                }, tempObj.visibility);

                try {
                    this.apiDrowGeoJsonPolygon(
                        tempObj.geoJSON,
                        tempObj.fillColor,
                        tempObj.lineWidth,
                        tempObj.lineColor,
                        tempObj.id
                    );
                } catch (e){
                    console.error('绘制geojson错误',e);
                }
            }
            /**
             * 创建临时图层
             * */
            let tempGraphicsLayer = new this.GIS.GraphicsLayer('tempGraphicsLayer');
            this.addMapLayer('tempGraphicsLayer', {
                layer: tempGraphicsLayer,
                order:this.mapOrderNum
            }, true);


        },

        /**
         * 基础地图工厂
         * @param {name,type} obj
         */
        baseMapFactory(obj){
            if (obj.map === 'GG'){
                return new GG(obj.type);
            } else if (obj.map === 'TDT'){
                return new TDT(obj.type);
            }
        },
        /**
         * 添加图层
         * @param {*} name 图层id
         * @param {*} obj 图层对象
         * @param {*} visibility 是否显示
         */
        addMapLayer(name,obj,visibility){
            if (visibility){
                obj.layer.show();
            } else {
                obj.layer.hide();
            }
            obj.layer.id = name;

            this.mapLayers[name] = {};
            this.mapLayers[name].layer = obj.layer;
            this.mapLayers[name].order = obj.order;
            this.map.addLayer(obj.layer,this.mapLayers[name].order);
            // this.mapOrder();
            // this.$ammap.mapLayers = this.mapLayers;
            this.amEvent.setMapLayers(this.mapLayers);
            this.mapOrderNum++;
            return obj.layer;
        },
        /**
         * 图层排序
         */
        mapOrder(){
            for (let key in this.mapLayers){
                let obj = this.mapLayers[key];
                this.map.reorderLayer(obj.layer, obj.order);
            }
        },
        /**
         * @param {
         *    name:'',
         *    obj:{
         *      layer:obj
         *      order:number
         *    },
         *    visibility:true/false
         * } obj
         */
        apiAddLayer(obj){
            let eventToken = obj.eventToken;
            let tempObj = obj.layer;
            this.addMapLayer(tempObj.id, {
                layer: new this.GIS.GraphicsLayer(),
                order:this.mapOrderNum
            }, tempObj.visibility);

            // this.$ammap.$emit(EventConst.MAP_ADD_LAYER_SUCCESS,eventToken);
            this.amEvent.emit(EventConst.MAP_ADD_LAYER_SUCCESS,eventToken);
        },
        /**
         * 定位
         * @param {*} point
         */
        apiCenterPoint(point){
            if (point.feature.geometry.type === 'polygon'){
                let pointCenter = point.feature.geometry.getExtent().getCenter() ;
                this.map.centerAt(
                    new this.GIS.Point(pointCenter.x, pointCenter.y, new this.GIS.SpatialReference({ wkid: this.map.spatialReference.wkid }))
                );
            } else if (point.feature.geometry.type === 'polyline'){
                let pointCenter = point.feature.geometry.getExtent().getCenter() ;
                this.map.centerAt(
                    new this.GIS.Point(pointCenter.x, pointCenter.y, new this.GIS.SpatialReference({ wkid: this.map.spatialReference.wkid }))
                );
            } else if (point.feature.geometry.type === 'point'){
                this.map.centerAt(point.feature.geometry);
            }
        },
        /**
         * 测站
         * @param {*} stations
         */
        apiCenterStatioin(obj){
            //事件源页面对象
            let pageThis = obj.page;
            //地图测站数据
            let data = obj.data;

            this.map.infoWindow.closeAll();

            let stationObj = this.amEvent.getStations();
            let graphic = stationObj[
                data.nameParam['layerType']+'_'+
              data[data.nameParam.id]
            ];

            this.map.centerAt(graphic.geometry);

            if (data.nameParam.clickWinType === 'infoTemplate'){//自定义infoTemplate窗口内容

                let id = this.mapLibs.createInfoTemplate(graphic,'infoTemplate');
                this.map.infoWindow.setFeatures([graphic]);
                this.map.infoWindow.show(graphic.geometry);
                //发送事件
                pageThis.$emit('mapClick',data,id);

            } else if (data.nameParam.clickWinType === 'custom'){//自定义窗口
                //发送事件
                pageThis.$emit('mapClick',data);

            } else if (data.nameParam.clickWinType === 'default'){//系统默认窗口和内容

                this.mapLibs.createInfoTemplate(graphic,'default');
                this.map.infoWindow.setFeatures([graphic]);
                this.map.infoWindow.show(graphic.geometry);

            }
        },
        /**
         * 清空地图
         */
        apiMapClear(){
            this.mapLayers['tempLayer'].layer.clear();
        },
        apiDrowGeoJsonPolygon(ringsObj,fillColor,lineWidth,lineColor,layerNM){
            if (!ringsObj){
                return;
            }
            if (!fillColor){
                // eslint-disable-next-line no-param-reassign
                fillColor = ringsObj['fillColor'];
                // eslint-disable-next-line no-param-reassign
                lineWidth =ringsObj['lineWidth'];
                // eslint-disable-next-line no-param-reassign
                lineColor = ringsObj['lineColor'];
                // eslint-disable-next-line no-param-reassign
                ringsObj = ringsObj['mapJSONObj'];
                // eslint-disable-next-line no-param-reassign
                layerNM = ringsObj['layerNM'];
            }
            try {
                let tempLayer = {};
                if (!layerNM){
                    tempLayer = this.mapLayers['tempLayer'].layer;
                } else {
                    tempLayer = this.mapLayers[layerNM].layer;
                }

                for (let j =0;j<ringsObj.features.length;j++){
                    let properties = ringsObj.features[j].properties || {};
                    let paths = ringsObj.features[j].geometry.coordinates;
                    for (let i =0;i<paths.length;i++){
                        if (ringsObj.features[j].geometry.type === 'MultiPolygon'){
                            for (let q =0;q<paths[i].length;q++){
                                let temprings = paths[i][q];
                                tempLayer.add(
                                    this.mapLibs.drowGeoJsonPolygon( temprings,
                                        this.map.spatialReference.wkid,
                                        properties.backcolor || fillColor ,
                                        properties.layerLineWidth || lineWidth,
                                        properties.linecolor || lineColor)
                                );
                            }
                        } else if (ringsObj.features[j].geometry.type === 'Polygon'){
                            tempLayer.add(
                                this.mapLibs.drowGeoJsonPolygon( paths[i],
                                    this.map.spatialReference.wkid,
                                    properties.backcolor || fillColor,
                                    properties.layerLineWidth || lineWidth,
                                    properties.linecolor || lineColor)
                            );
                        } else if (ringsObj.features[j].geometry.type === 'MultiPoint'){

                            //ringsObj.features[j].geometry.coordinates;
                            for (let q =0;q<paths[i].points.length;q++){
                                let temppoints = paths[i].points[q];
                                tempLayer.add(
                                    this.mapLibs.drowGeoJsonPoint( temppoints,
                                        this.map.spatialReference.wkid,
                                        properties.backcolor || fillColor ,
                                        properties.layerLineWidth || lineWidth,
                                        properties.linecolor || lineColor)
                                );


                            }

                        }
                    }
                }
            } catch (e){
                console.error('绘制geojson错误1',e);
            }
        },
        apiGetConfigAll(){


        },
        apiChangeBaseMap(type){
            this.mapLayers['imagesLayer'].layer.hide();
            this.mapLayers['terrainsLayer'].layer.hide();
            this.mapLayers['layersLayer'].layer.hide();
            if (type === 'terrains'){
                this.mapLayers['terrainsLayer'].layer.show();
            } else if (type === 'images'){
                this.mapLayers['imagesLayer'].layer.show();
            } else if (type === 'layers'){
                this.mapLayers['layersLayer'].layer.show();
            }
        },
        apiMapStatusChange(status){

            let data = this.defaultSetting.mapStateList.find((item)=>item.id === status );

            let stationArrSetting = data.station;
            let geojsonArrSetting = data.geojson;
            let baseMapSetting = data.baseMap;

            //_layer_amstation


            //设置测站图层
            for (let tempKey in this.mapLayers){
                if (tempKey.indexOf('_layer_amstation')>-1){
                    let tempLayer = this.mapLayers[tempKey];
                    if (stationArrSetting.findIndex(item => item+'_layer_amstation' === tempLayer.layer.id) > -1){
                        tempLayer.layer.show();
                    } else {
                        tempLayer.layer.hide();
                    }
                }
            }

            //设置动态图层
            let dynamicLayersSetting = data.dynamicLayers;//当前动态图层对象
            for (let i =0;i<this.defaultSetting.dynamicLayers.length;i++){
                //临时动态图层对象
                let layerTemp = this.defaultSetting.dynamicLayers[i];
                //图层ID
                let layerID = layerTemp.id;
                //如果动态图层中设置了改图层
                if (dynamicLayersSetting[layerID]){
                    //图层显示
                    this.mapLayers[layerID].layer.show();
                    //如果设置了动态图层的子图层
                    if (dynamicLayersSetting[layerID].show.length > 0){
                        //设置动态图层
                        this.mapLayers[layerID].layer.setVisibleLayers(dynamicLayersSetting[layerID].show);
                    } else {
                        //如果是空的那么影藏图层
                        this.mapLayers[layerID].layer.hide();
                    }
                } else {
                    //影藏图层
                    this.mapLayers[layerID].layer.hide();
                }
            }

            //设置geojson图层
            let geojsonSetting = data.geojson;//当前动态图层对象
            for (let i =0;i<this.defaultSetting.geojson.length;i++){
                let tempObj = this.defaultSetting.geojson[i];
                if (geojsonSetting.findIndex(item => item === tempObj.id) > -1){
                    this.mapLayers[tempObj.id].layer.show();
                } else {
                    this.mapLayers[tempObj.id].layer.hide();
                }
            }

            // this.apiChangeBaseMap(data.baseMap);
            this.amEvent.emit(EventConst.BASE_MAP_CHANGE,data.baseMap);
            return;

            this.amEvent.emit(EventConst.STATION_LAYER_CHANGE,data);
            this.amEvent.emit(EventConst.DYNAMIC_LAYER_CHANGE,data);
            this.amEvent.emit(EventConst.GEOJSON_LAYER_CHANGE,data);


        }
    },
    mounted() {
        //处理同一个页面中又两个map组件的情况，如果存在两个资源信息就不用重新加载了
        //初始化全局事件处理函数
        this.amEvent = new AMEvent(this);

        //合并配置信息，缺省的属性补齐
        this.defaultSetting = deepObjectMerge(this.config,settingTemplate);

        //判断是否有状态参数
        if (this.defaultSetting.defaultMapState && this.defaultSetting.mapStateList.length > 0){
            //获取默认状态对象
            let currentStatusObj = this.defaultSetting.mapStateList.find((item)=>item.id === this.defaultSetting.defaultMapState );
            //如果状态对象存在
            if (currentStatusObj){
                //设置默认基础地图
                if (currentStatusObj.baseMap) {
                    this.defaultSetting['baseMap'].defaultshow = currentStatusObj.baseMap;
                }
                //设置动态图层
                if (currentStatusObj.dynamicLayers){
                    for (let i =0;i<this.defaultSetting.dynamicLayers.length;i++){
                        let dynamicLayerObj = this.defaultSetting.dynamicLayers[i];
                        let id = dynamicLayerObj.id;
                        if (currentStatusObj.dynamicLayers[id]){
                            this.defaultSetting.dynamicLayers[i].show = currentStatusObj.dynamicLayers[id].show;
                            this.defaultSetting.dynamicLayers[i].visibility = currentStatusObj.dynamicLayers[id].visibility;
                        } else {
                            this.defaultSetting.dynamicLayers[i].visibility = false;
                        }
                    }
                }
                // 设置geojson
                if (currentStatusObj.geojson){
                    for (let i =0;i<this.defaultSetting.geojson.length;i++){
                        let tempObj = this.defaultSetting.geojson[i];
                        //如果数组中存在那么现实
                        if (currentStatusObj.geojson.findIndex(item=>item === tempObj.id) > -1){
                            this.defaultSetting.geojson[i].visibility = true;
                        } else {
                            this.defaultSetting.geojson[i].visibility = false;
                        }
                    }
                }
            }
        }
        //设置全局参数
        this.amEvent.setDefaultSetting(this.defaultSetting);
        this.gisModules = this.defaultSetting.gisModules;


        //对外提供API
        //添加图层
        this.amEvent.on(EventConst.MAP_ADD_LAYER,this.apiAddLayer);
        //监听地图清空事件
        this.amEvent.on(EventConst.MAP_CLEAR,this.apiMapClear);
        //监听地图定位 支持面、点和线
        this.amEvent.on(EventConst.MAP_CENTER,this.apiCenterPoint);
        //地图绘制GeoJSON
        this.amEvent.on(EventConst.MAP_DROWGEOJSONPOLYGON,this.apiDrowGeoJsonPolygon);
        //地图测站定位
        this.amEvent.on(EventConst.MAP_CENTER_STATION,this.apiCenterStatioin);
        //设置地图状态
        this.amEvent.on(EventConst.MAP_STATUS_CHANGE,this.apiMapStatusChange);


        if (this.$ammap.GIS.map){
            this.GIS = this.$ammap.GIS;
            this.initMap();
        } else {
            this.init();
        }


    }
};
