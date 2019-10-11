

export const settingTemplate = {
    debugger:true,
    x:117.38984,
    y:39.14688,
    level:9,
    popupDefaultWdith:250,
    dynamicLayers:[
    ],
    geojson:[
    ],
    baseMap:{
        visibility:true,
        type:'tdt',//谷歌地图:google,天地图:tdt
        defaultshow:'terrains',//影像图:images,地形图:terrains,矢量图:layers
        labelLayerVisibility:true,//地图标注
        shadeLayer:{//阴影标注
            // visibility:true,
            // opacity:0.5
        }
    },
    lend:{
        shadeLayerVisibility:false,
        labelsLayerVisibility:false
    },
    gisModules:[
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
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/CartographicLineSymbol'
    ]
};

/**
export let defaultSetting = {
    debugger:true,
    x:117.38984,
    y:39.14688,
    level:9,
    dynamicLayers:[

    ],
    geojson:[
        {
            id:'drowplane1Layer',
            paths:[[117.29,39.23],[117.34,39.12],[117.77,39.32]],
            fillColor:[255,33,22,0.3],//背景颜色
            lineWidth:1,//边界宽度
            lineColor:[0,0,0,1]//边界颜色
        }
    ],
    baseMap:{
        visibility:true,
        type:'tdt',//谷歌地图:google,天地图:tdt
        defaultshow:'terrains',//影像图:images,地形图:terrains,矢量图:layers
        labelLayerVisibility:true,//地图标注
        shadeLayer:{
            visibility:false,
            backgroundColor:'#fff',
            opacity:0.5
        }
    },
    search:{
        dynamicLayer:{
            'DLbackalllayer':{
                layerids:[0,1,2,3,4,5,6,7,9,10],
                ParamsDes:{
                    2:{
                        'NAME':'名称',
                        'Shape':'',
                        'GB':'',
                        'ANGLE':'',
                        'ORIG_FID':''
                    }
                },
                textSearchParams:['NAME','Shape','GB','ANGLE','ORIG_FID']
            },
            'NHBackalllayer':{
                layerids:[0,1,2,3,4,5,6,7,9,10],
                ParamsDes:{
                    3:{
                        'FID':'名称',
                        'Shape':'形状',
                        'GB':'容量',
                        'ANGLE':'面积',
                        'ORIG_FID':'起点'
                    }
                },
                textSearchParams:['NAME','Shape','GB','ANGLE','ORIG_FID']
            }
        }
    },
    lend:{
        shadeLayerVisibility:false,
        labelsLayerVisibility:false,
        dynLayers:{
            isGroup:true,//是否分组
            //   分组类型：
            //    系统提供三种分组,custom,layers,all
            //   custom:自定义分组规则，可以安装个人喜好高度定制
            //   layers：按照动态图层进行排序，一个图层是一个组
            //   all:所有图层分到一个组中
            groupType:'',
            group:[
                {
                    name:'静海图层',
                    ids:[{
                        layerid:'DLbackalllayer',
                        ledid:0
                    }]
                },
                {
                    name:'宁河图层',
                    ids:[{
                        layerid:'DLbackalllayer',
                        ledid:0
                    }
                    ]
                }
            ]
        },
        stations:[

        ]
    }
};

 */