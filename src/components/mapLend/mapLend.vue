<template>
    <div v-show="mapinit" class="mapLend" >
      <h3 class="title">图例</h3>
        <div style="margin:16px 0;">
          <div class="sub-title">底图</div>
          <div class="layers-wrap">
              <el-checkbox-group v-model="baseMapList" @change="baseMapListChange">
                <el-checkbox label="底图">
                  <img class="lendIcon" :src="require('./images/lend_dt.png')"/>
                  底图
                  </el-checkbox>
                <el-checkbox label="标注">
                  <img class="lendIcon" :src="require('./images/lend_bz.png')"/>
                  标注
                </el-checkbox>
                <el-checkbox label="遮罩">
                  <img class="lendIcon" :src="require('./images/lend_zz.png')"/>
                  遮罩
                </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>

        <div style="margin:16px 0;">
          <div class="sub-title">图层</div>
          <!-- <div class="line"></div> -->
          <!-- <div class="flex-line">
            <el-checkbox-group v-model="lendLayersmodel">
                  <el-checkbox v-for="(obj,index) in lendLayers" :label="obj.layerId+'-'+obj.value" :key="index">
                    {{obj.name}}
                  </el-checkbox>
            </el-checkbox-group>
          </div> -->
            <div  v-for="(obj,index) in lendLayerObj" :key="index" class="flex-line">
              <div style="width:100%;" class="layer-title">{{obj.name}}</div>
              <el-checkbox-group v-model="lendLayersmodel"  @change="layerListChange">
                    <el-checkbox v-for="(obj,index) in obj.list" :label="obj.layerId+'-'+obj.value" :key="index">
                      {{obj.name}}
                    </el-checkbox>
              </el-checkbox-group>
            </div>
        </div>


        <div style="margin:16px 0;" v-if="lendStationLayers.length > 0">
          <div class="sub-title">测站</div>
          <el-checkbox-group v-model="stationsMapList" @change="stationLayerClick">
            <el-checkbox  v-for="(obj) in lendStationLayers" :key="obj.id" :label="obj.id">
              {{obj.name}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
    </div>
</template>

<script>

import EventConst,{AMEvent} from '@/config/EventConst';
export default {
    name:'mapLend',
    props: {
        labelwidth:{
            type: Number,
            default: 45
        }
    },
    watch:{
        labelwidth(value){
            if (document.getElementsByClassName('el-checkbox__label').length > 0) {
                for (let i =0;i<document.getElementsByClassName('el-checkbox__label').length;i++){
                    let tempObj = document.getElementsByClassName('el-checkbox__label')[i];
                    tempObj.style.width = value+'px';
                }
            }
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
            lendLayers:[],
            lendLayersmodel:[],
            lendLayerObj:{},
            lendStationLayers:[],
            baseMapList:['底图','标注','遮罩'],
            layerMapList:[],
            stationsMapList:[]
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

            if (!this.defaultSetting.lend ){
                this.dynLayers();
                return;
            }
            //如果默认影藏遮罩图层
            if (this.defaultSetting.lend.shadeLayerVisibility === undefined || this.defaultSetting.lend.shadeLayerVisibility){
                this.baseMapList.splice(this.baseMapList.findIndex(item => item === '遮罩'), 1);
                this.map.getLayer('shadeLayer').hide();
            }

            //如果默认影藏标注图层
            if (!this.defaultSetting.lend.labelsLayerVisibility === undefined || this.defaultSetting.lend.labelsLayerVisibility){
                this.baseMapList.splice(this.baseMapList.findIndex(item => item === '标注'), 1);
                this.map.getLayer('labelsLayer').hide();
            }
            //绘制动态图层图例信息
            this.dynLayers();
        },
        /**
         * 动态设置label的宽度
         */
        changeLabelW(){
            if (document.getElementsByClassName('el-checkbox__label').length > 0) {
                for (let i =0;i<document.getElementsByClassName('el-checkbox__label').length;i++){
                    let tempObj = document.getElementsByClassName('el-checkbox__label')[i];
                    tempObj.style.width = this.labelwidth+'px';
                }
            }
        },
        /**
         * 设置动态图层图例
         */
        dynLayers(){
            this.lendLayerObj = {};
            this.lendLayers = [];
            for (let i =0;i<this.defaultSetting.dynamicLayers.length;i++){

                let layerConf = this.defaultSetting.dynamicLayers;
                let id = layerConf[i].id;
                let name = layerConf[i].name;
                let layers = layerConf[i].layers;
                let showArr = layerConf[i].show;
                this.lendLayerObj[id] = {};
                this.lendLayerObj[id].name = name;
                this.lendLayerObj[id].list = [];
                this.lendLayerObj[id].ids = [];

                for (let layerkey in layers){
                    let index = showArr.indexOf(Number(layerkey));

                    //对象形式设置图层
                    this.lendLayerObj[id].list.push({
                        show:index>-1,
                        name:layers[layerkey],
                        value:layerkey,
                        layerId:id
                    });
                    this.lendLayerObj[id].ids.push(id+'-'+layerkey);

                    //lendLayers 未使用 把所有的图层加到一起
                    this.lendLayers.push({
                        show:index>-1,
                        name:layers[layerkey],
                        value:layerkey,
                        layerId:id
                    });

                    //设置默认需要显示的图层
                    if (index>-1){
                        this.lendLayersmodel.push(id+'-'+layerkey);
                    }
                }
            }
            this.$nextTick(()=>{
                this.changeLabelW();
            });

        },
        /**
         * 基础地图修改事件
         */
        baseMapListChange(){

            let index = this.baseMapList.indexOf('底图');

            if (index > -1){
                if (this.amEvent.getBaseType() === 'layers'){
                    this.map.getLayer('layersLayer').show();
                } else if (this.amEvent.getBaseType() === 'terrains'){
                    this.map.getLayer('terrainsLayer').show();
                } else if (this.amEvent.getBaseType() === 'imagesLayer'){
                    this.map.getLayer('imagesLayer').show();
                }
            } else {
                this.map.getLayer('imagesLayer').hide();
                this.map.getLayer('terrainsLayer').hide();
                this.map.getLayer('layersLayer').hide();
            }

            index = this.baseMapList.indexOf('标注');
            if (index > -1){
                this.map.getLayer('labelsLayer').show();
            } else {
                this.map.getLayer('labelsLayer').hide();
            }

            index = this.baseMapList.indexOf('遮罩');
            if (index > -1){
                this.map.getLayer('shadeLayer').show();
            } else {
                this.map.getLayer('shadeLayer').hide();
            }
        },
        /**
         * 图层修改事件
         */
        layerListChange(){
            for (let i =0;i<this.defaultSetting.dynamicLayers.length;i++){
                let layerConf = this.defaultSetting.dynamicLayers;
                let layerid = layerConf[i].id;
                let tempArr = [];
                for (let j =0;j<this.lendLayersmodel.length;j++){
                    let tempObj = this.lendLayersmodel[j];
                    if (tempObj.indexOf(layerid) > -1){
                        tempArr.push(tempObj.split('-')[1]);
                    }
                }
                if (tempArr.length <= 0){
                    this.map.getLayer(layerid).hide();
                } else {
                    this.map.getLayer(layerid).show();
                    this.map.getLayer(layerid).setVisibleLayers(tempArr);
                }
            }
        },
        /*
        * 添加测站
        */
        stationAddEvent(data){
            this.lendStationLayers.push(data.layer);
            if (data.layer.visibility){
                this.stationsMapList.push(data.layer.id);
            }
        },
        /**
         * 测站图层点击事件
         **/
        stationLayerClick(){
            for (let i =0;i<this.lendStationLayers.length;i++){
                let id = this.lendStationLayers[i].id;
                this.map.getLayer(id).hide();
                if (this.stationsMapList.indexOf(id)>-1){
                    this.map.getLayer(id).show();
                }
            }

        }
    },
    mounted(){
        this.amEvent = new AMEvent(this);
        let that = this;
        if (document.getElementsByClassName('el-checkbox__label').length > 0) {
            for (let i =0;i<document.getElementsByClassName('el-checkbox__label').length;i++){
                let tempObj = document.getElementsByClassName('el-checkbox__label')[i];
                tempObj.style.width = that.labelwidth+'px';
            }
        }
        // this.$ammap.$on(EventConst.MAP_ADD_LAYER,this.stationAddEvent);
        // this.$ammap.$on(EventConst.MAP_INIT_EVENT,this.init);
        this.amEvent.on(EventConst.MAP_ADD_LAYER,this.stationAddEvent);
        this.amEvent.on(EventConst.MAP_INIT_EVENT,this.init);
    }
};
</script>

<style scoped lang = "scss">
  .mapLend{
    .lendIcon{
      width:24px;
      height:24px;
      position: relative;
      top: 8px;
    }
  }
  .flex-line{
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    label{
      /* width: 33.33%; */
    }
  }
  .layer-title{
    padding-left:6px;
    margin-top:6px;
    margin-bottom:6px;
    color:#333;
  }
  .layer-title::before{
    content: ' ';
    position: relative;
    background: #333;
    border-radius: 6px;
    top:0;
    left:-4px;
    display: inline-block;
    width:6px;
    height:6px;
  }

</style>

<style  lang = "scss">
.lendWin{
      .el-checkbox__label{
        font-size: 12px;
      }
      .el-checkbox__inner{
          height:12px;
          width:12px;
          line-height: 12px;
      }
      .el-checkbox__inner::after{
        top:auto;
        left:3px;
      }
  }
</style>