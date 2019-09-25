<template>
    <div ref="mapSwitch" @mouseenter="openCards" @mouseleave="closeCard"
    :class="{'expand':this.expand}"
     class="mapSwitch" id=mapType-wrapper >
        <div v-show="mapLoadFlag" id="mapType">
           <div data-type="yx" @click="CardClickEvent('yx')" :class="{'active':this.currentMap === 'yx'}" class="mapTypeCard earth">
            <div>影像图</div>
          </div>
          <div data-type="dl" @click="CardClickEvent('dl')"  :class="{'active':this.currentMap === 'dl'}" class="mapTypeCard normal choosedType ">
            <div>道路图</div>
          </div>
          <div data-type="dx" @click="CardClickEvent('dx')" :class="{'active':this.currentMap === 'dx'}"  class="mapTypeCard  panorama">
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
            currentMap:'yx',//当前地图
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

            this.currentMap = 'dx';
            if (this.amEvent.getDefaultSetting().baseMap.defaultshow === 'images'){
                this.currentMap = 'yx';
            } else if (this.amEvent.getDefaultSetting().baseMap.defaultshow === 'terrains'){
                this.currentMap = 'dx';
            } else if (this.amEvent.getDefaultSetting().baseMap.defaultshow === 'layers'){
                this.currentMap = 'dl';
            }
            this.amEvent.setBaseType(this.currentMap);
        },
        CardClickEvent(type){
            this.currentMap = type;
            this.imagesLayer.hide();
            this.terrainsLayer.hide();
            this.layersLayer.hide();
            if (type === 'dl'){
                this.layersLayer.show();
            } else if (type === 'dx'){
                this.terrainsLayer.show();
            } else if (type === 'yx'){
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
        //图层加载比较慢，这里延迟2秒执行，如果延迟2秒还没有获取到那么间隔2秒检查一遍，最多检查4遍
        that.amEvent.on(EventConst.MAP_INIT_EVENT, function(data){
            setTimeout(
                function(){
                    that.init(data);
                }
                ,2000);
        });


    }
};
</script>

<style scoped lang = "scss">

</style>
