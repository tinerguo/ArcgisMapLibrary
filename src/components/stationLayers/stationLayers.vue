<template>
  <div>
    <div class="mapMouseOverDiv popupwin" :style="getmapMouseOverDivStyle">
        <slot name="overDiv">
                <table class="popupwinTable">
                  <tr v-if="mapMouseOver.currentObj.ParamsDes[i]" v-for="(key,i) in mapMouseOver.currentObj" :key="i">
                    <th>{{mapMouseOver.currentObj.ParamsDes[i]}}:</th>
                    <td>{{key}}</td>
                  </tr>
                </table>
        </slot>
    </div>
  </div>
</template>

<script>
import EventConst,{AMEvent} from '@/config/EventConst';
import mapLib from '@/utils/maplib';
export default {
    props: {
        mdata: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            map:{},
            GIS:{},
            amEvent:{},
            defaultSetting:{},
            mapLayers:{},
            eventToken:'',
            mapMouseOver:{
                x:100000,
                y:0,
                currentObj:{}
            }
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
            this.createLayers();
        },
        /**
         * 创建图层 每一类测站对应一个图层
         */
        createLayers(){
            let tempObj = this.mdata;
            let layerNM = tempObj.type+'layer';
            // if (!this.mapLayers[layerNM]){
            //     layerArr.push({
            //         id:layerNM,
            //         name:tempObj.name,
            //         visibility:true
            //     });
            //     this.$ammap.stationsLayers.push({
            //         id:layerNM,
            //         name:tempObj.name,
            //         visibility:true
            //     });
            // }

            this.eventToken = Math.random();
            //添加图层
            this.amEvent.emit(EventConst.MAP_ADD_LAYER,{
                layer:{
                    id:layerNM,//图层ID
                    name:tempObj.name,//图层名称
                    visibility:true
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
            let layerNM = tempObj.type+'layer';
            let layer = this.amEvent.getMapLayers()[layerNM];
            if (!layer){
                return;
            }
            mapLib.ondrawPointLocator(this,this.GIS,this.amEvent.getMap(),layer.layer,
                tempObj.type,
                tempObj.list,
                tempObj.iconURL,
                tempObj.width,
                tempObj.height,
                tempObj.ParamsDes,
                tempObj.ParamsKey
            );
        }
    },
    mounted () {
        this.amEvent = new AMEvent(this);
        this.amEvent.on(EventConst.MAP_INIT_EVENT,this.init);
        this.amEvent.on(EventConst.MAP_ADD_LAYER_SUCCESS,this.drowmap);

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