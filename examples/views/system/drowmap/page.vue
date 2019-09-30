<template>
  <div class="page-index">

    <!-- 左侧窗口-->
    <div class="leftContent">
      <ArcgisMap :config="defaultSetting">
        <!-- 底图切换组件-->
        <mapSwitch></mapSwitch>
        <mapDrow  ref="mapDrow" @saveDrowJSON="saveDrowJSON"></mapDrow>
      </ArcgisMap>
    </div>

    <!-- 右侧窗口-->
    <div class="rightContent">
         <!-- 标题 -->
        <div class="title">
          <span>代码编辑器</span>
          <a class="datav" @click="showDataVWin"><mapFont name="iconyou-shuang"></mapFont>中国边界</a>
        </div>

        <!-- 图层选择区域 -->
        <div class="toolsWrap">
          <div class="selectWrap">
            <el-select size="mini" v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
            <a @click="deleteSelectBoxJSON"><mapFont name="iconshanchu"></mapFont></a>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="绘制" placement="bottom">
            <a @click="selectBoxDrowMap" ><mapFont name="iconhuizhi"></mapFont></a>
          </el-tooltip>
        </div>

        <!-- 代码绘制区域 -->
        <div class="toolsWrap">
          <div class="colorWrap">
            <el-tooltip class="item" effect="dark" content="背景颜色" placement="bottom">
              <el-color-picker size="mini" v-model="backColor" show-alpha></el-color-picker>
            </el-tooltip>
          </div>
          <div class="colorWrap">
            <el-tooltip class="item" effect="dark" content="边界颜色" placement="bottom">
              <el-color-picker size="mini" v-model="lineColor" show-alpha></el-color-picker>
            </el-tooltip>
          </div>
          <div class="mumWrap">
            <el-tooltip class="item" effect="dark" content="边界宽度" placement="bottom">
              <el-input-number style="width:100px;" size="mini" v-model="lineWidth" :min="1" :max="10" label="描述文字"></el-input-number>
            </el-tooltip>
          </div>
          <div class="mumWrap" style="top:-8px;">
            <el-tooltip class="item" effect="dark" content="绘制" placement="bottom">
              <a @click="codeEditorDrowMap"><mapFont name="iconhuizhi"></mapFont></a>
            </el-tooltip>
          </div>
          <div class="mumWrap" style="top:-8px;">
            <el-tooltip class="item" effect="dark" content="保存" placement="bottom">
              <a @click="openSaveCodeWin"><mapFont name="iconbaocun"></mapFont></a>
            </el-tooltip>
          </div>
          <div class="mumWrap" style="top:-8px;">
            <el-tooltip class="item" effect="dark" content="格式化" placement="bottom">
              <a @click="codeFormat"><mapFont name="iconJSONgeshihua"></mapFont></a>
            </el-tooltip>
          </div>

        </div>
        <!-- 代码编辑器 -->
        <editor ref='geoJSONEditor' v-model="content" @init="editorInit"
        lang="json" theme="chrome" width="500" :height="editorHeight"></editor>
    </div>
    <!-- 阿里中国边界线 -->
    <el-dialog :visible.sync="dialogDatavVisible" :fullscreen="true">
      <iframe frameborder="0" name="Iframe1" src="http://datav.aliyun.com/tools/atlas/" width="100%" height="600"></iframe>
    </el-dialog>

    <el-dialog
      title="图层名称"
      :visible.sync="CodeSavedialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%">
      <div style="height:20px;"></div>
        <el-input v-model="mapLayersName" placeholder="请输入内容"></el-input>
        <div style="height:20px;"></div>
        <el-button @click="saveJSONData" style="float:right;margin-right:20px;" size="small" type="primary">确定</el-button>
        <div style="clear:both;"></div>
    </el-dialog>


  </div>
</template>

