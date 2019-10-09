<template>
  <div>
      <!-- 左侧窗口 -->
      <div v-if="winType == 'left'" v-show="leftWinVis" class="searchResultWin left">
        <div class="title">
          图层列表
        </div>
        <div class="windCloseBtn" @click="closeLeftWin">
          <mapFont name="iconguanbi"></mapFont>
        </div>

        <div class="resultContent" ref="result-content">
          <ul>
            <li class="title" v-show="searchLayerList.stations.length > 0">
              测站
            </li>
            <li v-for="(obj,index) in searchLayerList.stations" @click="toMapPoint(obj,'station')" :key="index+obj.id">
                <div class="left">
                  <!-- {{obj.icon}} -->
                  <mapFont name="iconchuangkou"></mapFont>
                </div>
                <div class="content">
                  {{obj.name}}
                </div>
                <div class="right">
                </div>
            </li>
            <li class="title" v-show="searchLayerList.point.length > 0">
              点
            </li>
            <li v-for="(obj,index) in searchLayerList.point" @click="toMapPoint(obj)" :key="index+obj.id">
                <div class="left">
                  <!-- {{obj.icon}} -->
                  <mapFont name="iconchuangkou"></mapFont>
                </div>
                <div class="content">
                  {{obj.name}}
                </div>
                <div class="right">
                </div>
            </li>
            <li  class="title" v-show="searchLayerList.polyline.length > 0">
              线
            </li>
            <li v-for="(obj,index) in searchLayerList.polyline" @click="toMapPoint(obj)" :key="index+obj.id">
              <div>
                <!-- {{obj.icon}} -->
                  <mapFont name="iconchuangkou"></mapFont>
              </div>
              <div>
                {{obj.name}}
              </div>
              <div>
              </div>
            </li>
            <li  class="title" v-show="searchLayerList.polygon.length > 0">
            面
            </li>
            <li v-for="(obj,index) in searchLayerList.polygon" @click="toMapPoint(obj)" :key="index">
              <div>
                <!-- {{obj.icon}} -->
                  <mapFont name="iconchuangkou"></mapFont>
              </div>
              <div>
                {{obj.name}}
              </div>
              <div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="winType == 'bottom'" v-show="leftWinVis" class="searchResultWin bottom">
        <div class="title">
          图层列表
        </div>
        <div class="windCloseBtn" @click="closeLeftWin">
          <mapFont name="iconguanbi"></mapFont>
        </div>

        <div class="resultContent" ref="result-content">
          <ul>
            <li class="title" v-show="searchLayerList.stations.length > 0">
              测站
            </li>
            <li v-for="(obj,index) in searchLayerList.stations" @click="toMapPoint(obj,'station')" :key="index+obj.id">
                <div class="left">
                  <!-- {{obj.icon}} -->
                  <mapFont name="iconchuangkou"></mapFont>
                </div>
                <div class="content">
                  {{obj.name}}
                </div>
                <div class="right">
                </div>
            </li>
            <li class="title" v-show="searchLayerList.point.length > 0">
              点
            </li>
            <li v-for="(obj,index) in searchLayerList.point" @click="toMapPoint(obj)" :key="index+obj.id">
                <div class="left">
                  <!-- {{obj.icon}} -->
                  <mapFont name="iconchuangkou"></mapFont>
                </div>
                <div class="content">
                  {{obj.name}}
                </div>
                <div class="right">
                </div>
            </li>
            <li  class="title" v-show="searchLayerList.polyline.length > 0">
              线
            </li>
            <li v-for="(obj,index) in searchLayerList.polyline" @click="toMapPoint(obj)" :key="index+obj.id">
              <div>
                <!-- {{obj.icon}} -->
                  <mapFont name="iconchuangkou"></mapFont>
              </div>
              <div>
                {{obj.name}}
              </div>
              <div>
              </div>
            </li>
            <li  class="title" v-show="searchLayerList.polygon.length > 0">
            面
            </li>
            <li v-for="(obj,index) in searchLayerList.polygon" @click="toMapPoint(obj)" :key="index">
              <div>
                <!-- {{obj.icon}} -->
                  <mapFont name="iconchuangkou"></mapFont>
              </div>
              <div>
                {{obj.name}}
              </div>
              <div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- 查询组件 -->
      <div class="mapSearchWrap">
        <el-input v-model="searchInput" placeholder="输入查询内容"></el-input>
        <el-button @click="textMapSearchLayers" type="primary" style="margin-left:4px;">查询</el-button>
        <a @click="drowMapSearchLayers" class="iconBtn "  :class="{'active':drowMapActive}" title="单点查询" style="margin-left:6px;" >
          框选<mapFont name="iconkuangxuan"></mapFont>
        </a>
        <a @click="clickMapSearchLayers" class="iconBtn "  :class="{'active':clickMapActive}" title="框选查询" style="margin-left:6px;" >
          单点<mapFont  name="iconkuangxuan"></mapFont>
        </a>
    </div>
  </div>
</template>

