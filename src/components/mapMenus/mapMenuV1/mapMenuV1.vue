<template>
    <div :style="getMenuStyle" v-show="mapinit" class="mapMenu01" >
      <menuItemV1 @menuClick="menuClick" v-for="(item,index) in menuData" :class="{active:item.status == active}" :data="item" :key="index">

      </menuItemV1>
    </div>
</template>

<script>

import EventConst,{AMEvent} from '@/config/EventConst';
export default {
    name:'mapMenu01',
    props: {
        top:{
            type: Number,
            default: 0
        },
        left:{
            type: Number,
            default: 0
        },
        right:{
            type: Number,
            default: 0
        },
        bottom:{
            type: Number,
            default: 0
        },
        menuData:{
            type:Array,
            default:()=>[]
        }
    },
    data(){
        return {
            amEvent:{},
            mapinit:false,
            map:{},
            GIS:{},
            defaultSetting:{},
            mapLayers:{},
            active:''
        };
    },
    computed:{
        getMenuStyle(){
            let styleObj= {
                top:'auto',
                left:'auto',
                bottom:'auto',
                right:'auto'
            };
            if (this.top){
                styleObj['top'] = this.top+'px';
            }
            if (this.bottom){
                styleObj['bottom'] = this.bottom+'px';
            }
            if (this.left){
                styleObj['left'] = this.left+'px';
            }
            if (this.right){
                styleObj['right'] = this.right+'px';
            }
            return styleObj;
        }
    },
    methods:{

        /**
         * 地图初始化
         */
        init(){
            this.mapinit = true;
            this.defaultSetting = this.amEvent.getDefaultSetting();//  this.$ammap.defaultSetting;
            this.map = this.amEvent.getMap(); //this.$ammap.map;
            this.GIS = this.amEvent.getGIS();
            this.mapLayers = this.amEvent.getMapLayers();
            let currentStatusObj = this.defaultSetting.mapStateList.find((item)=>item.id === this.defaultSetting.defaultMapState );
            this.active = currentStatusObj.id;
        },
        menuClick(data){
            this.active = data.status;
            this.amEvent.emit(EventConst.MAP_STATUS_CHANGE,this.active);
        }
    },
    mounted(){
        this.amEvent = new AMEvent(this);
        this.amEvent.on(EventConst.MAP_INIT_EVENT,this.init);
    }
};
</script>

<style scoped lang = "scss">
  .mapMenu01{
    position: absolute;
    border-radius: 4px;
    z-index: 21;
    background: rgba(33, 150, 243, 0.81);
    box-shadow: 1px 1px 3px rgba(255,255,255,0.3);
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-around;
    padding:0px 20px;
    padding-right:0;
    box-sizing: border-box;
  }
</style>
