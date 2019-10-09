<template>
    <div ref="mapSwitch" @mouseenter="openCards" @mouseleave="closeCard"
    :class="{'expand':this.expand}"
     class="mapSwitch" id=mapType-wrapper >
        <div v-show="mapLoadFlag" id="mapType">
           <div data-type="imagesLayer" @click="CardClickEvent('imagesLayer')" :class="{'active':this.currentMap === 'imagesLayer'}" class="mapTypeCard earth">
            <div>影像图</div>
          </div>
          <div data-type="layers" @click="CardClickEvent('terrains')"  :class="{'active':this.currentMap === 'terrains'}" class="mapTypeCard normal choosedType ">
            <div>道路图</div>
          </div>
          <div data-type="terrains" @click="CardClickEvent('layers')" :class="{'active':this.currentMap === 'layers'}"  class="mapTypeCard  panorama">
            <div>地形图</div>
          </div>
        </div>
    </div>
</template>

<script>
import EventConst,{AMEvent} from '@/config/EventConst';
let t = null;
export default {
    name:'mapSwtich',
    data(){
        return {
            expand:false,
            imagesLayer:{},
            amEvent:{},
            terrainsLayer:{},
            layersLayer:{},
            currentMap:'imagesLayer',//当前地图
            mapLoadFlag:false
        };
    },
    computed:{
        getMapWrapClass(){
            var classObj = {};
            if (this.expand){
                classObj = [];
            } else {
                classObj = ['expand'];
            }
            return classObj;
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
            this.mapLoadFlag = true;
            this.imagesLayer = this.amEvent.getMapLayers()['imagesLayer'].layer;
            this.terrainsLayer = this.amEvent.getMapLayers()['terrainsLayer'].layer;
            this.layersLayer = this.amEvent.getMapLayers()['layersLayer'].layer;

            this.currentMap = 'terrains';
            if (this.amEvent.getDefaultSetting().baseMap.defaultshow === 'images'){
                this.currentMap = 'imagesLayer';
            } else if (this.amEvent.getDefaultSetting().baseMap.defaultshow === 'terrains'){
                this.currentMap = 'terrains';
            } else if (this.amEvent.getDefaultSetting().baseMap.defaultshow === 'layers'){
                this.currentMap = 'layers';
            }
            this.amEvent.setBaseType(this.currentMap);
        },
        CardClickEvent(type){
            this.currentMap = type;
            this.imagesLayer.hide();
            this.terrainsLayer.hide();
            this.layersLayer.hide();

            if (type === 'layers'){
                this.layersLayer.show();
            } else if (type === 'terrains'){
                this.terrainsLayer.show();
            } else if (type === 'imagesLayer' || type === 'images'){
                this.imagesLayer.show();
            }
            this.amEvent.setBaseType(type);
        },
        openCards(){
            clearTimeout(t);
            this.expand = true;
        },
        closeCard(){
            var that = this;
            if (t !== null){
                clearTimeout(t);
            }
            t=setTimeout(function(){
                that.expand = false;
                clearTimeout(t);
                t = null;
            },400);

        }
    },
    mounted(){
        this.amEvent = new AMEvent(this);
        let that = this;
        that.amEvent.on(EventConst.MAP_INIT_EVENT,this.init);
        this.amEvent.on(EventConst.BASE_MAP_CHANGE,this.CardClickEvent);

    }
};
</script>

<style scoped lang = "scss">

</style>
