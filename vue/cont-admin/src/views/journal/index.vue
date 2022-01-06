<template>
  <div class="journal">
    <el-row>
      <em>选择日期：</em>
      <el-date-picker
        v-model="dataRang"
        type="daterange"
        value-format="timestamp"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="change"
      ></el-date-picker>
      <el-button type="dqx-btn" class="ml20">查询</el-button>
      <el-button @click="reSet">重置</el-button>
    </el-row>
     <!-- 表格 -->
      <el-table :data="tableData" border height="calc(100vh - 300px)" style="width: 100%;" class="mt20">
        <el-table-column prop="uid" label="操作人" class="el-col-4"></el-table-column>
        <el-table-column prop="content" label="操作行为" class="el-col-4"></el-table-column>
      </el-table>
  </div>
</template>
<script>
import { getLogs } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      dataRang: "",
      tableData: [],
      start:'',
      end:''
    };
  },
  methods:{
    // 获取列表
    getIndex(){
      getLogs({start:this.start,end:this.end,page:this.page}).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      })
    },
    // 日期变化
    change(val){
      this.start = val[0];
      this.end = val[1] + 3600 * 1000 * 24 - 1000;
    },
    // 重置条件
    reSet() {
      Object.assign(this.$data, this.$options.data());
    }
  },
  mounted(){
    this.getIndex();
      this.$store.commit('setPaging',true);
  },
  computed:{
    ...mapGetters(['page']),
    dataList(){
      return[this.page,this.start,this.end]
    }
  },
  watch:{
    dataList(newVal){
      this.getIndex();
    }
  }
};
</script>
