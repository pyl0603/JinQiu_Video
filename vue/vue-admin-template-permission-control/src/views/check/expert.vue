<template>
  <div class="diss">
    <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList"></top-tab>
    <el-row>
      <div class="el-col-24 tar">
        搜索：
        <el-input
          class="mr20"
          v-model="keyworlds"
          v-inputRule
          @keyup.enter.native="setTitle"
        ></el-input>
        <el-button type="dqx-btn" @click="setTitle">查询</el-button>
        <el-button @click="(value = ''), (keyworlds = ''), (title = '')"
          >重置</el-button
        >
      </div>
    </el-row>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="mb10 mt10"
      height="calc(100vh - 300px)"
    >
      <el-table-column label="方案ID" prop="id">
        <!-- <template slot-scope="scope">{{ scope.$index + 1 }}</template> -->
      </el-table-column>
      <el-table-column prop="title" label="方案标题"></el-table-column>
      <el-table-column label="作者">
        <template slot-scope="scope">
          {{scope.row.publisher.nickName}}
        </template>
      </el-table-column>
      <el-table-column label="方案状态">
        <template slot-scope="scope">{{
          scope.row.planStatus.display
        }}</template>
      </el-table-column>
      <el-table-column label="提交时间">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatTime }}
        </template>
      </el-table-column>
      <el-table-column label="调整" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="advUrl(scope.row.id)"
            >广告链接</el-button
          >
          <el-button @click="itemDet(scope.row)" type="text" size="small"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="方案详情"
      :visible.sync="dialogVisible"
      width="50%"
      :show-close="true"
        class="to-margin"
    >
      <el-dialog
        width="30%"
        title="驳回理由"
        :visible.sync="innerVisible"
        append-to-body
        style="margin-top:20vh!important;"
      >
        <div>
          <el-input
            type="textarea"
            placeholder="驳回原因"
            v-model="denyReson" 
            maxlength="60"
          ></el-input>
          <el-row type="flex" justify="end">{{denyReson.length}}/60</el-row>
          <div slot="footer" class="dialog-footer tac mt20">
            <el-button type="dqx-btn" @click="cancle">确定</el-button>
            <el-button @click="innerVisible = false">取消</el-button>
          </div>
        </div>
      </el-dialog>
        <el-row>
          标题：<el-input v-model="itemData.title" disabled></el-input>
        </el-row>
        <el-row>
          <el-col :span='12'>作者：<el-input v-model="itemData.publisher.nickName" disabled></el-input></el-col>
        </el-row>
        <el-row>
          <el-col :span='12'
            >赛事：<el-input
              v-model="itemData.competitionName"
              disabled
            ></el-input>
          </el-col>
          <el-col :span='12'>时间：{{ itemData.matchTime | formatTime }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-row
              >{{ itemData.homeTeamName }} VS
              {{ itemData.awayTeamName }}</el-row
            >
            <el-row>
              <el-radio-group
                v-if="
                  itemData.playType.value === 1 || itemData.playType.value === 3
                "
                v-model="itemData.bigOrSmallBall.value"
                disabled
              >
                <el-radio-button label="1">
                  <div>
                    大{{
                      itemData.category.value === 0 ? "球" : "分"
                    }}(结果大于{{ itemData.handicap }})
                  </div>
                  <em>赔率：{{ itemData.homePoint }}</em>
                </el-radio-button>
                <el-radio-button label="2">
                  <div>
                    小{{
                      itemData.category.value === 0 ? "球" : "分"
                    }}(结果小于{{ itemData.handicap }})
                  </div>
                  <em>赔率：{{ itemData.awayPoint }}</em>
                </el-radio-button>
              </el-radio-group>
              <el-radio-group
                v-if="
                  itemData.playType.value === 2 || itemData.playType.value === 4
                "
                v-model="itemData.homeOrAwayWin.value"
                disabled
              >
                <el-radio-button value="c" disabled>
                  <em>主{{ this.itemData.handicap }}</em>
                </el-radio-button>
                <el-radio-button label="1">
                  <em>主胜：{{ itemData.homePoint }}</em>
                </el-radio-button>
                <el-radio-button label="2">
                  <em>客胜：{{ itemData.awayPoint }}</em>
                </el-radio-button>
              </el-radio-group>
            </el-row>
          </el-col>
          <el-col :span='8'>
            <el-row>
              推荐：<el-input v-model="itemData.playType.display" disabled></el-input>
            </el-row>
            <el-row>金额：<el-input v-model="itemData.planPrice.value" disabled></el-input></el-row>
            </el-col>
        </el-row>
        <el-row type="flex" align="top">
          方案内容：
            <el-input type="textarea" v-model='itemData.content' disabled :rows="10"></el-input>
        </el-row>
        <el-row v-if="itemData.rejectReason" type="flex" align="top">
          驳回原因：
            <el-input type="textarea" v-model='itemData.rejectReason' disabled></el-input>
        </el-row>
      <div slot="footer" class="dialog-footer tac" v-if="itemData.planStatus.value === 1">
        <el-button type="dqx-btn" @click="confirm">通过</el-button>
        <el-button @click="innerVisible = true">驳回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TopTab from "@/views/common/top-tab";
import { formatTime } from "@/utils/index.js";
import { planList, checkedPlan } from "@/api/expert";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tabList: [
        { name: "待审核", value: 1 },
        { name: "审核通过", value: 2 },
        { name: "审核驳回", value: 3 }
      ],
      tableData: [],
      keyworlds: "",
      dialogVisible: false,
      title: "",
      // 详情
      disTitle: "",
      disTime: 0,
      disCont: "",
      disImg: [],
      id: "",
      innerVisible: false,
      radio: 1,
      denyReson: "",
      planStatus: 1,
      itemData: {
        id: 0,
        category: { value: 0, display: "" },
        playType: { value: 0, display: "" },
        matchId: 0,
        homeTeamName: "",
        awayTeamName: "",
        competitionId: 0,
        competitionName: "",
        companyId: 0,
        matchTime: 0,
        handicap: 0,
        homePoint: 0,
        awayPoint: 0,
        homeScore: null,
        awayScore: null,
        homeLogo: "",
        awayLogo: "",
        bigOrSmallBall: { value: 0, display: "" },
        homeOrAwayWin: { value: 0, display: "" },
        planPrice: { value: 0, display: "" },
        title: "",
        content: "",
        planStatus: { value: 0, display: "" },
        rejectReason: null,
        buyCount: null,
        readCount: null,
        publishTime: null,
        publisher: {
          nickName:''
        },
        hidden: true,
        matchResult: { value: 0, display: "" },
        goodsId: null,
        createdAt: 0,
        updatedAt: 0
      }
    };
  },
  filters: {
    checkTxt(txt) {
      let txtList = {
        0: "未审核",
        1: "审核通过",
        2: "审核驳回"
      };
      return txtList[txt];
    },
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  components: {
    TopTab
  },
  methods: {
    // 生成分享链接
    advUrl(val) {
      this.copy("https://m.jinqiulive.com/expert.html?id=" + val);
    },
    // 状态筛选
    chooseTab(e) {
      this.planStatus = e;
    },
    copy(data) {
      let url = data;
      let oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
        message: "复制成功",
        type: "success"
      });
      oInput.remove();
    },
    //详情
    itemDet(e) {
      this.dialogVisible = true;
      this.itemData = e;
    },
    // 获取帖子列表
    async getDiscs() {
      planList({
        keys: this.title,
        planStatus: this.planStatus,
        page: this.page
      }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
    // 驳回
    async cancle() {
      if (this.denyReson == "") {
        this.$message("请输入驳回原因");
        return;
      }
      checkedPlan({
        id: this.itemData.id,
        isAccepted: false,
        refuseReason: this.denyReson
      }).then(_ => {
        this.$message("操作成功");
        this.dialogVisible = false;
        this.innerVisible = false;
        this.getDiscs();
      });
    },
    //   通过
    async confirm() {
      this.$confirm("确认通过该方案", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          checkedPlan({
            id: this.itemData.id,
            isAccepted: true,
            refuseReason: ""
          }).then(_ => {
            this.$message({
              type: "success",
              message: "已通过!"
            });
            this.dialogVisible = false;
            this.getDiscs();
          });
        })
        .catch(() => {
          this.dialogVisible = false;
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },

    async setTitle() {
      this.title = this.keyworlds;
    }
  },
  async mounted() {
    this.getDiscs();
    this.$store.commit("setPaging", true);
  },
  computed: {
    ...mapGetters(["page", "uid"]),
    dataList() {
      return [this.title, this.planStatus, this.value];
    }
  },
  watch: {
    page(newVal) {
      this.getDiscs();
    },
    dataList(newVal) {
      this.$store.commit("setPage", 1);
      this.getDiscs();
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input{
  width: 200px;
}
/deep/.el-dialog {
  margin-top: 10vh !important;
}
.el-radio {
  display: block;
  margin-top: 20px;
}
.to-margin{
  .el-row{
    margin-bottom: 10px;
  }
  .el-input,.el-textarea{
    width: calc(100% - 100px);
  }
}
/deep/.el-radio-button__orig-radio:checked+.el-radio-button__inner{
  background: #409EFF;
  color: #ffffff;
}
/deep/.dis-det {
  max-height: calc(100vh - 180px);
  overflow-y: scroll;
  .lineHeight {
    line-height: 28px;
  }
  img {
    width: 100%;
  }
}
</style>
