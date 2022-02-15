<template>
  <div class="banner-his">
    <el-row class="search-bar tar init-row">
      <el-col :span="8" class="tar init-col">
        <el-input
          class="mr10"
          placeholder="输入完整手机号查询"
          v-model="keyWorlds"
        ></el-input>
        <el-button type="dqx-btn" @click="key = keyWorlds" class="ml20"
          >查询</el-button
        >
      </el-col>
    </el-row>
    <div class="history mt20">
      <el-table
        :data="userlist"
        border
        style="width: 100%;"
        height="calc(100vh - 350px)"
      >
        <el-table-column label="注册时间" width="200">
          <template slot-scope="scope">{{
            scope.row.createdAt | formatTime
          }}</template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="invitationCountTotal" label="拉新人数"></el-table-column>
        <el-table-column label="操作">
           <template slot-scope="scope">
            <el-button
              type="text"
              @click="see(scope.row)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
     <el-dialog title="拉新详情" :visible.sync="dialogVisible" width="70%" >
      <el-table
        :data="tableData"
        border
        style="width: 100%;"
        height="calc(100vh - 300px)"
      >
        <el-table-column label="注册时间" width="200">
          <template slot-scope="scope">{{
            scope.row.createdAt | formatTime
          }}</template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
      </el-table>
      <paging ref="paging" @changePage="changePage" :total="totalModal" style="margin-top:10px"></paging>
    </el-dialog>
  </div>
</template>
<script>
import paging from '@/components/Paging/pop-index';
import { mapGetters } from "vuex";
import { users, userDetail } from "@/api/user.js";
import { formatTime } from "@/utils/index.js";
export default {
  data() {
   return {
      userlist: [],
      tableData: [],
      keyWorlds: '',
      key: '',
      mobile: '',
      page_size: 10,
      pageModal: 1,
      totalModal: 0,
      dialogVisible: false
   }
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  methods: {
    see(val) {
      const userId = val.id
      userDetail(userId, {page:this.pageModal}).then(res => {
        this.tableData = res.data
      })
      this.dialogVisible = true
    },
    getUserlist() {
      let params = {
        all: 1,
        exact: 1,
        key: this.key,
        page: this.page,
        page_size: this.page_size,
        real: 1,
        invited: 1
      }
      users(params).then(res => {
        this.userlist = res.data
        this.$store.commit("setTotal", res.meta.pagination.total);
      })
    },
    changePage(val){
      this.pageModal = val
    },
    search() {
      this.$message("操作成功");
      this.getUserlist()
    }
  }, 
  watch: {
    dataList(newVal) {
      if (this.key !== '') {
        this.$store.commit("setPage", 1);
      }
      this.getUserlist();
    },
    page(newVal) {
      this.getUserlist();
    }
  },
  components:{
    paging
  },
  mounted() {
    this.getUserlist();
    this.$store.commit("setPaging", true);
  },
  computed: {
    ...mapGetters(["page"]),
    dataList(){
      return[this.page, this.key]
    }
  },
}
</script>
<style lang="scss">
.init-row {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
}
.init-col {
  display: flex;
}
</style>