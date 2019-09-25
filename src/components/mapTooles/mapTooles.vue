<template>
    <div v-show="mapinit" class="mapToolesWrap " :style="mapToolesWrapStyle">
       <div id="HomeButton"></div>
        <div id="search"></div>

        <div :style="{width:this.lendwidth+'px',height:this.lendheight+'px'}" class="lendWin"
        v-show="!lendWinVis">
          <div class="closeBtn" @click="btnClick('图例')">
            <mapFont name="iconguanbi"></mapFont>
          </div>
            <mapLend :labelwidth="labelwidth"></mapLend>
          </div>
        <div class = "btnBox">
          <!-- 刷新数据 -->
          <div class="button">
            <a title="刷新数据"><mapFont name="iconshuaxin"></mapFont></a>
          </div>
          <!-- 清空数据 -->
          <div class="button"  @click="btnClick('清空数据')">
            <a title="清空数据"><mapFont name="iconqingchu"></mapFont></a>
          </div>
          <!-- 上一视图 -->
          <div class="button"  @click="btnClick('上一视图')">
            <a title="上一视图"><mapFont name="iconyou-shuang"></mapFont></a>
          </div>
          <!-- 下一视图 -->
          <div class="button"  @click="btnClick('下一视图')">
            <a title="下一视图"><mapFont name="iconzuo-shuang"></mapFont></a>
          </div>
           <!-- 地图默认位置和级别 -->
          <div class="button"  @click="btnClick('默认位置')">
            <a title="默认位置"><mapFont name="iconhome"></mapFont></a>
          </div>
           <!-- 图层控制（图例） -->
          <div class="button"  @click="btnClick('图例')">
              <a title="图例"><mapFont name="iconcaidan"></mapFont></a>
          </div>
        </div>
    </div>
</template>

<script>

import EventConst,{AMEvent} from '@/config/EventConst';
let extentList = [];
let count = 0;
export default {
    name:'mapTooles',
    props: {
        //图例默认宽度
        lendwidth: {
            type: Number,
            default: 400
        },
        //图例默认高度
        lendheight: {
            type: Number,
            default: 400
        },
        //图例label默认宽度
        labelwidth:{
            type: Number,
            default: 45
        },
        //图例窗口默认是否打开
        lendWin:{
            type: Boolean,
            default: true
        }
    },
    data(){
        return {
            amEvent:{},
            mapinit:false,
            lendWinVis:this.lendWin,
            baseMapList:['底图','标注','遮罩'],
            layerMapList:['水库','市属二级河道','街道面'],
            stationsMapList:['雨量站','水位站','下穿通道'],
            defaultSetting:{}
        };
    },
    computed:{
        mapToolesWrapStyle(){
            return {
                left:'auto',
                right:'20px',
                top:'auto',
                bottom:'120px'
            };
        }
    },
    methods:{
        init(){
            this.mapinit = true;
            this.defaultSetting = this.amEvent.getDefaultSetting();
            if (this.defaultSetting.baseMap.visibility){
                //baseMap
            }
            dojo.connect(this.amEvent.getMap(), 'onExtentChange', this.showExtent);
        },
        showExtent(extent){
            extentList.push(
                {
                    'xmin':extent.xmin,
                    'ymin':extent.ymin,
                    'xmax':extent.xmax,
                    'ymax':extent.ymax,
                    'spatialReference': this.amEvent.getMap().spatialReference
                }
            );
            extentList = extentList.slice(-2);
        },
        btnClick(value){
            // eslint-disable-next-line new-cap
            let navToolbar = new this.$ammap.GIS.navigation(this.amEvent.getMap());
            // eslint-disable-next-line default-case
            switch (value){
            case '漫游':
                navToolbar.deactivate();
                break;
            case '上一视图':
                if (count >= 0 && count < extentList.length - 1){
                    let startExtent = new esri.geometry.Extent(extentList[count]);
                    this.amEvent.getMap().setExtent(startExtent);
                    count++;
                    if (count >= extentList.length - 1){
                        count = extentList.length - 1;
                    }
                }
                break;
            case '下一视图':
                console.log(count);
                if (count > 0 && count <= extentList.length - 1){
                    let startExtent = new esri.geometry.Extent(extentList[count - 1]);
                    this.amEvent.getMap().setExtent(startExtent);
                    count++;
                    if (count >= extentList.length - 1){
                        count = 0;
                    }
                }
                break;
            case '默认位置':
                this.amEvent.getMap().centerAndZoom(new this.$ammap.GIS.Point(this.amEvent.getDefaultSetting().x,this.amEvent.getDefaultSetting().y),
                    this.amEvent.getDefaultSetting().level);
                break;
            case '图例':
                this.lendWinVis = !this.lendWinVis;
                break;
            case '清空数据':
                this.amEvent.getMap().infoWindow.closeAll();
                this.amEvent.getMapLayers()['tempLayer'].layer.clear();

                break;


            }
        },
        baseMapListChange(values){
            console.log(values);
        }
    },
    mounted(){
        this.amEvent = new AMEvent(this);
        this.amEvent.on(EventConst.MAP_INIT_EVENT,this.init);
        // this.$ammap.$on(EventConst.MAP_INIT_EVENT,);


    }
};
</script>

<style scoped lang = "scss">

    .mapToolesWrap{
        position: absolute;
        top:20px;
        left:40px;
        z-index: 20;
        .btnBox{
          .button{
            text-align: center;
            border: 1px solid #57585A;
            border-radius: 5px;
            width: 30px;
            height: 30px;
            font-size: 24px;
            line-height: 25px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            cursor: pointer;
            background: #fff;
            margin:2px 0;
          }
        }
    }
    .lendWin{
      height:auto;
      width:auto;
      overflow: hidden;
      border:1px solid #333;
      position: absolute;
      bottom:0px;
      right:40px;
      z-index: 20;
      background: rgba(255,255,255,0.8);
      border-radius: 4px;
      padding:4px 10px;
      box-shadow: 2px 1px 1px #ccc;
      font-size: 12px;
      font-weight: 400;
      .title{
        font-size: 16px;
        text-align: center;
      }
      .sub-title{
        font-size: 12px;
        font-weight: 900;
      }
      .line{
        margin:6px 0;
      }
      .closeBtn{
          position: absolute;
          top:8px;
          right:8px;
          cursor: pointer;
      }

    }
</style>
