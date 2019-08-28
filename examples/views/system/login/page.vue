<template>
  <div class="page-login">


      <div class="right">

          <el-carousel :interval="4000" style="height:100%;">
             <el-carousel-item v-for="(item,index) in 5" :key="item">
               <div class="imageItem" style="height:100%;width:100%;" :style="{'backgroundImage': 'url('+bg[index]+')'}">
               </div>
             </el-carousel-item>
           </el-carousel>

           <div class="left-title">
               <h1 class="top-title" style="">
                   农业节水监测和地下水管理系统
               </h1>
               <div class="sub-title" style="">
                   NONGYEJIESHUIJIANCEHEDIXIASHUIGUANLIXITONG</div>
           </div>
      </div>

      <div class="left">
          <div class="header">
            <div>
                <h1 style="font-size:26px;text-align: center;margin:0;">
                    农业节水监测和地下水管理系统
                </h1>
                <div style="font-size:12px;text-align:center;colro:#676767;">
                    NONGYEJIESHUIJIANCEHEDIXIASHUIGUANLIXITONG</div>
            </div>
          </div>
          <div class="form">
              <el-form ref="loginForm" label-position="top" :rules="rules" :model="formLogin" size="default">
                <el-form-item prop="username">
                  <el-input class="animation a3" type="text" v-model="formLogin.username" placeholder="请输入用户名"/>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input class="animation a4" type="password" v-model="formLogin.password" placeholder="请输入密码"/>
                </el-form-item>
              </el-form>
              <button style="outline:none;" class="animation a6" @click="submit">登录</button>
          </div>
        </div>

  </div>
</template>

<script>
    import dayjs from 'dayjs'
    import { mapActions } from 'vuex'
    export default {
      data () {
        return {
            bg: [
                require('./image/photo1.jpg'),
                require('./image/photo2.jpg'),
                require('./image/photo3.jpg'),
                require('./image/photo4.jpg'),
                require('./image/photo5.jpg'),
            ],
          timeInterval: null,
          time: dayjs().format('HH:mm:ss'),
          // 快速选择用户
          dialogVisible: false,
          // 表单
          formLogin: {
            username: '',
            password: ''
          },
          // 校验
          rules: {
            username: [
              { required: true, message: '请输入用户名', trigger: 'blur' }
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' }
            ]
          }
        }
      },
      mounted () {
        this.timeInterval = setInterval(() => {
          this.refreshTime()
        }, 1000)
      },
      beforeDestroy () {
        clearInterval(this.timeInterval)
      },
      methods: {
        ...mapActions('d2admin/account', [
          'login'
        ]),
        refreshTime () {
          this.time = dayjs().format('HH:mm:ss')
        },
        /**
         * @description 接收选择一个用户快速登录的事件
         * @param {Object} user 用户信息
         */
        handleUserBtnClick (user) {
          this.formLogin.username = user.username
          this.formLogin.password = user.password
          this.submit()
        },
        /**
         * @description 提交表单
         */
        // 提交登录信息
        submit () {
          this.$refs.loginForm.validate((valid) => {
            if (valid) {
              // 登录
              // 注意 这里的演示没有传验证码
              // 具体需要传递的数据请自行修改代码
              this.login({
                username: this.formLogin.username,
                password: this.formLogin.password
              })
                .then(() => {
                  // 重定向对象不存在则返回顶层路径
                  this.$router.replace(this.$route.query.redirect || '/index')
                })
            } else {
              // 登录表单校验失败
              this.$message.error('表单校验失败')
            }
          })
        }
      }
    }
</script>

