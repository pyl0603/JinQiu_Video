<template>
  <div class="per-data mt30">
    <el-row class="per-data-cont">
      <span class="el-col-24 cada tac mb30">
        <span class="up-img mt60" v-if="startImg == ''">
          <svg-icon icon-class="tupian"></svg-icon>
          <span class="f16">1242*1863</span>
        </span>
        <div class="upload-after" v-if="startImg != ''">
          <img :src="startImg" alt>
        </div>
        <upload ref="upload" @upImg="upImg"></upload>
      </span>
      <el-col :span="10" class="input-cont f16" :push="2">
        <el-col>
          <em>账号</em>：
          <el-input v-inputRule v-model="userInfo.nickname"></el-input>
        </el-col>
        <el-col class="mt20">
          <em>职务</em>：
          <el-input v-inputRule></el-input>
        </el-col>
        <el-col class="mt20">
          <em>姓名</em>：
          <el-input v-inputRule v-model="userInfo.realName"></el-input>
        </el-col>
      </el-col>
      <el-col :span="10" class="input-cont f16" :push="2">
        <el-col>
          <em>性别</em>：
          <el-radio-group v-model="userRadio">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-col>

        <el-col class="mt20">
          <em>验证手机</em>：
          <el-input placeholder="请输入" v-model="userInfo.mobile"></el-input>
        </el-col>

        <el-col class="mt20">
          <em>验证邮箱</em>：
          <el-input placeholder="请输入" v-model="userInfo.email"></el-input>
        </el-col>
      </el-col>
    </el-row>
    <!-- 弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :show-close="false">
      <div class="dialog-cont">
        <div>
          <em>邮箱账号：</em>
          <el-input placeholder="请输入"></el-input>
          <el-button type="dqx-btn" class="ml20">发送</el-button>
        </div>
        <div class="mt30">
          <em>验证码：</em>
          <el-input placeholder="请输入"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="dqx-btn" @click="dialogVisible = false">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { myInfo } from "@/api/staff";
import upload from "@/components/UploadImg/index";
export default {
  data() {
    return {
      userRadio: 1,
      dialogVisible: false,
      userInfo: "",
      startImg:''
    };
  },
  components: {
    upload
  },
  mounted() {
    this.$store.commit("setPaging", false);
    myInfo().then(res => {
      this.userInfo = res.data;
      this.startImg = res.data.avatar_url
    });
  },
  methods: {
    // 获取邮箱验证码
    getEmail() {
      this.dialogVisible = true;
    },
     // 图片上传
    upImg(val) {
      this.startImg = val + "?x-oss-process=image/auto-orient,1";
    },
  }
};
</script>
<style lang="scss" scoped>
.per-data {
  .up-img {
    display: inline-block;
    width: 140px;
    height: 140px;
    line-height: 0px;
    border-radius: 50%;
    font-size: 50px;
    background: #f0f0f0;
    text-align: center;
    .svg-icon {
      margin-top: 30px;
    }
  }
  /deep/.inputFlie {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      position: absolute;
      margin-top: -140px;
      margin-left: -70px;
      opacity: 0;
      z-index: 1;
    }
    .upload-after{
      img{
        width: 140px;
        height: 140px;
        line-height: 0px;
        border-radius: 50%;
      }
    }
  .input-cont em {
    position: relative;
    display: inline-block;
    width: 64px;
    text-align: justify;
    top: 18px;
    &::after {
      display: inline-block;
      content: "";
      width: 100%;
    }
  }
  .per-data-cont .el-input {
    width: calc(100% - 130px);
  }
}
</style>
