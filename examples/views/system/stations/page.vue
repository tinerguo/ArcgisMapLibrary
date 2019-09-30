<template>
  <div class="page-index">

    <ArcgisMap :config="defaultSetting">
      <mapTooles :lend-win="true" :lendheight="280" :lendwidth="275"></mapTooles>
      <!-- 经纬度显示组件 -->
      <cooding></cooding>
      <!-- 底图切换组件 -->
      <mapSwitch></mapSwitch>

      <!-- 默认窗口 -->
      <stationLayers :visibility="false" :mdata="stationLayers['雨情站']"></stationLayers>

      <stationLayers :visibility="false" :mdata="stationLayers['水库']"></stationLayers>

      <stationLayers ref="xiachuantongdao" :visibility="false"
      :mdata="stationLayers['下穿通道']" @mapMove="XCTDmapMove" @mapClick="XCTDmapClick">
        <template slot="overDiv">
          <div class="popupwin">
            <div style="text-align:center;">自定义悬浮窗口</div>
            <table class="gridtable">
              <tr>
                <th>名称：</th>
                <td colspan="3">{{currentStationData.stnm}}</td>
              </tr>
              <tr>
                <th>经度：</th>
                <td>{{currentStationData.lgtd}}</td>
                <th>纬度：</th>
                <td>{{currentStationData.lttd}}</td>
              </tr>
              <tr>
                <th>雨量值：</th>
                <td>{{currentStationData.oneDngVal}}</td>
                <th>24小时雨量值：</th>
                <td>{{currentStationData.rainfull}}</td>
              </tr>
            </table>
          </div>
        </template>
      </stationLayers>

      <stationLayers ref="shuiqingStation" :visibility="true"
      :mdata="stationLayers['水情站']" @mapMove="SQmapMove" @mapClick="SQmapClick">
        <template slot="overDiv">
          <div class="popupwin">
            <div style="text-align:center;">自定义悬浮窗口</div>
            <table class="gridtable">
              <tr>
                <th>名称：</th>
                <td colspan="3">{{currentStationData.hnnm}}</td>
              </tr>
              <tr>
                <th>经度：</th>
                <td>{{currentStationData.lgtd}}</td>
                <th>纬度：</th>
                <td>{{currentStationData.lttd}}</td>
              </tr>
              <tr>
                <th>雨量值：</th>
                <td>{{currentStationData.oneDngVal}}</td>
                <th>24小时雨量值：</th>
                <td>{{currentStationData.rainfull}}</td>
              </tr>
            </table>
          </div>
        </template>
      </stationLayers>

      <mapWin :isopen="false" title="下穿通道" :width="400" :height="530" position='left-top' :top='10'>
        <div class="leftWinWrap">
            <div  style="text-align:center;">
              下穿通道
            </div>
            <ul>
              <li @click="XCTDpointCenter(obj)" v-for="(obj,index) in stationLayers['下穿通道'].list" :key="index">
                <div class="num">{{(index+1)}}</div>
                <div>{{obj.stnm}}</div>
              </li>
            </ul>
        </div>
      </mapWin>

      <mapWin :isopen="false" title="水情站" :width="400" :height="530" position='left-top':top='100'>
        <div class="leftWinWrap">
            <div  style="text-align:center;">
              水情站
            </div>
            <ul>
              <li @click="SQpointCenter(obj)" v-for="(obj,index) in stationLayers['水情站'].list" :key="index">
                <div class="num">{{(index+1)}}</div>
                <div>{{obj.stnm}}</div>
              </li>
            </ul>
        </div>
      </mapWin>

      <mapWin :isopen="false" title="雨情站" :width="400" :height="330" position='left-top':top='180'>
        <div class="leftWinWrap">
            <div  style="text-align:center;">
              雨情站
            </div>
            <ul>
              <li @click="SQpointCenter(obj)" v-for="(obj,index) in stationLayers['雨情站'].list" :key="index">
                <div class="num">{{(index+1)}}</div>
                <div>{{obj.stnm}}</div>
              </li>
            </ul>
        </div>
      </mapWin>

      <mapWin :isopen="true" title="水库" :width="400" :height="330" position='left-top' :top='260'>
        <div class="leftWinWrap">
            <div  style="text-align:center;">
              水库
            </div>
            <ul>
              <li @click="SQpointCenter(obj)" v-for="(obj,index) in stationLayers['水库'].list" :key="index">
                <div class="num">{{(index+1)}}</div>
                <div>{{obj.stnm}}</div>
              </li>
            </ul>
        </div>
      </mapWin>
    </ArcgisMap>

    <el-dialog
      title="下穿通道信息（自定义窗口）"
      :visible.sync="xxtdDialogVisible"
      width="60%">
      <div class="xxtdStationContent">
        <div class="title">
          <el-select size="mini" v-model="value" placeholder="请选择测站类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
        <el-select size="mini" v-model="value" placeholder="请选择测站">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
        </div>
        <div class="content">
            <div class="leftWrap">
              表格
            </div>
            <div class="rightWrap">
              图表
            </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="xxtdDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="xxtdDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState,mapActions } from 'vuex';
