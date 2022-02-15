<template>
  <div class="diss">
    <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList"></top-tab>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="mb10 mt10"
      height="calc(100vh - 300px)"
    >
      <el-table-column label="提审时间">
        <template slot-scope="scope">
          {{ scope.row.createTime | formatTime }}
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="用户昵称"></el-table-column>
      <el-table-column prop="mobile" label="账号"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="itemDet(scope.row)" type="text" size="small"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="主播用户审核"
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
      <div>
        <div class="mb20" v-if="this.reviewStatus === 2">
          <em>拒绝理由:</em>
          <p class="refuse-reason">{{ dialogValue.refuseReason }}</p>
        </div>
        <div></div>
      </div>
      <div class="mt20">
        <em>姓名：</em><span>{{ dialogValue.realName }}</span>
        <em class="ml60">身份证号码：</em
        ><span>{{ dialogValue.idcardNo }}</span>
      </div>
      <div class="two-part">
        <!-- 左侧小图 -->
        <div class="left">
          <div class="mt20 items">
            <div>
              <em class="title">身份证正面（照片清晰无遮挡）</em>
              <img class="check-img" :src="dialogValue.frontImage" @click="bigImg = dialogValue.frontImage"/>
            </div>
            <div>
              <em class="title">身份证背面（照片清晰无遮挡）</em>
              <img class="check-img" :src="dialogValue.backImage"  @click="bigImg = dialogValue.backImage"/>
            </div>
          </div>
          <div class="mt20 items">
            <div>
              <em class="title">手持身份证照片（照片清晰无遮挡）</em>
              <img class="check-img" :src="dialogValue.handImage"  @click="bigImg = dialogValue.handImage"/>
            </div>
          </div>
        </div>
        <!-- 右侧大图 -->
        <div class="right">
          <img :src="bigImg" alt="">
        </div>
      </div>
      <div
        v-if="this.reviewStatus === 0"
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
import { checkedAnchor, getAnchorApply } from "@/api/live";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tabList: [
        { name: "待审核", value: 0 },
        { name: "审核通过", value: 1 },
        { name: "审核驳回", value: 2 }
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
      reviewStatus: 0,
      dialogValue: {},
      profession: "",
      refultReason: "",
      bigImg:''
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
      this.reviewStatus = val;
    },
    // 获取列表
    async getDiscs() {
      getAnchorApply({
        status: this.reviewStatus,
        page: this.page,
        page_size: 10
      }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
    // 驳回
    async cancle() {
      let params = {
        status: false,
        reason: this.refultReason
      };
      checkedAnchor(this.dialogValue.id,params).then(_ => {
        this.$message("操作成功");
        this.dialogVisible = false;
        this.innerVisible = false;
        this.getDiscs();
      });
    },
    //   通过
    async confirm() {
      let params = {
        status: true,
        reason: ""
      };
      checkedAnchor(this.dialogValue.id,params).then(_ => {
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
      this.bigImg = val.frontImage;
      // this.profession = this.dialogValue.professionType.display;
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
.items {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  div {
    margin-right: 20px;
  }
}
.title {
  display: block;
  margin-bottom: 10px;
}
.check-img {
  width: 100%;
}
.refuse-reason {
  color: #ff0000;
}
.two-part{
  display: flex;
  justify-content: flex-start;
  .left{
    width: 50%;
  }
  .right{
    width: 50%;
    img{
      width: 80%;
    }
  }
}

</style>
