import {xd,xx} from './geoJSON';
export let defaultSetting = {
    debugger:true,
    x:117.38984,
    y:39.14688,
    level:5,
    /** 动态图层 */
    dynamicLayers:[
        {
            name:'静海图层',
            id:'DLbackalllayer',
            url:'http://111.30.103.114:6080/arcgis/rest/services/DongLiMapFlood/MapServer',
            show:[0,1,2,3,4,5,6,7,9,10],//默认显示
            layers:{//图例显示对于名称
                0:'险工',
                1:'险段',
                2:'一级河道',
                3:'二级河道',
                4:'乡镇边界',
                5:'乡镇面',
                6:'水库',
                7:'支干渠',
                8:'地图遮罩 ',
                9:'市属二级河道',
                10:'区界外河流'
            },
            search:{//查询组件使用
                layerids:[3,4,5],//查询图层
                ParamsDes:{//对象描述
                    2:{
                        'NAME':'名称',
                        'Shape':'',
                        'GB':'',
                        'ANGLE':'',
                        'ORIG_FID':''
                    }
                },
                textSearchParams:['NAME','Shape','GB','ANGLE','ORIG_FID']
            }
        },
        {
            name:'东丽图层',
            id:'NHBackalllayer',
            url:'http://111.30.97.35:8099/arcgis/rest/services/NHMAP/MapServer',
            show:[0,1,2,3,4,5,6,7,8],
            layers:{
                0:'二级河道new',
                1:'一级河道',
                2:'外洪威胁村落',
                3:'企业',
                4:'边界',
                5:'乡镇 ',
                6:'水库',
                7:'西七里海',
                8:'盛庄洼 '
            },
            search:{
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
    ],
    /** geojson 图层 */
    geojson:[
        {
            id:'drowplane1Layer',
            geoJSON:xx,
            fillColor:[255,33,22,0.3],//背景颜色
            lineWidth:4,//边界宽度
            lineColor:[255,33,0,0.5]//边界颜色
        },
        {
            id:'drowplane2Layer',
            geoJSON:xd,
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
            visibility:true,
            opacity:0.5
        }
    },
    lend:{
        shadeLayerVisibility:false,
        labelsLayerVisibility:false
    },
    type:{
        dynamicLayers:{

        }
    }
};


/**
           * 分组类型：
           *  系统提供三种分组,custom,layers,all
           * custom:自定义分组规则，可以安装个人喜好高度定制
           * layers：按照动态图层进行排序，一个图层是一个组
           * all:所有图层分到一个组中
           */


/**
        dynLayers:{
            isGroup:true,//是否分组

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
         */