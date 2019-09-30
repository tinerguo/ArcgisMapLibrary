<template>
	<div class="page-layout">

		<div class="header">
      <img style="height:80%" :src="require('../assets/logo.png')" alt="">
			<h1 class="logo">
        <span>地图组件库</span>
        <div class="sub-title">amMap</div>
      </h1>
      <div class="menu">
        <ul>
          <router-link :to="{ name: 'index'}" tag="li">
              <a>地图模板</a>
          </router-link>
          <router-link :to="{ name: 'drowmap'}" tag="li">
            <a>地图绘制</a>
          </router-link>
          <router-link :to="{ name: 'win'}" tag="li">
            <a>地图窗口</a>
          </router-link>
          <router-link :to="{ name: 'stations'}" tag="li">
            <a>测站绘制</a>
          </router-link>
          <li>
            <a style="text-decoration:line-through;">底图校准</a>
          </li>
          <li>
            <a  style="text-decoration:line-through;">地图在线编辑</a>
          </li>
        </ul>
      </div>
		</div>
    <div class="content">
    <keep-alive >
      <router-view />
    </keep-alive>
    </div>
	</div>
</template>

<script>
export default {
    data () {
        return {

        };
    },
    mounted () {

    },
    beforeDestroy () {
    },
    methods: {

    }
};
</script>


<style lang="scss" scoped>
	.header{
		border-bottom:solid 1px #E5EBEE;
    height:62px;
    box-sizing: border-box;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    padding-left:40px;
    .logo{
      font-size: 18px;
      color:#0485a7;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      line-height: 1em;
      width:130px;
      .sub-title{
        font-size: 14px;
        color:#1874a7;
      }
    }
    .menu{
      width: 100%;
      padding-right: 40px;
      ul{
        float: right;
      }
      li,ul{
        list-style: none;
        padding:0;
        margin:0;
      }
      li{
        float: left;
        margin:0 10px;
        cursor: pointer;
        transition: 0.1s all;
        border-bottom:1px solid #fff;
        a{
          display: inline-block;
          color: #4A5560;
          margin-bottom:6px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
        }
        &:hover
        {
          border-bottom:1px solid #666666;
        }
      }
      li.active{
        border-bottom:1px solid #333;
      }

    }
  }
  .page-layout{
    height:100%;
    width:100%;
    position: absolute;
  }
  .content{
    position: absolute;
    top:62px;
    bottom:0px;
    width:100%;
  }
</style>