<style lang="scss">
    .el-carousel__container{
        height:100%;
    }
    .page-login {
        display: flex;
        height: 100vh;

    .container {
      display: flex;
      height: 100vh;
    }

    .left {
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      justify-content: center;
      -webkit-animation-name: left;
              animation-name: left;
      -webkit-animation-duration: 1s;
              animation-duration: 1s;
      -webkit-animation-fill-mode: both;
              animation-fill-mode: both;
      -webkit-animation-delay: 1s;
              animation-delay: 1s;
    }

    .right {
      flex: 1;
      background-color: black;
      transition: 1s;
      position: relative;
    }
    .imageItem{
        flex: 1;
        background-color: black;
        transition: 1s;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }

    .header{
        margin-bottom:80px;
    }

    .el-input__inner{
        height: 50px;
        padding: 0 26px;
        border-radius: 25px;
    }
    .el-form-item__error{
        left:20px!important;
    }

    .form {
      max-width: 80%;
      display: flex;
      flex-direction: column;
      margin:0 auto;
      width: 100%;
    }

    .form > p {
      text-align: right;
    }

    .form > p > a {
      color: #000;
      font-size: 14px;
    }

    .form > button {
      text-align: center;
      line-height:50px;
      border: 0;
      background: #326add;
      border-radius: 25px;
      height: 50px;
      color: #fff;
      letter-spacing: 10px;
      font-family: 'Rubik', sans-serif;
      cursor:pointer;
      font-size: 16px;
    }

    .animation {
      -webkit-animation-name: move;
              animation-name: move;
      -webkit-animation-duration: .4s;
              animation-duration: .4s;
      -webkit-animation-fill-mode: both;
              animation-fill-mode: both;
      -webkit-animation-delay: 2s;
              animation-delay: 2s;
    }

    .a1 {
      -webkit-animation-delay: 2s;
              animation-delay: 2s;
    }

    .a2 {
      -webkit-animation-delay: 2.1s;
              animation-delay: 2.1s;
    }

    .a3 {
      -webkit-animation-delay: 2.2s;
              animation-delay: 2.2s;
    }

    .a4 {
      -webkit-animation-delay: 2.3s;
              animation-delay: 2.3s;
    }

    .a5 {
      -webkit-animation-delay: 2.4s;
              animation-delay: 2.4s;
    }

    .a6 {
      -webkit-animation-delay: 2.5s;
              animation-delay: 2.5s;
    }
    .left-title{
        left:50%;top:50%;margin:0 auto;
        margin-left:-180px;
        margin-top:-155px;
        z-index:9999;position:absolute;color:#fff;
        -webkit-animation-name: moveToTight;
                animation-name: moveToTight;
        -webkit-animation-duration: 1s;
                animation-duration: 1s;
        -webkit-animation-fill-mode: both;
                animation-fill-mode: both;
        -webkit-animation-delay: 1s;
                animation-delay: 1s;
                .top-title{
                    font-size:30px;text-align: center;margin:0;
                }
                .sub-title{
                    font-size:12px;text-align:center;colro:#676767;
                }
    }

    @-webkit-keyframes moveToTight {
      0% {
        opacity: 1;
        visibility: visible;
        -webkit-transform: translateX(0);
                transform: translateX(0);
      }
      100% {
        opacity: 0;
        visibility: hidden;
        -webkit-transform: translateX(500px);
                transform: translateX(500px);
      }
    }
    @keyframes moveToTight {
      0% {
        opacity: 1;
        visibility: visible;
        -webkit-transform: translateX(0);
                transform: translateX(0);
      }
      100% {
        opacity: 0;
        visibility: hidden;
        -webkit-transform: translateX(500px);
                transform: translateX(500px);
      }
    }

    @-webkit-keyframes move {
      0% {
        opacity: 0;
        visibility: hidden;
        -webkit-transform: translateY(-40px);
                transform: translateY(-40px);
      }
      100% {
        opacity: 1;
        visibility: visible;
        -webkit-transform: translateY(0);
                transform: translateY(0);
      }
    }
    @keyframes move {
      0% {
        opacity: 0;
        visibility: hidden;
        -webkit-transform: translateY(-40px);
                transform: translateY(-40px);
      }
      100% {
        opacity: 1;
        visibility: visible;
        -webkit-transform: translateY(0);
                transform: translateY(0);
      }
    }

    @-webkit-keyframes left {
      0% {
        opacity: 0;
        width: 0;
      }
      100% {
        opacity: 1;
        padding: 20px 40px;
        width: 440px;
      }
    }
    @keyframes left {
      0% {
        opacity: 0;
        width: 0;
      }
      100% {
        opacity: 1;
        padding: 20px 40px;
        width: 440px;
      }
    }
}
</style>
