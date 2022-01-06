<template>
  <div class="background-user">
    <div class="operate-group">
      搜索：
      <el-input v-model="searchKey" v-inputRule clearable @keyup.enter.native="sear" />
      <el-button class="ml20" type="dqx-btn" @click="sear">搜索</el-button>
      <el-button @click="addUser">新增后台用户</el-button>
    </div>
    <div class="content mt30">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="用户ID" />
        <el-table-column prop="nickname" label="用户昵称" />
        <el-table-column prop="mobile" label="手机号码" />
        <el-table-column label="类型">
          <template slot-scope="scope">{{scope.row.admin ? '超级管理员' : '后台用户'}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="del(scope.row.id)"
              type="text"
              size="small"
              :disabled="scope.row.admin"
            >移除</el-button>
            <el-button
              @click="setPwd(scope.row)"
              type="text"
              size="small"
              :disabled="scope.row.admin"
            >修改密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗 -->
      <el-dialog
        :title="isNew?'新增后台用户' : '修改用户密码'"
        :visible.sync="dialogVisible"
        width="30%"
        :show-close="false"
      >
        <div class="add-user">
          <div class="add-user-item mt20">
            <label>用户账号：</label>
            <el-input v-model="temp.account" :disabled="!isNew" v-inputNumber />
            <el-button type="dqx-btn" class="ml20" @click="searUser" v-if="isNew">查询</el-button>
          </div>
          <div class="add-user-item mt20">
            <label>用户昵称：</label>
            <el-input v-model="temp.nickname" readonly="readonly" />
          </div>
          <div class="add-user-item mt20">
            <label>设置密码：</label>
            <el-input v-model="temp.password" />
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="dqx-btn" @click="confirm">确定</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { userList, setMana, setPwd } from "@/api/staff";
import { formatTime } from "@/utils/index.js";
export default {
  data() {
    return {
      searchKey: "",
      keys: "",
      tableData: [],
      dialogVisible: false,
      userId: "",
      isNew: true,
      temp: {
        account: "",
        nickname: "",
        password: ""
      }
    };
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  mounted() {
    this.$store.commit("setPaging", true);
    this.getIndexs();
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
    setPwd(val) {
      this.dialogVisible = true;
      this.isNew = false;
      this.userId = val.id;
      this.temp.account = val.mobile;
      this.temp.nickname = val.nickname;
    },
    // 新增用户弹出窗
    addUser() {
      this.temp.account = "";
      this.temp.nickname = "";
      this.temp.password = "";
      this.dialogVisible = true;
      this.isNew = true;
    },
    searUser() {
      if (this.temp.account.length != 11) {
        this.$message("请输入11位手机号");
        return;
      }
      this.userId = "";
      userList({ all: 1, key: this.temp.account }).then(res => {
        if (res.data.length == 0) {
          this.$message("暂无该用户");
        } else {
          this.temp.nickname = res.data[0].nickname;
          this.userId = res.data[0].id;
        }
      });
    },
    // 确认新增
    confirm() {
      //
      if (this.userId != "") {
        if (this.isNew) {
          setMana(this.userId, {
            password: this.temp.password,
            beManager: true
          }).then(_ => {
            this.$message("操作成功");
            this.dialogVisible = false;
            this.getIndexs();
          });
        } else {
          setPwd(this.userId, { password: this.temp.password }).then(_ => {
            this.$message("操作成功");
            this.dialogVisible = false;
            this.getIndexs();
          });
        }
      } else {
        this.$message("请先选择要操作的用户");
      }
    },
    // 移除
    del(val) {
      this.$confirm("确认移除该后台用户？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          setMana(val, { beManager: false }).then(_ => {
            this.$message("操作成功");
            this.getIndexs();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回"
          });
        });
    },
    // 获取后台用户数据
    getIndexs() {
      userList({
        all: 0,
        page: this.page,
        key: this.keys,
        real: this.real
      }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    }
  },
  computed: {
    ...mapGetters(["page"])
  },
  watch: {
    page(newVal) {
      this.getIndexs();
    },
    keys(newVal) {
      if (this.page != 1) {
        this.$store.commit("setPage", 1);
      } else {
        this.getIndexs();
      }
    }
  }
};
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
.add-user {
  &-item {
    .el-input {
      width: calc(100% - 200px);
    }
  }
}
</style>
