<template>
  <div>
    <top-tab ref="topTab" @chooseTab="chooseTab" :chooseIndex="chooseIndex" :tabList="tabList"></top-tab>
    <div class="contMana">
      <el-row>
        <div class="el-col-12 tar">
          <el-button type="dqx-btn" @click="goAdd" class="mr20">添加内容</el-button>搜索：
          <el-input class="mr20" v-model="keyworlds" v-inputRule></el-input>
          <el-button type="dqx-btn" @click="setTitle">查询</el-button>
          <el-button @click="reSet">重置</el-button>
        </div>
      </el-row>
      <el-row class="mt20">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          height="calc(100vh - 310px)"
        >
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleDelete(scope.row.id)" v-if="scope.row.isPublish">删除</el-button>
              <el-button size="mini" type="text" @click="handleEdit(scope.row.id)">查看</el-button>
              <!-- <el-button
                size="mini"
                type="text"
                @click="handleCheck(scope.row)"
              >{{scope.row.checkStatus | checkTxt(scope.row.isPublish)}}</el-button> -->
            </template>
          </el-table-column>
          <el-table-column prop="title" label="文章名称"></el-table-column>
          <el-table-column prop="author" label="文章作者" width="120"></el-table-column>
          <el-table-column prop="sourceLink" label="文章来源"></el-table-column>
          <el-table-column prop="view" label="阅读量" width="100"></el-table-column>
          <!-- <el-table-column label="定时发布" width="250">
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.publishTiming"
                type="datetime"
                placeholder="选择定时发布时间"
                v-if="!scope.row.isPublish && scope.row.checkStatus === 1"
                @change="changePubTime($event,scope.$index,scope.row.id)"
                value-format="timestamp"
                format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </template>
          </el-table-column>-->
          <el-table-column label="发布时间" width="200" v-if="isPublish">
            <template slot-scope="scope">{{ scope.row.publishTime | formatTime }}</template>
          </el-table-column>
          <el-table-column label="置顶" width="120" v-if="isPublish">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleTop(scope.row.id,scope.row.isRecommend)"
              >{{scope.row.isRecommend ? '取消置顶' : '置顶'}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="类型标签" width="200" v-if="isPublish">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.label"
                placeholder="请选择"
                class="mr30"
                v-if="scope.row.isPublish"
                @change="setTag($event,scope.row.id)"
              >
                <el-option
                  v-for="item in optiontag"
                  :key="item.type"
                  :label="item.text == '' ? '空' : item.text"
                  :value="item.type"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  getCont,
  delCont,
  putContTop,
  setContTime,
  contPublish,
  contCheck,
  getLable,
  addLabel
} from "@/api/edit.js";
import TopTab from "@/views/common/top-tab";
import { mapGetters } from "vuex";
import { formatTime } from "@/utils/index.js";
export default {
  data() {
    return {
      tabList: [
        { name: "管理文章", value: "article" },
        { name: "管理视频", value: "video" }
      ],
      tableData: [],
      multipleSelection: [],
      title: "",
      keyworlds: "",
      isPublish: true,
      checkStatus: "",
      type: "article", //判断当前是文章还是视频
      optiontag: [],
      tag: "",
      chooseIndex:0,
      options: [
        {
          value: true,
          label: "已发布"
        },
        {
          value: 0,
          label: "待审核"
        },
        {
          value: 2,
          label: "驳回记录"
        }
      ],
      value: "",
      itemIndex: 0
    };
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    },
    checkTxt(checks, e) {
      if (checks === 0) {
        return "审核";
      }
      if (checks === 1 && !e) {
        return "发布";
      }
      if (checks === 1 && e) {
        return "已发布";
      }
      if (checks === 2) {
        return " 被驳回";
      }
    }
  },
  components: {
    TopTab
  },
  mounted() {
    if (this.$route.query.type) {
      this.type = this.$route.query.type == "article" ? "article" : "video";
      this.chooseIndex = this.$route.query.type == "article" ? 0 : 1;
    }
    this.getIndex();
    // 获取标签列表
    getLable().then(res => {
      this.optiontag = res.data;
    });
    this.$store.commit("setPaging", true);
  },
  methods: {
    // 设置标签
    setTag(val, e) {
      addLabel({ id: e, label: val }).then(_ => {
        this.$message("设置成功");
        this.getIndex();
      });
    },
    // 下拉筛选
    changeStatus(val, e) {
      this.itemIndex = e;
      if (val === true) {
        this.isPublish = true;
        this.checkStatus = "";
      } else {
        this.isPublish = false;
        this.checkStatus = val;
      }
    },
    // 设置自动发布的时间
    changePubTime(val, e, id) {
      let item = this.tableData[e];
      item.publishTiming = val;
      this.$set(this.tableData, e, item);
      setContTime(id, val, this.type).then(_ => {
        this.$message("操作成功");
      });
    },
    // 关键字搜索
    setTitle() {
      this.$store.commit("setPage", 1);
      this.title = this.keyworlds;
    },
    // 获取列表
    getIndex() {
      getCont(
        {
          page: this.page,
          title: this.title,
          isPublish: this.isPublish,
          checkStatus: this.checkStatus
        },
        this.type
      ).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
    //   顶部tab,切换数据源
    chooseTab(val) {
      this.type = val;
      this.itemIndex = 0;
      this.isPublish = true;
      this.$store.commit("setPage", 1);
      this.checkStatus = "";
    },
    //   是否展示
    changeSwitch() {},
    // 文章修改
    handleEdit(val) {
      this.$router.push({
        path: "/edit/index",
        query: { type: this.type, id: val }
      });
    },
    // 置顶
    handleTop(val, e) {
      putContTop(val, !e, this.type).then(_ => {
        this.$message("操作成功");
        this.page = 1;
        this.getIndex();
      });
    },
    // 定时发布
    setTime(val) {
      console.log(1);
    },
    // 添加内容
    goAdd() {
      this.$router.push({ path: "/edit/index", query: { type: this.type } });
    },
    // 文章删除
    handleDelete(val) {
      delCont(val, this.type).then(_ => {
        this.$message("删除成功");
        this.getIndex();
      });
    },
    // 内容审核
    handleCheck(val) {
      if (!val.isPublish && val.checkStatus === 1) {
        contPublish(val.id, this.type).then(_ => {
          this.$message("操作成功");
          this.getIndex();
        });
      }
      if (val.checkStatus === 0) {
        this.$router.push({
          path: "/edit/index",
          query: { type: this.type, id: val.id }
        });
      }
      return;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 重置条件
    reSet() {
      Object.assign(this.$data, this.$options.data());
    }
  },
  computed: {
    ...mapGetters(["page"]),
    dataList() {
      return [
        this.page,
        this.title,
        this.isPublish,
        this.checkStatus,
        this.type
      ];
    }
  },
  watch: {
    dataList(newVal) {
      this.getIndex();
    }
  }
};
</script>
<style lang="scss" scoped>
.contMana {
  padding: 20px;
  .checkStatus + .checkStatus {
    border-left: 1px solid #eee;
  }
  .checkStatus {
    display: inline-block;
    padding: 0 20px;
  }
  .el-input {
    width: calc(80% - 250px);
  }
  table {
    border: 1px solid #f5f5f5;
  }
  .el-date-editor {
    width: 200px;
  }
}
</style>
