<template>
  <div class="page-index">

    <ArcgisMap :config="defaultSetting">
      <!-- 底图工具组件 -->
      <mapTooles :lend-win="true"></mapTooles>
      <!-- 经纬度显示组件 -->
      <cooding></cooding>
      <!-- 底图切换组件 -->
      <mapSwitch></mapSwitch>
      <!-- 底图查询组件 -->
      <mapSearch @mapMove="mapMove3" @mapClick="mapClick3"></mapSearch>
      <stationLayers :mdata="stationLayers['雨情站']" @mapMove="mapMove1" @mapClick="mapClick1">
        <template slot="overDiv">
          <div class="popupwin">
            <div style="text-align:center;">外部定义</div>
            <table>
              <tr>
                <th>名称：</th>
                <td colspan="3">{{currentStationData.name}}</td>
              </tr>
              <tr>
                <th>经度：</th>
                <td>{{currentStationData.x}}</td>
                <th>纬度：</th>
                <td>{{currentStationData.y}}</td>
              </tr>
              <tr>
                <th>雨量值：</th>
                <td>{{currentStationData.value}}</td>
                <th>24小时雨量值：</th>
                <td>{{currentStationData.value24}}</td>
              </tr>
            </table>
          </div>
        </template>
        </stationLayers>
      <stationLayers :mdata="stationLayers['水情站']" @mapMove="mapMove2" @mapClick="mapClick2"></stationLayers>
    </ArcgisMap>
  </div>
</template>

<script>
import { mapState,mapActions } from 'vuex';
import {defaultSetting} from './config/mapSetting.js';
export default {
    data () {
        return {
            defaultSetting:defaultSetting,
            radio: '1',
            currentStationData:{},
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
            gridData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }]
        };
    },
    components: {
        // eslint-disable-next-line vue/no-unused-components
        // ArcgisMap
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
        mapClick1(data,domID){
            console.log(domID);
            console.log(data);
            this.currentStationData = data;
        },
        mapClick2(data,domID){
            console.log(domID);
            console.log(data);
            this.currentStationData = data;
        },
        mapMove1(data){
            this.currentStationData = data;
        },
        mapMove2(data){
            this.currentStationData = data;
        },
        mapMove3(){


        },
        mapClick3(){


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
    table{
      width:100%;
      border-collapse: collapse;
      th{
        background: #f5f5f5;
        border:1px solid #333;
        text-align: center;
        font-weight: 300;
        font-size: 12px;
      }
      td{
        text-align: center;
        border:1px solid #333;
        font-weight: 300;
        font-size: 12px;
      }
    }
  }
</style>