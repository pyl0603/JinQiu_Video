<template>
  <div class="app-user">
    <div class="el-col-24 tar mb20">
      只查看真实用户：<el-switch :value="real" @change="changeReal" />
      <el-input placeholder="请输入用户昵称或真实姓名" class="ml20 mr10" v-inputRule v-model="names"  @keyup.enter.native="search"></el-input>
      <el-button type="dqx-btn" @click="search">搜索</el-button>
      <el-button  @click="reSet">重置</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="mb10 mt20"
      height="calc(100vh - 240px)"
    >
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称"></el-table-column>
      <el-table-column prop="mobile" label="手机"></el-table-column>
      <el-table-column label="注册时间" width="300">
        <template slot-scope="scope">{{ scope.row.createdAt | formatTime}}</template>
      </el-table-column>
      <el-table-column prop="roles[0].name" label="第三方"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click="det(scope.row)" type="text" size="small">查看</el-button>
          <el-button
            @click="scope.row.enabled?set(scope.row):cancle(scope.row)"
            type="text"
            size="small"
          >{{scope.row.enabled?'封号':'解封'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="用户封号" :visible.sync="dialogVisible" :show-close="false">
      <div>
        封号理由：
        <el-select v-model="value" placeholder="请选择" class="mr20" @change="change">
          <el-option v-for="item in reason" :key="item.id" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </div>
      <div class="mt20">
        其他理由：
        <el-input placeholder="请输入描述" :disabled="value != '其他'" v-model="reasonTxt"></el-input>
      </div>
      <div class="mt20">
        清空数据：
        <el-switch v-model="clearData" @change="changeClearData" />
      </div>
      <div slot="footer" class="dialog-footer tac">
        <el-button type="dqx-btn" @click="confirmClose()">封号</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog width="70%" title="用户详情(处罚记录)" :visible.sync="dialogFormVisible" :show-close="false">
      <!-- 用户信息 -->
      <div>
        <div class="mb20">
          用户头像：
          <img :src="userInfo.avatar" alt width="50" />
          <span class="ml30" v-if="pName != ''">
            主账户姓名：
            <em>{{ pName }}</em>
          </span>
          <span class="ml30" v-if="pPhone != ''">
            主账号手机号：
            <em>{{ pPhone }}</em>
          </span>
        </div>
        <span class="mr30">
          用户ID：
          <em>{{userInfo.id}}</em>
        </span>
        <span class="mr30">
          用户名：
          <em>{{userInfo.nickname}}</em>
        </span>
        <span class="mr30">
          微信号：
          <em>{{userInfo.mobile}}</em>
        </span>
        <span class="mr30">
          手机号：
          <em>{{userInfo.mobile}}</em>
        </span>
        <span class="mr30">
          性别：
          <em>{{userInfo.gender.display}}</em>
        </span>
      </div>
      <!-- 用户处罚记录 -->
      <div>
        <el-table
          :data="tableDataPun"
          border
          style="width: 100%"
          class="mb10 mt10"
          height="calc(76vh - 240px)"
        >
          <el-table-column label="举报时间">
            <template slot-scope="scope">{{ scope.row.createdAt | formatTime}}</template>
          </el-table-column>
          <el-table-column prop="type.display" label="处理结果"></el-table-column>
          <el-table-column label="处罚截止">
            <template slot-scope="scope">{{scope.row.endAt | formatTime}}</template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer tac">
        <el-button type="dqx-btn" @click="dialogFormVisible = false">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  userList,
  getPun,
  disableUser,
  enableUser,
  getUserInfo,
  delUserData
} from "@/api/staff";
import { mapGetters } from "vuex";
import { formatTime } from "@/utils/index.js";
export default {
  data() {
    return {
      tableData: [],
      tableDataPun: [],
      dialogFormVisible: false,
      dialogVisible: false,
      userInfo: { gender: { display: "" } },
      uid: "",
      names: "",
      key: "",
      reasonTxt: "",
      real: true,
      value: "频繁发表淫秽色情言论",
      reason: [
        { name: "频繁发表淫秽色情言论", id: 1 },
        { name: "多次发表违法信息", id: 2 },
        { name: "频繁发布营销广告", id: 3 },
        { name: "多次对他人恶意攻击谩骂", id: 4 },
        { name: "其他", id: 5 }
      ],
      pName: "",
      pPhone: "",
      clearData: false
    };
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  methods: {
    // 重置数据
    async reSet(){
      this.key = '';
      this.real = true;
      this.names = '';
    },
    // 是否清除数据
    async changeClearData(val) {
      this.clearData = val;
    },
    // 用户姓名/昵称搜索
    async search() {
      this.key = this.names;
    },
    // 切换真实用户
    async changeReal(val) {
      this.real = val;
    },
    // 修改封号理由
    async change(val) {},
    // 获取惩罚列表
    async getPuns() {
      getPun({ page: 1, page_size: 50, uid: this.uid }).then(res => {
        this.tableDataPun = res.data;
      });
    },
    // 获取列表
    async getList() {
      userList({
        all: 1,
        page: this.page,
        key: this.key,
        real: this.real
      }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
    // 查看详情
    async det(val) {
      this.pName = "";
      this.pPhone = "";
      this.userInfo = val;
      this.uid = val.id;
      // if(val.pid){
      //   getUserInfo(val.pid).then(res => {
      //     this.pName = res.data.nickname;
      //     this.pPhone = res.data.mobile;
      //     this.dialogFormVisible = true;
      //   })
      // }else{
      //   this.dialogFormVisible = true;
      // }
      this.dialogFormVisible = true;
    },
    // 封号
    async set(val) {
      this.userInfo = val;
      this.dialogVisible = true;
    },
    // 确认封号
    async confirmClose() {
      let reason = "";
      if (this.value == "其他") {
        reason = this.reasonTxt;
      } else {
        reason = this.value;
      }
      if (this.clearData) {
        this.$confirm("确认封号并清除数据？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            disableUser(this.userInfo.id, { reason: reason }).then(_ => {
              if (this.clearData) {
                delUserData(this.userInfo.id).then(_ => {
                  this.$message("操作成功,已封号且清空数据");
                });
              }else{
                  this.$message("操作成功，已封号");
              }
              this.dialogVisible = false;
              this.getList();
            });
          })
          .catch(() => {
            this.clearData = false;
            this.$message({
              type: "info",
              message: "已取消封号"
            });
          });
      }
    },
    // 解封
    async cancle(val) {
      this.$confirm("确认解封该账户？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          enableUser(val.id).then(_ => {
            this.$message("操作成功");
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  async mounted() {
    this.getList();
    this.$store.commit("setPaging", true);
  },
  computed: {
    ...mapGetters(["page"]),
    dataList() {
      return [this.key, this.real];
    }
  },
  watch: {
    page(newVal) {
      this.getList();
    },
    dataList(newVal) {
      if (this.page == 1) {
        this.getList();
      } else {
        this.$store.commit("setPage", 1);
      }
    },
    uid(newVal) {
      this.getPuns();
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
.el-input {
  width: 300px;
}
</style>