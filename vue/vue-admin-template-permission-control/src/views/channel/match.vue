<template>
  <div class="channel">
    <div class="el-col-24 mb20 cada f14">
      <div class="el-col-12 mt10">
        <span class="show-tab cp" @click="tabs(1)" :class="{c18c : def === 1}">我的频道</span>
        <span class="show-tab cp" @click="tabs(0)" :class="{c18c : def === 0}">更多频道</span>
      </div>
      <div class="el-col-12 tar">
        <el-button type="dqx-btn" @click="addChannel">增加频道</el-button>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%;"  height="calc(100vh - 310px)">
      <el-table-column label="排序" class="el-col-4">
        <template slot-scope="scope">{{scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column prop="name" label="频道" class="el-col-4"></el-table-column>
      <el-table-column prop="countArticles" label="文章总数" style="width:10%;"></el-table-column>
      <el-table-column prop="countViewToday" label="今日访问人数" style="width:10%;"></el-table-column>
      <el-table-column prop="countViewTotal" label="总访问人数" style="width:10%;"></el-table-column>
      <el-table-column label="调整" width="200">
        <template slot-scope="scope">
          <el-button @click="change(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="setUp(scope.row.id)" type="text" size="small">上移</el-button>
          <el-button @click="setDown(scope.row.id)" type="text" size="small">下移</el-button>
          <el-button @click="setTop(scope.row.id)" type="text" size="small">置顶</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="是否默认" width="100">
        <template slot-scope="scope">
          <el-switch
            :key="scope.$index"
            :value="scope.row.isDefault"
            @change="changeSwitchDefault($event, scope.row)"
          />
        </template>
      </el-table-column> -->
      <el-table-column label="是否系统" width="100">
        <template slot-scope="scope">
          <el-switch
            :key="scope.$index"
            :value="scope.row.isSystem"
            @change="changeSwitchSystem($event, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="是否展示" width="100">
        <template slot-scope="scope">
          <el-switch
            :key="scope.$index"
            :value="scope.row.isShow"
            @change="changeSwitch($event, scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 -->
    <el-dialog title="添加赛事频道" :visible.sync="dialogVisible" width="30%" :show-close="false">
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
          <div class="search-match mt20">
            <em>查询赛事：</em>
            <el-input v-inputRule v-model="channel"  @keyup.enter.native="sear"></el-input>
            <el-button type="dqx-btn" class="ml10" @click="sear">查询</el-button>
          </div>
          <div class="res-list mt20">
            查询结果：
            <div>
              <span v-for="item in resList" :key="item.id" class="cp" @click="chooseItem(item)">{{item.name_zh}}</span>
            </div>
          </div>
          <div class="mt20">已选择：{{channelName}}</div>
          <div class="mt20">可编辑：
            <el-switch
            :value="isSystem"
            @change="changeSystems"
          />
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
          <div class="mt20">屏蔽高清直播：
            <el-switch
            :value="isEnableLiveSource"
            @change="changeEnable"
          />
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
  getMatchIndex,
  addMatchChannel,
  delChannel,
  setMatchTop,
  setMatchUp,
  setMatchDown,
  changeShow,
  changeShare,
  changeInfo,
  changeSystem,
  changeDefault
} from "@/api/channel";
import { getMatch } from '@/api/public'
import upload from "@/components/UploadImg/index"
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      def:1,
      tableData: [],
      channel: "",
      dialogVisible: false,
      resList:[],
      isMain:false,
      chooseVal:{id:'',name_zh:''},
      name:'',
      channelName:'',
      dialogStatus:'create',
      upChannelId:'',
      isSystem:false,
      image: "",
      posList:[{value:1,display:'我的频道'},{value:0,display:'更多频道'}],
      posType:1,
      isEnableLiveSource:false
    };
  },
  components: {
    upload
  },
  methods: {
    // 切换高清直播
    changeEnable(){
      this.isEnableLiveSource = !this.isEnableLiveSource
    },
    // 赛事频道所在位置
    changePos(val){
      this.posType = val;
    },
     // 首页赛事icon上传
    upImg(val) {
      this.image = val;
    },
    // 修改是否默认
    changeSwitchDefault(val, row) {
      row.isDefault = val;
      changeDefault(row.id, { value: row.isDefault }).then(_ => {
        this.$message("操作成功");
        this.getMain();
      });
    },
     // 修改是否可移除
    changeSystems(){
      this.isSystem = !this.isSystem
    },
    // 修改是否共享
    changeMain(){
      this.isMain = !this.isMain;
    },
    // 修改是否系统状态
    changeSwitchSystem(val, row) {
      row.isSystem = val;
      changeSystem(row.id, { value: row.isSystem }).then(_ => {
        this.$message("操作成功");
      });
    },
    // 修改频道
    change(val){
      this.dialogStatus = 'update';
      this.chooseVal.id = val.competitionId;
      this.chooseVal.name_zh = val.competitionName;
      this.channelName = val.competitionName;
      this.dialogVisible = true;
      this.name = val.name;
      // this.channelName = val.competition.name_zh
      this.isMain = val.isMain;
      this.upChannelId = val.id
      this.image = val.logo;
      this.isEnableLiveSource = val.isEnableLiveSource;
    },
    // 选择频道
    chooseItem(val){
      this.chooseVal.id = val.id;
      this.chooseVal.name_zh = val.name_zh;
      this.channelName = val.name_zh;
      this.name = val.short_name_zh;
      this.resList = [];
      this.image  = val.logo;
    },
    // 查询赛事
    sear(){
      getMatch({page:1,key:this.channel,page_size:20}).then(res => {
        this.resList = res.data
      })
    },
    //   新增按钮
    addChannel() {
      this.dialogVisible = true;
      this.dialogStatus = 'create';
      this.image = '';
    },
    // 修改
    updateData(){
      let isDef = this.posType == 1 ? true : false;
      changeInfo(this.upChannelId,{ name: this.name,competition:{id:this.chooseVal.id,name:this.chooseVal.name_zh} ,logo:this.image,isSystem:this.isSystem,isDefault: isDef,isEnableLiveSource:this.isEnableLiveSource}).then(_ => {
        this.$message("操作成功");
        this.dialogVisible = false;
        this.getMain();
      });
    },
    // 新增事件
    createData() {
      let isDef = this.posType == 1 ? true : false;
      let competition = null
      if(this.chooseVal.id != undefined){
        competition = {id:this.chooseVal.id,name:this.chooseVal.name_zh}
      }
      console.log(competition)
      addMatchChannel({ name: this.name, isDefault: isDef,competition:competition,logo:this.image,isMain:this.isMain,isSystem:this.isSystem,isEnableLiveSource:this.isEnableLiveSource }).then(_ => {
        this.$message("操作成功");
        this.dialogVisible = false;
        this.getMain();
      });
    },
    // 切换事件
    tabs(val) {
      this.def = val;
    },
    // 是否展示
    changeSwitch(val, row) {
      row.isShow = val;
      changeShow(row.id, { value: row.isShow }).then(_ => {
        this.$message("操作成功");
      });
    },
    // 是否共享
    changeSwitchMain(val, row) {
      row.isMain = val;
      changeShare(row.id, { value: row.isMain }).then(_ => {
        this.$message("操作成功");
      });
    },
    // 移动频道
    setUp(val) {
      setMatchUp(val).then(_ => {
        this.$message("操作成功");
        this.getMain();
      });
    },
    setDown(val) {
      setMatchDown(val).then(_ => {
        this.$message("操作成功");
      });
       this.getMain();
    },
    // 频道置顶
    setTop(val) {
      setMatchTop(val).then(_ => {
        this.$message("操作成功");
      });
       this.getMain();
    },
    // 获取首页频道数据
    getMain() {
      getMatchIndex({ def: this.def, page: this.page,page_size:100 }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    }
  },

  mounted() {
    this.$store.commit("setPaging", false);
    this.getMain();
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
