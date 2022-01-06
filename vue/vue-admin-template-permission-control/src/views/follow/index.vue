<template>
  <div class="follow">
    <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList"></top-tab>
    <!-- 页面分类 -->
    <div class="add-btn">
      <el-button type="dqx-btn" @click="addCont">新增</el-button>
    </div>
    <rec :is="currentTab" ref="Team" :tabName="tabName" :isAdd="isAdd" @arrId="arrId"></rec>
    <!-- 弹窗 -->
    <el-dialog title="添加内容" :visible.sync="dialogVisible" width="30%" :show-close="false">
      <div class="dialog-cont">
        <div>
          <div class="search-match mt20">
            <em>添加内容：</em>
            <el-input v-inputRule v-model="cont"></el-input>
            <el-button
              type="dqx-btn"
              class="ml10"
              @click="searTeam"
              v-if="type === 0 || type === 1 "
            >球队</el-button>
            <el-button type="dqx-btn" class="ml10" @click="searPlayer" v-if="type === 0 || type === 2">球员</el-button>
            <el-button type="dqx-btn" class="ml10" @click="searCircle" v-if="type===4">圈子</el-button>
          </div>
          <div class="res-list mt20">
            查询结果：
            <div>
              <span
                v-for="item in resList"
                :key="item.id"
                class="cp"
                @click="chooseItem(item)"
              >{{item.nameZh|| item.name}}</span>
            </div>
          </div>
          <div class="mt20">已选择：{{contName}}</div>
          <div slot="footer" class="dialog-footer mt20 tac">
            <el-button type="dqx-btn" @click="createData">保存</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TopTab from "@/views/common/top-tab";
import Rec from "./rec.vue";
import Team from "./team.vue";
import Player from "./player.vue";
import Other from "./other.vue";
import Circles from "./circle.vue";
import {
  getKeys,
  getPlayer,
  addConts,
  getTeam,
  getTeamAll
} from "@/api/follow";
import { getCircle } from "@/api/circle";
export default {
  data() {
    return {
      cont: "",
      contName: "",
      contInfo: "",
      resList: [],
      currentTab: "Team",
      tabName: [],
      dialogVisible: false,
      isAdd: false,
      tabList: [
      ],
      competitionId: 0,
      id: 1,
      type: 1,
      addType:0,
      cat: 0
    };
  },
  components: {
    TopTab,
    Rec,
    Team,
    Player,
    Circles,
    Other
  },
  methods: {
    // 查询球员
    searPlayer() {
      this.addType = 2;
      getPlayer({ key: this.cont,page:1,page_size:20 }).then(res => {
        this.resList = res.data;
      });
    },
    // 查询球队
    searTeam() {
      this.addType = 1
        if(this.currentTab == 'Team'){
          getTeamAll({ key: this.cont,matcheventId:this.competitionId ,page:1,page_size:20}).then(res => {
            this.resList = res.data;
          });
        }else{
          getTeamAll({ key: this.cont ,page:1,page_size:20 }).then(res => {
            this.resList = res.data;
          });
        }
      // }
    },
    // 查询圈子
    searCircle() {
      this.addType = 4
      getCircle({ name: this.cont }).then(res => {
        this.resList = res.data;
      });
    },
    chooseItem(val) {
      this.contName = val.nameZh || val.name;
      this.contInfo = val;
    },
    // 新增按钮
    addCont(val) {
      this.resList = [];
      this.contName = "";
      this.cont = "";
      this.dialogVisible = true;
    },
    // 新增提交
    createData() {
      if(!this.contInfo){
        this.$message('请先选择内容');
        return
      }
      addConts({
        itemId: this.contInfo.sid || this.contInfo.id,
        itemLogo: this.contInfo.logo,
        itemName: this.contInfo.nameZh || this.contInfo.name,
        itemType: this.addType,
        attId: this.id
      }).then(_ => {
        this.isAdd = !this.isAdd;
        this.dialogVisible = false;
      });
    },
    // 分类Id
    arrId(val) {
      this.id = val[0];
      this.competitionId = val[1];
    },
    //   顶部tab,切换数据源
    chooseTab(val) {
      // 新增时判断
      let contType = {
        Team: () => (
          (this.type = 1),
          (this.id = this.tabName[0].list[0].id),
          (this.competitionId = this.tabName[0].list[0].competitionId)
        ),
        Player: () => ((this.type = 2), (this.id = this.tabName[1].list[0].id)),
        Circles: () => ((this.type = 5), (this.id = this.tabName[2].list[0].id))
      };
      contType[val]();
      this.contInfo = '';
      this.currentTab = val;
      if (this.type == 0) {
        getKeys(this.cat).then(res => {
          this.tabName = res.data;
        });
      }
    }
  },
  async created() {
    if(this.$route.fullPath.indexOf('basketball') > -1){
      this.cat = 1
    }
    if(this.$route.fullPath.indexOf('football') > -1){
      this.cat = 0
    }
    let { data } = await getKeys(this.cat);
    this.tabName = data;
    this.tabList  = data;
  }
};
</script>
<style lang="scss" scoped>
.add-btn {
  text-align: right;
  height: 30px;
}
.el-input {
  width: calc(100% - 250px);
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
