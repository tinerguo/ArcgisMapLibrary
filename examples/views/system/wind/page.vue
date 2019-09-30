<template>
  <div class="page-index">
      <ArcgisMap ref="ArcgisMap" :config="defaultSetting">
          <mapWin title="底部窗口测试" :isopen=true position='bottom-right' :right="180">


          </mapWin>
          <mapWin title="图例" position='bottom-right' :right="310"></mapWin>

          <mapWin :width="200" :height="400" position='left-bottom' :bottom='0'></mapWin>
          <mapWin title="左侧窗口测试" :width="200" :height="400" position='left-bottom' :bottom='111'></mapWin>
          <mapWin :width="200" :height="400" position='left-bottom' :bottom='198'></mapWin>
          <mapWin :isopen=true  :width="200" :height="400"  position='right'></mapWin>


      </ArcgisMap>
  </div>
</template>

<script>
import {defaultSetting} from './config/mapSetting.js';
export default {
    data () {
        return {
            defaultSetting:defaultSetting
        };
    },
    components: {
    },
    computed:{
    },
    methods:{

    },
    mounted () {
        this.editorHeight = document.documentElement.clientHeight - 134;
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

</style>