<script>
import EventConst,{AMEvent} from '@/config/EventConst';
import {LayerSearch,TextLayerSearch} from '@/utils/layerSearch';
import {mapLibs} from '@/utils/maplib';
import BScroll from 'better-scroll';
import { debuglog } from 'util';
import { setTimeout } from 'timers';
export default {
    name:'mapSearch',
    props: {
        winType: {
            type: String,
            default: 'bottom'//bottom
        }
    },
    data(){
        return {
            map:{},
            GIS:{},
            defaultSetting:{},
            mapLayers:{},
            tabActiveName:'first',
            mapClientEvent:null,
            drawToolbar:{},
            clickMapActive:false,
            drowMapActive:false,
            layerSearch:{},
            mapLibs:{},
            leftWinVis:false,
            searchInput:'',
            searchLayerList:{
                point:[],
                polygon:[],
                polyline:[],
                stations:[]
            },
            mapExtentChange:null,
            buttonState:true,
            timer:null
        };
    },
    computed:{
    },
    methods:{
        /**
         * 地图初始化
         */
        init(){
            //始化变量
            this.map = this.amEvent.getMap();
            this.GIS = this.$ammap.GIS;
            this.defaultSetting = this.amEvent.getDefaultSetting();
            this.mapLayers = this.amEvent.getMapLayers();
            this.layerSearch = new LayerSearch(
                this,
                this.defaultSetting.dynamicLayers
            );
            this.mapLibs = new mapLibs(
                this
            );
        },
        /**
         * 框选地图查询
         */
        drowMapSearchLayers(){
            if (this.drowMapActive ){
                return;
            }
            this.drowMapActive = true;
            this.drawToolbar = new this.$ammap.GIS.draw(this.map);
            this.drawToolbar.on('draw-end',this.showResults);
            this.map.setMapCursor('pointer');
            this.drawToolbar.activate(this.GIS.draw.EXTENT);
        },
        /**
         * 文本地图查询
         */
        textMapSearchLayers(){
            let graphics = this.amEvent.getStations();//this.$ammap.stations;
            this.searchLayerList.stations = [];
            //获取测站列表
            for (let key in graphics){
                let tempObj = graphics[key];
                let attributes = tempObj.attributes;
                let nameParam = attributes.nameParam;
                let name = attributes[nameParam.name];
                if (name.indexOf(this.searchInput) > -1){
                    this.searchLayerList.stations.push({
                        id:attributes[nameParam.id],
                        name:attributes[nameParam.name],
                        data:tempObj,
                        icon:'测站'
                    });
                }
            }

            this.layerSearch.textSearch(this.searchInput,this.layerSearchResultCallBack);
        },
        /**
         * 点击地图查询
         */
        clickMapSearchLayers(){
            if (this.clickMapActive ){
                return;
            }
            this.clickMapActive = true;
            let that = this;
            this.mapExtentChange =this.amEvent.getMap().on('click', function(ev) {
                that.layerSearch.extendSearch({
                    geometry:ev.mapPoint
                },that.layerSearchResultCallBack);
                that.mapExtentChange.remove();
                that.mapExtentChange = null;
            });

        },
        /**
         * 框选结果
         */
        showResults(extent){
            this.drawToolbar.deactivate();
            this.map.setMapCursor('default');
            this.drowMapActive = false;
            let graphics = this.amEvent.getStations();//   this.$ammap.stations;
            this.searchLayerList.stations = [];
            //获取测站列表
            for (let key in graphics){
                let tempObj = graphics[key];
                let attributes = tempObj.attributes;
                let nameParam = attributes.nameParam;
                if (extent.geometry.contains(tempObj.geometry)){
                    this.searchLayerList.stations.push({
                        id:attributes[nameParam.id],
                        name:attributes[nameParam.name],
                        data:tempObj,
                        icon:'测站'
                    });
                }
            }
            //图层查询
            this.layerSearch.extendSearch(extent,this.layerSearchResultCallBack);
        },
        layerSearchResultCallBack(results){
            let that = this;
            this.clickMapActive = false;
            that.leftWinVis = true;
            that.searchLayerList.polygon = [];
            that.searchLayerList.polyline = [];
            that.searchLayerList.point = [];
            for (let i =0;i<results.length;i++){
                let tempArr = results[i];
                // 测站检索
                for (let j =0;j<tempArr.length;j++){
                    let tempObj = tempArr[j];
                    //polygon polyline point
                    if (!tempObj.feature.geometry){
                        continue;
                    }
                    if (tempObj.feature.geometry.type === 'polygon'){
                        that.searchLayerList.polygon.push({
                            id:tempObj.layerId+tempObj.value+tempObj.feature.geometry.type,
                            name:tempObj.layerName+tempObj.value,
                            data:tempObj,
                            icon:'线'
                        });
                    } else if (tempObj.feature.geometry.type === 'polyline'){
                        that.searchLayerList.polyline.push({
                            id:tempObj.layerId+tempObj.value+tempObj.feature.geometry.type,
                            name:tempObj.layerName+tempObj.value,
                            data:tempObj,
                            icon:'线'
                        });
                    } else if (tempObj.feature.geometry.type === 'point'){
                        that.searchLayerList.point.push({
                            id:tempObj.layerId+tempObj.value+tempObj.feature.geometry.type,
                            name:tempObj.layerName+tempObj.value,
                            data:tempObj,
                            icon:'点'
                        });
                    }
                }
            }
        },
        /**
         * 点击结果
         */
        toMapPoint(obj,type){
            if (type === 'station'){
                this.mapLibs.clearMap();
                this.mapLibs.mapCenter(obj.data.geometry);
                this.mapLibs.drowStation(obj.data);
                return;
            }
            this.amEvent.emit(EventConst.MAP_CENTER,obj.data);
            this.amEvent.emit(EventConst.MAP_CLEAR);


            setTimeout(function(){
                if (obj.data.feature.geometry.type === 'polygon'){
                    this.mapLibs.drowPolygon(obj.data);
                } else if (obj.data.feature.geometry.type === 'polyline'){
                    this.mapLibs.drowPolyline(obj.data);
                } else if (obj.data.feature.geometry.type === 'point'){
                    this.mapLibs.drowPoint(obj.data);
                }
            }.bind(this),400);
        },
        /**
         * 关闭左侧窗口
         */
        closeLeftWin(){
            this.mapLibs.closeAllMapPopWin();
            this.mapLibs.clearMap();
            this.leftWinVis = false;
        },
        scrollInit () {
            this.BS = new BScroll(this.$refs['result-content'], {
                mouseWheel: true,
                click: true
            });
        },
        scrollDestroy () {
            try {
                this.BS.destroy();
            } catch (e) {
                delete this.BS;
                this.BS = null;
            }
        }
    },
    mounted(){
        this.scrollInit();
        this.amEvent = new AMEvent(this);
        let that = this;
        that.amEvent.on(EventConst.MAP_INIT_EVENT, this.init);
    }
};
</script>

