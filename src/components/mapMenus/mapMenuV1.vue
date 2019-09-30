<template>
    <div v-show="mapinit" class="mapMenu01" >

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
            mapLayers:{}
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
        }
    },
    mounted(){
        this.amEvent = new AMEvent(this);
        this.amEvent.on(EventConst.MAP_INIT_EVENT,this.init);
    }
};
</script>

<style scoped lang = "scss">

</style>
