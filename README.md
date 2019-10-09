# ArcgisMapLibrary
基业arcgis for js 封装的地图组件


* 项目路径介绍:
  src:组件包
    assets:静态资源
    components:组件
    config:配置
    mapTitles:地图切片
    minxins:vue 通用 minxins
    utils:工具包
  examples:webpack 项目例子包
  gulpExamples:gulp项目测试包
  

地图说明：

* 谷歌地图
  GG：m  矢量图 道路图、不可嵌套
  GG：p  带标签的地形图 可用
  GG：s  卫星图  可用  不带标签
  GG：y  带标签的卫星图 
  GG：h  标签层（路名、地名等） 可用、可嵌套

谷歌影像图:

  GG:s 和 GG:h 需要纠偏

  GG:m

  GG:p


* 天地图

  TDT: anno  标注可以嵌套
  TDT: dem 地形图
  TDT: image 影像图
  TDT: layer 矢量图

~~~
  地图组件总结：
    sdk路径配置：
        采用nginx部署，配置sdk路径
    底图配置：
        谷歌、高德、arcgis online、天地图
    地图默认加载位置：
        经纬度，级别
    专题图配置：
        图层类型：ArcGISDynamicMapServiceLayer
        图层控制与现实
    图例窗口：
        需要配置：样式、位置、动画效果、现实内容
        现实内容：可以添加系统默认集合用户手动编写,系统提供：地图、矢量图、测站、雨量等级等常用模块
    绘制路径组件：
        绘制路线，有动画效果
    定位：
        地图找到具体位置
        1.通过经纬度定位，需要设置经纬度、地图级别、定位图片、显现窗口内容
        2.通过名称+类型查找
    地图点位绘制：
        例如：雨量站、水情站、泵站等
        功能：
        1.绘制不同图片的地图图标
        2.支持刷新操作
        3.鼠标悬浮窗口（用户自定义）
        4.鼠标点击窗口（用户自定义）
        5.地图标注
            标注样式，数据展示
    地图查询：
        点选查询：
            面，点，线
        面查询：
            绘制面，框选查询
    地图测站级别显示配置：
        根据测站名称、类型、ID、显示级别列表来进行控制测站在哪个级别显示，默认每个级别都显示
    地图标注级别显示配置：
        标注位置
        级别是否展示
        数据格式（是否支持多行）
    地图对外API：
        1.地图绘制
        2.图例选择
        3.地图切换
        4.专题图图层切换
        5.定位
        6.鼠标点击
        7.鼠标悬浮
        8.地图放大缩小
地图模板：
    地图组件库中地图默认是iframe嵌套的，通过API进行地图操作及调用，模板提供了几个常用的地图设计实现
    模板功能：
        1.数据窗口
        2.菜单
        3.查询窗口
        4.抽屉窗口模板
~~~




~~~
defaultSetting:{
                x:117.38984,
                y:39.14688,
                level:11,
                dynamicLayers:[
                    {
                        id:'DLbackalllayer',
                        url:'http://111.30.103.114:6080/arcgis/rest/services/DongLiMapFlood/MapServer',
                        show:[0,1,2,3,4,5,6,7,9,10],
                        layers:{
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
                        search:{
                            event:['mouseOver','mouseClick'],
                            windStyle:'',//窗口样式
                            params:['NAME','FID']
                        }
                    },
                    {
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
                            event:['mouseOver','mouseClick'],
                            windStyle:'',//窗口样式
                            params:['NAME','FID']
                        }
                    }
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
                    type:'google',//谷歌地图:google,天地图:tdt
                    defaultshow:'terrains',//影像图:images,地形图:terrains,矢量图:layers
                    labelLayerVisibility:true,//地图标注
                    shadeLayer:{
                        visibility:true,
                        backgroundColor:'#fff',
                        opacity:0.5
                    }
                },
                search:{
                    layers:[
                        {
                            id:'DLbackalllayer',
                            layerids:[0,1,2,3,4,5,6,7,9,10],
                            params:['NAME','FID'],
                            /*
                             * type说明:
                             *    dynamicLayer:gisserver发布矢量图层
                             *    stationLayer:测站图层
                             */
                            type:'dynamicLayer'
                        }
                    ]
                },
                lend:{
                    baseMap:true,
                    dynLayers:{
                        isGroup:true,//是否分组
                        /**
                         * 分组类型：
                         *  系统提供三种分组,custom,layers,all
                         * custom:自定义分组规则，可以安装个人喜好高度定制
                         * layers：按照动态图层进行排序，一个图层是一个组
                         * all:所有图层分到一个组中
                         */
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
            }
~~~
~~~
            测站配置：
            stationLayers:{
                '雨情站':{
                    name:'雨情站',
                    type:'rain',
                    iconURL:require('ex/assets/map/jsd.png'),
                    width:24,
                    height:24,
                    wkid : 4326,
                    ParamsDes:{
                        id:'编号',
                        name:'名称',
                        x:'经度',
                        y:'纬度',
                        value:'雨量(mm)'
                    },
                    list:[
                        {
                            id:'001',
                            name:'测试测站2',
                            x:'117.395',
                            y:'39.166',
                            value:0.4,
                            value24:22
                        },
                        {
                            id:'002',
                            name:'测试测站3',
                            x:'117.13',
                            y:'39.057',
                            value:2.44
                        }
                    ],
                    /**
                     * 地图窗口
                     * infoTemplate:系统弹出窗口，传递给用户窗口内容ID和测站信息
                     * custom：系统传递测站信息
                     * default:系统默认，默认使用infoTemplate展示测站信息列表
                     */
                    clickWinType:'default'
                },
                '水情站':{
                    name:'水情站',
                    type:'water',
                    width:24,
                    height:24,
                    wkid : 4326,
                    ParamsKey:{
                        id:'stcd',
                        name:'stnm',
                        x:'lgtd',
                        y:'lttd',
                        value:'value'
                    },
                    ParamsDes:{
                        stcd:'测站编码',
                        stnm:'测站名称',
                        lgtd:'经度',
                        lttd:'纬度',
                        value:'水位(m)'
                    },
                    list:[
                        {
                            stcd:'001',
                            stnm:'测试测站2',
                            lgtd:'117.381',
                            lttd:'39.149',
                            value:20
                        },
                        {
                            stcd:'002',
                            stnm:'测试测站3',
                            lgtd:'117.139',
                            lttd:'39.071',
                            value:2.44
                        }
                    ],
                    iconURL:function(value){
                        if (value > 10){
                            return require('ex/assets/map/swz2.png');
                        }
                        return require('ex/assets/map/swz1.png');
                    },
                    clickWinType:'infoTemplate'
                }
            },
~~~