<style scoped lang = "scss">
  .searchResultWin.left{
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    width:250px;
    background: #fff;
    box-shadow: 1px 1px 2px #ccc;
    z-index: 24;
    .windCloseBtn{
      position: absolute;
      right:10px;
      top:10px;
      cursor: pointer;
    }
    .title{
      border-bottom:1px solid #ccc;
      height:40px;
      line-height: 40px;
      color:#333;
      padding-left:10px;
      font-size: 14px;
    }
    .resultContent{
      overflow: hidden;
      height:calc(100% - 122px);
      li{
        height:40px;
        border-bottom:1px solid #ccc;
        cursor: pointer;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        padding:0 10px;
        font-size: 12px;
      }
      li:hover{
        background: #f5f5f5;
      }
      li.title{
        height:24px;
        line-height: 24px;
        background:#0089c9;
        padding-left:20px;
        color:#fff;
        border-bottom:1px solid #fff;
        font-size: 14px;
      }
    }
  }
  .mapSearchWrap{
    position: absolute;
    top:20px;
    right:40px;
    box-sizing: border-box;
    line-height: 32px;
    border-radius: 4px;
    border:1px solid #333;
    background: rgba(255,255,255,0.6);;
    z-index: 20;
    padding:4px 10px;
    display: flex;
    flex-flow: row nowrap;
  }
  .iconBtn{
    cursor: pointer;
    padding:0px 20px;
    border:1px solid #929292;
    border-radius: 4px;
    color:#0089c9;
    display: inline-block;
    font-size: 12px;
    width:80px;
    height: 30px;
    line-height: 30px;
  }
  .iconBtn.active{
    background: #ccc;
    color:#fff;
    font-weight: 900;
  }


  .searchResultWin.bottom{
    position: absolute;
    top:66px;
    right:42px;
    width:312px;
    height:400px;
    background: #fff;
    box-shadow: 1px 1px 2px #ccc;
    z-index: 24;
    border:1px solid #333;
    border-radius: 4px;
    .windCloseBtn{
      position: absolute;
      right:10px;
      top:10px;
      cursor: pointer;
    }
    .title{
      border-bottom:1px solid #ccc;
      height:40px;
      line-height: 40px;
      color:#333;
      padding-left:10px;
      font-size: 14px;
    }
    .resultContent{
      overflow: hidden;
      height:calc(100% - 62px);
      li{
        height:40px;
        border-bottom:1px solid #ccc;
        cursor: pointer;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        padding:0 10px;
        font-size: 12px;
      }
      li:hover{
        background: #f5f5f5;
      }
      li.title{
        height:24px;
        line-height: 24px;
        background:#0089c9;
        padding-left:20px;
        color:#fff;
        border-bottom:1px solid #fff;
        font-size: 14px;
      }
    }
  }
</style>

<style lang="scss">
    .popupwin-content{
    table{
      width:100%;
      border-collapse: collapse;
      th{
        background: #f5f5f5;
        border:1px solid #333;
        text-align: center;
      }
      td{
        text-align: center;
        border:1px solid #333;
      }
    }
  }
</style>