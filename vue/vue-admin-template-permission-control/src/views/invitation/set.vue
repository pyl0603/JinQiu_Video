<template>
  <div>
    <el-row class="tar">
      <el-button type="dqx-btn" @click="add">添加</el-button>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="calc(100vh - 240px)"
    >
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="personTime" label="人数"></el-table-column>
      <el-table-column prop="display" label="描述"></el-table-column>
      <el-table-column label="调整" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="text" @click="del(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="活动管理"
      :visible.sync="dialogVisible"
      width="60%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-row>
        标题：<el-input
          v-model="item.title"
          placeholder="请输入标题"
        ></el-input>
      </el-row>
      <el-row class="mt20">
        人数：<el-input
          v-model="item.personTime"
          placeholder="请输入人数"
        ></el-input>
      </el-row>
      <el-row class="mt20">
        描述：<el-input
          v-model="item.display"
          placeholder="请输入描述"
        ></el-input>
      </el-row>
      <div slot="footer" class="dialog-footer tac">
        <el-button type="dqx-btn" @click="isAdd ? createData() : updateData()"
          >保存</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getInvi, addInvi, putInvi, delInvi } from "@/api/active.js";
export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      item: {
        title: "",
        personTime: null,
        display: ""
      },
      isAdd: true,
      id: null
    };
  },
  created() {
    this.getIndex();
    this.$store.commit("setPaging", false);
  },
  methods: {
    // 获取列表
    getIndex() {
      getInvi().then(res => {
        this.tableData = res.data;
      });
    },
    // 添加
    createData() {
      addInvi(this.item).then(res => {
        this.$message("添加成功");
        this.dialogVisible = false;
        this.getIndex();
      });
    },
    cancel(){
      this.getIndex();
      this.dialogVisible = false
    },
    // 修改
    updateData() {
      putInvi(this.id,this.item).then(res => {
        this.$message("添加成功");
        this.dialogVisible = false;
        this.getIndex();
      })
    },
    // 删除
    del(val) {
      delInvi(val).then(res => {
        this.$message("添加成功");
        this.getIndex();
      })
    },
    add(val) {
      this.isAdd = true;
      this.dialogVisible = true;
      this.item = { title: "",personTime: null,display: ""}
      // let data = this.list[val]
      // addInvi(data).then(res => {
      //   this.$message("添加成功")
      // })
    },
    edit(val) {
      this.isAdd = false;
      this.id = val.id;
      this.item = val;
      this.dialogVisible = true;
      // let data = this.list[val]
      // putInvi(id,data).then(_ => {
      //   this.$message("操作成功")
      // })
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: calc(100% - 100px);
}
</style>
