<template>
  <div class="channel">
    <div class="el-col-24 mb20 cada f14 tar">
        <el-button type="dqx-btn" @click="addChannel">增加频道</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%;"  height="calc(100vh - 310px)">
      <el-table-column label="排序" class="el-col-4">
        <template slot-scope="scope">{{scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column prop="name" label="频道" class="el-col-4"></el-table-column>
      <el-table-column label="项目" style="width:10%;">
        <template slot-scope="scope">
          {{scope.row.category.display}}
        </template>
      </el-table-column>
      <el-table-column prop="countViewToday" label="今日访问人数" style="width:10%;"></el-table-column>
      <el-table-column prop="countViewTotal" label="总访问人数" style="width:10%;"></el-table-column>
      <el-table-column label="调整" width="250">
        <template slot-scope="scope">
          <el-button @click="change(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="setUp(scope.row.id)" type="text" size="small" :disabled="scope.$index == 0" :class="{highLight : scope.$index != 0}">上移</el-button>
          <el-button @click="setDown(scope.row.id)" type="text" size="small"  :disabled="scope.$index == tableData.length - 1"  :class="{highLight : scope.$index != tableData.length - 1}">下移</el-button>
          <el-button @click="setTop(scope.row.id)" type="text" size="small" :disabled="scope.$index == 0" :class="{highLight : scope.$index != 0}" >置顶</el-button>
          <el-button @click="del(scope.row.id)" type="text" size="small" class="red-txt">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 -->
    <el-dialog :title="dialogStatus==='create'?'添加数据频道':'修改数据频道'" :visible.sync="dialogVisible" width="30%" :show-close="false">
      <div class="dialog-cont">
        <div>
          <div class="mt20">选择分类：
            <el-select v-model="posType" placeholder="请选择" @change="changePos">
            <el-option
              v-for="item in posList"
              :key="item.value"
              :label="item.display"
              :value="item.value"
            ></el-option>
          </el-select>
          </div>
          <div class="mt20" v-if="posType === 1">
            <em>图样式：</em>
            <el-select v-model="dataTypeVal" placeholder="请选择">
            <el-option
              v-for="item in diffList"
              :key="item.value"
              :label="item.display"
              :value="item.value"
            ></el-option>
          </el-select>
          </div>
          <div class="search-match mt20">
            <em>查询赛事：</em>
            <el-input v-inputRule v-model="channel"></el-input>
            <el-button type="dqx-btn" class="ml10" @click="sear">查询</el-button>
          </div>
          <div class="res-list mt20">
            查询结果：
            <div v-if="resList.length > 0">
              <el-radio v-for="item in resList" v-model="radio" :label="item.id" :key="item.id" @change="chooseItem(item)">{{item.name_zh}}</el-radio>
              <!-- <span
                v-for="item in resList"
                :key="item.id"
                class="cp"
                @click="chooseItem(item)"
              >{{item.name_zh}}</span> -->
            </div>
          </div>
          <div class="mt20">
            <em>输入名称：</em>
            <el-input v-inputRule v-model="name"></el-input>
          </div>
          <!-- <div class="mt20">已选择：<i class="c18c">{{channelName}}</i></div> -->
          <div slot="footer" class="dialog-footer mt20 tac">
            <el-button type="dqx-btn" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getDataIndex,
  addDataChannel,
  delChannel,
  setDataTop,
  setDataUp,
  setDataDown,
  changeShow,
  changeType,
  changeTree,
  changeInfo,
  changeSystem,
  changeDataSort,
  getDataType,
  getTypeDiff
} from "@/api/channel";
import { mapGetters } from "vuex";
import { setCategory } from '@/utils/auth'
import { getMatch } from "@/api/public";
export default {
  data() {
    return {
      tableData: [],
      def: 0,
      channel: "",
      dialogVisible: false,
      resList: [],
      isMain: true,
      chooseVal: {id:'',name_zh:''},
      name: "",
      channelName: "",
      dialogStatus: "create",
      upChannelId: "",
      isSystem: false,
      radio:'',
      posList: [
        { value: -1, display: "请选择" },
        { value: 0, display: "足球赛事频道" },
        { value: 1, display: "篮球赛事频道" }
      ],
      posType: -1,
      diffList:[],
      typeList:[],
      dataTypeVal:0
    };
  },

  mounted() {
    this.$store.commit("setPaging", false);
    getDataType().then(res => {
      this.typeList = res.data;
      this.def = this.typeList[0].value;
    });
    this.getMain();
    this.getTypeDiffs();
  },
  methods: {
    // 赛事频道所在位置
    changePos(val) {
      if(val != -1){
        setCategory(val);
      }
      this.posType = val;
    },
    // 获取篮球频道子项差异(树状图样式)
    getTypeDiffs(){
      getTypeDiff().then(res => {
        this.diffList = res.data;
        this.dataTypeVal = this.diffList[0].value;
        console.log(this.diffList)
      })
    },
    // 修改频道分类
    changeSort(val,e){
      changeDataSort(e,{value:val}).then(_ => {
        this.$message('操作成功');
        this.getMain()
      })
    },
    // 修改是否可移除
    changeSystems() {
      this.isSystem = !this.isSystem;
    },
    // 修改是否共享状态
    changeSwitchSystem(val, row) {
      row.isSystem = val;
      changeSystem(row.id, { value: row.isSystem }).then(_ => {
        this.$message("操作成功");
      });
    },
    // 修改频道
    change(val) {
      this.dialogStatus = "update";
      this.posType = val.category.value;
      setCategory(val.category.value);
      this.chooseVal.id = val.competitionId;
      this.chooseVal.name_zh = val.competitionName;
      this.channelName = val.competitionName;
      this.channel = val.competitionName;
      this.dialogVisible = true;
      this.name = val.name;
      this.dataTypeVal = val.dataType;
      this.isMain = val.isMain;
      this.upChannelId = val.id;
    },
    //   新增按钮
    addChannel() {
      this.dialogVisible = true;
      this.dialogStatus = "create";
      this.posType = -1;
      this.name = '';
      this.channel = '';
      this.resList = [];
      this.channelName = '';
    },
    // 删除
    del(val) {
      this.$confirm("确认删除该频道？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delChannel(val).then(_ => {
            this.$message("操作成功");
            this.getMain();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回"
          });
        });
    },
    // 修改
    updateData() {
      if(this.posType == -1){
        this.$message('请选择分类')
        return;
      } 
      let posType;
      if(this.posType == 0){
        posType = 0;
      }else{
        posType = this.dataTypeVal;
      }
      changeInfo(this.upChannelId, {
        name: this.name,
        // competition:this.chooseVal.id,
        competition: { id: this.chooseVal.id,name:this.chooseVal.name_zh },
        dataType:posType
      }).then(_ => {
        this.$message("操作成功");
        this.dialogVisible = false;
        this.getMain();
      });
    },
    // 选择频道
    chooseItem(val) {
      this.chooseVal = val;
      this.channelName = val.name_zh;
      this.name = val.short_name_zh;
      this.channel = val.name_zh;
      this.resList = [];
    },
    // 查询赛事
    sear() {
      if(this.posType == -1){
        this.$message('请选择分类')
        return;
      } 
      getMatch({ page: 1, key: this.channel, page_size: 20 }).then(res => {
        this.resList = res.data;
      });
    },
    // 新增事件
    createData() {
      if(this.posType == -1){
        this.$message('请选择分类')
        return;
      } 
      let posType;
      if(this.posType == 0){
        posType = 0;
      }else{
        posType = this.dataTypeVal;
      }
      addDataChannel({
        name: this.name,
        competition: { id: this.chooseVal.id,name:this.chooseVal.name_zh },
        type: this.def,
        isSystem: this.isSystem,
        dataType: posType
      }).then(_ => {
        this.$message("操作成功");
        this.dialogVisible = false;
        this.getMain();
      });
    },
    // 切换事件
    tabs(val) {
      this.def = val;
    },
    // 是否树状图
    changeSwitchTree(val, row) {
      row.isTree = val;
      changeTree(row.id, { value: row.isTree }).then(_ => {
        this.$message("操作成功");
      });
    },
    // 是否展示
    changeSwitch(val, row) {
      row.isShow = val;
      changeShow(row.id, { value: row.isShow }).then(_ => {
        this.$message("操作成功");
      });
    },
    // 移动频道
    setUp(val) {
      setDataUp(val).then(_ => {
        this.$message("操作成功");
        this.getMain();
      });
    },
    setDown(val) {
      setDataDown(val).then(_ => {
        this.$message("操作成功");
        this.getMain();
      });
    },
    // 频道置顶
    setTop(val) {
      setDataTop(val).then(res => {
        // 成功
        this.$message("操作成功");
        this.getMain();
      });
    },
    // 获取首页频道数据
    getMain() {
      getDataIndex({ type: this.def, page: this.page,page_size:100 }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    }
  },
  computed: {
    dataList() {
      let val = [this.def, this.page];
      return val;
    },
    ...mapGetters(["page"])
  },
  watch: {
    dataList(newVal) {
      this.getMain();
    },
    page(newVal) {
      console.log(newVal);
    }
  }
};
</script>
<style lang="scss" scoped>
.show-tab {
  display: inline-block;
  width: 120px;
  text-align: center;
}
.show-tab + .show-tab {
  border-left: 1px solid #f5f5f5;
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
  .el-radio {
    display: block;
    line-height: 30px;
  }
}
/deep/.el-select .el-input{
  width: 200px;
}
.highLight{
  color: #333;
}
.red-txt{
  color: red;
}
</style>

