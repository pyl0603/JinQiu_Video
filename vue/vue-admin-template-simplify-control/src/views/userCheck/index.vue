<template>
  <div class="app-user">
    
    <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList"></top-tab>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="mb10 mt10"
      height="calc(100vh - 240px)"
    >
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column label="用户头像">
          <template slot-scope="scope">
            <img :src="scope.row.applies[scope.row.applies.length -1 ].current" alt="" class="user-avatar">
              <img :src="scope.row.applies[scope.row.applies.length -1 ].current" alt="" class="big-avatar">
            <!-- <div v-for="item in scope.row.applies" :key="item.id" v-if="item.type">
              
            </div> -->
          </template>
      </el-table-column>
      <el-table-column prop="nickname" label="用户昵称"></el-table-column>
      <el-table-column prop="mobile" label="手机"></el-table-column>
      <el-table-column prop="roles[0].name" label="第三方"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click="confirm(scope.row.applies)" type="text" size="small">通过</el-button>
          <el-button @click="cancle(scope.row.applies)" type="text" size="small">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getCheckUser,checkedUser } from "@/api/staff";
import { mapGetters } from "vuex";
import TopTab from "@/views/common/top-tab";
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      userInfo: { gender: { display: "" } },
      mobile:'',
      tabList: [
        { name: "未审核列表", value: 'Main' },
        { name: "审核通过", value: 'Match' },
        { name: "审核驳回", value: 'Data' }
      ],
    };
  },
  methods: {
    // 顶部tab选择
    async chooseTab(val){},
    // 获取列表
    async getList() {
      getCheckUser({page: this.page,mobile:this.mobile,page_size:5 }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
    // 确认
    async confirm(val){
      let id =''
      val.map(res => {
        if(res.type){
          id = res.id
        }
      })
      let data = [{id:id,isPass:true}]
      checkedUser(data).then(_ => {
        this.$message('操作成功');
        this.getList();
      })
    },
    // 驳回
    async cancle(val){
      let id =''
      val.map(res => {
        if(res.type){
          id = res.id
        }
      })
       checkedUser([{id:id,isPass:false}]).then(_ => {
        this.$message('操作成功');
        this.getList();
      })
    },
    // 封号
    async close(val) {}
  },
  async mounted() {
    this.getList();
    this.$store.commit('setPaging',true)
  },
  components:{
    TopTab
  },
  computed: {
     ...mapGetters(["page"]),
  },
  watch: {
    page(newVal) {
      console.log(1)
      this.getList();
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-dialog {
  margin-top: 8vh !important;
  em {
    display: inline-block;
    padding: 5px 10px;
    background: rgba(249, 249, 249, 1);
    border: 1px solid rgba(206, 206, 206, 1);
    border-radius: 8px;
  }
}
.user-avatar{
    width: 45px;
    height: 45px;
    // border-radius: 50%;
}
.big-avatar{
    display: none;
}
.hover-row .big-avatar{
    display: inline-block;
    width: 450px;
    height: 450px;
    background: #000;
    position: absolute;
    z-index: 999;
    margin-left: 20px;
}
</style>