<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
    <div class="title"> 
    今球吧</div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
            <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          ref="code"
          v-model="loginForm.code"
          placeholder="请输入验证码"
        />
      </el-form-item>

            <el-button
        style="width:100%;margin-bottom:30px;"
        @click="VerificationCode"
      >{{ShowTime?'获取验证码':Time}}</el-button>
      <el-button
        :loading="loading"
        type="dqx-btn"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>
    </el-form>
  </div>
</template>

<script>
// import { validUsername } from "@/utils/validate";
import { GetVerification } from '@/api/user'
// import { TimelineItem } from 'element-ui';
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        // 15705929646
        username: "",
        password: "",
        code:'',

      },
      ShowTime:true,
      Time:0,
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: 'validateUsername' }
        ],
        password: [
          { required: true, trigger: "blur", validator: 'validatePassword' }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    VerificationCode(){
      this.ShowTime = false
      
      this.Time = 10
       let timer = setInterval(()=>{
         this.Time = this.Time -1
         this.Time<=0?this.ShowTime = true:''
       },1000)
         this.ShowTime === true ? clearInterval(timer) :''
      GetVerification(this.loginForm.username)
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
   
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.dispatch("user/login", {
            phoneNumber:this.loginForm.username,
            code:this.loginForm.code
          }).then(() => {
              // this.$router.push({ path: this.redirect || "/" });
              this.$router.push({path:'/'})
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!")
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #283443;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
.title{
  text-align:center;
  font-size: 40px;
  margin-bottom: 20px;
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      // color: $light_gray;
      color: #454545;
      height: 47px;
      caret-color: $cursor;
      outline: none;
      &:-webkit-autofill {
        // box-shadow: 0 0 0px 1000px #fff inset !important
        // -webkit-text-fill-color:
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    background: #fff;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url("~img/bg.png") no-repeat center;
  background-size: cover;
  overflow: hidden;

  .login-form {
    position: absolute;
    width: 400px;
    padding:20px 40px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 0px 10px 5px #f0f0f0;
    max-width: 100%;
    top: 50%;
    right: 8%;
    transform: translateY(-50%);
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    font-size: 20px;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
