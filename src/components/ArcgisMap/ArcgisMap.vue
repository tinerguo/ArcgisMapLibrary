<template>
    <div ref="mapDiv" class = "map " >
      <slot ></slot>
      <!-- <div style="position:absolute;height:200px;width:400px;right:40px;top:40px;z-index:100;">
        <div class="btn" @click="test1">测试1</div>
        <div class="btn" @click="test2">测试2</div>
        <div class="btn" @click="test3">测试3</div>
      </div> -->
    </div>
</template>

<script>
import initArcgis from './js/arcgis_map';
export default initArcgis;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang = "less">
    .map {
        left:0;
        right:0;
        position: absolute;
        top:0;
        bottom:0;
        background: #001e26;
    }
    .btn{
      padding:4px 10px;
    }
</style>
