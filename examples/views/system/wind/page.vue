<template>
  <div class="page-index">
      <ArcgisMap ref="ArcgisMap" :config="defaultSetting">
          <mapWin></mapWin>
      </ArcgisMap>
  </div>
</template>

<script>
import { mapState,mapActions } from 'vuex';
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
        ...mapState('gray', [
            'text','count'
        ])
    },
    methods:{
        ...mapActions('gray', [
            'gogoshow',
            'increment'
        ])

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