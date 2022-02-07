<template>
  <div class="match-item">
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="mb10"
      height="calc(100vh - 290px)"
    >
      <el-table-column label="发布时间" width="300">
        <template slot-scope="scope">{{ scope.row.publishTime| formatTime}}</template>
      </el-table-column>
       <el-table-column label="文章名称">
            <template slot-scope="scope"><em v-if="scope.row.isTop">置顶</em>{{ scope.row.title }}</template>
          </el-table-column>
      <el-table-column prop="publisher.nickName" label="作者" width="300"></el-table-column>
      <!-- <el-table-column prop="subhead" label="关键词" width="100"></el-table-column> -->
      <el-table-column label="关联" width="120" v-if="matchChoose">
        <template slot-scope="scope">
          <el-button
            @click="isPush ? handleClick(scope.row) : showPop(scope.row)"
            type="text"
            size="small"
          >{{isPush ? '选择' : '推送'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <paging ref="paging" @changePage="changePage" :total="total"></paging>
  </div>
</template>
<script>
import paging from "@/components/Paging/pop-index";
// import { getArticles } from '@/api/public'
import { availablePlanList } from "@/api/expert.js";
import { formatTime } from "@/utils/index.js";
export default {
  props: {
    matchChoose: {
      type: Boolean,
      default: true
    },
    startTime: {
      type: Number,
      default: 0
    },
    endTime: {
      type: Number,
      default: 0
    },
    isPush: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 表格数据
      tableData: [],
      total: 0,
      page: 1,
      isAvailable: true, //方案是否在售
    };
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  components: {
    paging
  },
  methods: {
    handleClick(val) {
      console.log(val)
      this.$emit("associated",["4",val.title, val.id])
    },
    changePage(val) {
      this.page = val;
    },
    getList() {
      let val = this.endTime === 0 ? { page: this.page } : { page: this.page, start: this.startTime, end: this.endTime };
      availablePlanList({
          page: this.page,
          isAvailable: this.isAvailable
           } ).then(res => {
        console.log(res)
        this.tableData = res.data;
        this.total = res.meta.pagination.total;
      });
    },
    // 弹窗关联
    showPop(val) {
      this.$emit("showPop", val);
    }
  },
  mounted() {
    this.getList();
    this.$store.commit("setPaging", false);
  },
  computed: {
    pages() {
      let data = [this.page, this.startTime, this.endTime];
      return data;
    }
  },
  watch: {
    pages(newVal) {
      this.getList();
    }
  }
};
</script>
<style lang="scss" scoped>
 em{
    color: #18CE94;
    display: inline-block;
    margin-right: 5px;;
  }
img {
  height: 50px;
}
</style>