import {defaultSetting} from './config/mapSetting.js';
import {rainStations} from './config/rainStations.js';
import {rainStations1} from './config/rainStations1.js';
import {rainStations2} from './config/rainStations2.js';
import {floodStations} from './config/FloodStation.js';

export default {
    data () {
        return {
            defaultSetting:defaultSetting,
            radio: '1',
            currentStationData:{},
            xxtdDialogVisible:false,
            stationLayers:{
                '雨情站':{
                    name:'雨情站',
                    type:'rain',
                    iconURL:function(data){
                        return require('ex/assets/map/jsd.png');
                    },
                    width:24,
                    height:24,
                    wkid : 4326,
                    ParamsKey:{
                        id:'stcd',
                        name:'stnm',
                        x:'lgtd',
                        y:'lttd',
                        value:'oneAltVal'
                    },
                    list:rainStations,
                    /**
                     * 地图窗口
                     * infoTemplate:系统弹出窗口，传递给用户窗口内容ID和测站信息
                     * custom：系统传递测站信息
                     * default:系统默认，默认使用infoTemplate展示测站信息列表
                     */
                    clickWinType:'default'
                },
                '水库':{
                    name:'水库',
                    type:'shuiku',
                    iconURL:require('ex/assets/map/sk.png'),
                    width:24,
                    height:24,
                    wkid : 4326,
                    ParamsKey:{
                        id:'stcd',
                        name:'stnm',
                        x:'lgtd',
                        y:'lttd',
                        value:'oneAltVal'
                    },
                    ParamsDes:{
                        stcd:'编号',
                        stnm:'名称',
                        lgtd:'经度',
                        lttd:'纬度',
                        rainfull:'累计雨量值',
                        thirtyMAltVal:'雨量(mm)'
                    },
                    list:rainStations1,
                    /**
                     * 地图窗口
                     * infoTemplate:系统弹出窗口，传递给用户窗口内容ID和测站信息
                     * custom：系统传递测站信息
                     * default:系统默认，默认使用infoTemplate展示测站信息列表
                     */
                    clickWinType:'default'
                },
                '下穿通道':{
                    name:'下穿通道',
                    type:'xiachuantongdao',
                    iconURL:require('ex/assets/map/swz2.png'),
                    width:24,
                    height:24,
                    wkid : 4326,
                    ParamsKey:{
                        id:'stcd',
                        name:'stnm',
                        x:'lgtd',
                        y:'lttd',
                        value:'oneAltVal'
                    },
                    ParamsDes:{
                        stcd:'编号',
                        stnm:'名称',
                        lgtd:'经度',
                        lttd:'纬度',
                        rainfull:'累计雨量值',
                        thirtyMAltVal:'雨量(mm)'
                    },
                    list:rainStations2,
                    /**
                     * 地图窗口
                     * infoTemplate:系统弹出窗口，传递给用户窗口内容ID和测站信息
                     * custom：系统传递测站信息
                     * default:系统默认，默认使用infoTemplate展示测站信息列表
                     */
                    clickWinType:'custom'
                },
                '水情站':{
                    name:'水情站',
                    type:'water',
                    width:24,
                    height:24,
                    ParamsKey:{
                        id:'stcd',
                        name:'stnm',
                        x:'lgtd',
                        y:'lttd',
                        value:'value'
                    },
                    list:floodStations,
                    clickWinType:'infoTemplate'
                }
            },
            options: [
                {
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }
            ],
            value: ''
        };
    },
    components: {
    },
    computed:{
        ...mapState('gray', [
            'text','count'
        ])
    },
    methods:{
        ...mapActions('gray', [
            'gogoshow',
            'increment'
        ]),
        /**
         * 下穿通道窗口
         */
        XCTDmapMove(data){
            console.log(data);
            this.currentStationData = data;
        },
        XCTDmapClick(data){
            this.currentStationData = data;
            this.xxtdDialogVisible= true;
        },
        /**
         * 水情窗口
         */
        SQmapMove(data){
            this.currentStationData = data;
        },
        SQmapClick(data,domID){
            this.currentStationData = data;
            this.$nextTick(function(){
                document.getElementById(domID).innerHTML =
                '<div style="height:200px;width:100px;">自定义内容</div>';
            });
        },
        /**
         * 下穿通道定位
         */
        XCTDpointCenter(data){
            this.$refs['xiachuantongdao'].apiCenterStatioin(data);
        },
        /**
         * 水情定位
         */
        SQpointCenter(data){
            this.$refs['shuiqingStation'].apiCenterStatioin(data);
        }
    },
    mounted () {

    },
    beforeDestroy () {
    }
};
</script>


