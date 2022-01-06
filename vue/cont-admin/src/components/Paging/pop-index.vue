<template>
  <div class="block">
    <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: {
      total:{
          type:Number,
          default:10
      },
      pageSize:{
        type:Number,
        default:10
      },
      currentPage:{
        type:Number,
        default: 1
      }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.$emit('changePage',val)
    }
  },
  data() {
    return {
    };
  },
  
};
</script>
<style lang="scss">
// scss新增样式
.el-pagination {
  text-align: right;
  padding-right: 20px;
  font-size: 14px;
}
.el-pagination__total {
  position: absolute;
  left: 40px;
}
.el-pager li {
  background-color: #fff !important;
  border: 1px solid #cecece;
  border-radius: 4px !important;
}
.el-pager li:hover {
  color: #fff !important;
  background-color: #adadad !important;
}
.el-pager li.active {
  background-color: #adadad !important;
}
.el-pager li.active + li {
  border-left: 1px solid #cecece;
}
</style>
