<template>
  <div class="overview">
    <div class="push-header">
      <el-row class="push-info">
        <el-col :span="18" class="info-topic">
          <span>
            <em>推送概览</em>
          </span>
          <span class="ml20 tac">
            <i>总收到数</i>
            <em>{{ devicesNum }}</em>
          </span>
          <span class="ml20 tac">
            <i>总打开数</i>
            <em>{{ sentCount }}</em>
          </span>
          <span class="ml20 tac">
            <i>今日广播剩余</i>
            <em>{{ openCount }}</em>
          </span>
          <span class="ml20 tac">
            <i>总推送数</i>
            <em>{{ iosbroadcast }}</em>
          </span>
        </el-col>
        <el-col :span="6" class="tar">
          <span class="refresh" @click="sear">刷新数据推送</span>
        </el-col>
      </el-row>
      <el-row class="new-tab tar mt20">
        类别：
        <el-select class="mr30" v-model="parmas.category" placeholder="请选择">
          <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        选择日期：
        <!-- <el-date-picker
          v-model="dataRang"
          type="date"
        /> -->
        <el-date-picker
          class="mr30"
          v-model="dataRang"
          type="datetimerange"
          range-separator="至"
          @change="handlechangeTiming"
          value-format="timestamp"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        推送内容:
        <el-input
          class="mr30"
          v-model="parmas.searchText"
          placeholder="请输入内容"
        ></el-input>
        <el-button type="dqx-btn" @click="searchList">搜索</el-button>
      </el-row>
    </div>
    <div class="push-cont">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        height="calc(100vh - 400px)"
      >
        <el-table-column label="推送日期" >
          <template slot-scope="scope" >{{
            showDate(scope.row.createTime, )
          }}</template>
        </el-table-column>
        <el-table-column prop="userInfo.nickname" label="推送人" />
        <el-table-column label="推送内容">
          <template slot-scope="scope">{{
            scope.row.category===0?'系统消息':(scope.row.category===1?'内容推送':'')
          }}</template>
        </el-table-column>
        <el-table-column label="关联">
          <template slot-scope="scope">{{
            scope.row.concatType===0?'无':(scope.row.concatType===1?'视频':(scope.row.concatType===2?'资讯':''))
          }}</template>
        </el-table-column>
        <el-table-column label="设备系统">
          <template slot-scope="scope">{{
           scope.row.osType===0?'安卓':( scope.row.osType===1?'IOS':( scope.row.osType===2?'所有平台':''))
          }}</template>
        </el-table-column>
        <el-table-column label="收到数">
          <template slot-scope="scope">{{
            scope.row.arriveCount == null ? "——" : scope.row.arriveCount
          }}</template>
        </el-table-column>
        <el-table-column label="打开数">
          <template slot-scope="scope">{{
            scope.row.openCount == null ? "——" : scope.row.openCount
          }}</template>
        </el-table-column>
        <el-table-column prop="operate" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="getDialog(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      title="内容推送"
      :visible.sync="dialogVisible"
      width="60%"
      :show-close="false"
      top="10vh"
    >
      <div class="system">
        <el-row>
          <p class="text">{{ detaillogs }}</p>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-col>
              <el-col class="mt20">
                标题：
                <el-input
                  v-model="title"
                  class="ml20"
                  maxlength="26"
                  clearable
                  :disabled="true"
                />
              </el-col>
              <el-col class="mt20">
                <em>内容：</em>
                <!-- <el-input
                  v-model="content"
                  class="ml20"
                  type="textarea"
                  :rows="5"
                  maxlength="78"
                  :disabled="true"
                /> -->
                <el-input
                  v-model="content"
                  class="ml20"
                  maxlength="26"
                  clearable
                  :disabled="true"
                />
              </el-col>
              <el-col v-if="resUrl !== ''" class="mt20">
                <!-- 外链：
                <el-input
                  disabled
                  v-if="resUrl !== ''"
                  v-model="resUrl"
                  class="ml20"
                /> -->
              </el-col>
              <el-col class="edit-choose">
                <el-row class="mt20">
                  <em class="mr20 f14">推荐平台：</em>
                  <el-checkbox-group v-model="checkList" class="ml20">
                    <el-checkbox disabled label="IOS" value="IOS" />
                    <el-checkbox disabled label="Android" value="Android" />
                  </el-checkbox-group>
                </el-row>
                <el-row class="mt20">
                  <em class="mr20 f14">定时发送：</em>
                  <el-radio-group v-model="sendRadio" class="ml20">
                    <el-radio disabled :label="2">开启</el-radio>
                    <el-radio disabled :label="1">关闭</el-radio>
                  </el-radio-group>
                </el-row>
                <el-row class="mt20">
                  <em class="mr20 f14">选择时间日期：</em>
                  <el-date-picker
                    v-model="dataTime"
                    value-format="timestamp"
                    type="datetime"
                    placeholder="选择日期时间"
                    :disabled="true"
                  />
                </el-row>
                <el-row class="mt20">
                  <em class="mr20 f14">选择有效时间：</em>
                  <el-radio-group v-model="timeRadio">
                    <el-radio disabled :label="1">1小时</el-radio>
                    <el-radio disabled :label="3">3小时</el-radio>
                    <el-radio disabled :label="24">24小时</el-radio>
                    <el-radio disabled :label="0">其他</el-radio>
                  </el-radio-group>
                </el-row>
                <el-row class="mt20" v-if="timeRadio == 0">
                  <em class="mr20 f14">选择有效期限：</em>
                  <el-date-picker
                    v-model="lastTime"
                    value-format="timestamp"
                    type="datetime"
                    placeholder="选择日期时间"
                    :disabled="true"
                  ></el-date-picker>
                </el-row>
              </el-col>
            </el-col>
          </el-col>

          <el-col :span="12" class="edit-choose">
            <el-row>
              <em class="mr20 f14"
                >广播：
                <el-switch disabled :value="allChoose" @change="changeAll"
              /></em>
            </el-row>
            <el-row class="mt20" v-if="!allChoose">
              <el-collapse accordion>
                <el-collapse-item
                  v-for="(item, index) in teamList"
                  :key="index"
                >
                  <template slot="title">
                    {{ item.name }}
                    <el-checkbox
                      disabled
                      :indeterminate="item.isIndeterminate"
                      v-model="item.selected"
                      @change="onChangeFather(item)"
                      class="one-role-level ml20"
                    ></el-checkbox>
                  </template>
                  <div class="two-role-level mt10">
                    <span
                      v-for="team in item.teams"
                      :key="team.id"
                      class="mr30"
                    >
                      <el-checkbox
                        disabled
                        v-model="team.selected"
                        :label="team.name"
                        @change="onChangeSon(team, item)"
                      ></el-checkbox>
                    </span>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-row>
          </el-col>
        </el-row>
        <!-- <el-row class="tac mt20">
          <el-button type="dqx-btn" class="mr30">确定</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-row> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { formatDate, formatTime } from "@/utils/index.js";
