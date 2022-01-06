<template>
  <div class="source">
    <div class="el-col-24">
      <div class="el-col-24 cada f14 tar">
        频道选择：
        <el-select v-model="competition" placeholder="请选择" class="mr20">
            <el-option
              v-for="item in tabList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        <el-date-picker
          v-model="dataRang"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          @change="change"
          @pick="pick"
          align="right"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="calc(100vh - 280px)"
    >
      <el-table-column label="推送日期" width="300">
        <template slot-scope="scope">{{ scope.row.startAt | formatTime }}</template>
      </el-table-column>
      <el-table-column label="比赛" width="400">
        <template slot-scope="scope">{{scope.row.homeTeamName}}VS{{scope.row.awayTeamName}}</template>
      </el-table-column>
      <el-table-column prop="customStatusDesc" label="直播状态" width="250"></el-table-column>
      <el-table-column prop="potpourriNum" label="集锦数量"></el-table-column>
      <el-table-column label="功能">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="set(scope.row.id)">集锦设置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 -->
    <el-dialog width="70%" title="集锦设置" :visible.sync="dialogVisible" :show-close="false"  :close-on-click-modal="false">
      <!-- 内容模块 -->
      <div class="cont">
        <!-- 左侧编辑区域 -->
        <div class="left">
          <div>标题：<el-input  v-inputRule v-model='itemInfo.title'></el-input></div>
          <div class="mt20">标签：<el-input v-model="itemInfo.tag"></el-input></div>
          <div class="history mt20">历史：<em class="mr20 cp" @click="itemInfo.tag = item" v-for="(item,index) in hisList" :key="index">{{item}}</em></div>
          <div class="mt20">来源：<el-radio v-model="type" label="0">外链</el-radio>
  <el-radio v-model="type" label="1">本地上传</el-radio></div>
          <div class="mt20">链接：<el-input v-model="itemInfo.url" v-inputRule></el-input>
          <div class="ml20">
          <el-button type="text" class="ml20">本地上传</el-button>
          <uploadI ref="uploadI" @finishUp="upVideo"></uploadI></div>
          </div>
        <div class="tac mt20"><el-button type="dqx-btn" @click="dialogStatus==='create'?createData():updateData()">{{dialogStatus==='create'?'添加':'修改'}}</el-button></div>
        </div>
        <!-- 右侧列表 -->
        <div class="right ml20">
          <div class="mb20">集锦列表</div>
            <el-table
      ref="multipleTable"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      height="calc(70vh - 200px)"
    >
      <el-table-column prop="title" label="标题" width="250"></el-table-column>
      <el-table-column label="添加时间" width="150"><template slot-scope="scope">{{ scope.row.createdAt | formatTime }}</template></el-table-column>
      <el-table-column prop="tag" label="标签"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
          <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer tac">
        <el-button @click="dialogVisible = false" type="dqx-btn">关闭弹窗</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getSimple } from "@/api/setting";
