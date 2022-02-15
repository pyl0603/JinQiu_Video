<template>
  <!-- 左侧 -->
  <div class="left el-col-7">
    <div class="top-header">
      <!-- 搜索框 -->
      <div class="sear mt20">
        <el-input v-inputRule prefix-icon="el-icon-search" v-model="keyWorlds"  @keyup.enter.native="searCont"></el-input>
        <el-button type="dqx-btn ml10" @click="searCont">搜索</el-button>
      </div>
    </div>
    <!-- 文章列表 -->
    <div class="list">
      <div class="item cp" v-for="item in list" :key="item.id" @click="getDet(item.id)">
        <span
          class="c424 f16"
        >{{item.title}}</span>
        <div class="item-btm cada f14 mt10">
            <em>{{item.community.name}}</em>
        <em>{{item.createdAt | formatTime}}</em>
        </div>
      </div>
    </div>
    <paging ref="paging" @changePage="changePage" :total="total" class="mt10"></paging>
  </div>
</template>
<script>
import paging from "@/components/Paging/page-eva";
import { getDis } from '@/api/eva'
import { formatTime } from "@/utils/index.js";
export default {
  data() {
    return {
      total: 0,
      type: 'article',
      keyWorlds: "",
      page:0,
      list:[],
      searTxt:'',
      isSearch:false
    };
  },
  props:{
      isRefresh:{
          type:Boolean,
          default:true
      }
  },
  components: {
    paging
  },
    filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  methods: {
    // 分页切换
    async changePage(val) {
      this.page = val;
    },
    // 内容检索
    async searCont(){
        this.searTxt = this.keyWorlds;
    },
    async getIndex(){
      getDis({page:this.page,title:this.searTxt}).then( res =>{
        this.list = res.data;
        this.total = res.meta.pagination.total
      })
    },
    async getDet(val){
      this.$emit('disId',val)
    }
  },
  mounted(){
    this.page = 1;
    this.getIndex();
  },
  computed:{
      dataList(){
          return [this.page,this.searTxt]
      }
  },
  watch:{
      isRefresh(newVal){
          this.getIndex();
      },
    searTxt(newVal){
        this.getIndex();
    }
  }
};
</script>
<style lang="scss" scoped>
.item-btm{
    display: flex;
    justify-content: space-between;
}
/deep/.el-pagination{
    margin-left: -20px;
}
.left {
  height: calc(100vh - 60px);
  padding: 0 20px;
  border-right: 10px solid #f2f2f2;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  .top-header {
    position: fixed;
    background: #fff;
    width: calc(25% - 40px);
  }
  .list {
    margin-top: 60px;
    height: calc(100vh - 180px);
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .item + .item {
    border-top: 1px solid #f2f2f2;
  }
  .item {
    padding: 10px 0;
    span {
      display: block;
      line-height: 28px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    em {
      display: block;
    }
  }
  .el-input {
    width: calc(100% - 90px);
  }
  .tab {
    display: flex;
    justify-content: space-between;
    width: 185px;
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
    border: 1px solid #cecece;
    margin-left: calc(50% - 92px);
    span + span {
      border-left: 1px solid #cecece;
    }
    span {
      display: inline-block;
      width: 92px;
      text-align: center;
      background: #f0f0f0;
    }
    span.on {
      color: #18ce94;
      background: #fff;
    }
  }
}
</style>

