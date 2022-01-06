<template>
  <div class="banner-his">
    <el-row class="search-bar">
      <el-col :span="12">
        <span class="show-tab cp" @click="tabs(0)" :class="{c18c : def === 0}">上架</span>
        <span class="show-tab cp" @click="tabs(1)" :class="{c18c : def === 1}">下架</span>
      </el-col>
      <el-col :span="12" class="tar">
      <el-input
        class="mr10"
        placeholder="请输入关键字"
        v-model="keyWorlds"
      ></el-input>
      <el-button type="dqx-btn" @click="key = keyWorlds" class="mr20"
        >查询</el-button
      >
      <el-button type="dqx-btn" @click="created = true,dialogVisible = true,itemDet = {}" class="ml30"
        >新增礼品</el-button
      >
      </el-col>
    </el-row>
    <div class="history mt20">
      <el-table
        :data="tableData"
        border
        style="width: 100%;"
        height="calc(100vh - 300px)"
      >
        <el-table-column label="礼品等级" width="200">
          <template slot-scope="scope">{{
            scope.row.group.title
          }}</template>
        </el-table-column>
        <el-table-column prop="fullName" label="礼品标题"></el-table-column>
        <el-table-column prop="title" label="商品简称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="edit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="del(scope.row.id)"
              >{{def === 0 ? '下架' : '上架'}}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="礼品管理" style="margin-top:-10vh" 
      :close-on-click-modal="false" :visible.sync="dialogVisible" width="80%" :show-close="false">
      <Edit @getlist="getIndex" :data="itemDet"></Edit>
      <!-- <div slot="footer" class="dialog-footer tac">
            <el-button type="dqx-btn" @click="createData">保存</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </div> -->
    </el-dialog>
  </div>
</template>
<script>
import { getGift, addGift, putGift, setStatus} from "@/api/active.js";
import { mapGetters } from "vuex";
import { formatTime } from "@/utils/index.js";
import Edit from './gift-edit.vue'
export default {
  data() {
    return {
      dataRang: "",
      tableData: [],
      keyWorlds: "",
      code: "",
      created:true,
      dialogVisible: false,
      itemDet:'',
      key:'',
      keyWorlds:'',
      def:0
    };
  },
  components:{
    Edit
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  methods: {
    // 切换事件
    tabs(val) {
      this.def = val;
    },
    // 弹窗确认按钮去
    getIndex(){
      this.dialogVisible = false;
      this.getList()
    },
    getList() {
      let status = this.def === 0 ? true : false
      getGift({ page: this.page,key:this.key,status:status}).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
    // 编辑
    edit(val){
      this.itemDet = val;
      this.dialogVisible = true;
    },
    // 删除
    del(val){
      let status = this.def === 0 ? false : true
      setStatus(val,{value:status}).then(res => {
        this.$message("操作成功");
        this.getList();
      })
    },
    use(val) {
      useCode(val).then(_ => {
        this.$message("操作成功");
        this.getList();
      });
    },
    change(val) {
      console.log(val[0], val[1]);
    },
    handleClick(val) {
      this.$emit("chooseItem", val);
    }
  },
  mounted() {
    this.getList();
    this.$store.commit("setPaging", true);
  },
  computed: {
    ...mapGetters(["page"]),
    dataList(){
      return [this.key,this.def]
    },
  },
  watch: {
    dataList(newVal) {
      if (this.page != 1) {
        this.page = 1;
      } else {
        this.getList();
      }
    },
    page(newVal) {
      this.getList();
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 300px;
}
.show-tab {
  display: inline-block;
  width: 120px;
  text-align: center;
  font-size: 14px;
}
.show-tab + .show-tab {
  border-left: 1px solid #f5f5f5;
}
</style>
