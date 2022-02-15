<template>
  <div class="player">
    <el-row style="text-align: right;">
      <el-button type="dqx-btn" @click="dialogVisible = true">添加</el-button>
    </el-row>
    <el-row class="mt20">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        height="calc(100vh - 240px)"
      >
        <el-table-column prop="itemName" label="主播昵称"></el-table-column>
        <el-table-column label="调整" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="movePos(scope.$index, scope.$index - 1)">上移</el-button>
            <el-button size="mini" type="text" @click="movePos(scope.$index, scope.$index + 1)">下移</el-button>
            <el-button size="mini" type="text" @click="moveTop(scope.row.id,scope.$index)">置顶</el-button>
            <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="关注推荐" width="300">
          <template slot-scope="scope">
           <el-switch
            :key="scope.$index"
            :value="scope.row.isRecommend"
            @change="changeRec($event, scope.row)"
          />
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- 弹窗 -->
    <el-dialog title="添加主播" :visible.sync="dialogVisible" width="40%" :show-close="false">
      <div class="dialog-cont">
        <div>
          <div class="search-match mt20">
            <em>添加内容：</em>
            <el-input v-model="cont" placeholder="请输入主播昵称"></el-input>
            <el-button
              type="dqx-btn"
              class="ml10"
              @click="searAnchor"
              
            >查询</el-button>
          </div>
          <div class="res-list mt20">
            查询结果：
            <div>
              <span
                v-for="item in resList"
                :key="item.id"
                class="cp"
                @click="chooseItem(item)"
              >{{item.streamer.nickName}}</span>
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
import { getKeys, putRec, getList, batchConts, addConts} from '@/api/follow'
import { getAnchorList} from '@/api/live'
export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      posList: [],
      typeId: 4,
      cont:'',
      resList:[],
      contName:'',
      dialogVisible:false,
      id:''

    };
  },
  async mounted() {
    this.$store.commit("setPaging", false);
    let { data } = await getKeys(2)
    this.typeId = data[0].list[0].id
    this.getLists()
  },
  methods: {
    // 添加关注
    createData(){
      let data = {
        itemId: this.id,
        itemName: this.contName,
        itemType: 2,
        category: 2,
        attId: this.typeId
      }
      addConts(data).then(_ => {
        this.$message("操作成功");
        this.getLists()
        this.dialogVisible = false
      })
    },
    // 查询主播
    searAnchor(){
      getAnchorList({nickName:this.cont}).then(res => {
        this.resList = res.data;
      })
    },
    // 选择
    chooseItem(val){
      this.contName = val.streamer.nickName;
      this.id = val.streamer.id

    },
    // 推荐
    changeRec(val, row) {
      row.isRecommend = val;
      let lockType = val ? 'recommend' : 'cancel-recommend'
      putRec(row.id, lockType).then(_ => {
        this.$message("操作成功");
      });
    },
     // 移动
    movePos(val,vals){
      if(val > vals && val == 0){
        this.$message('该记录已经是第一条数据了')
        return
      }
      if(val < vals && vals == this.posList.length){
        this.$message('该记录已经是最后一条数据了')
        return
      }
      let item = this.posList[val];
      let items = this.posList[vals];
      this.posList[val] = items;
      this.posList[vals] = item;
      this.setPos();
    },
     // 置顶
    moveTop(val,e) {
      if(e == 0){
        this.$message('该记录已经是第一条数据了')
        return
      }
      for (let i = 0; i < this.posList.length; i++) {
        if (this.posList[i] === val) {
          this.posList.splice(i, 1); // 如果数据组存在该元素，则把该元素删除
          this.posList.unshift(val); // 再添加到第一个位置
        }
      }
      console.log(this.posList);
      this.setPos();
    },
    // 删除
    del(val){
       for (let i = 0; i < this.posList.length; i++) {
        if (this.posList[i] === val) {
          this.posList.splice(i, 1); // 如果数据组存在该元素，则把该元素删除
        }
      }
      this.setPos();
    },
    // 排序
    setPos() {
      batchConts(this.typeId, this.posList).then(res => {
        this.tableData = res.data;
        this.posList = [];
        res.data.map(res => {
          this.posList.push(res.id);
        });
      });
    },
    // 获取列表
    getLists() {
      getList(this.typeId).then(res => {
        this.tableData = res.data;
        this.posList = [];
        res.data.map(res => {
          this.posList.push(res.id);
        });
      });
    },
  },
   watch:{
    isAdd(newVal){
      this.getLists()
    }
  }
};
</script>
<style lang="scss" scoped>
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