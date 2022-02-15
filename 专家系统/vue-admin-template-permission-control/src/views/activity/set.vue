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
      <el-table-column
        prop="activityType.display"
        label="类型"
      ></el-table-column>
      <el-table-column label="调整" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="edit(scope.row)"
            >编辑</el-button
          >
          <!-- <el-button size="mini" type="text" @click="del(scope.row.id)"
            >删除</el-button
          > -->
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
        标题：
        <el-input class="ml20" v-model="item.title" placeholder="请输入标题"></el-input>
        <!-- <el-select v-model="item.title" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select> -->
      </el-row>
      <el-row class="mt20">
        方案数：<el-input  
          class="ml10"
          v-model="item.personTime"
          placeholder="请输入方案数"
        ></el-input>
      </el-row>
      <el-row class="mt10">
        描述：&nbsp;<el-input
        class="ml20"
          v-model="item.display"
          placeholder="请输入描述"
        ></el-input>
      </el-row>
      <el-row class="mt20"
        >类型:
        <el-select  class="ml30" v-model="value" placeholder="类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
      options: [
        { value: 2, label: "发帖数" },
        { value: 3, label: "连红数" },
        { value: 4, label: "连黑数" }
      ],
      value: "",

      tableData: [],
      dialogVisible: false,
      item: {
        title: "",
        personTime: null,
        display: "",
        activityType: 0
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
      const arr = [2, 3, 4];
      let a = 0
      arr.map(async item => {
       const { data } = await getInvi({ activityType: item })
       a = a+data.length
         if( this.tableData.length >= a ) return

        data.map((i,index,arry)=>{
          this.tableData.push(i)
        })
        
      });
    },

    
    // 添加
    createData() {
      
      this.item.activityType = this.value;
     
      addInvi(this.item).then(res => {
        this.$message("添加成功");
        this.dialogVisible = false;
        this.getIndex();
      });
      
    },
    cancel() {
      this.getIndex();
      this.dialogVisible = false;
    },
    // 修改
    updateData() {
      this.item.activityType = this.value;
      putInvi(this.id, this.item).then(res => {
        this.$message("添加成功");
        this.dialogVisible = false;
        this.getIndex();
      });
    },
    // 删除
    del(val) {
      delInvi(val).then(res => {
        this.$message("添加成功");
        this.getIndex();
      });
    },
    add(val) {
      this.value = ''
      this.isAdd = true;
      this.dialogVisible = true;
      this.item = { title: "", personTime: null, display: "" };
      // let data = this.list[val]
      // addInvi(data).then(res => {
      //   this.$message("添加成功")
      // })
    },
    edit(val) {
      this.isAdd = false;
      this.id = val.id;
      this.item = val;
      this.value = val.activityType.value
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
