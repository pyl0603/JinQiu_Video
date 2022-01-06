<template>
  <div class="system">
    <el-row>
      <el-col :span="10">
        <el-col>
          标题：
          <el-input v-model="title" class="ml20" maxlength="15" clearable />
        </el-col>
        <el-col class="mt20">
          <em>内容：</em>
          <el-input v-model="content" class="ml20" type="textarea" :rows="5" maxlength="78" />
        </el-col>
        <el-col class="mt20">
          <!-- 点我看详情>> -->
          <el-select class="changeType" v-model="select" placeholder="请选择关联内容" @change="change" @blur="selectIndex">
            <el-option
              v-for="item in selectArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <span v-if="select === 1 || select === 0" class="text">当前选中的：{{title}}</span>
          <p v-if="select !== 3" class="viewText">点我看详情>>></p>
        </el-col>
        <el-col v-if="isUrl" class="mt20">
          外链：
          <el-input v-model="url" class="ml20" />
        </el-col>
      </el-col>
      <el-col :span="14" class="edit-choose">
        <el-row class>
          <em class="mr20 f14">推荐平台：</em>
          <el-checkbox-group v-model="checkList" class="ml20">
            <el-checkbox label="IOS" value="IOS" />
            <el-checkbox label="Android" value="Android" />
          </el-checkbox-group>
        </el-row>
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
          />
        </el-row>
        <el-row class="mt60">
          <em class="mr20 f14">选择有效时间：</em>
          <el-radio-group v-model="timeRadio">
            <el-radio :label="1">1小时</el-radio>
            <el-radio :label="3">3小时</el-radio>
            <el-radio :label="24">24小时</el-radio>
            <el-radio :label="0">其他</el-radio>
          </el-radio-group>
        </el-row>
        <el-row class="mt20" v-if="timeRadio == 0">
          <em class="mr20 f14">选择有效期限：</em>
          <el-date-picker
            v-model="lastTime"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm"
          ></el-date-picker>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="tac mt30">
      <el-button type="dqx-btn" class="mr60" @click="save()" :disabled="isLoading">提交</el-button>
      <el-button class="ml20" @click="reset()">重置</el-button>
    </el-row>

    <!--显示弹窗-->
    <simplify-cont ref="simplifyCont" @matchId="matchId" :show-conn="showConn" @closePop="showConn = false" />
  </div>
</template>
<script>
import { setCategory } from '@/utils/auth'
import { addSysMsg, addPush } from "@/api/setting";
import SimplifyCont from '@/components/Dialog/simplify'
export default {
  components: {
    SimplifyCont
  },
  props: {
  },
  data() {
    return {
      timeRadio: 24, // 选择有效时间
      sendRadio: 1, // 定时发送
      checkList: ['IOS', 'Android'], // 推荐平台
      dataTime: '', // 选择日期
      lastTime: "", // 选择其他有效时间
      id: '',
      title: '', // 选择标题
      content: '', // 选择内容
      url: '',
      select: '', // 选择点我详情
      selectArr: [
        {
          value: 0,
          label: '足球比赛'
        },
        {
          value: 1,
          label: '篮球比赛'
        },
        {
          value: 2,
          label: '外链'
        },
        {
          value: 3,
          label: '空内容'
        }
      ],
      isLoading: false,
      isUrl: false, // 是否显示外链
      showConn: false // 显示弹窗
    }
  },
  watch: {
  },
  mounted() {
      this.$store.commit('setPaging', false)
  },
  methods: {
    // 推送
    save() {
      console.log(11,this.checkList,this.select)
      let pushableAndroid,
        pushableIos = false;
      if (this.checkList.length === 2) {
        pushableAndroid = true;
        pushableIos = true;
      } else if (this.checkList.length === 1) {
        if (this.checkList[0] === "IOS") pushableIos = true;
        if (this.checkList[0] === "Android") pushableAndroid = true;
      } else {
        this.$message("请选择平台");
        return
      }
      if (this.select == null || this.select === '') {
        this.$message('请选择关联内容')
        return
      }
      let resType = -1
      if (this.select === 0 || this.select === 1) {
        resType = 2
      } else if (this.select === 2) {
        resType = 4
      } else {
        resType = -1
      }
      if (this.dataTime !== '') {
        if (this.dataTime < new Date().getTime()) {
          this.$message('时间必须在当前时间及之后')
          return
        }
      }
      if (this.sendRadio === 2 && this.dataTime === '') {
        this.$message('请选择发送时间')
        return
      }
      if (this.content === '') {
        this.$message('请输入内容')
        return
      }
      this.timeRadio = this.timeRadio == 0 ? 0 : this.timeRadio;
      this.lastTime = this.timeRadio == 0 ? this.lastTime : "";
      let params = {}
      Object.assign(params, {
        title: this.title, // 标题
        content: this.content,  // 内容
        bePushAt: this.dataTime, // 选择日期
        sendTimeType: this.sendRadio, // 是否定时发送
        notificationType: this.select,  // 足球 篮球 外链 空
        resUrl: this.isUrl ? this.url:'', // 外链
        resId: this.id,
        pushableAndroid: pushableAndroid,
        pushableIos: pushableIos,
        expiredAt: this.lastTime, // 选择其他有效期
        isAll: true
      })
      if (resType !== -1) {
        Object.assign(params,{resType: resType})
      }
      if (this.select !== null || this.select !== '') {
        Object.assign(params,{notificationType: this.select})
      }
      if (this.timeRadio !== 0) {
        Object.assign(params,{expireDuration: this.timeRadio})
      }
      this.isLoading = true
      addSysMsg(params).then(res => {
        this.isLoading = false
        this.reset()
        this.$router.push('/push/overview')
        this.$message(res.data);
        this.$emit("cancle");
      });
    },
    // 设置足球或者篮球
    change(val) {
      if (val === 3) {
        this.isUrl = false
        return
      }
      if (val === 2) {
        this.isUrl = true
        return
      }
      this.isUrl = false
      this.getCont()
      setCategory(val)
    },
    selectIndex(val) {
      const text = val.target.value
      const selected = this.selectArr.find(item => item.value === this.select)
      if (selected && selected.label === text) {
        this.select = ''
      }
    },
    // 选择
    matchId(val) {
      console.log(val)
      this.title = val[4]
      this.id = val[2]
      this.showConn = false
    },
    getCont() {
      this.showConn = true
    },
    // 重置
    reset() {
      this.title = ''
      this.content = ''
      this.select = null
      this.timeRadio = 24, // 选择有效时间
      this.sendRadio = 1, // 定时发送
      this.checkList = ['IOS', 'Android'], // 推荐平台
      this.dataTime = '', // 选择日期
      this.lastTime = '' // 选择其他有效时间
      this.isUrl = false
      this.url = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.system {
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
  .text {
    color: #ADADAD;
    margin-left: 8px;
  }
  .changeType {
    margin-left: 80px
  }
  .viewText {
    color: #1268FF;
    font-size: 16px;
    margin-left: 80px;
    margin-top: 22px;
  }
  /deep/.el-dialog__header {
    display: none;
  }
}
</style>

