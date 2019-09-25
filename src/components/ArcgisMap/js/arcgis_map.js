/* eslint-disable new-cap */
/* eslint-disable no-undef */
import { loadCss, loadModules } from 'esri-loader';
import {TDTMap} from '@/arcgisWiget/mapTitles/TDTMap';
import {GoogleMap} from '@/arcgisWiget/mapTitles/GoogleMap';
// import {PopupT} from '@/arcgisWiget/mapPopUpWin/PopupExtended';
import EventConst,{AMEvent} from '@/config/EventConst';
import mapLib,{mapLibs} from '@/utils/maplib';
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
                'esri/map',
                'esri/dijit/OverviewMap',
                'esri/geometry/webMercatorUtils',
                'esri/toolbars/navigation',
                'esri/dijit/Measurement',
                'esri/units',
                'esri/layers/TiledMapServiceLayer',
                'esri/layers/ArcGISDynamicMapServiceLayer',
                'esri/SpatialReference',
                'esri/geometry/Extent',
                'esri/layers/TileInfo',
                'esri/geometry/Point',
                'esri/geometry/Circle',
                'esri/geometry/Polygon',
                'esri/symbols/SimpleFillSymbol',
                'esri/graphic',
                'esri/layers/GraphicsLayer',
                'esri/tasks/IdentifyTask',
                'esri/tasks/IdentifyParameters',
                'esri/layers/FeatureLayer',
                'esri/symbols/PictureMarkerSymbol',
                'esri/symbols/SimpleLineSymbol',
                'esri/renderers/SimpleRenderer',
                'esri/toolbars/draw',
                'esri/tasks/FindTask',
                'esri/tasks/FindParameters',
                'esri/geometry/webMercatorUtils',
                'esri/InfoTemplate',
                'ncam/PopupExtended',
                'esri/dijit/PopupTemplate',
                'esri/symbols/SimpleMarkerSymbol'
            ],
            mapOrderNum:0,
            mapLibs:{},
            shadeGraphicsLayer:{},
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
            loadCss(window.configs.arcgisApiURL+'js/esri/css/esri.css');
            // loadCss('3.27');
            // 加载模块
            loadModules(this.gisModules, {
                url: window.configs.arcgisApiURL+'init.js',
                // version: '3.27',
                dojoConfig: {
                    parseOnLoad: false,
                    async: true,
                    tlmSiblingOfDojo: false,
                    packages: [
                        window.configs.dojoConfigPackages
                    ]
                }
            }).then(this.loadModules)
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
                    defaultWidth: 250,
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

            if (this.defaultSetting.baseMap.visibility){
                this.initBaseMap();
            }
            // this.$ammap.$emit(EventConst.MAP_INIT_EVENT);
            this.amEvent.emit(EventConst.MAP_INIT_EVENT,{});
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
                }, this.defaultSetting.baseMap.labelLayerVisibility);

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
                }, this.defaultSetting.baseMap.labelLayerVisibility);
            }

            //添加动态图层
            this.loadSpecialLayers();

            this.addMapLayer('tempLayer', {
                layer: new this.GIS.GraphicsLayer('tempLayer'),
                order:this.mapOrderNum
            }, true);

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
                }, true);


                // eslint-disable-next-line no-loop-func
                (function(tempObj,tempDynamicLayer){
                    dojo.connect(tempDynamicLayer, 'onLoad', function (layers) {
                        layers.setVisibleLayers(tempObj.show);
                    });
                })(tempObj,tempDynamicLayer);
            }

            /**
             * 创建geoJSON
             * */
            let geojsonGraphicsLayer = new this.GIS.GraphicsLayer('geojsonGraphicsLayer');
            this.addMapLayer('geojsonGraphicsLayer', {
                layer: geojsonGraphicsLayer,
                order:this.mapOrderNum
            }, true);

            for (let j =0;j<this.defaultSetting.geojson.length;j++){
                let tempObj = this.defaultSetting.geojson[j];
                // geojsonGraphicsLayer.add(mapLib.ondrawplaneLocator(
                //     this.GIS,
                //     tempObj.paths,
                //     this.map.spatialReference.wkid,
                //     tempObj.fillColor,
                //     tempObj.lineWidth,
                //     tempObj.lineColor
                // ));
                try {
                    geojsonGraphicsLayer.add(this.apiDrowGeoJsonPolygon(
                        tempObj.geoJSON,
                        tempObj.fillColor,
                        tempObj.lineWidth,
                        tempObj.lineColor));
                } catch (e){}


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
         * 清空地图
         */
        apiMapClear(){
            this.mapLayers['tempLayer'].layer.clear();
        },
        apiDrowGeoJsonPolygon(ringsObj,fillColor,lineWidth,lineColor){
            try {
                if (!this.shadeGraphicsLayer.id){
                    this.shadeGraphicsLayer = this.addMapLayer('shadetttGraphicsLayer', {
                        layer: new this.GIS.GraphicsLayer('shadetttGraphicsLayer'),
                        order:0
                    }, true);
                }

                for (let j =0;j<ringsObj.features.length;j++){
                    let paths = ringsObj.features[j].geometry.coordinates;
                    for (let i =0;i<paths.length;i++){
                        if (ringsObj.features[j].geometry.type === 'MultiPolygon'){
                            for (let q =0;q<paths[i].length;q++){
                                let temprings = paths[i][q];
                                this.shadeGraphicsLayer.add(
                                    this.mapLibs.drowGeoJsonPolygon( temprings,
                                        this.map.spatialReference.wkid,
                                        fillColor,
                                        lineWidth,lineColor)
                                );
                            }
                        } else if (ringsObj.features[j].geometry.type === 'Polygon'){
                            this.shadeGraphicsLayer.add(
                                this.mapLibs.drowGeoJsonPolygon( paths[i],
                                    this.map.spatialReference.wkid,
                                    fillColor,
                                    lineWidth,lineColor)
                            );
                        }
                    }
                }
            } catch (e){}
        },
        apiGetConfigAll(){


        }
    },
    mounted() {
        //处理同一个页面中又两个map组件的情况，如果存在两个资源信息就不用重新加载了
        //初始化全局事件处理函数
        this.amEvent = new AMEvent(this);

        //合并配置信息，缺省的属性补齐
        this.defaultSetting = deepObjectMerge(this.config,settingTemplate);
        //设置全局参数
        this.amEvent.setDefaultSetting(this.defaultSetting);

        if (this.$ammap.GIS.map){
            this.GIS = this.$ammap.GIS;
            this.initMap();
        } else {
            this.init();
        }
        //对外提供API
        //添加图层
        this.amEvent.on(EventConst.MAP_ADD_LAYER,this.apiAddLayer);
        //监听地图清空事件
        this.amEvent.on(EventConst.MAP_CLEAR,this.apiMapClear);
        //监听地图定位 支持面、点和线
        this.amEvent.on(EventConst.MAP_CENTER,this.apiCenterPoint);
        // let t1 = {'kafa':['1'],'name':{'n1':'22',n2:'33'},'age':'tiner','home':{'1':'333','2':{'cici':'7'},'3':['1','2']}};
        // let t3 = {'kafa':{},'name':{'n1':'1111',n2:'33111'},'home':{'1':'333','3':['3','4']}};
        // console.log(deepObjectMerge(t1,t3));

        // import {deepObjectMerge} from '@/utils/resolver';
        // import {defaultSetting} from '@/config/defaultSetting';


    }
};
