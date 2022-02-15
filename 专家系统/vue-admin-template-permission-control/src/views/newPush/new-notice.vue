<template>
  <div class="new-push">
    <!-- <el-row class="f14 tac cada push-tab mt20">
      <span class="el-col-2 cp" :class="{c18c:itemIndex === 1}" @click="newTab(1)">通知</span>
      <span class="el-col-2 cp" :class="{c18c:itemIndex === 2}" @click="newTab(2)">消息</span>
    </el-row>-->
    <el-row>
      <el-col :span="12">
        <el-col class="mb20">
          标题：
          <el-input class="ml20" v-model="title" maxlength="16" placeholder="请输入标题(最多16位)"></el-input>
        </el-col>
        <el-col class="mt20 mb20" v-if="isPage&&!isSys">
          外链：
          <el-input class="ml20" v-model="url"></el-input>
        </el-col>
        <div class="mt20 mb20">
          <em>内容：</em>
          <el-input  class="ml20" type="textarea" :rows="5" v-model="content" maxlength="78" placeholder="请输入内容(最多78字)"></el-input>
        </div>
        <el-row class="mt20">
          <em class="mr20 f14">推荐平台：</em>
          <el-checkbox-group v-model="checkList" class="ml20">
            <el-checkbox label="iOS" value="1"></el-checkbox>
            <el-checkbox label="Android" value="2"></el-checkbox>
          </el-checkbox-group>
        </el-row>
        <el-row class="mt20" v-if="allChoose">
          <em class="mr20 f14">定时发送：</em>
          <el-radio-group v-model="sendRadio" class="ml20">
            <el-radio :label="2">开启</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
        </el-row>
        <el-row class="mt20" v-if="allChoose">
          <em class="mr20 f14">选择推送日期：</em>
          <el-date-picker
            v-model="dataTime"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm"
          ></el-date-picker>
        </el-row>
        <el-row class="mt20">
          <em class="mr20 f14">过期时间：</em>
          <el-radio-group v-model="sendTime" class="ml20">
            <el-radio :label="1">1小时</el-radio>
            <el-radio :label="3">3小时</el-radio>
            <el-radio :label="24">24小时</el-radio>
            <el-radio :label="0">其他</el-radio>
          </el-radio-group>
        </el-row>
        <el-row class="mt20" v-if="sendTime == 0">
          <em class="mr20 f14">过期期限：</em>
          <el-date-picker
            v-model="lastTime"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-row>
      </el-col>

      <el-col :span="12" class="edit-choose">
        <el-row>
          <em class="mr20 f14">
            广播：
            <el-switch :value="allChoose" @change="changeAll" />
          </em>
        </el-row>
        <el-row class="mt20" v-if="!allChoose">
          <el-collapse accordion>
            <el-collapse-item v-for="(item,index) in teamList" :key="index">
              <template slot="title">
                {{item.name}}
                <el-checkbox
                :indeterminate="item.isIndeterminate"
                  v-model="item.selected"
                  @change="onChangeFather(item)"
                  class="one-role-level ml20"
                ></el-checkbox>
              </template>
              <div class="two-role-level mt10">
                <span v-for="team in item.teams" :key="team.id" class="mr30">
                  <el-checkbox
                    v-model="team.selected"
                    :label="team.name"
                    @change="onChangeSon(team,item)"
                  ></el-checkbox>
                </span>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="tac mt30">
      <el-button type="dqx-btn" @click="isSys?saveSys():save()" class="mr60" :disabled="isLoading">提交</el-button>
      <el-button @click="cancle" v-if="!isPage">取消</el-button>
    </el-row>
  </div>
