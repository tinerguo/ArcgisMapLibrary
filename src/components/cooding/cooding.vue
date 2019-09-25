<template>
  <div class="coodingWrap" :style="getcCoodingStyle">
    <div id="cooding" class="cooding">级别:  坐标:</div>
    <div id="btn" class="js-copy" data-clipboard-text="15260983827">
        <a @click="selectXY" title="点击复制坐标"><mapFont class="copybtn" name="iconcaidan"></mapFont></a>
    </div>
  </div>
</template>

<script>
import EventConst,{AMEvent} from '@/config/EventConst';
// var Clipboard =require('@/utils/clipboard.min.js');
export default {
    name:'cooding',
    data(){
        return {
            mp:null,
            mapExtentChange:null
        };
    },
    computed:{
        getcCoodingStyle(){
            if (this.mp){
                return {
                    display:'block'
                };
            }
            return {
                display:'none'
            };
        }
    },
    methods:{
        init(){
            if (!this.amEvent.getDefaultSetting().baseMap.visibility){
                return;
            }
            if (!this.amEvent.getMap()){
                return;
            }
            //todo:经纬度显示
            dojo.connect(this.amEvent.getMap(), 'onMouseMove', this.showCoordinates);
            dojo.connect(this.amEvent.getMap(), 'onMouseDrag', this.showCoordinates);
            this.amEvent.getMap().on('extent-change', this.extentChange);
        },
        extentChange(evt){
            var that = this;
            var level = that.amEvent.getMap().getLevel();
            this.$nextTick(()=>{
                dojo.byId('cooding').innerHTML = '级别:'+level + '  坐标:' + Number(this.mp.x).toFixed(4) + ', ' +
                  Number(this.mp.y).toFixed(4);
            });

        },
        showCoordinates(evt){
            var that = this;
            var level = that.amEvent.getMap().getLevel();
            let mp = evt.mapPoint;
            this.mp = mp;
            this.$nextTick(()=>{
                if (this.amEvent.getMap().spatialReference.wkid === 102113){
                    let geometry = new this.$ammap.GIS.Point(mp.x,mp.y);
                    let geometryMc = this.$ammap.GIS.webMercatorUtils.webMercatorToGeographic(geometry);
                    dojo.byId('cooding').innerHTML = '级别:'+level + '  坐标:' + Number(geometryMc.x).toFixed(4) + ', ' +
                  Number(geometryMc.y).toFixed(4);
                } else {
                    dojo.byId('cooding').innerHTML = '级别:'+level + '  坐标:' + Number(mp.x).toFixed(4) + ', ' +
                  Number(mp.y).toFixed(4);
                }
            });
        },
        selectXY(){
            let that = this;
            if (this.mapExtentChange){
                return;
            }
            this.mapExtentChange =this.amEvent.getMap().on('click', function(ev) {
                let lat = Math.round(ev.mapPoint.getLatitude() * 1000) / 1000;
                let lon = Math.round(ev.mapPoint.getLongitude() * 1000) / 1000;
                // eslint-disable-next-line no-alert
                alert(lon+','+lat);
                that.mapExtentChange.remove();
                that.mapExtentChange = null;
            });

        }
    },
    mounted(){
        this.amEvent = new AMEvent(this);
        this.amEvent.on(EventConst.MAP_INIT_EVENT,this.init);
        // this.$ammap.$on(EventConst.MAP_INIT_EVENT,this.showPoint);
    }
};
</script>

<style scoped lang = "scss">
  .coodingWrap{
      position: absolute;
      bottom: 15px;
      left: 20px;
      z-index: 999;
      border-radius: 5px;
      box-shadow: 2px 2px 8px #adadad;
      padding: 5px 10px;
      background: #0088cc;
      color: #fff;
      font-weight: 900;
      font-size: 12px;
      width: 225px;
      display: none;
  }
  .copybtn{
    position: absolute;
    right:4px;
    top:4px;
    cursor: pointer;
  }
</style>
