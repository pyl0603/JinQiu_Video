<template>
  <div class="banner-his">
    <el-row class="search-bar">
      <el-col :span="12">
        <span class="show-tab cp" @click="tabs(200)" :class="{c18c : def === 200}">未发货</span>
        <span class="show-tab cp" @click="tabs(201)" :class="{c18c : def === 201}">已发货</span>
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
      </el-col>
    </el-row>
    <div class="history mt20">
      <el-table
        :data="tableData"
        border
        style="width: 100%;"
        height="calc(100vh - 300px)"
      >
        <el-table-column label="订单号" prop="id" width="200">
        </el-table-column>
        <el-table-column prop="receiver" label="收件人"></el-table-column>
        <el-table-column prop="contact" label="手机号码"></el-table-column>
        <el-table-column label="礼品等级">
          <template slot-scope="scope">
            {{scope.row.vo.group.title}}
          </template>
        </el-table-column>
        <el-table-column label="商品简称">
          <template slot-scope="scope">
            {{scope.row.vo.title}}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="edit(scope.row)"
              v-if="scope.row.status.value == 200"
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="send(scope.row)"
              v-if="scope.row.status.value == 200"
              >发货</el-button
            >
             <el-button
              type="text"
              @click="see(scope.row)"
              v-if="scope.row.status.value != 200"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="物流管理" 
      :close-on-click-modal="false" :visible.sync="dialogVisible" width="70%" :show-close="false">
      <Edit :deliver="deliver" :orderMsg="orderMsg" :data="itemDet" @getlist="getIndex"></Edit>
    </el-dialog>
  </div>
</template>
<script>
import { getDelivery } from "@/api/active.js";
import { mapGetters } from "vuex";
import { formatTime } from "@/utils/index.js";
import Edit from './log-edit.vue'
export default {
  data() {
    return {
      dataRang: "",
      tableData: [],
      keyWorlds: "",
      code: "",
      key: '',
      def: 200,
      created:true,
      dialogVisible: false,
      deliver:false,
      orderMsg:false,
      itemDet:{}
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
    // 弹窗确认按钮
    getIndex(){
      this.dialogVisible = false;
      this.getList()
    },
    // 发货
    send(val){
      this.deliver = true;
      this.orderMsg = false;
      this.itemDet = val;
      this.dialogVisible = true;
    },
    // 编辑
    edit(val){
      this.orderMsg = true;
      this.deliver = false;
      this.itemDet = val;
      this.dialogVisible = true;
    },
    see(val){
      this.orderMsg = true;
      this.deliver = true;
      this.itemDet = val;
      this.dialogVisible = true;
    },
    // 切换事件
    tabs(val) {
      this.def = val;
    },
    // 弹窗确认按钮去
    createData(){},
    getList() {
      getDelivery({ page: this.page,status:this.def,key:this.key }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
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
      return[this.def,this.key]
    }
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
