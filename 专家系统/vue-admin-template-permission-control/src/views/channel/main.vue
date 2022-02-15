<template>
  <div class="channel">
    <div class="el-col-24 mb20 cada f14">
      <div class="el-col-12 mt10">
        <span class="show-tab cp" @click="tabs(1)" :class="{c18c : def === 1}">我的频道</span>
        <span class="show-tab cp" @click="tabs(0)" :class="{c18c : def === 0}">更多频道</span>
      </div>
      <div class="el-col-12 tar">
        <el-button type="dqx-btn" @click="getMatchChn">从赛事频道导入</el-button>
        <el-button type="dqx-btn" @click="addChannel">增加频道</el-button>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%;" height="calc(100vh - 310px)">
      <el-table-column label="排序" class="el-col-4">
        <template slot-scope="scope">{{scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column prop="name" label="频道" class="el-col-4"></el-table-column>
      <el-table-column prop="countArticles" label="文章总数" style="width:10%;"></el-table-column>
      <el-table-column prop="countViewToday" label="今日访问人数" style="width:10%;"></el-table-column>
      <el-table-column prop="countViewTotal" label="总访问人数" style="width:10%;"></el-table-column>
      <el-table-column label="调整" width="200">
        <template slot-scope="scope">
          <el-button @click="updata(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="setUp(scope.row.id)" type="text" size="small">上移</el-button>
          <el-button @click="setDown(scope.row.id)" type="text" size="small">下移</el-button>
          <el-button @click="setTop(scope.row.id)" type="text" size="small">置顶</el-button>
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
      <el-table-column label="锁定" width="100">
        <template slot-scope="scope">
          <el-switch
            :key="scope.$index"
            :value="scope.row.isSystem"
            @change="changeSwitchSystem($event, scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 从赛事频道导入 -->
    <el-dialog title="赛事频道列表" :visible.sync="dialogMatch" width="30%" :show-close="false">
    <div class="match-chn-list">
      <span class="mt10 cp" v-for="item in matchChnList" :key="item.id" @click="confirmMatch(item)">{{item.name}}</span>
    </div>
    <div class="mt20">已选择：<em class="c18c f20">{{matchChnName}}</em></div>
    <div slot="footer" class="dialog-footer mt20 tac">
          <el-button type="dqx-btn" @click="addMatchChn">确定</el-button>
          <el-button @click="dialogMatch = false">取消</el-button>
        </div>
    </el-dialog>
    <!-- 弹窗 -->
    <el-dialog title="添加首页频道" :visible.sync="dialogVisible" width="30%" :show-close="false">
      <div class="dialog-cont">
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
          <em>新增频道：</em>
          <el-input v-inputRule v-model="channel"></el-input>
        </div>
        <div class="mt20" v-if="dialogStatus ==='create'">
          是否系统
          <el-switch :value="isSystem" @change="changeSystems"/>
        </div>
        <div slot="footer" class="dialog-footer mt20 tac">
          <el-button type="dqx-btn" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import upload from "@/components/UploadImg/index";
import { mapGetters } from "vuex";
import {
  getMainIndex,
  addMainChannel,
  delChannel,
  setMainTop,
  setMainUp,
  setMainDown,
  changeShow,
  changeType,
  changeName,
  changeSystem,
  changeInfo,
  getMatchIndex,
  changeShare
} from "@/api/channel";
export default {
  data() {
    return {
      dialogVisible: false,
      channel: "",
      tableData: [],
      def: 1,
      dialogStatus: "create",
      updateId: "",
      image: "",
      isSystem: false,
      matchChnList:[],
      dialogMatch:false,
      matchChnName:'',
      matchChnId:0
    };
  },
  components: {
    upload
  },
  methods: {
    // 首页赛事icon上传
    upImg(val) {
      this.image = val;
    },
    // 新增频道
    async addMatchChn(){
      changeShare(this.matchChnId,{value:true}).then(_ => {
        this.$message('操作成功');
        this.dialogMatch = false;
        this.getMain();
      })
    },
    // 选择赛事频道
    async confirmMatch(val){
      this.matchChnName = val.name;
      this.matchChnId = val.id;
    },
    // 从赛事频道导入
    async getMatchChn(){
      getMatchIndex({page_size:100}).then(res => {
        this.matchChnList = res.data;
        this.dialogMatch  = true;
      })
    },
    // 修改是否可移除
    changeSystems() {
      this.isSystem = !this.isSystem;
    },
    // 修改是否系统状态
    changeSwitchSystem(val, row) {
      row.isSystem = val;
      changeSystem(row.id, { value: row.isSystem }).then(_ => {
        this.$message("操作成功");
      });
    },
    //   新增按钮
    addChannel() {
      this.dialogStatus = "create";
      this.dialogVisible = true;
    },
    // 修改按钮
    updata(val) {
      this.dialogStatus = "update";
      this.dialogVisible = true;
      this.channel = val.name;
      this.image = val.logo
      this.updateId = val.id;
    },
    // 新增事件
    createData() {
      let isDef = this.def == 1 ? true : false;
      addMainChannel({
        name: this.channel,
        isDefault: isDef,
        isSystem: this.isSystem,
        logo:this.image
      }).then(_ => {
        this.$message("操作成功");
        this.dialogVisible = false;
        this.getMain();
      });
    },
    // 修改事件
    updateData() {
      changeInfo(this.updateId, { name: this.channel,logo:this.image }).then(_ => {
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
    // 移动频道
    setUp(val) {
      setMainUp(val).then(_ => {
        this.$message("操作成功");
        this.getMain();
      });
    },
    setDown(val) {
      setMainDown(val).then(_ => {
        this.$message("操作成功");
        this.getMain();
      });
    },
    // 频道置顶
    setTop(val) {
      setMainTop(val).then(_ => {
        this.$message("操作成功");
        this.getMain();
      });
    },
    // 获取首页频道数据
    getMain() {
      getMainIndex({ def: this.def, page: this.page,page_size:100 }).then(res => {
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
.match-chn-list{
  max-height: 30vh;
  overflow-y:scroll;
  span+span{
    border-top: 1px solid #e5e5e5;
  }
  span{
    padding-top: 10px;
    display: block;
  }
}
</style>


