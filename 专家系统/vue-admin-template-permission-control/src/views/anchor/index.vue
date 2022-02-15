<template>
  <div class="player">
    <el-row class="tar">
      <el-input placeholder="请输入内容" v-model="keyworlds" maxlength="50" v-inputRule class="input-with-select" @keyup.enter.native="setTitle">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="房号" value="1"></el-option>
          <el-option label="主播昵称" value="2"></el-option>
        </el-select>
      </el-input>
      <el-button type="dqx-btn" @click="setTitle">搜索</el-button>
    </el-row>
    <el-row class="mt20">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        height="calc(100vh - 240px)"
      >
        <el-table-column label="主播昵称">
           <template slot-scope="scope">
            {{scope.row.streamer.nickName}}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{scope.row.streamer.status.display}}
          </template>
        </el-table-column>
        <el-table-column prop="roomNumber" label="房号"></el-table-column>
        <el-table-column label="粉丝数">
           <template slot-scope="scope">
            {{scope.row.streamer.fansNumber}}
          </template>
        </el-table-column>
        <el-table-column label="调整" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="anSwitch(scope.row.streamer)">{{scope.row.streamer.status.value === 4 ? '解禁': '禁播'}}</el-button>
            <el-button size="mini" type="text" @click="del(scope.row.streamer)" style="color:red;">移除</el-button>
            <el-button size="mini" type="text" @click="pop(scope.row.id,scope.row.streamer)">进入直播间</el-button>
            <el-button size="mini" type="text" @click="reco(scope.row.id)">举报记录</el-button>
          </template>
        </el-table-column>
        <el-table-column label="首页推荐" width="150">
          <template slot-scope="scope">
           <el-switch
            :key="scope.$index"
            :value="scope.row.streamer.isRecommend"
            @change="changeRec($event, scope.row.streamer)"
          />
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog title="直播间详情" :visible.sync="dialogVisible" :show-close="true">
      <iframe :src="liveUrl" frameborder="0"></iframe>
      <div slot="footer" class="dialog-footer mt20 tac">
            <el-button type="dqx-btn" @click="anSwitch(status)">{{status.status.value === 4 ? '解禁': '禁播'}}</el-button>
            <el-button  @click="force(status)">强制下播</el-button>
          </div>
    </el-dialog>
    
    <el-dialog :visible.sync="isReport" title="举报记录">
      <Report :target="target"></Report>
    </el-dialog>
  </div>
</template>

<script>
import { getAncListFans, anchSwitch, anchRecm, anchDel, anchForce} from '@/api/live'
import { getReport } from '@/api/setting'
import { mapGetters } from 'vuex'
import Report from './report'
export default {
  data() {
    return {
      tableData: [],
      select:'1',
      keyworlds:'',
      cont:'',
      dialogVisible: false,
      isReport: false,
      liveUrl:'',
      target: 0,
      status: {id:'',status:{value:0}}
    };
  },
  async mounted() {
    this.$store.commit("setPaging", true);
    this.getList()
  },
  components:{
    Report
  },
  methods: {
    // 强制下播
    force(val){
       this.$confirm(`确认强制下播?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          anchForce(val.id).then(_ => {
            this.$message("操作成功");
            this.getList();
            this.dialogVisible = false
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 禁播
    anSwitch(val){
      let isOff = val.status.value === 4 ? 'free' : 'forbidden'
      let isOffTxt = val.status.value === 4 ? '解禁' : '禁播'
       this.$confirm(`确认${isOffTxt}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
      anchSwitch(val.id,isOff).then(_ => {
        this.$message('操作成功')
        this.getList()
        this.dialogVisible = false
      })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 移除
    del(val){
      this.$confirm(`确认移除主播-${val.nickName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          anchDel(val.id).then(_ => {
            this.$message("操作成功");
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 推荐
    changeRec(val, row) {
      row.isRecommend = val;
      anchRecm(row.id, {isRecommend: val}).then(_ => {
        this.$message("操作成功");
      });
    },
    // 进入直播间
    pop(e,val){
      this.liveUrl = `http://192.168.1.214:8080/live.html?tips=1&id=${e}`
      this.status = val;
      this.dialogVisible = true;
    },
    // 举报记录
    reco(e){
      this.target = e
      this.isReport = true;
    },
    // 关键词检索
    setTitle(){
      this.cont = this.keyworlds
    },
    // 获取列表
    getList() {
      let roomNumber,nickName = ''
      roomNumber = this.select === '1' ? this.keyworlds : ''
      nickName = this.select === '2' ? this.keyworlds : ''
      getAncListFans({roomNumber: roomNumber,nickName:nickName,page:this.page,page_size:10}).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
  },
  computed: {
    ...mapGetters(['page']),
    dataLis(){
      return [this.cont, this.select ]
    }
  },
   watch:{
     page(){
       this.getList()
     },
     dataLis(){
       if(this.page == 1){
         this.getList()
       }else{
         this.$store.commit("setPage", 1);
       }
     }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-input-group__prepend {
  position: absolute;
  margin-top: 0px;
  line-height: 40px;
  width: 120px;
  height: 40px;
  z-index: 9;
  border-radius: 0;
}
iframe{
  width: 45vw;
  height: 70vh;
  overflow-y: scroll;
}
.el-input {
  display: inline-block;
  width: calc(40% - 120px);
  margin-right: 120px;
}
/deep/.el-dialog{
  margin-top: 5vh!important;
  height: 90vh;
}
/deep/.el-input-group > .el-input__inner {
  margin-left: 120px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
