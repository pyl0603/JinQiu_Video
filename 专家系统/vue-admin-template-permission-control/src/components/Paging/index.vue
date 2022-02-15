<template>
 <div class="block paging" v-if="isPaging">
    <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters([
      "total",
      "isPaging",
      'page'
      ])
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.$store.commit("setPage", val)
    }
  },
  data() {
    return {
      currentPage: 1
    };
  }
};
</script>
<style lang="scss" scoped>
// scss新增样式
/deep/.el-pagination{
  text-align: right;
  padding-right: 20px;
  font-size:14px;
  position: absolute;
  bottom:20px;
  width: 100%;
  padding-right: 60px!important;
}

</style>
