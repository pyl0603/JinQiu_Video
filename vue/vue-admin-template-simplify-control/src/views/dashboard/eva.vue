<template>
  <div class="count"> 
    <div class="el-col-12">
      选择部门：
      <el-select v-model="value" placeholder="请选择" class="mr20" @change="changeDep">
          <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
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
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="calc(100vh - 310px)"
    >
      <el-table-column prop="workName" label="作者"></el-table-column>
      <el-table-column prop="commentCount.article" label="文章"></el-table-column>
      <el-table-column prop="commentCount.video" label="视频"></el-table-column>
      <el-table-column prop="commentCount.discuss" label="帖子"></el-table-column>
      <el-table-column prop="commentCount.total" label="总计" width="120"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getMyDep,getEvaCount } from '@/api/staff'
import { mapGetters } from "vuex";
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
        new Date(new Date().toLocaleDateString()).getTime() , //结束时间
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
      videoTotal: "",
      list:[],
      value:''
    };
  },
  async mounted() {
    this.$store.commit("setPaging", false);
    getMyDep().then(res => {
      this.list = res.data;
      this.value = this.list[0].id;
      this.getIndex();
    })
  },
  methods: {
    // 部门选择
    async changeDep(val) {
      this.value = val;
    },
    //   日期筛选相关
    async pick(val) {
      console.log(val);
    },
    // 日期选择
    async change(val) {
      console.log(val);
      this.start = val[0];
      this.end = val[1];
    },
    // 获取列表
    async getIndex() {
      let type = "";
      getEvaCount(
        this.value,
        {
          start: this.start - 3600 * 1000 * 2.5,
          end: this.end + 3600 * 1000 * 21.5 
        }
      ).then(res => {
        this.tableData = res.data;
      });
    }
  },
  computed: {
    ...mapGetters(["roles", "user_id"]),
    dataList() {
      return [this.start, this.end];
    }
  },
  watch: {
    value(newVal) {
      this.getIndex();
    },
    dataList(newVal) {
      this.getIndex();
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