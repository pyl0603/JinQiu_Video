<template>
  <div class="match-item">
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="mb10"
      height="calc(100vh - 290px)"
    >
      <el-table-column prop="roomNumber" label="房间ID" width="300"></el-table-column>
      <el-table-column label="主播昵称" >
        <template slot-scope="scope">
          {{scope.row.streamer.nickName}}
        </template>
      </el-table-column>
      <el-table-column label="关联" width="120" v-if="matchChoose">
        <template slot-scope="scope">
          <el-button
            @click="isPush ? handleClick(scope.row) : showPop(scope.row)"
            type="text"
            size="small"
          >{{isPush ? '选择' : '推送'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <paging ref="paging" @changePage="changePage" :total="total"></paging>
  </div>
</template>
<script>
import paging from "@/components/Paging/pop-index";
import { getAnchorList } from "@/api/live";
import { formatTime } from "@/utils/index.js";
export default {
  props: {
    matchChoose: {
      type: Boolean,
      default: true
    },
    select: {
      type: String,
      default: '1'
    },
    cont: {
      type: String,
      default: ''
    },
    isPush: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 表格数据
      tableData: [],
      total: 0,
      page: 1,
      defaultImg: 'this.src="' + require("img/img_default_error.png") + '"'
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
  methods: {
    handleClick(val) {
      console.log(val)
      //this.$emit("matchId", ["6", val.streamer.nickName, val.roomNumber, 6]);
      this.$emit("matchId", val);
    },
    changePage(val) {
      this.page = val;
    },
    getList() {
      let roomNumber,nickName = ''
      roomNumber = this.select === '1' ? this.cont : ''
      nickName = this.select === '2' ? this.cont : ''
      getAnchorList({roomNumber: roomNumber,nickName:nickName,page:this.page,page_size:10}).then(res => {
        this.tableData = res.data;
        this.total = res.meta.pagination.total;
      });
    },
    // 弹窗关联
    showPop(val) {
      console.log(1)
      this.$emit("showPop", val);
    }
  },
  mounted() {
    this.getList();
    this.$store.commit("setPaging", false);
  },
  computed: {
    pages() {
      let data = [this.page,this.cont,this.select];
      return data;
    }
  },
  watch: {
    pages(newVal) {
      this.getList();
    }
  }
};
</script>
<style lang="scss" scoped>
 em{
    color: #18CE94;
    display: inline-block;
    margin-right: 5px;;
  }
img {
  height: 50px;
}
</style>
