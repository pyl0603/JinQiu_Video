<template>
  <div class="tags">
    <el-row>
      <el-col :span="24" class="tar">
        <el-button type="dqx-btn" @click="update">更新球队标签</el-button>
        <el-input v-inputRule class="ml20" v-model="keyWorlds"></el-input>
        <el-button type="dqx-btn" class="ml20" @click="sear">查询</el-button>
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="calc(100vh - 290px)"
    >
      <el-table-column prop="name" label="标签名称"></el-table-column>
      <!-- <el-table-column prop="subhead" label="简介" width="200"></el-table-column> -->
    </el-table>
    <!-- 弹窗 -->
    <el-dialog title="更新球队标签" :visible.sync="dialogVisible" width="30%" :show-close="false">
      <div class="dialog-cont">
        <div>
          <div class="search-match mt20">
            <em>更新球队标签：</em>
            <el-input v-inputRule v-model="cont"></el-input>
            <el-button type="dqx-btn" class="ml10" @click="searTeam">搜索</el-button>
          </div>
          <div class="res-list mt20">
            查询结果：
            <div v-if="resList.length>0">
              <span
                v-for="item in resList"
                :key="item.id"
                class="cp"
                @click="chooseItem(item)"
              >{{item.nameZh}}</span>
            </div>
          </div>
          <div class="mt20">已选择：{{contName}}</div>
          <div slot="footer" class="dialog-footer mt20 tac">
            <el-button type="dqx-btn" @click="updateTag">更新</el-button>
            <el-button @click="dialogVisible = false;contName = ''">取消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getTagsList,getTagsByKey,putTagsByKey } from "@/api/edit";
import { mapGetters } from "vuex";
import NewTag from '@/views/common/new-tag'
export default {
  data() {
    return {
      tableData: [],
      keyWorlds: "",
      keyVal: "", //搜索关键字
      dialogVisible:false,
      dialogStatus:"create",
      id:0,
      tagsNameVal:'',
      cont:'',
      resList:[],
      contName:'',
      tagTeamId:''
    };
  },
  components:{
    NewTag
  },
  methods: {
    // 更新球队标签
    async updateTag(){
      putTagsByKey({teamId:this.tagTeamId,name:this.contName}).then(_ => {
        this.$message('更新成功')
        this.dialogVisible = false;
        this.contName = '';
        this.tagTeamId = '';
        this.cont = ''; 
        this.getIndex()
      })
    },
    // 查找球队标签
    async searTeam(){
      getTagsByKey({name:this.cont}).then(res => {
        this.resList = res.data;
      })
    },
    // 标签接口在admin端，调整到publish端，统计的上线到admin线上
    async update(){
      this.dialogVisible = true;
      this.resList = [];  // 重置弹窗
      this.contName = '';
    },
    // 已选中球队
    async chooseItem(val){
      this.contName = val.nameZh;
      this.tagTeamId = val.id;
    },
    // 获取标签列表
    getIndex() {
      getTagsList({ page: this.page, name: this.keyVal }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
    // 查询
    sear() {
      this.keyVal = this.keyWorlds;
    },
    // 新增
    addNew() {
      this.dialogStatus = "create"
      this.dialogVisible = true
    },
    // 修改
    change(val) {
      this.id = val.id;
      this.tagsNameVal = val.name;
      this.dialogStatus = "update"
      this.dialogVisible = true
    },
    // 删除
    del() {},
    // 取消
    cancel(){
      // this.page = 1;
      this.getIndex();
      this.dialogVisible = false;
    }
  },
  mounted() {
    this.getIndex();
    this.$store.commit("setPaging", true);
  },
  computed: {
    dataList() {
      let val = [this.keyVal, this.page];
      return val;
    },
    ...mapGetters(["page"])
  },
  watch: {
    dataList(newVal) {
      this.getIndex();
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 300px;
}
.res-list div {
  display: inline-block;
  width: calc(100% - 120px);
  padding: 0 10px;
  max-height: 120px;
  overflow-y: scroll;
  background: rgba(249, 249, 249, 1);
  border: 1px solid rgba(206, 206, 206, 1);
  border-radius: 8px;
  &::-webkit-scrollbar {
    display: none;
  }
  span {
    display: block;
    line-height: 30px;
  }
}
</style>

