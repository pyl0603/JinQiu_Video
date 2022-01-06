<template>
  <div class="channel">
    <div class="el-col-24 mb20 cada f14">
      <div class="el-col-12 mt10">
        <span class="show-tab cp" @click="tabs(0)" :class="{c18c : def === 0}">常用频道</span>
        <span class="show-tab cp" @click="tabs(1)" :class="{c18c : def === 1}">更多频道</span>
      </div>
      <div class="el-col-12 tar">
        <el-button type="dqx-btn" @click="addChannel">添加</el-button>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%;"  height="calc(100vh - 310px)">
      <el-table-column label="排序"  width="200">
        <template slot-scope="scope">{{scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column prop="name" label="频道"></el-table-column>
      <el-table-column label="调整" width="200">
        <template slot-scope="scope">
          <el-button @click="change(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="move(scope.row.id,'up')" type="text" size="small" :disabled="scope.$index === 0">上移</el-button>
          <el-button @click="move(scope.row.id,'down')" type="text" size="small"  :disabled="scope.$index === tableData.length-1">下移</el-button>
          <el-button @click="move(scope.row.id,'top')" type="text" size="small" :disabled="scope.$index === 0">置顶</el-button>
        </template>
      </el-table-column>
      <el-table-column label="锁定频道" width="100">
        <template slot-scope="scope">
          <el-switch
            :key="scope.$index"
            :value="scope.row.isLock"
            @change="changeSwitchSystem($event, scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 -->
    <el-dialog title="添加频道" :visible.sync="dialogVisible" width="30%" :show-close="false">
      <div class="dialog-cont">
        <div>
          <div class="dialog-upload mb20">
          <em>上传icon：</em>
          <div class="dialog-upload-right">
            <div class="upload-before" v-if="image == ''">
              <svg-icon icon-class="tupian"></svg-icon>
            </div>
            <div class="upload-after" v-if="image != ''">
              <img :src="image" alt>
            </div>
            <upload ref="upload" @upImg="upImg"></upload>
          </div>
        </div>
          <div>
            <em>输入名称：</em>
            <el-input v-inputRule v-model="name"></el-input>
          </div>
          <div class="mt20">所在位置：
            <el-select v-model="posType" placeholder="请选择" @change="changePos">
            <el-option
              v-for="item in posList"
              :key="item.value"
              :label="item.display"
              :value="item.value"
            ></el-option>
          </el-select>
          </div>
          <div class="mt20">内容展示：
            <el-select v-model="contType" placeholder="请选择" @change="changeCont">
              <el-option
                v-for="item in contList"
                :key="item.value"
                :label="item.display"
                :value="item.value"
              ></el-option>
             </el-select>
          </div>
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
  getType,
  getList,
  addItmes,
  updateItems,
  putItems,
  moveItems
} from "@/api/live";
import upload from "@/components/UploadImg/index"
export default {
  data() {
    return {
      def:0,
      tableData: [],
      channel: "",
      dialogVisible: false,
      resList:[],
      isMain:false,
      name:'',
      channelName:'',
      dialogStatus:'create',
      upChannelId:'',
      isSystem:false,
      image: "",
      posList:[{value:0,display:'常用频道'},{value:1,display:'更多频道'}],
      posType:0,
      isEnableLiveSource:false,
      contList: [{value:0,display:'全部内容'},{value:1,display:'垂直内容'}],
      contType: 0
    };
  },
  components: {
    upload
  },
  methods: {
    // 频道所在位置
    changePos(val){
      this.posType = val;
    },
     // icon上传
    upImg(val) {
      this.image = val;
    },
     // 修改是否可移除
    changeSystems(){
      this.isSystem = !this.isSystem
    },
    // 修改是否系统状态
    changeSwitchSystem(val, row) {
      row.isLock = val;
      let lockType = val ? 'lock' : 'unlock'
      putItems(row.id, lockType).then(_ => {
        this.$message("操作成功");
      });
    },
    // 修改频道
    change(val){
      console.log(val)
      this.dialogStatus = 'update';
      this.dialogVisible = true;
      this.name = val.name;
      this.upChannelId = val.id;
      this.image = val.logo;
      this.posType = val.type.value
      this.contType = val.isAll ? 1:0
    },
    //   新增按钮
    addChannel() {
      this.dialogVisible = true;
      this.dialogStatus = 'create';
      this.image = '';
      this.name = '';
      this.posType = 0;
       this.contType = 1
    },
    // 修改
    updateData(){
      updateItems(this.upChannelId,{ name: this.name, type: this.posType,logo:this.image, isAll: this.contType}).then(_ => {
        this.$message("操作成功");
        this.dialogVisible = false;
        this.getMain();
      });
    },
    // 新增事件
    createData() {
      addItmes({ name: this.name, type: this.posType,logo:this.image, isAll: this.contType}).then(_ => {
        this.$message("操作成功");
        this.dialogVisible = false;
        this.getMain();
      });
    },
    // 切换事件
    tabs(val) {
      this.def = val;
    },
    // 移动频道
    move(e,val){
      moveItems(this.def,e,val).then(_ => {
        this.$message("操作成功");
        this.getMain();
      })
    },
    // 获取首页频道数据
    getMain() {
      getList(this.def).then(res => {
        this.tableData = res.data;
      });
    },
    // 内容展示
    changeCont(val){
      this.contType = val;
    },
  },
  async mounted() {
    this.$store.commit("setPaging", false);
    // 获取类型列表，暂不使用
    let { data } = await getType()
    this.getMain();
  },
  computed: {
    dataList() {
      let val = [this.def];
      return val;
    },
  },
  watch: {
    dataList() {
      this.getMain();
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
.res-list div{
  display: inline-block;
  width: calc(100% - 120px);
  padding: 0 10px;
  max-height: 120px;
  overflow-y: scroll;
  background:rgba(249,249,249,1);
  border:1px solid rgba(206,206,206,1);
  border-radius:8px;
  &::-webkit-scrollbar {
    display: none;
  }
  span{
    display: block;
    line-height: 30px;
  }
}
.dialog-upload em{
  display: inline-block;
  width: 80px;
}
.dialog-upload-right{
  display: inline-block;
}
/deep/.inputFlie {
  width: 50px;
  height: 50px;
  position: absolute;
  margin-top: -50px;
  opacity: 0;
  z-index: 1;
  border-radius: 50%;
}
.upload-after {
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}
.upload-before {
  width: 50px;
  height: 50px;
  background: #f5f5f5;
  text-align: center;
  border-radius: 50%;
  span {
    display: block;
  }
  .svg-icon {
    font-size: 25px;
    color: #adadad;
    margin-top: 12px;
  }
}
/deep/.dialog-cont .el-input{
  width: 150px;
}
</style>