<script>
import { mapState,mapActions } from 'vuex';
import {defaultSetting} from './config/mapSetting.js';
import {bj,zz,xx,ga} from './config/GeoJSON.js';
export default {
    data () {
        return {
            defaultSetting:defaultSetting,
            content:'',
            editorHeight:400,
            dialogDatavVisible:false,
            backColor: 'rgba(255, 69, 0, 0.68)',
            lineWidth: 2,
            lineColor: 'rgba(0, 0, 0, 1)',
            GeoJSONObj:{
                bj:bj,
                zz:zz,
                xx:xx,
                ga:ga
            },
            options: [{
                value: 'bj',
                label: '北京'
            }, {
                value: 'zz',
                label: '涿州'
            }, {
                value: 'xx',
                label: '雄县'
            }, {
                value: 'ga',
                label: '固安'
            }],
            value: '',
            num:0,
            CodeSavedialogVisible:false,
            mapLayersName:''
        };
    },
    components: {
        'editor':require('vue2-ace-editor')
    },
    computed:{
        ...mapState('gray', [
            'text','count'
        ])
    },
    methods:{
        ...mapActions('gray', [
            'gogoshow',
            'increment'
        ]),
        editorInit: function () {
            require('brace/mode/json');
            require('brace/theme/chrome');
            require('brace/snippets/json'); //snippet
        },
        //显示终边边界窗口
        showDataVWin(){
            this.dialogDatavVisible = true;
        },
        //删除下拉列表项目
        deleteSelectBoxJSON(){
            if (this.value === 'bj' ||
            this.value === 'zz' ||
            this.value === 'xx' ||
            this.value === 'ga'){
                this.$message({
                    showClose: true,
                    message: '亲，系统图层不可以删除!',
                    type: 'warning'
                });
                return;
            }
            this.options = this.options.filter(item => item.value !== this.value);
            this.value = this.options[this.options.length -1].value;
            this.$refs['mapDrow'].clearMap();

            this.selectBoxDrowMap();
        },
        //下拉列表地图绘制
        selectBoxDrowMap(){
          debugger;
            let tempObj = this.GeoJSONObj[this.value];


            let obj = this.options.find((item)=>{
                return item.value === this.value;
            });


            this.content = JSON.stringify(tempObj,null,4);
            this.$refs['mapDrow'].apiDrowGeoJsonPolygon(
                obj.label,
                tempObj,
                tempObj.properties && tempObj.properties.backcolor || this.backColor,
                tempObj.properties && tempObj.properties.layerLineWidth || this.lineWidth,
                tempObj.properties && tempObj.properties.linecolor || this.lineColor
            );
        },
        //保存数据
        saveDrowJSON(data,name){
            let rom = Math.random();
            this.options.push({
                value:name+rom,
                label:name
            });
            this.value = name+rom;
            console.log(data);
            this.GeoJSONObj[name+rom] = data;
            this.$notify({
                title: '成功',
                message: '保存成功!',
                type: 'success'
            });
            this.content = JSON.stringify(data,null,4);
        },
        //保存json数据
        saveJSONData(){
            if (this.mapLayersName === ''){
                this.$message({
                    showClose: true,
                    message: '亲，请为图层起个名字!',
                    type: 'warning'
                });
                return;
            }
            if (this.content === ''){
                this.$message({
                    showClose: true,
                    message: '警告，请完善geoJson!',
                    type: 'warning'
                });
                return;
            }
            let tempObj = {};
            try {
                tempObj = JSON.parse(this.content);
            } catch (e){
                this.$message({
                    showClose: true,
                    message: '警告,代码转换对象失败!',
                    type: 'warning'
                });
                return;
            }
            let name = this.mapLayersName;
            let rom = Math.random();
            this.options.push({
                value:name+rom,
                label:name
            });
            this.value = name+rom;
            this.GeoJSONObj[name+rom] = tempObj;
            this.CodeSavedialogVisible = false;
            this.$notify({
                title: '成功',
                message: '保存成功!',
                type: 'success'
            });
        },
        openSaveCodeWin(){

            this.CodeSavedialogVisible = true;
        },
        //代码格式化
        codeFormat(){
            try {
                this.content = JSON.stringify(JSON.parse(this.content),null,4);
            } catch (e){
                this.$message({
                    showClose: true,
                    message: '警告，格式化失败!',
                    type: 'warning'
                });
            }
        },
        //代码绘制
        codeEditorDrowMap(){
            if (this.content === ''){
                this.$message({
                    showClose: true,
                    message: '警告，请完善geoJson!',
                    type: 'warning'
                });
                return;
            }
            let tempObj = {};
            try {
                tempObj = JSON.parse(this.content);
            } catch (e){
                this.$message({
                    showClose: true,
                    message: '警告,代码转换对象失败!',
                    type: 'warning'
                });
                return;
            }

            this.$refs['mapDrow'].apiDrowGeoJsonPolygon(
                '',
                tempObj,
                tempObj.properties && tempObj.properties.backcolor || this.backColor,
                tempObj.properties && tempObj.properties.layerLineWidth || this.lineWidth,
                tempObj.properties && tempObj.properties.linecolor || this.lineColor
            );


        }

    },
    mounted () {
        this.editorHeight = document.documentElement.clientHeight - 194;

    },
    beforeDestroy () {
    }
};
</script>

<style  lang="scss" scoped>
  .page-index {
    display: flex;
    flex-flow: row nowrap;
    height:100%;
    width:100%;
    box-sizing: border-box;

  }

  .leftContent{
    height:100%;
    border-right:1px solid #999999;
    box-sizing: border-box;
    position: relative;
    flex-grow: 1;
  }
  .rightContent{
    height:100%;
    position: relative;
    width:500px;
    .title{
      height:30px;
      line-height: 30px;
      text-align: center;
      font-weight: 900;
      border-bottom:1px solid #eee;
    }
    .toolsWrap{
      border-bottom:1px solid #eee;
      padding:2px 0;
      height: 50px;
      padding:10px;
      vertical-align: baseline;
      box-sizing: border-box;
      font-size: 12px;
      a{
        padding: 0px 6px;
        cursor: pointer;
        display: inline-block;
      }
      .iconfont{
        color:#65666a;
        border:1px solid #e6e6e6;
        border-radius: 2px;
        font-size: 14px;
        border-radius: 4px;
        padding:4px;
      }
    }
    .datav{
      position:absolute;right:10px;margin-right:10px;font-weight:200;cursor: pointer;
      font-size: 12px;
      color:#777;
      .iconfont{
        font-size: 12px;
        color:#777;
      }
    }
  }

  .popupwin{
     padding:0px;
    table{
      width:100%;
      border-collapse: collapse;
      th{
        background: #f5f5f5;
        border:1px solid #333;
        text-align: center;
        font-weight: 300;
        font-size: 12px;
      }
      td{
        text-align: center;
        border:1px solid #333;
        font-weight: 300;
        font-size: 12px;
      }
    }
  }

  .colorWrap{
    position: relative;
    display: inline-block;
    top:0px;
  }
  .selectWrap{
    position: relative;
    display: inline-block;
    top:-2px;
  }
 .mumWrap{
    position: relative;
    display: inline-block;
    top:-10px;
  }
</style>