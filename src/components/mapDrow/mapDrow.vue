<template>
    <div class="mapDrowWrap" >
      <div class="inner-wrap">

        <el-select v-model="drowType" placeholder="请选择绘制类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

      </div>

      <div class="btn" @click="drowMap">开始绘制</div>
    </div>
</template>

<script>

import EventConst,{AMEvent} from '@/config/EventConst';
export default {
    name:'mapDrow',
    props: {

    },
    data(){
        return {
            map:{},
            GIS:{},
            defaultSetting:{},
            amEvent:{},
            mapLayers:{},
            drawToolbar:{},
            drowType:'freehandpolygon',
            options: [{
                value: 'freehandpolygon',
                label: '手绘多边形'
            }, {
                value: 'Multipoint',
                label: 'Multipoint'
            }, {
                value: 'Line',
                label: 'Line'
            }, {
                value: 'Polyline',
                label: 'Polyline'
            }, {
                value: 'FreehandPolyline',
                label: 'FreehandPolyline'
            }]
        };
    },

    methods:{
        init(){
            this.map = this.amEvent.getMap();
            this.GIS = this.$ammap.GIS;
            this.defaultSetting = this.amEvent.getDefaultSetting();
            this.mapLayers = this.amEvent.getMapLayers();
        },
        drowMap(){

            this.drawToolbar = new this.GIS.draw(this.map);
            this.drawToolbar.on('draw-end',this.drowMapEnd);
            this.map.setMapCursor('pointer');
            console.log(this.GIS.draw.FREEHAND_POLYGON);
            this.drawToolbar.activate(this.drowType);
        },
        drowMapEnd(extent){
            //关闭绘图工具
            this.drawToolbar.deactivate();
        }

    },
    mounted(){
        this.amEvent = new AMEvent(this);
        // this.$ammap.$on(EventConst.MAP_INIT_EVENT,this.init);
        this.amEvent.on(EventConst.MAP_INIT_EVENT,this.init);
    }
};
</script>

<style scoped lang = "scss">
  .mapDrowWrap{
    position: absolute;
    top:6px;
    right:6px;
    border-radius: 4px;
    border:1px solid #333;
    padding:6px 10px;
    box-sizing: border-box;
    z-index: 23;
    background: rgba(255,255,255,0.4);
    .inner-wrap{
      display: inline-block;
      margin-bottom:10px;
    }
    .btn{
      cursor: pointer;
      padding:3px 6px;
      border-radius: 2px;
      border:1px solid #333;
      line-height: 24px;
      height: 24px;
      font-size: 12px;
    }
  }
</style>
