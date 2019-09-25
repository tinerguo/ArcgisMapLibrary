<template>
  <div class="mapWin" :style="getMapWinStyle" >
    <div class="titleBar" :style="getMapWinTitleStyle" :class="getMapWinTitleClass">
      {{title}}
    </div>
    <div class="content">

    </div>
  </div>
</template>

<script>
import {AMEvent} from '@/config/EventConst';

export default {
    name:'cooding',
    props: {
        title: {
            type: String,
            default: '水情信息'
        },
        height:{
            type: Number,
            default: 500
        },
        width:{
            type: Number,
            default: 400
        },
        position:{
            type: Object,
            default: ()=>{
                return {
                    style:'left',//bottom bottom-center  bottom-left bottom-right
                    left:20,
                    top:0,
                    bottom:30,
                    right:0
                };
            }
        }
    },
    computed: {
        getMapWinStyle(){
            let tempStyleObj = {};
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.position.bottom = this.position.bottom || 0;
            if (this.position.style === 'bottom' || this.position.style === 'bottom-center'){
                tempStyleObj['bottom'] = this.position.bottom+'px';
                tempStyleObj['right'] = '0px';
                tempStyleObj['left'] = '0px';
                tempStyleObj['margin'] ='0 auto';
                tempStyleObj['border-top-left-radius'] ='4px';
                tempStyleObj['border-top-right-radius'] ='4px';
            } else if (this.position.style === 'bottom-left'){
                tempStyleObj['bottom'] = this.position.bottom+'px';
                tempStyleObj['left'] = this.position.left+'px';
                tempStyleObj['border-top-left-radius'] ='4px';
                tempStyleObj['border-top-right-radius'] ='4px';
            } else if (this.position.style === 'bottom-right'){
                tempStyleObj['bottom'] = this.position.bottom+'px';
                tempStyleObj['right'] = this.position.right+'px';
                tempStyleObj['border-top-left-radius'] ='4px';
                tempStyleObj['border-top-right-radius'] ='4px';
            } else if (this.position.style === 'left' || this.position.style === 'left-center'){
                tempStyleObj['left'] = this.position.left+'px';
                tempStyleObj['margin-top'] = -this.height/2+'px';
                tempStyleObj['top'] = '50%';
                tempStyleObj['border-top-right-radius'] ='4px';
                tempStyleObj['border-bottom-right-radius'] ='4px';
            }
            return tempStyleObj;

        },
        getMapWinTitleStyle(){
            let tempStyleObj = {};


            if (this.position.style === 'bottom' ||
                  this.position.style === 'bottom-center' ||
                  this.position.style === 'bottom-left' ||
                  this.position.style === 'bottom-right'){
                if (this.title.length >0){
                    tempStyleObj['width'] = this.title.length*12 + 60+'px';
                    tempStyleObj['height'] = '30px';
                    tempStyleObj['line-height'] = '30px';
                } else {
                    tempStyleObj['width'] = 4*12 + 60+'px';
                    tempStyleObj['height'] = '30px';
                    tempStyleObj['line-height'] = '30px';
                }
                tempStyleObj['left'] = '0px';
                tempStyleObj['right'] = '0px';
                tempStyleObj['margin'] ='0 auto';
                tempStyleObj['border-top-left-radius'] ='4px';
                tempStyleObj['border-top-right-radius'] ='4px';
                tempStyleObj['top'] ='-30px';
                tempStyleObj['border-bottom'] ='none';
            } else if (this.position.style === 'left' ||
                  this.position.style === 'left-center' ||
                  this.position.style === 'left-left' ||
                  this.position.style === 'left-right'){
                if (this.title.length >0){
                    tempStyleObj['height'] = this.title.length*12 + 60+'px';
                    // tempStyleObj['line-height'] = this.title.length*12 + 60+'px';
                    // tempStyleObj['width'] = '50px';
                } else {
                    tempStyleObj['height'] = 4*12 + 60+'px';
                    // tempStyleObj['line-height'] = this.title.length*12 + 60+'px';
                    // tempStyleObj['width'] = '50px';
                }
                tempStyleObj['top'] = '40px';
                // tempStyleObj['margin-top'] = -(this.title.length*12 + 60)/3*2+'px';
                tempStyleObj['right'] = '-49px';
                tempStyleObj['border-top-righ-radius'] ='4px';
                tempStyleObj['border-top-right-radius'] ='4px';
                tempStyleObj['border-left'] ='none';
            }
            return tempStyleObj;

        },
        getMapWinTitleClass(){
            let tempStyleObj = {};
            if (this.position.style === 'left' ||
                  this.position.style === 'left-center' ||
                  this.position.style === 'left-left' ||
                  this.position.style === 'left-right'){
                tempStyleObj['bottom'] = true;
            }
            return tempStyleObj;
        }
    },
    data(){
        return {

        };
    },
    methods:{
    },
    mounted(){
        this.amEvent = new AMEvent(this);
    }
};
</script>

<style scoped lang = "scss">
  .mapWin{
    position: absolute;
    height:400px;
    width:500px;
    z-index: 21;
    background: #fff;
    border:1px solid #333;
    box-sizing: border-box;
    padding:6px;
    font-size: 12px;
    .titleBar{
      position: absolute;
      height:4em;
      font-size: 14px;
      border:1px solid #333;
      background: #fff;
      text-align: center;
      box-sizing: border-box;
      cursor: pointer;
    }
    .titleBar.bottom{
      line-height: 1.2em;
      width: 25px;
      margin: 0 auto;
      padding: 18px;
      padding-right: 30px;
    }
  }
</style>