import { getMatches } from "@/api/public";
import {getPotp,addPotp,putPotp,delPotp,sortPotp} from '@/api/potpourris'
import { mapGetters } from "vuex";
import { formatTime } from "@/utils/index.js";
import uploadI from "@/components/UploadVideo/index";
export default {
  data() {
    let _this = this;
    return {
      dataRang: [
        new Date(new Date().toLocaleDateString()).getTime(),
        new Date(new Date().toLocaleDateString()).getTime()+3600 * 1000 * 24-1000
      ], //  时间选择
      tableData: [], //列表
      dialogVisible: false, //弹窗
      list: [], //直播源列表
      itemInfo:{tag:'',title:'',url:''},
      type:'0',
      hisList:[],
      dialogStatus: "create", //修改|新增
      tabList: [], //频道列表
      itemIndex: 0,
      competition: 0, //频道id
      start: new Date(new Date().toLocaleDateString()).getTime(), //开始时间
      end:
        new Date(new Date().toLocaleDateString()).getTime() +3600 * 1000 * 24 +
          1000, //结束时间
      liveId: 0,
      potpId:0,
      isNull: true,
      isAdd: true,
      refreshDate: "", //刷新数据
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
              _this.start = new Date(new Date().toLocaleDateString()).getTime();
              _this.end =
                new Date(new Date().toLocaleDateString()).getTime() +
                3600 * 1000 * 24 -
                1000;
              _this.dataRang = [_this.start, _this.end];
            }
          },
          {
            text: "三天内",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 72);
              picker.$emit("pick", date);
              _this.start = new Date(new Date().toLocaleDateString()).getTime()-3600 * 1000 * 24 * 3;
              _this.end =
                new Date(new Date().toLocaleDateString()).getTime()+3600 * 1000 * 24-1000;
              _this.dataRang = [_this.start, _this.end];
            }
          },
          {
            text: "一周内",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24*7);
              picker.$emit("pick", date);
              _this.start = new Date(new Date().toLocaleDateString()).getTime()-3600 * 1000 * 24 * 7;
              _this.end =
                new Date(new Date().toLocaleDateString()).getTime()+3600 * 1000 * 24-1000;
              _this.dataRang = [_this.start, _this.end];
            }
          }
        ]
      }
    };
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  components:{
    uploadI
  },
  mounted() {
    this.getChannel();
      if(localStorage.getItem('his')){
        this.hisList = JSON.parse(localStorage.getItem('his'))
      }
    this.$store.commit("setPaging", true);
  },
  methods: {
    // 历史记录的缓存(暂无)
    // 日期选择
    change(val) {
      console.log(val);
      this.start = val[0];
      this.end = val[1] + 3600 * 1000 * 24 - 1000;
    },
    pick(val) {
      console.log(val);
    },
    // 视频上传
    async upVideo(val){
      this.type = '1';
      this.itemInfo.url = val.data.fullVideoPath;
    },
    // 获取集锦列表
    async getpotp(val){
      getPotp(val).then(res => {
        this.list = res.data;
      })
    },
    // 集锦编辑
    async edit(val){
      this.dialogStatus = 'update'
      this.potpId = val.id;
      this.itemInfo.title = val.title;
        this.itemInfo.tag = val.tag;
        this.itemInfo.url = val.url;
        this.type = val.type === 0 ?'0':'1';
    },
    // 集锦设置
    set(val) {
      this.dialogVisible = true;
      this.getpotp(val);
      this.liveId = val;
    },
    // 新增
    createData() {
      if(!this.hisList.includes(this.itemInfo.tag)&&this.itemInfo.tag != ''){
        this.hisList.unshift(this.itemInfo.tag)
      }
      let hisList = []
      if(this.hisList.length>5){
        hisList = this.hisList.splice(0,5);
      }else{
        hisList = this.hisList;
      }
      localStorage.setItem('his',JSON.stringify(hisList))
      let type = this.type === '0' ? 0 : 1
      addPotp(this.liveId, {title:this.itemInfo.title,url:this.itemInfo.url,tag:this.itemInfo.tag,type:type}).then(_ => {
        this.$message("操作成功");
        this.itemInfo.title = '';
        this.itemInfo.tag = '';
        this.itemInfo.url = '';
        this.type = '0';
        this.getpotp(this.liveId);
      });
    },
    // 修改
    updateData() {
       if(!this.hisList.includes(this.itemInfo.tag)&&this.itemInfo.tag != ''){
        this.hisList.unshift(this.itemInfo.tag)
      }
      let hisList = []
      if(this.hisList.length>5){
        hisList = this.hisList.splice(0,5);
      }else{
        hisList = this.hisList;
      }
      localStorage.setItem('his',JSON.stringify(hisList))
      let type = this.type === '0' ? 0 : 1
      putPotp(this.potpId, {title:this.itemInfo.title,url:this.itemInfo.url,tag:this.itemInfo.tag,type:type}).then(_ => {
        this.$message("操作成功");
        this.itemInfo.title = '';
        this.itemInfo.tag = '';
        this.itemInfo.url = '';
        this.type = '0';
        this.getpotp(this.liveId);
      });
    },
    // 删除数据
    del(val) {
        delPotp(val).then(_ => {
          this.$message("已删除");
          this.getpotp(this.liveId);
        });
    },
    
    // 频道切换
    tabChoose(val, e) {
      this.itemIndex = val;
      this.competition = e.competitionId;
      this.$store.commit("setPage", 1);
    },
    // 获取频道列表
    getChannel() {
      getSimple().then(res => {
        let all = [{ competitionId: "", name: "全部", id: "" }];
        this.tabList = all.concat(res.data);
        this.competition = this.tabList[0].competitionId;
        console.log(this.competition);
      });
    },
    // 获取精选赛事
    getMatche() {
      getMatches({
        competition: this.competition,
        start: this.start,
        end: this.end,
        page: this.page
      }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
    
  },
  computed: {
    ...mapGetters(["page"]),
    dataList() {
      return [this.competition, this.start, this.end, this.page];
    },
    urlList() {
      return this.list.filter(res => {
        return res.url != "" && res.name != "";
      });
    }
  },
  watch: {
    dataList(newVal) {
      this.getMatche();
    },
    dataRang(newVal) {
      console.log(newVal);
    },
    list: {
      handler(val) {
        // 列表为空时保存按钮置灰
        if (val.length === 1 && (val[0].name === "" || val[0].url === "")) {
          this.isAdd = true;
        } else {
          this.isAdd = false;
        }
        // 列表存在为空项时添加直播源按钮置灰
        let num = 0;
        val.map(res => {
          if (res.url === "" || res.name === "") {
            num++;
          }
        });
        if (num > 0) {
          this.isNull = true;
        } else {
          this.isNull = false;
        }
      },
      deep: true //加上这
    },
    refreshDate(newVal) {
      let times =
        new Date(newVal).getFullYear().toString() +
        (new Date(newVal).getMonth() + 1).toString() +
        new Date(newVal).getDate().toString();
      refreshMatch(times).then(res => {
        this.start = newVal;
        this.end = newVal + 3600 * 1000 * 24 - 1000;
        this.$store.commit('setPage',1)
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.cont{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.tab-name {
  display: inline-block;
  padding: 0 20px;
}
.list {
  max-height: 500px;
  overflow-y: scroll;
}
.tab-name + .tab-name {
  border-left: 1px solid #d0d0d0;
}
.left{
  width: 45vw;
}
.right{
  width: calc(55vw - 40px);
}
.el-input{
  width: calc(100% - 150px); 
}
/deep/.inputFlieV{
  position: absolute;
  margin-top: -35px;
  width: 80px;
  // margin-left: 80px;
  z-index: 9;
  opacity: 0;
}
.history em{
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>