import {
  getPushLogs,
  getNoticeStatistical,
  getStatistical,
  getNoticeRecord,
  getNoticeSync
} from "@/api/push";
export default {
  data() {
    return {
      devicesNum: 0, // 设备数
      sentCount: 0, // 收到数
      openCount: 0, // 打开数
      iosbroadcast: 0, // IOS广播数
      andbroadcast: 0, // 安卓广播数
      tableData: [],
      options: [
        { id: -1, name: "全部" },
        { id: 0, name: "足球比赛" },
        { id: 1, name: "篮球比赛" },
        { id: 2, name: "外联推送" },
        { id: 3, name: "空" }
      ],
      searchKey: "",
      value: -1,
      dataRang: new Date(),
      tabList: [{ name: "NBA" }],
      dialogVisible: false, // 弹出窗
      timeRadio: 3, // 选择有效时间
      sendRadio: 2, // 定时发送
      checkList: ["IOS", "Android"], // 推荐平台
      dataTime: "", // 选择日期
      lastTime: "", // 选择其他有效时间
      title: "", // 选择标题
      content: "", // 选择内容
      resUrl: "", // 是否外链接
      detaillogs: "", // 提示
      allChoose: false,
      teamList: [],
      isIndeterminate: false,
      taskId: -1,
      categoryOptions: [
        {
          value: 1,
          label: "视频"
        },
      
        {
          value: 2,
          label: "资讯"
        },
        {
          value: 0,
          label: "无"
        },
          {
          value: -1,
          label: "全部"
        },
      ],
      categoryValue: "",
      parmas: {
        category: -1,
        dateEnd: -1,
        dateStart: -1,
        pageNum: 1,
        pageSize: 10,
        searchText: ""
      }
    };
  },
  computed: {},
  mounted() {
    this.$store.commit("setPaging", false);
    this.getPushData();
    this.getNoticeRecordList()
  },
  methods: {
    searchList(){
      this.getNoticeRecordList()
    },
    async getNoticeRecordList(){
const res = await getNoticeRecord(this.parmas)
     this.tableData = res.data.list
      console.log(res.data.list);
      this.$store.commit('setTotal', res.data.total)
    },
    handlechangeTiming(timing) {
      //获得时间戳
      console.log(timing);
      this.parmas.dateEnd = timing[1]
      this.parmas.dateStart = timing[0]
    },
    async sear() {
      const res = await getNoticeSync(this.taskId);
      this.getPushData();
    },
    // // 时间选择
    // change() {
    //   this.startTime = this.dataRang[0]
    //   this.endTime = this.dataRang[1] + 3600 * 1000 * 24 - 1000
    // },
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
    getPushData() {
      getNoticeStatistical().then(res => {
        const {
          todayRemainingBroadPushCount,
          totalArriveCount,
          totalOpenCount,
          totalPushCount
        } = res.data;
        // this.tableData = res.data.list
        // let data = res.data.statistics
        (this.devicesNum = totalArriveCount),
          (this.sentCount = totalOpenCount),
          (this.openCount = todayRemainingBroadPushCount),
          // this.andbroadcast = data.androidBroadcastTimes // 广播次数
          (this.iosbroadcast = totalPushCount);
        console.log("列表", res.data);
   
        // this.$store.commit('setTotal', res.meta.pagination.total)
      });
    },
    // 日统计
    // getDailyData() {
    //   let date = new Date();
    //   let nowdate = formatDate(date);
    //   getDailyStatistics({date: nowdate}).then(res => {
    //     console.log('数据', res.data)
    //     let data = res.data
    //     this.devicesNum = 0, // 设备数
    //     this.terminalNum = 0, // 终端数
    //     this.monNum = 0, // 本月推送
    //     this.totalNum = 0 // 总推送
    //   })
    // },
    // 查看弹出窗
    getDialog(data) {
      console.log(data,'hi');
      this.detaillogs = `推送人：${data.userInfo?data.userInfo.nickname:'暂无数据'}, 于${formatTime(
        data.createTime
      )}提交推送`;
      this.dialogVisible = true;
      this.dialogVisible = true;
      (this.sendRadio = data.sendTimeType), // 定时发送
        (this.checkList = this.devicesText(
          data.osType===0?'Android':(data.osType===2?'Android':null),
          data.osType===1?'IOS':(data.osType===2?'Android':null),
        )), // 推荐平台
        (this.dataTime = data.bePushAt), // 选择日期
        (this.lastTime = data.expiredAt), // 选择其他有效时间 timeRadio
        (this.timeRadio = data.expireDuration ? data.expireDuration : 0), // 选择有效时间
        (this.title = data.title);
      this.content = data.category===0?'系统消息':(data.category===1?'内容推送':null);
      this.teamList = data.teamTable;
      this.allChoose = data.isAll;
      this.resUrl = data.resUrl;
    },
    // 计算列表关系
    replayText(type) {
      // 1-文章 2-比赛 3-视频 4-外链
      switch (type) {
        case 1:
          return "文章";
          break;
        case 2:
          return "比赛";
          break;
        case 3:
          return "视频";
          break;
        case 4:
          return "外链";
          break;
        default:
          return "空";
      }
    },
    // 计算列表设备
    devicesText(android, ios) {
      console.log(" 计算列表设备", android, ios);
      if (android && ios) {
        return ["IOS", "Android"];
      }
      if (android && !ios) {
        return ["Android"];
      }
      if (!android && ios) {
        return ["IOS"];
      }
    },
    // 显示设备
    devicesDetail(android, ios) {
      if (android && ios) {
        return "Android/IOS";
      }
      if (android && !ios) {
        return "Android";
      }
      if (!android && ios) {
        return "IOS";
      }
    },
    // 显示日期
    showDate(bePushAt, creationTime) {
      return bePushAt === null
        ? formatTime(creationTime)
        : formatTime(bePushAt);
    }
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    // ...mapGetters(['page']),
    // dataList() {
    //   return [this.page, this.keys]
    // }
  },
  // eslint-disable-next-line vue/order-in-components
  watch: {
    dataList(newVal) {
      this.getPushData();
    }
  }
};
</script>
<style lang="scss" scoped>
.overview {
  .push-info {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 30px;
    .info-topic {
      display: flex;
      align-items: center;
    }
    span {
      display: inline-block;
      width: 160px;
      i {
        color: #adadad;
        font-size: 18px;
      }
      em {
        display: block;
        margin-top: 10px;
        color: #171717;
        font-size: 24px;
        font-weight: 600;
      }
    }
    .refresh {
      color: #1268ff;
      font-size: 16px;
      cursor: pointer;
    }
  }
  .el-input {
    display: inline-block;
    width: 200px;
  }
  .push-cont {
    margin-top: 24px;
  }
}
// 弹出窗
.system {
  .text {
    color: #adadad;
  }
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
      width: calc(50% - 80px);
    }
  }
}
</style>
