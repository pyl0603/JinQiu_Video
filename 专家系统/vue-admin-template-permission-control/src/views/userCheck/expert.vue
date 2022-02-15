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
      <el-table-column label="排序">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="mobile" label="账号"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称"></el-table-column>
      <!-- <el-table-column label="用户头像">
          <template slot-scope="scope">
            <img :src="scope.row.applies[scope.row.applies.length -1 ].current" alt="" class="user-avatar">
              <img :src="scope.row.applies[scope.row.applies.length -1 ].current" alt="" class="big-avatar">
          </template>
      </el-table-column> -->
      <el-table-column label="提交时间">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="itemDet(scope.row)" type="text" size="small"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="专家用户审核"
      :visible.sync="dialogVisible"
      width="60%"
      :show-close="true"
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
            v-model="refultReason"
            placeholder="驳回原因"
            maxlength="60"
          ></el-input>
          <el-row type="flex" justify="end"
            >{{ refultReason.length }}/60</el-row
          >
          <div slot="footer" class="dialog-footer tac mt20">
            <el-button type="dqx-btn" @click="cancle">确定</el-button>
            <el-button @click="innerVisible = false">取消</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- <det
        ref="Det"
        :disTitle="disTitle"
        :disTime="disTime"
        :disCont="disCont"
        :disImg="disImg"
      ></det> -->
      <div>
        <div class="mb20" v-if="this.reviewStatus === 3">
          <em>拒绝理由:</em>
          <p class="refuse-reason">{{ dialogValue.refuseReason }}</p>
        </div>
        <div></div>
        <em>账号：</em><span>{{ dialogValue.mobile }}</span> <em class="ml60">昵称：</em
        ><span>{{ dialogValue.nickname }}</span> <em class="ml60">手机号：</em
        ><span>{{ dialogValue.mobile }}</span>
        <div class="mt20">
          <em>近期比赛：</em><span>{{ dialogValue.recentMatch }}</span>
        </div>
        <div class="mt20">
          <em>推荐理由：</em>
          <el-input
            class="mt10"
            type="textarea"
            :rows="6"
            v-model="dialogValue.reason"
          ></el-input>
        </div>
      </div>
      <div class="mt20">
        <em>职位类别：</em><span>{{ profession }}</span>
        <img
          v-if="dialogValue.professionImage"
          class="check-img"
          :src="dialogValue.professionImage"
        />
      </div>
      <div class="mt20">
        <em>姓名：</em><span>{{ dialogValue.realName }}</span>
        <em class="ml60">身份证号码：</em><span>{{ dialogValue.idNumber }}</span>
      </div>
      <div class="mt20">
        <em>身份证正面（照片清晰无遮挡）</em>
        <img class="check-img" :src="dialogValue.idCardFront" />
        <em>身份证背面（照片清晰无遮挡）</em>
        <img class="check-img" :src="dialogValue.idCardBack" />
      </div>
      <div class="mt20">
        <em>手持身份证照片（照片清晰无遮挡）</em>
        <img class="check-img" :src="dialogValue.idCardHand" />
      </div>
      <div
        v-if="this.reviewStatus === 1"
        slot="footer"
        class="dialog-footer tac"
      >
        <el-button type="dqx-btn" @click="confirm">通过</el-button>
        <el-button @click="innerVisible = true">驳回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Det from "@/views/common/dis-det";
import TopTab from "@/views/common/top-tab";
import { formatTime } from "@/utils/index.js";
import { getDisc, getDiscDet, disDeny, disUndeny } from "@/api/circle";
import { checkedExpert, getExpertApplyList } from "@/api/expert";
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
      reviewStatus: 1,
      dialogValue: {},
      profession: "",
      refultReason: ""
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
    Det,
    TopTab
  },
  methods: {
    // 顶部tab选择
    async chooseTab(val) {
      console.log(val);
      this.reviewStatus = val;
    },
    // 获取列表
    async getDiscs() {
      getExpertApplyList({
        keys: this.title,
        reviewStatus: this.reviewStatus,
        page: this.page
      }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
    // 驳回
    async cancle() {
      // let denyMessage = "";
      // if (this.radio === 1) denyMessage = "广告，软文等营销内容";
      // if (this.radio === 2) denyMessage = "文章内容与标题严重不符";
      // if (this.radio === 3)
      //   denyMessage = "文章开头，正文主体（图片信息）包含各种联系方式";
      // if (this.radio === 4) denyMessage = "淫秽色情";
      // if (this.radio === 5) denyMessage = "违法信息";
      // disDeny(this.id, { denyMessage: denyMessage }).then(_ => {
      //   this.$message("操作成功");
      //   this.dialogVisible = false;
      //   this.innerVisible = false;
      //   this.getDiscs();
      // });
      let params = {
        id: this.dialogValue.id,
        isAccepted: false,
        refuseReason: this.refultReason
      };
      checkedExpert(params).then(_ => {
        this.$message("操作成功");
        this.dialogVisible = false;
        this.innerVisible = false;
        this.getDiscs();
      });
    },
    //   通过
    async confirm() {
      let params = {
        id: this.dialogValue.id,
        isAccepted: true,
        refuseReason: ""
      };
      checkedExpert(params).then(_ => {
        this.$message("操作成功");
        this.dialogVisible = false;
        this.getDiscs();
      });
    },
    //  详情
    async itemDet(val) {
      console.log(val);
      this.dialogVisible = true;
      this.dialogValue = val;
      this.profession = this.dialogValue.professionType.display;
    },
    // 搜索字段
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
      return [this.title, this.reviewStatus];
    }
  },
  watch: {
    page() {
      this.getDiscs();
    },
    dataList() {
      this.$store.commit("setPage", 1);
      this.getDiscs();
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: calc(80% - 200px);
}
/deep/.el-dialog {
  margin-top: 0 !important;
}
.el-radio {
  display: block;
  margin-top: 20px;
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
.check-img {
  width: 300px;
  height: 200px;
}
.refuse-reason {
  color: #ff0000;
}
</style>
