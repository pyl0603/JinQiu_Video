<template>
  <div class="login-container">
    <div class="login-content">
      <h2 class="login-title">今球简化版管理后台</h2>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user"/>
          </span>
          <el-input
            v-inputNumber
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入账号"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
          <el-input
            v-inputNumberLetter
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
            clearable
            maxlength="30"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
        </el-form-item>
        <el-button
          :loading="loading"
          type="dqx-btn"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleLogin"
        >登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { removeToken } from '@/utils/auth'

export default {
  name: "Login",
  data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号'));
        } else {
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
         if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
    return {
      loginForm: {
        // 15705929646
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { validator: validatePass, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass2, trigger: 'blur' }
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
      if(this.loginForm.username == ''){
        this.$message('请输入账号');
        return
      }
      if(this.loginForm.password == ''){
        this.$message('请输入密码');
        return
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.dispatch("user/login", this.loginForm).then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loginForm.password = ''
              this.loading = false;
            });
        } else {
          console.log("error submit!!")
          return false
        }
      })
    }
  },
  created() {
    removeToken();
  },
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
  // background: url("~img/bg.png") no-repeat center;
  background-size: cover;
  overflow: hidden;

  .login-content {
    position: absolute;
    width: 400px;
    padding: 0 40px;
    max-width: 100%;
    top: 40%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    overflow: hidden;
  }

  .login-title {
    text-align: center;
    padding: 82px 0;
    color: #171717;
    font-size: 24px;
  }

  // .login-form {
  //   position: absolute;
  //   width: 400px;
  //   padding: 0 40px;
  //   max-width: 100%;
  //   top: 50%;
  //   left: 50%;
  //   transform: translateX(-50%) translateY(-50%);
  //   overflow: hidden;
  // }

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
