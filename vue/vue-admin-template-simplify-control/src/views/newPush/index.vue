<template>
  <div class="new-push">
    <!-- <el-row class="f14 tac cada push-tab mt20">
      <span class="el-col-2 cp" :class="{c18c:itemIndex === 1}" @click="newTab(1)">通知</span>
      <span class="el-col-2 cp" :class="{c18c:itemIndex === 2}" @click="newTab(2)">消息</span>
    </el-row>-->
    <el-row class="mt20">
      <el-col :span="10">
        <el-col>
          标题：
          <el-input v-inputRule class="ml20" v-model="title" maxlength="26"></el-input>
        </el-col>
        <el-col class="mt20" v-if="isPage&&!isSys">
          外链：
          <el-input v-inputRule class="ml20" v-model="url"></el-input>
        </el-col>
        <el-col class="mt20">
          <em>内容：</em>
          <el-input v-inputRule class="ml20" type="textarea" :rows="5" v-model="content"  maxlength="78"></el-input>
        </el-col>
      </el-col>
      <el-col :span="14" class="edit-choose">
        <!-- <el-row>
          <el-radio-group v-model="userRadio">
            <el-radio :label="3">全部用户</el-radio>
            <el-radio :label="6">指定用户</el-radio>
            <el-radio :label="9">指定用户群组</el-radio>
          </el-radio-group>
        </el-row>-->
        <el-row class>
          <em class="mr20 f14">推荐平台：</em>
          <el-checkbox-group v-model="checkList" class="ml20">
            <el-checkbox label="iOS" value="1"></el-checkbox>
            <el-checkbox label="Android" value="2"></el-checkbox>
          </el-checkbox-group>
        </el-row>
        <!-- <el-row class="mt60">
          <em class="mr20 f14">选择群组：</em>
          <el-input placeholder="选择">选择</el-input>
        </el-row>-->
        <!-- <el-row class="mt60">
          <em class="mr20 f14">用户ID：</em>
          <el-input class="ml20" type="textarea" :rows="5"></el-input>
        </el-row>-->
        <el-row class="mt60">
          <em class="mr20 f14">定时发送：</em>
          <el-radio-group v-model="sendRadio" class="ml20">
            <el-radio :label="2">开启</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
        </el-row>
        <el-row class="mt60">
          <em class="mr20 f14">选择时间日期：</em>
          <el-date-picker
            v-model="dataTime"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="tac mt30">
      <el-button type="dqx-btn" @click="isSys?saveSys():save()" class="mr60">保存</el-button>
      <el-button @click="cancle" v-if="!isPage">取消</el-button>
    </el-row>
  </div>
</template>
<script>
import { addPush, addSysMsg } from "@/api/setting";
export default {
  data() {
    return {
      userRadio: 3,
      sendRadio: 1,
      checkList: [],
      itemIndex: 1,
      dataTime: "",
      title: "",
      content: "",
      url: "",
      newsTitle: ""
    };
  },
  props: {
    isPage: {
      type: Boolean,
      default: true
    },
    type: {
      type: Number,
      default: 4
    },
    isMsg: {
      type: Boolean,
      default: false
    },
    pushInfo: {
      type: Object,
      default: () => {}
    },
    isSys: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    newTab(val) {
      this.itemIndex = val;
    },
    cancle() {
      this.$emit("cancle");
    },
    // 系统消息
    saveSys() {
      let pushableAndroid,
        pushableIos = false;
      if (this.checkList.length === 2) {
        pushableAndroid = true;
        pushableIos = true;
      } else if (this.checkList.length === 1) {
        if (this.checkList[0] === "iOS") pushableIos = true;
        if (this.checkList[0] === "Android") pushableAndroid = pushableAndroid;
      } else {
        this.$message("请选择平台");
      }
      if (this.dataTime != "") {
        if (this.dataTime < new Date().getTime()) {
          this.$message("时间必须在当前时间及之后");
          return;
        }
      }
      addSysMsg({
        title: this.title,
        content: this.content,
        pushableAndroid: pushableAndroid,
        pushableIos: pushableIos,
        bePushAt: this.dataTime
      }).then(_ => {
        this.$message("操作成功");
      });
    },
    // 推送
    save() {
      let type = this.isMsg ? this.type : 5;
      if (this.sendRadio === 1) this.dataTime = "";
      if (!this.isPage) this.url = "";
      let platformType = 0;
      if (this.checkList.length === 2) {
        platformType = 0;
      } else if (this.checkList.length === 1) {
        if (this.checkList[0] === "iOS") platformType = 2;
        if (this.checkList[0] === "Android") platformType = 1;
      } else {
        this.$message("请选择平台");
      }
      let id = "";
      let imageUrl = "";
      if (this.type === 1) {
        this.newsTitle = this.pushInfo.title;
      }
      if (this.type === 1 || this.type === 3) {
        id = this.pushInfo.id;
        imageUrl = this.pushInfo.cover;
        this.url = this.pushInfo.url;
      }
      // if(this.type === 1){
      //   this.url = `https://m.jinqiulive.com/apparticle?id=${this.pushInfo.id}`
      // }
      // if(this.type === 3){
      //   this.url = `https://m.jinqiulive.com/video?id=${this.pushInfo.id}`
      // }
      if (this.type === 2) {
        id = this.pushInfo.id;
      }
      if (this.dataTime != "") {
        if (this.dataTime < new Date().getTime()) {
          this.$message("时间必须在当前时间及之后");
          return;
        }
      }
      if(this.sendRadio === 2 && this.dataTime === ''){
        this.$message("请选择发送时间");
          return;
      }
      console.log(this.newsTitle);
      addPush({
        title: this.title,
        newsTitle: this.newsTitle,
        content: this.content,
        sendTime: this.dataTime,
        sendTimeType: this.sendRadio,
        type: this.type,
        url: this.url,
        imageUrl: imageUrl,
        id: id,
        platformType: platformType
      }).then(res => {
        this.$message(res.data);
        this.$emit("cancle");
      });
    }
  },
  mounted() {
    this.title = this.pushInfo.title;
    this.content = this.pushInfo.subhead;
    this.$store.commit("setPaging", false);
  },
  watch: {
    pushInfo(newVal) {
      console.log(1);
      this.title = newVal.title;
      this.content = newVal.subhead;
    }
  }
};
</script>
<style lang="scss" scoped>
.new-push {
  .push-tab {
    span + span {
      border-left: 1px solid #f5f5f5;
    }
  }
  .el-input,
  .el-textarea {
    display: inline-block;
    width: calc(100% - 150px);
  }
  .el-checkbox-group {
    display: inline-block;
  }
  .edit-choose {
    .el-input,
    .el-textarea {
      display: inline-block;
      width: calc(50% - 100px);
    }
  }
}
</style>

