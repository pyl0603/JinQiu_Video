<template>
  <div class="match-item">
    <el-table :data="tableData" border style="width: 100%" class="mb10"  height="calc(100vh - 290px)">
      <el-table-column label="发布时间" width="300">
        <template slot-scope="scope">
          
        {{ scope.row.updateTime| formatTime}}
        </template>
      </el-table-column>
      <el-table-column label="预览图" v-if="isPush">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" alt=""  :onerror="defaultImg">
        </template>
      </el-table-column>
             <el-table-column label="视频名称">
            <template slot-scope="scope"><em v-if="scope.row.isTop">置顶</em>{{ scope.row.title }}</template>
          </el-table-column>
      <el-table-column prop="author" label="作者" width="300"></el-table-column>
      <!-- <el-table-column prop="subhead" label="关键词" width="100"></el-table-column> -->
      <el-table-column label="关联" width="120" v-if="matchChoose">
        <template slot-scope="scope">
          <el-button @click="isPush ? handleClick(scope.row) : showPop(scope.row)" type="text" size="small">{{isPush ? '选择' : '推送'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
      <paging ref="paging" @changePage="changePage" :total="total"></paging>
  </div>
</template>
<script>
import paging from '@/components/Paging/pop-index';
// import { getVideos } from '@/api/public'
// import { getCont } from "@/api/edit.js";
import { getMedia } from "@/api/newEdit.js";
import { formatTime } from "@/utils/index.js";
// const datas = {
//   date: "2016-05-02",
//   name: "王小虎",
//   province: "上海",
//   city: "普陀区",
//   address: "上海市普陀区金沙江路 1518 弄",
//   zip: 200333
// };
export default {
  props: {
    matchChoose: {
      type: Boolean,
      default: true
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
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  data() {
    return {
      // 表格数据
      tableData: [],
      total:0,
      page:1,
      defaultImg: 'this.src="' + require("img/img_default_error.png") + '"',
    };
  },
  components: {
    paging
    },
  methods:{
      handleClick(val){
          this.$emit('videos',['2',val.title,val.id,2])
      },
      changePage(val){
        this.page = val;
      },
      getList(){
        let val = this.endTime === 0 ? {page:this.page} : {page:this.page,start:this.startTime,end:this.endTime}
         getMedia({
          category: 0,
          type: 2,
          page: this.page,
          start: this.startTime,
          end: this.endTime,
          isPublish: true,
          status: 1
           } ).then(res => {
        this.tableData = res.data;
        this.total = res.meta.pagination.total;
      });
      },
      // 弹窗关联
      showPop(val){
        this.$emit('showPop',val)
      }
  },
  mounted(){
    this.getList();
    this.$store.commit('setPaging',false)
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
<style lang="scss" scoped>
img{
  height: 50px;
}
 em{
    color: #18CE94;
    display: inline-block;
    margin-right: 5px;;
  }
</style>
