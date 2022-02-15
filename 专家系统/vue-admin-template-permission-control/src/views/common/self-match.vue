<template>
  <div class="match-item">
    <el-table :data="tableData" border style="width: 100%" class="mb10"  height="calc(100vh - 290px)">
      <el-table-column label="比赛">
        <template slot-scope="scope">
          <span v-if="scope.row.type.value === 98">{{ scope.row.title }}</span>
          <span v-if="scope.row.type.value != 98"
            >{{ scope.row.home.name }} VS {{ scope.row.away.name }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="competition" label="联赛场次" class="el-col-6"></el-table-column>
      <el-table-column label="开赛时间" width="200">
        <template slot-scope="scope">
          {{scope.row.matchTime | formatTime}}
        </template>
      </el-table-column>
      <el-table-column label="关联" width="120" v-if="matchChoose">
        <template slot-scope="scope">
          <el-button @click="isPush ? choose(scope.row) : showPop(scope.row)" type="text" size="small">{{isPush ? '选择' : '推送'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
      <paging ref="paging" @changePage="changePage" :total="total"></paging>
  </div>
</template>
<script>
import paging from '@/components/Paging/pop-index';
import { getSelfMatch } from '@/api/public'
import { formatTime } from "@/utils/index.js";
export default {
  props: {
    matchChoose: {
      type: Boolean,
      default: false
    },
    startTime:{
      type:Number,
      default:0
    },
    endTime:{
      type:Number,
      default:0
    },
    isPush:{
      type:Boolean,
      default:true
    }
  },
  data() {
    return {
      // 表格数据
      tableData: [],
      total:0,
      page:1
    };
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  components: {
    paging
    },
  methods:{
      choose(val){
        this.$emit('matchId',['1',val.competition,val.id,1])
      },
      changePage(val){
        this.page = val;
      },
      getList(){
        let val = this.endTime === 0 ? {page:this.page} : {page:this.page,start:this.startTime,end:this.endTime}
        getSelfMatch(val).then(res => {
          this.tableData = res.data;
          this.total = res.meta.pagination.total
        })
      },
      // 弹窗关联
      showPop(val){
        this.$emit('showPop',val)
      }
  },
  mounted(){
    this.getList();
  },
  computed:{
    pages(){
      let data = [this.page,this.startTime,this.endTime]
      return data
    }
  },
  watch:{
    pages(newVal){
      this.getList()
    }
  }
};
</script>