<style  lang="scss" scoped>
  .page-index {
  }
  .btn{
    height:30px;
    border-radius: 4px;
    border:1px solid #ccc;
    cursor: pointer;
    line-height: 30px;
    text-align: center;
    width: 200px;
    margin:10px 0px;
  }
  .popupwin{
     padding:0px;
    table.gridtable {
      font-family: verdana,arial,sans-serif;
      font-size:11px;
      color:#333333;
      border-width: 1px;
      border-color: #666666;
      border-collapse: collapse;
    }
    table.gridtable th {
      border-width: 1px;
      padding: 2px;
      border-style: solid;
      border-color: #666666;
      background-color: #dedede;
    }
    table.gridtable td {
      border-width: 1px;
      padding: 2px;
      border-style: solid;
      border-color: #666666;
      background-color: #ffffff;
    }
  }

    .testPanel{
      position: absolute;
      top:20px;
      right:200px;
      z-index: 999;
      border-radius: 4px;
      background: rgba(255,255,255,0.9);
      height:300px;
      width:420px;
      padding:6px 10px;
      border:1px solid #fefefe;
      .button{
        padding:6px 10px;
        text-align: center;
        line-height:20px;
        height: 20px;
        border:1px solid #333;
        border-radius: 4px;
        display: inline-block;
        min-width: 80px;
        font-size: 12px;
        cursor: pointer;;

      }
  }

  .xxtdStationContent{
      .title{
        height:40px;
      }
      .content{
        height:300px;
        display: flex;
        flex-flow: row nowrap;
        .leftWrap{
          width:200px;
          border:1px solid #333;
        }
        .rightWrap{
          flex-grow: 1;
          border:1px solid #333;
          border-left:none;
        }
      }

  }
  .leftWinWrap{
    height:300px;
    overflow: hidden;
    li,ul{
      list-style: none;
    }
    li{
      border-bottom: 1px solid #f5f5f5;
      box-sizing: border-box;
      height:60px;
      line-height: 60px;
      padding-left:10px;
      cursor: pointer;
      display: flex;
      flex-flow: row nowrap;
      .num{
        width:40px;
      }
    }
    li:hover{
      background: #e7e7e7;
    }
  }
</style>