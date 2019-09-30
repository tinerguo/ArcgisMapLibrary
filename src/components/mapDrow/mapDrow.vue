<template>
    <div class="mapDrowWrap" >
      <div class="inner-wrap">

        <el-select v-model="drowType" placeholder="请选择绘制类型"  size="mini">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="colorWrap">
        <el-tooltip class="item" effect="dark" content="背景颜色" placement="bottom">
          <el-color-picker size="mini" v-model="backcolor" show-alpha></el-color-picker>
        </el-tooltip>
      </div>
      <div class="colorWrap">
        <el-tooltip class="item" effect="dark" content="边界颜色" placement="bottom">
          <el-color-picker size="mini" v-model="linecolor" show-alpha></el-color-picker>
        </el-tooltip>
      </div>
      <div class="mumWrap">
        <el-tooltip class="item" effect="dark" content="边界宽度" placement="bottom">
          <el-input-number style="width:100px;" size="mini" v-model="layerLineWidth" :min="1" :max="10" label="描述文字"></el-input-number>
        </el-tooltip>
      </div>
      <div style="padding-left:10px;">
        <div class="btn" @click="drowMap">开始绘制</div>
        <div style="float:right;margin-right:10px;">
        <div class="btn" @click="drowMapsave">保存</div>
        <div class="btn" @click="clearMap">清空</div>
        </div>
      </div>


     <el-dialog
      title="图层名称"
      :visible.sync="mapSavedialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%">
      <i>提示：图层将被保存到右侧代码编辑器中.</i>
      <div style="height:20px;"></div>
        <el-input v-model="mapLayersName" placeholder="请输入内容"></el-input>
        <div style="height:20px;"></div>
        <el-button @click="saveMapLayersName" style="float:right;margin-right:20px;" size="small" type="primary">确定</el-button>
        <div style="clear:both;"></div>
    </el-dialog>


     <el-dialog
      title=""
      :visible.sync="PolygonSaveVisible"
      :modal="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="20%">
      <span>请为图层设置一个名称</span>
      <div style="height:20px;"></div>
        <el-input v-model="PolygonName" placeholder="请输入内容"></el-input>
        <div style="height:20px;"></div>
        <el-button @click="savePolygonName" style="float:right;margin-right:20px;" size="small" type="primary">确定</el-button>
        <div style="clear:both;"></div>
    </el-dialog>

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
            layerLineWidth:2,
            linecolor: 'rgba(0, 0, 0,1)',
            backcolor: 'rgba(255, 69, 0, 0.68)',
            drowType:'freehandpolygon',
            mapJSONObj:{
                type:'FeatureCollection',
                features:[]
            },
            mapLayersName:'',
            PolygonName:'',
            PolygonTempObj:{},
            mapSavedialogVisible:false,
            PolygonSaveVisible:false,
            options: [{
                value: 'Multipoint',
                label: '多个点'
            }, {
                value: 'Line',
                label: '直线'
            }, {
                value: 'Polyline',
                label: '多条直线'
            }, {
                value: 'freehandpolygon',
                label: '手绘多边形'
            }, {
                value: 'Triangle',
                label: '三角形'
            }, {
                value: 'Extent',
                label: '长方形'
            }, {
                value: 'Circle',
                label: '圆形'
            }, {
                value: 'Ellipse',
                label: '椭圆'
            }, {
                value: 'Polygon',
                label: '多边形'
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
            this.drawToolbar.activate(this.drowType.toLowerCase());
        },
        drowMapEnd(evt){
            let type = evt.geometry.type;
            let tempLayer = this.mapLayers['tempLayer'].layer;
            let symbol = null;
            //设置面的填充样式
            let polygonsymbol = new esri.symbol.SimpleFillSymbol(
                esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                new esri.symbol.SimpleLineSymbol(
                    esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                    new dojo.Color(this.linecolor), this.layerLineWidth
                ),
                new dojo.Color(this.backcolor)
            );

            let linesymbol = new esri.symbol.SimpleLineSymbol(
                esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                new dojo.Color(this.linecolor), this.layerLineWidth
            );

            let pointsymbol = new this.GIS.SimpleMarkerSymbol(
                esri.symbol.SimpleLineSymbol.STYLE_SOLID,//style
                18,//size
                new this.GIS.SimpleLineSymbol(//outline
                    esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                    new dojo.Color(this.linecolor),
                    this.layerLineWidth),
                new dojo.Color(this.backcolor));//color


            let geojsonType = '';
            let geojsonCoordinates = {};

            if (type === 'polyline'){
                geojsonType = 'Polygon';
                geojsonCoordinates = evt.geometry.toJson();
                symbol = linesymbol;
            } else if (type === 'polygon'){
                geojsonType = 'Polygon';
                geojsonCoordinates = evt.geometry.toJson().rings;
                symbol = polygonsymbol;
            } else if (type === 'extent'){
                geojsonType = 'Polygon';
                geojsonCoordinates = evt.geometry.toJson();
                symbol = polygonsymbol;
            } else if (type === 'multipoint'){
                geojsonType = 'MultiPoint';
                geojsonCoordinates = [
                    evt.geometry.toJson()
                ];
                symbol = pointsymbol;
            }

            this.PolygonTempObj = {
                type:'Feature',
                properties:{
                    name:'',
                    backcolor:this.backcolor,
                    linecolor:this.linecolor,
                    layerLineWidth:this.layerLineWidth
                },
                geometry:{
                    type:geojsonType,
                    coordinates:geojsonCoordinates
                }
            };


            //关闭绘图工具
            this.drawToolbar.deactivate();
            this.PolygonSaveVisible = true;
            tempLayer.add(new this.GIS.graphic(evt.geometry, symbol));
        },
        clearMap(){
            this.mapJSONObj.features = [];
            let tempLayer = this.mapLayers['tempLayer'].layer;
            tempLayer.clear();
        },
        drowMapsave(){
            if (this.mapJSONObj.features.length <= 0){
                this.$message({
                    showClose: true,
                    message: '亲，地图没有可以保存的图层!',
                    type: 'warning'
                });
                return;
            }
            this.mapSavedialogVisible = true;
        },
        //保存多边形名称
        savePolygonName(){
            this.PolygonSaveVisible = false;
            let name = this.PolygonName;
            this.PolygonTempObj.properties.name = name;
            this.mapJSONObj.features.push(this.PolygonTempObj);
            this.PolygonName = '';
        },
        //保存图层名称
        saveMapLayersName(){
            if (this.mapLayersName === ''){
                this.$message({
                    showClose: true,
                    message: '亲，请为图层起个名字!',
                    type: 'warning'
                });
                return;
            }
            this.mapSavedialogVisible = false;
            let name = this.mapLayersName;
            //派发事件传递给父组件
            this.$emit('saveDrowJSON',Object.assign({},this.mapJSONObj),name);
            this.mapLayersName = '';
        },
        apiDrowGeoJsonPolygon(name,ringsObj,fillColor,lineWidth,lineColor){
            this.clearMap();
            ringsObj['properties'] = {
                name,
                backcolor:fillColor,
                linecolor:lineColor,
                layerLineWidth:lineWidth
            };
            if (ringsObj.type === 'FeatureCollection') {
                this.mapJSONObj.features = this.mapJSONObj.features.concat(ringsObj.features);
            }

            this.amEvent.emit(EventConst.MAP_DROWGEOJSONPOLYGON, {
                mapJSONObj:ringsObj,
                fillColor:fillColor,
                lineWidth:lineWidth,
                lineColor:lineColor
            });
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
    background: rgba(255,255,255,0.8);
    .inner-wrap{
      display: inline-block;
      margin-bottom:10px;
    }
    .btn{
      cursor: pointer;
      padding:3px 6px;
      border-radius: 4px;
      border:1px solid #dcdfe6;
      line-height: 24px;
      color:#636569;
      height: 24px;
      font-size: 12px;
      display: inline-block;
    }
  }
  .colorWrap{
    display: inline-block;
    position: relative;
    top: 10px;
  }
  .mumWrap{
    display: inline-block;
    position: relative;
  }
</style>
