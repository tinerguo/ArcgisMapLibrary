<template>
    <div v-show="mapinit" class="mapMenu01" >
      <menuItemV1 @menuClick="menuClick" v-for="(item,index) in menuData" :class="{active:item.status == active}" :data="item" :key="index">

      </menuItemV1>
    </div>
</template>

<script>

import EventConst,{AMEvent} from '@/config/EventConst';
export default {
    name:'mapMenu01',
    props: {
        labelwidth:{
            type: Number,
            default: 45
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
            active:'',
            menuData:[
                {
                    name:'水情监测',
                    icon:'iconhome',
                    status:'waterState'
                },
                {
                    name:'雨情监测',
                    icon:'icontubiaozhexiantu',
                    status:'rainState'
                }
            ]
        };
    },
    computed:{

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
    background: #0033cc;
    top:20px;
    left:20px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-around;
    padding:0px 20px;
    padding-right:0;
    box-sizing: border-box;
  }
</style>
