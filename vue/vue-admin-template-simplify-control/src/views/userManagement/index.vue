<template>
  <div class="user-management">
    <div class="operate-group">
      搜索：
      <el-input v-model="searchKey" v-inputRule clearable @keyup.enter.native="sear"/>
      <el-button class="ml20" type="dqx-btn" @click="sear">搜索</el-button>
      <el-button class="ml20" @click="keys='',searchKey = ''">重置</el-button>
    </div>
    <div class="content mt30">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="用户ID"
        />
        <el-table-column
          prop="nickname"
          label="用户昵称"
        />
        <el-table-column
          prop="mobile"
          label="手机号码"
        />
        <el-table-column label="注册时间" width="300">
        <template slot-scope="scope">{{ scope.row.createdAt | formatTime}}</template>
      </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { userList } from '@/api/staff'
import { formatTime } from "@/utils/index.js";
export default {
  data() {
    return {
      searchKey: '',
      keys:'',
      tableData: []
    }
  },
   filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  mounted() {
    this.$store.commit('setPaging', true)
    this.getIndexs()
  },
  methods: {
    // 搜索
    sear(){
      this.keys = this.searchKey.replace(/\s*/g,"");
      if(this.keys == ''){
        this.$message("请输入关键字")
        return
      }
    },
    getIndexs() {
     userList({
        all: 1,
        page: this.page,
        key: this.keys,
        real: this.real
      }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    }
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters(['page']),
  },
  // eslint-disable-next-line vue/order-in-components
  watch: {
    page(newVal) {
      this.getIndexs()
    },
    keys(newVal){
      if(this.page != 1){
        this.$store.commit('setPage',1);
      }else{
        this.getIndexs()
      }

    }
  }
}
</script>
<style lang="scss" scoped>
.operate-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .el-input {
      width: 200px;
    }
  }
</style>
