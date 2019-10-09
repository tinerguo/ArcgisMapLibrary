<template>
    <div class="mapMenuItem01" @click="menuClick" >
      <mapFont class="menuIcon" :name="data.icon"></mapFont>
      <div class="text">{{data.name}}</div>
    </div>
</template>

<script>

import EventConst,{AMEvent} from '@/config/EventConst';
export default {
    name:'mapMenu01',
    props: {
        data:{
            type: Object,
            default: ()=> {}
        }
    },
    data(){
        return {
            amEvent:{},
            mapinit:false,
            map:{},
            GIS:{},
            defaultSetting:{},
            mapLayers:{}
        };
    },
    computed:{

    },
    methods:{
        menuClick(){
            this.$emit('menuClick',this.data);
        },
        /**
         * 地图初始化
         */
        init(){
            this.mapinit = true;
            this.defaultSetting = this.amEvent.getDefaultSetting();//  this.$ammap.defaultSetting;
            this.map = this.amEvent.getMap(); //this.$ammap.map;
            this.GIS = this.amEvent.getGIS();
            this.mapLayers = this.amEvent.getMapLayers();
        }
    },
    mounted(){
    }
};
</script>

<style scoped lang = "scss">
  .mapMenuItem01{
    width:80px;
    height:70px;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
    margin-right:20px;
    color: #fff;
    padding-top:2px;
    box-sizing: border-box;
    .menuIcon{
      font-size: 40px;
      font-weight: 300;
    }
    .text{
      margin-top:2px;
    }
  }
  .mapMenuItem01.active{
    background: rgba(255,255,255,0.3);
  }
  .mapMenuItem01.active:hover{
    background: rgba(255,255,255,0.3);
  }
  .mapMenuItem01:hover{
    background: rgba(255,255,255,0.1);
  }
</style>
