<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">今球短视频-发布平台</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入账号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password" v-if="Togglelogin">
        <span class="svg-container">
          <i class="el-icon-mobile"></i>
        </span>
        <el-input
          ref="password"
          v-model="loginForm.code"
          placeholder="请输入验证码"
          tabindex="2"
          auto-complete="on"
        />
        <el-button
          type="primary"
          class="show-pwd"
          plain
          @click="VerificationCode"
          :disabled="!ShowTime"
          >{{ ShowTime ? "获取验证码" : `${Time}后获取` }}</el-button
        >
      </el-form-item>

      <el-form-item prop="password" v-if="!Togglelogin">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="password"
          v-model="loginForm.password"
          placeholder="请输入密码"
          tabindex="2"
          auto-complete="on"
          show-password
        />
      </el-form-item>

      <div class="tips">
        <el-button
          type="dqx-btn"
          :loading="loading"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleLogin"
          >登陆</el-button
        >
        <el-button
          type="text"
          class="Togglelogin"
          @click="Togglelogin = !Togglelogin"
          >账号密码登陆</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { GetVerification } from "@/api/user";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "15270332428",
        password: "",
        code: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      Time: 60,
      ShowTime: true,
      Togglelogin: true, //切换登陆
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    VerificationCode() {
      let timer;
      this.ShowTime = false;
      timer = setInterval(() => {
        this.Time--;
        this.Time < 0 ? (this.ShowTime = true) : this.ShowTime;
        this.ShowTime ? clearInterval(timer) : "";
      }, 1000);

      GetVerification(this.loginForm.username);
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
      //验证码登陆
      if (this.Togglelogin) {
        this.$refs.loginForm.validate((valid) => {
          // if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", {
              phoneNumber: this.loginForm.username,
              code: this.loginForm.code,
            })
            .then(() => {
              this.$router.push("/addCont/contMana");
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
          // } else {
          //   console.log("error submit!!");
          //   return false;
          // }
        });
      } else {
        //账号密码登陆
        this.$refs.loginForm.validate((valid) => {
          // if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", {
              phoneNumber: this.loginForm.username,
              passwordMD5: this.loginForm.password,
            })
            .then(() => {
              this.$router.push("/addCont/index");
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
          // } else {
          //   console.log("error submit!!");
          //   return false;
          // }
        });
      }
    },
  },
};
</script>

<style lang="scss" scope>
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
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
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #f0f0f0;
    background: #fff;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scope>
$bg: #283443;
$light_gray: #fff;
$cursor: #283443;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
.title {
  text-align: center;
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
$light_gray: #2d3a4b;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url("../../icons//img/bg.png") no-repeat center;
  background-size: cover;
  overflow: hidden;

  .login-form {
    position: absolute;
    width: 400px;
    padding: 20px 40px;
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
    position: relative;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
    .Togglelogin {
      margin: 10px 0;
      position: absolute;
      top: 50%;
      right: 1%;
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    font-size: 16px;
    margin-right: 5px;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 10px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 10px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