</template>
<script>
import { addPush, addSysMsg, getPushTeam } from "@/api/setting";
export default {
  data() {
    return {
      userRadio: 3,
      sendRadio: 1,
      sendTime: 24,
      checkList: ["Android","iOS"],
      itemIndex: 1,
      dataTime: "",
      lastTime: "",
      title: "",
      content: "",
      url: "",
      newsTitle: "",
      allChoose: false,
      teamList: [],
      isIndeterminate:false,
      isLoading:false,
      matchId:null,
       pickerOptions: {
         disabledDate(time) {
            return time.getTime() < new Date(new Date().toLocaleDateString()).getTime();
          }
       }
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
  mounted() {
    if (this.pushInfo) {
      if(this.pushInfo.title){
        this.content = this.pushInfo.title.substring(0,15);
      }else{
        this.content = this.pushInfo.homeTeamName + 'VS' + this.pushInfo.awayTeamName;
      }
      this.title = "";
      this.matchId = this.pushInfo.matchId
      this.$store.commit("setPaging", false);
    }
    getPushTeam().then(res => {
      this.teamList = res.data;
    });
  },
  methods: {
    // 全部
    changeAll(val) {
      this.allChoose = val;
    },
    // 父选项点击选中事件
    async onChangeFather(parObj) {
      if (parObj.selected === true) {
        parObj.teams.map(res => (res.selected = true));
        parObj.isIndeterminate = false;
      } else {
        parObj.teams.map(res => (res.selected = false));
        parObj.isIndeterminate = false;
      }
    },
    // 子选项点击选中事件
    async onChangeSon(obj, parObj) {
      // 子选项部分选中
      if (parObj.teams.findIndex(res => res.selected === true) > -1) {
        parObj.selected = false;
        parObj.isIndeterminate = true;
      }
      //子选项全部取消选中
      if (parObj.teams.findIndex(res => res.selected === false) <= -1) {
        parObj.selected = true;
        parObj.isIndeterminate = false;
      }
      //子选项全部选中
      if (parObj.teams.findIndex(res => res.selected === true) <= -1) {
        parObj.selected = false;
        parObj.isIndeterminate = false;
      }
    },
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
        if (this.checkList[0] === "Android") pushableAndroid = true;
      } else {
        this.$message("请选择平台");
        return
      }
      if (this.dataTime != "") {
        if (this.dataTime < new Date().getTime()) {
          this.$message("时间必须在当前时间及之后");
          return;
        }
      }
      
      this.isLoading = true;
      addSysMsg({
        title: this.title,
        content: this.content,
        pushableAndroid: pushableAndroid,
        pushableIos: pushableIos,
        bePushAt: this.dataTime
      }).then(_ => {
        this.$message("操作成功");
        this.isLoading = false;
      }).catch(_ => {
        this.isLoading = false;
      });
    },
    // 推送
    save() {
      let type = this.isMsg ? this.type : 5;
      if (this.sendRadio === 1) this.dataTime = "";
      if (!this.isPage) this.url = "";
       let pushableAndroid,
        pushableIos = false;
      if (this.checkList.length === 2) {
        pushableAndroid = true;
        pushableIos = true;
      } else if (this.checkList.length === 1) {
        if (this.checkList[0] === "iOS") pushableIos = true;
        if (this.checkList[0] === "Android") pushableAndroid = true;
      } else {
        this.$message("请选择平台");
        return
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
      if (this.type === 2) {
        id = this.pushInfo.id;
      }
      if (this.dataTime != "") {
        if (this.dataTime < new Date().getTime()) {
          this.$message("时间必须在当前时间及之后");
          return;
        }
      }
      if (this.lastTime != "") {
        if (this.lastTime < new Date().getTime()) {
          this.$message("时间必须在当前时间及之后");
          return;
        }
      }
      if(this.sendTime == 0 && this.lastTime == ''){
        this.$message('请先选择有效时间');
        return
      }
      if (this.sendRadio === 2 && this.dataTime === "") {
        this.$message("请选择发送时间");
        return;
      }
      if (this.content === '' || this.content == null) {
        this.$message('请输入内容')
        return
      }
      this.sendTime = this.sendTime == 0 ? "" : this.sendTime;
      this.lastTime = this.sendTime == 0 ? this.lastTime : "";
      let teamIds = "";
      if (!this.allChoose) {
        this.sendRadio = 1
        this.dataTime = ""
        this.teamList.map(res => {
          res.teams.map(res => {
            if (res.selected) {
              teamIds += res.id + "_";
            }
          });
        });
        if(teamIds == ''){
          this.$message('请先选择推送群体');
          return
        }
        teamIds = teamIds.substring(0,teamIds.length-1)
      }
      let params = {
        title: this.title,
        resTitle: this.newsTitle,
        content: this.content,
        bePushAt: this.dataTime,
        sendTimeType: this.sendRadio,
        resType: this.type,
        resUrl: this.url,
        imageUrl: imageUrl,
        resId: id,
        pushableAndroid: pushableAndroid,
        pushableIos: pushableIos,
        expiredAt: this.lastTime,
        isAll: this.allChoose,
        teamTable: this.teamList,
        matchId: this.matchId
      }
      if (this.sendTime !== 0) {
        Object.assign(params,{expireDuration: this.sendTime})
      }
      this.isLoading = true;
      addPush(params).then(res => {
        this.$message(res.data);
        // this.$router.push('/count/push/record')
        this.$emit("cancle");
        this.isLoading = false;
      }).catch(_ => {
        this.isLoading = false;
      });
    }
  },
  watch: {
    pushInfo(newVal) {
      this.title = '';
      this.content = newVal.title;
      this.sendTime = 24;
      this.lastTime = '';
      this.matchId = newVal.matchId;
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

