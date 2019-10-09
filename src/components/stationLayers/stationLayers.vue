<template>
  <div>
    <div class="mapMouseOverDiv popupwin" :style="getmapMouseOverDivStyle">
        <slot name="overDiv">
                <table class="popupwinTable">

                  <template v-if="mapMouseOver.currentObj.ParamsDes != undefined">
                    <tr v-if="mapMouseOver.currentObj.ParamsDes[i]" v-for="(key,i) in mapMouseOver.currentObj" :key="i">
                      <th>{{mapMouseOver.currentObj.ParamsDes[i] == undefined ?'':mapMouseOver.currentObj.ParamsDes[i]}}:</th>
                      <td>{{key}}</td>
                    </tr>
                  </template>

                  <template v-if="mapMouseOver.currentObj.ParamsDes == undefined">
                    <tr v-if="(i != 'ParamsKey') && (i != 'ParamsDes') && (i != 'nameParam')" v-for="(key,i) in mapMouseOver.currentObj" :key="i">
                      <th>{{i}}</th>
                      <th>{{key}}</th>
                    </tr>
                  </template>

                </table>
        </slot>
    </div>
  </div>
</template>

<script>
import EventConst,{AMEvent} from '@/config/EventConst';
import {mapLibs} from '@/utils/maplib';
export default {
    props: {
        mdata: {
            type: Object,
            default: () => {}
        },
        visibility: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            map:{},
            GIS:{},
            amEvent:{},
            defaultSetting:{},
            mapLayers:{},
            layerType:'',
            eventToken:'',
            mapMouseOver:{
                x:100000,
                y:0,
                currentObj:{}
            },
            mapLibs:{}
        };
    },
    components: {
    },
    computed:{
        getmapMouseOverDivStyle(){
            return {
                left:this.mapMouseOver.x+'px',
                top:this.mapMouseOver.y+'px'
            };
        }
    },
    methods:{
        init(){
            this.map = this.amEvent.getMap();
            this.GIS = this.$ammap.GIS;
            this.defaultSetting = this.amEvent.getDefaultSetting();
            this.layerType = this.mdata.type;
            this.mapLayers = this.amEvent.getMapLayers();
            this.createLayers();
        },
        /**
         * 创建图层 每一类测站对应一个图层
         */
        createLayers(){
            let tempObj = this.mdata;
            let layerNM = tempObj.type+'_layer_amstation';
            this.eventToken = Math.random();


            let currenteStatusObj = !this.defaultSetting.mapStateList ?null:this.defaultSetting.mapStateList.find(item=>item.id === this.defaultSetting.defaultMapState);
            let visibility = false;
            if (currenteStatusObj){
                visibility = currenteStatusObj.station.findIndex(item=>item === this.layerType) > -1;
            } else {
                visibility = this.visibility;
            }
            //添加图层
            this.amEvent.emit(EventConst.MAP_ADD_LAYER,{
                layer:{
                    id:layerNM,//图层ID
                    name:tempObj.name,//图层名称
                    visibility: visibility
                },
                eventToken:this.eventToken
            });

        },
        drowmap(token){
            if (token !== this.eventToken){
                return;
            }
            // for (let key in this.stationLayers){
            let tempObj = this.mdata;//this.stationLayers[key];
            let layerNM = tempObj.type+'_layer_amstation';
            let layer = this.amEvent.getMapLayers()[layerNM];
            if (!layer){
                return;
            }
            this.mapLibs.ondrawPointLocator(this,this.GIS,this.amEvent.getMap(),layer.layer,
                tempObj.type,
                tempObj.list,
                tempObj.iconURL,
                tempObj.width,
                tempObj.height,
                tempObj.ParamsDes,
                tempObj.ParamsKey
            );
        },
        apiCenterStatioin(data){
            this.amEvent.emit(EventConst.MAP_CENTER_STATION,{
                page:this,
                data:data
            });
        }
    },
    mounted () {

        // eslint-disable-next-line new-cap
        this.mapLibs = new mapLibs(this);
        this.amEvent = new AMEvent(this);
        //地图图层加载完成（一个组件创建一个图层）
        this.amEvent.on(EventConst.MAP_ADD_LAYER_SUCCESS,this.drowmap);
        //地图初始化
        this.amEvent.on(EventConst.MAP_INIT_EVENT,this.init);

    }
};
</script>


<style  lang="scss" scoped>
  .mapMouseOverDiv{
    position: absolute;
    padding: 6px 10px;
    border:1px solid #ccc;
    border-radius: 4px;
    z-index: 22;
    background: rgba(255,255,255,0.8);
    td{
      font-size: 12px;
    }
  }

</style>

<style lang="scss">
  .popupwin{
     padding:20px;
     .popupwinTable{
       min-width: 200px;;
     }
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