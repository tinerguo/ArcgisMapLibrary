<template>
    <div class="mapWin" ref="mapWin" :style="getMapWinStyle" >
      <div class="titleBar" @click="switchWinState" :style="getMapWinTitleStyle" :class="getMapWinTitleClass">
        {{title}}
      </div>
      <div ref="content" :style="getContentStyle" class="content" style="border:1px solid #f5f5f5;overflow:hidden;">
         <ul>
           <li>
            <slot></slot>
           </li>
         </ul>
      </div>
    </div>
</template>

<script>
import {AMEvent} from '@/config/EventConst';
import BScroll from 'better-scroll';
export default {
    name:'cooding',
    props: {
        title: {
            type: String,
            default: '水情信息'
        },
        height:{
            type: Number,
            default: 300
        },
        width:{
            type: Number,
            default: 600
        },
        left:{
            type: Number,
            default: 0
        },
        right:{
            type: Number,
            default: 0
        },
        top:{
            type: Number,
            default: 0
        },
        bottom:{
            type: Number,
            default: 0
        },
        position:{
            type: String,
            default: 'left'
        },
        isopen:{
            type: Boolean,
            default: false
        }
    },
    computed: {
        getContentStyle(){
            let tempStyleObj = {};

            if (this.position === 'bottom' ||
                    this.position === 'bottom-center' ||
                    this.position === 'bottom-left' ||
                    this.position === 'bottom-right'){
                tempStyleObj.height = this.height-16 + 'px';
            } else if (this.position === 'left' ||
                    this.position === 'left-center' ||
                    this.position === 'left-top' ||
                    this.position === 'left-bottom' ||
                    this.position === 'right' ||
                    this.position === 'right-center' ||
                    this.position === 'right-top' ||
                    this.position === 'right-bottom'){
                tempStyleObj.height = this.height-16 + 'px';
            }

            this.scrollInit();

            return tempStyleObj;
        },
        getMapWinStyle(){
            let tempStyleObj = {};
            tempStyleObj['width'] = this.width+'px';
            tempStyleObj['height'] = this.height+'px';
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.bottom = this.bottom || 0;
            if (this.position === 'bottom' || this.position === 'bottom-center'){

                tempStyleObj['right'] = '0px';
                tempStyleObj['left'] = '0px';
                tempStyleObj['margin'] ='0 auto';
                tempStyleObj['border-top-left-radius'] ='4px';
                tempStyleObj['border-top-right-radius'] ='4px';

                if (this.isopen){
                    tempStyleObj['bottom'] = this.bottom+'px';
                    tempStyleObj['z-index'] = '21';
                } else {
                    tempStyleObj['bottom'] = -this.height+this.bottom+'px';
                }
            } else if (this.position === 'bottom-left'){
                tempStyleObj['left'] = this.left+'px';
                tempStyleObj['border-top-left-radius'] ='4px';
                tempStyleObj['border-top-right-radius'] ='4px';
                if (this.isopen){
                    tempStyleObj['bottom'] = this.bottom+'px';
                } else {
                    tempStyleObj['bottom'] = -this.height+this.bottom+'px';
                }
            } else if (this.position === 'bottom-right'){
                tempStyleObj['right'] = this.right+'px';
                tempStyleObj['border-top-left-radius'] ='4px';
                tempStyleObj['border-top-right-radius'] ='4px';
                if (this.isopen){
                    tempStyleObj['bottom'] = this.bottom+'px';
                    tempStyleObj['z-index'] = '21';
                } else {
                    tempStyleObj['bottom'] = -this.height+this.bottom+'px';
                }
            } else if (this.position === 'left' || this.position === 'left-center'){
                tempStyleObj['left'] = this.left+'px';
                tempStyleObj['margin-top'] = -this.height/2+'px';
                tempStyleObj['top'] = '50%';
                tempStyleObj['border-top-right-radius'] ='4px';
                tempStyleObj['border-bottom-right-radius'] ='4px';
                if (this.isopen){
                    tempStyleObj['left'] = this.left+'px';
                    tempStyleObj['z-index'] = '21';
                } else {
                    tempStyleObj['left'] = -this.width+this.left+'px';
                }
            } else if (this.position === 'left-top'){
                tempStyleObj['left'] = this.left+'px';
                tempStyleObj['top'] = this.top+'px';
                tempStyleObj['border-top-right-radius'] ='4px';
                tempStyleObj['border-bottom-right-radius'] ='4px';
                if (this.isopen){
                    tempStyleObj['left'] = this.left+'px';
                    tempStyleObj['z-index'] = '21';
                } else {
                    tempStyleObj['left'] = -this.width+this.left+'px';
                }
            } else if (this.position === 'left-bottom'){
                tempStyleObj['left'] = this.left+'px';
                tempStyleObj['bottom'] = this.bottom+'px';
                tempStyleObj['border-top-right-radius'] ='4px';
                tempStyleObj['border-bottom-right-radius'] ='4px';
                if (this.isopen){
                    tempStyleObj['left'] = this.left+'px';
                    tempStyleObj['z-index'] = '21';
                } else {
                    tempStyleObj['left'] = -this.width+this.left+'px';
                }
            } else if (this.position === 'right' || this.position === 'right-center'){
                tempStyleObj['right'] = this.right+'px';
                tempStyleObj['margin-top'] = -this.height/2+'px';
                tempStyleObj['top'] = '50%';
                tempStyleObj['border-top-left-radius'] ='4px';
                tempStyleObj['border-bottom-left-radius'] ='4px';
                if (this.isopen){
                    tempStyleObj['right'] = this.right+'px';
                    tempStyleObj['z-index'] = '21';
                } else {
                    tempStyleObj['right'] = -this.width+this.right+'px';
                }
            } else if (this.position === 'right-top'){
                tempStyleObj['right'] = this.right+'px';
                tempStyleObj['top'] = this.top+'px';
                tempStyleObj['border-top-left-radius'] ='4px';
                tempStyleObj['border-bottom-left-radius'] ='4px';
                if (this.isopen){
                    tempStyleObj['right'] = this.right+'px';
                    tempStyleObj['z-index'] = '21';
                } else {
                    tempStyleObj['right'] = -this.width+this.right+'px';
                }
            } else if (this.position === 'right-bottom'){
                tempStyleObj['right'] = this.right+'px';
                tempStyleObj['bottom'] = this.bottom+'px';
                tempStyleObj['border-top-left-radius'] ='4px';
                tempStyleObj['border-bottom-left-radius'] ='4px';
                if (this.isopen){
                    tempStyleObj['right'] = this.right+'px';
                    tempStyleObj['z-index'] = '21';
                } else {
                    tempStyleObj['right'] = -this.width+this.right+'px';
                }
            }
            return tempStyleObj;
        },
        getMapWinTitleStyle(){
            let tempStyleObj = {};


            if (this.position === 'bottom' ||
                    this.position === 'bottom-center' ||
                    this.position === 'bottom-left' ||
                    this.position === 'bottom-right'){
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
            } else if (this.position === 'left' ||
                    this.position === 'left-center' ||
                    this.position === 'left-top' ||
                    this.position === 'left-bottom'){
                if (this.title.length >0){
                    tempStyleObj['height'] = this.title.length*12 + 36+'px';
                } else {
                    tempStyleObj['height'] = 4*12 + 60+'px';
                }
                tempStyleObj['top'] = '40px';
                tempStyleObj['right'] = '-29px';
                tempStyleObj['border-top-right-radius'] ='4px';
                tempStyleObj['border-bottom-right-radius'] ='4px';
                tempStyleObj['border-left'] ='none';
            } else if (this.position === 'right' ||
                    this.position === 'right-center' ||
                    this.position === 'right-top' ||
                    this.position === 'right-bottom'){
                if (this.title.length >0){
                    tempStyleObj['height'] = this.title.length*12 + 36+'px';
                } else {
                    tempStyleObj['height'] = 4*12 + 60+'px';
                }
                tempStyleObj['top'] = '40px';
                tempStyleObj['left'] = '-29px';
                tempStyleObj['border-top-left-radius'] ='4px';
                tempStyleObj['border-bottom-left-radius'] ='4px';
                tempStyleObj['border-right'] ='none';
            }
            return tempStyleObj;

        },
        getMapWinTitleClass(){
            let tempStyleObj = {};
            if (this.position === 'left' ||
                    this.position === 'left-center' ||
                    this.position === 'left-top' ||
                    this.position === 'left-bottom' ||
                    this.position === 'right' ||
                    this.position === 'right-center' ||
                    this.position === 'right-top' ||
                    this.position === 'right-bottom'){
                tempStyleObj['bottom'] = true;
            }
            return tempStyleObj;
        }
    },
    data(){
        return {
            BS:null
        };
    },
    methods:{
        switchWinState(){
            if (this.position == 'bottom' ||
                this.position == 'bottom-center' ||
                this.position == 'bottom-left' ||
                this.position == 'bottom-right' ){

                let bottom = this.$refs['mapWin'].style.bottom.replace('px','');
                let positionBottom = this.bottom;
                if (bottom == positionBottom){//关闭
                    this.$refs['mapWin'].style.bottom = -this.height+positionBottom+'px';
                    this.$refs['mapWin'].style['z-index'] = 20;
                } else {//打开
                    this.$refs['mapWin'].style.bottom = positionBottom+'px';
                    this.$refs['mapWin'].style['z-index'] = 21;
                }

            } else if (this.position == 'left' ||
                this.position == 'left-center' ||
                this.position == 'left-top' ||
                this.position == 'left-bottom' ){

                let left = this.$refs['mapWin'].style.left.replace('px','');
                let positionLeft = this.left;
                if (left == positionLeft){//关闭
                    this.$refs['mapWin'].style.left = -this.width+positionLeft+'px';
                    this.$refs['mapWin'].style['z-index'] = 20;
                } else {//打开
                    this.$refs['mapWin'].style.left = positionLeft+'px';
                    this.$refs['mapWin'].style['z-index'] = 21;
                }
            } else if (this.position == 'right' ||
                this.position == 'right-center' ||
                this.position == 'right-top' ||
                this.position == 'right-bottom' ){

                let right = this.$refs['mapWin'].style.right.replace('px','');
                let positionRight = this.right;
                if (right == positionRight){//关闭
                    this.$refs['mapWin'].style.right = -this.width+positionRight+'px';
                    this.$refs['mapWin'].style['z-index'] = 20;
                } else {//打开
                    this.$refs['mapWin'].style.right = positionRight+'px';
                    this.$refs['mapWin'].style['z-index'] = 21;
                }
            }
        },
        scrollInit () {
            this.$nextTick(() => {
                if (!this.BS) {
                    this.BS = new BScroll(this.$refs['content'], {
                        mouseWheel: true,
                        click: true
                    });
                } else {
                    this.BS.refresh();
                }
            });
        },
        scrollDestroy () {
            try {
                this.BS.destroy();
            } catch (e) {
                delete this.BS;
                this.BS = null;
            }
        }
    },
    mounted(){
        // this.scrollInit();
        this.amEvent = new AMEvent(this);
        window.test = this;
    }
};
</script>

<style scoped lang = "scss">
  .mapWin{
    position: absolute;
    height:400px;
    width:500px;
    z-index: 20;
    background: #fff;
    border:1px solid #333;
    box-sizing: border-box;
    padding:6px;
    font-size: 12px;
    transition: all 1s;
    -moz-transition: all 1s; /* Firefox 4 */
    -webkit-transition: all 1s; /* Safari 和 Chrome */
    -o-transition: all 1s; /* Opera */
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
      width: 0;
      margin: 0 auto;
      padding: 8px;
      padding-right: 20px;
    }
  }
</style>
