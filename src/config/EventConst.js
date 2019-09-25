/**
 * Created by tiner on 2019/6/7.
 */

var MAP_INIT_EVENT = 'mapinitevent';//底图初始化成功
var MAP_ADD_LAYER = 'mapaddlayer';//地图创建图层
var MAP_ADD_LAYER_SUCCESS = 'mapaddlayersuccess';//地图创建图层成功
var MAP_CLEAR = 'mapclear';//清空地图
var MAP_CENTER= 'mapcenter';//地图定位
export default {
    MAP_INIT_EVENT,
    MAP_ADD_LAYER,
    MAP_ADD_LAYER_SUCCESS,
    MAP_CLEAR,
    MAP_CENTER
};

export function AMEvent(page){
    const componentName = 'ArcgisMap';
    this.page = page;
    // eslint-disable-next-line no-underscore-dangle
    let parent = this.page || this.page.$root;
    let name = this.page.$options.name;
    while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;
        if (parent) {
            name = parent.$options.name;
        }
    }
    this.uid = parent._uid;
}
AMEvent.prototype = {
    getGIS:function(){
        return this.page.$ammap.GIS;
    },
    emit:function(type,data){
        this.page.$ammap.$emit(type,data,this.uid);
    },
    on:function(type,fun){
        let that = this;
        this.page.$ammap.$on(type,function(data,uid){
            if (that.uid === uid){
                fun(data);
            }
        });
    },
    setMap:function (map){
        this.page.$ammap['uid'+this.uid].map = map;
    },
    setMapLayers:function (mapLayers){
        this.page.$ammap['uid'+this.uid].mapLayers = mapLayers;
    },
    setDefaultSetting:function (defaultSetting){
        if (!this.page.$ammap['uid'+this.uid]){
            this.page.$ammap['uid'+this.uid] = {};
        }
        this.page.$ammap['uid'+this.uid].defaultSetting = defaultSetting;
    },
    getMap:function (){
        return this.page.$ammap['uid'+this.uid].map;
    },
    getMapLayers:function (){
        return this.page.$ammap['uid'+this.uid].mapLayers;
    },
    getDefaultSetting:function (){
        return this.page.$ammap['uid'+this.uid].defaultSetting;
    },
    //设置测站
    setStations:function (key,station){
        if (!this.page.$ammap['uid'+this.uid].stations){
            this.page.$ammap['uid'+this.uid].stations = {};
        }
        this.page.$ammap['uid'+this.uid].stations[key] = station;
    },
    //设置测站
    getStations:function (){
        return this.page.$ammap['uid'+this.uid].stations;
    },
    setBaseType:function (baseType){
        this.page.$ammap['uid'+this.uid].baseType = baseType;
    },
    getBaseType:function (){
        return this.page.$ammap['uid'+this.uid].baseType;
    }
    // setStationsLayers:function (stationsLayers){
    //     this.page.$ammap['uid'+this.uid].stationsLayers = stationsLayers;
    // }
};