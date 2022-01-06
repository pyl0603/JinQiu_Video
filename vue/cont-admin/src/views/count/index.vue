<template>
  <div class="count">
    <div class="el-col-24">
      <div class="el-col-12 cada">
        <span class="f24 mr10 c222">我的统计 :</span>
        <span class="f20 cp mr20" @click="setType(1)" :class="{c18c:type===1}">文章：{{articleTotal}}</span>
        <span class="f20">|</span>
        <span class="f20 cp ml20" @click="setType(2)" :class="{c18c:type===2}">视频：{{videoTotal}}</span>
      </div>
      <div class="el-col-12 tar">
        时间：
        <el-date-picker
          v-model="dataRang"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          @change="change"
          @pick="pick"
          align="right"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="calc(100vh - 310px)"
    >
     <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleEdit(scope.row.id)">查看</el-button>
            </template>
          </el-table-column>
      <el-table-column prop="title" label="文章名称"></el-table-column>
      <el-table-column label="发布时间" width="200">
            <template slot-scope="scope">{{ scope.row.publishTime | formatTime }}</template>
          </el-table-column>
      <el-table-column prop="countView" label="浏览量" width="120"></el-table-column>
      <el-table-column prop="countLike" label="点赞数"  width="120"></el-table-column>
      <el-table-column prop="countComment" label="评论数" width="100"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getCont } from "@/api/edit.js";
import { mapGetters } from "vuex";
import { formatTime } from "@/utils/index.js";
export default {
  data() {
    let _this = this;
    return {
      dataRang: [
        new Date(new Date().toLocaleDateString()).getTime(),
        new Date(new Date().toLocaleDateString()).getTime()
      ], //  时间选择
      tableData: [], //列表
      start: new Date(new Date().toLocaleDateString()).getTime(), //开始时间
      end:
        new Date(new Date().toLocaleDateString()).getTime(), //结束时间
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
              _this.start = new Date(new Date().toLocaleDateString()).getTime();
              _this.end =
                new Date(new Date().toLocaleDateString()).getTime();
              _this.dataRang = [_this.start, _this.end];
            }
          },
          {
            text: "三天内",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 72);
              picker.$emit("pick", date);
              _this.start =
                new Date(new Date().toLocaleDateString()).getTime() -
                3600 * 1000 * 24 * 3;
              _this.end =
                new Date(new Date().toLocaleDateString()).getTime();
              _this.dataRang = [_this.start, _this.end];
            }
          },
          {
            text: "一周内",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
              _this.start =
                new Date(new Date().toLocaleDateString()).getTime() -
                3600 * 1000 * 24 * 7;
              _this.end =
                new Date(new Date().toLocaleDateString()).getTime();
              _this.dataRang = [_this.start, _this.end];
            }
          }
        ]
      },
      type: 1,
      articleTotal: "",
      videoTotal: ""
    };
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    },
  },
  async mounted() {
    this.$store.commit("setPaging", true);
    this.getIndex();
    this.getArticle();
    this.getVideo();
  },
  methods: {
    // 查看详情
    async handleEdit(val){
      if(this.type === 1){
        this.$router.push({
        path: "/addCont/index",
        query: { id: val }
      });
      }else{
        this.$router.push({
        path: "/video/index",
        query: { id: val }
      });
      }
    },
    // 类型原则
    async setType(val) {
      this.type = val;
    },
    //   日期筛选相关
    async pick(val) {
      console.log(val);
    },
    // 日期选择
    async change(val) {
      this.start = val[0];
      this.end = val[1];

      this.getArticle();
      this.getVideo();
    },
    // 获取列表
    async getIndex() {
      let type = "";
      getCont(
        {
          type: this.type,
          page: this.page,
          isPublish: true,
          status: 1,
          start: this.start - 3600 * 1000 * 2.5,
          end: this.end + 3600 * 1000 * 21.5 
        },
        type
      ).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
    async getArticle() {
      let type = "";
      getCont(
        {
          type: 1,
          page: this.page,
          isPublish: true,
          status: 1,
          start: this.start - 3600 * 1000 * 2.5,
          end: this.end + 3600 * 1000 * 21.5 
        },
        type
      ).then(res => {
        this.articleTotal = res.meta.pagination.total;
      });
    },
    async getVideo() {
      let type = "";
      getCont(
        {
          type: 2,
          page: this.page,
          isPublish: true,
          status: 1,
          start: this.start - 3600 * 1000 * 2.5,
          end: this.end + 3600 * 1000 * 21.5 
        },
        type
      ).then(res => {
        this.videoTotal = res.meta.pagination.total;
      });
    }
  },
  computed: {
    ...mapGetters(["page", "roles", "user_id"]),
    dataList() {
      return [this.type, this.start, this.end];
    }
  },
  watch: {
    page(newVal) {
      this.getIndex();
    },
    dataList(newVal) {
      if (this.page == 1) {
        this.getIndex();
      } else {
        this.$store.commit("setPage", 1);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  display: inline-block;
  width: calc(70% - 100px);
}
</style>