<template>
  <div class="player">
    <el-row class="mt20">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        height="calc(100vh - 240px)"
      >
        <el-table-column prop="author" label="排序"></el-table-column>
        <el-table-column prop="url" label="相关文章" width="200"></el-table-column>
        <el-table-column prop="author" label="类别"></el-table-column>
        <el-table-column prop="author" label="发文" width="180"></el-table-column>
        <el-table-column prop="author" label="热文数" width="180"></el-table-column>
        <el-table-column prop="author" label="今日新增粉丝" width="180"></el-table-column>
        <el-table-column prop="author" label="总粉丝量" width="180"></el-table-column>

        <el-table-column label="调整" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">上移</el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">下移</el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">置顶</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          name: "艾因vs杜海勒前瞻 杜海勒征战亚冠状态走低...",
          cont: "赛事:2018世界杯",
          date: "2016-05-03",
          author: "王小虎",
          url: "http://www.baidu.com",
          isOpen: true
        },
        {
          name: "艾因vs杜海勒前瞻 杜海勒征战亚冠状态走低...",
          cont: "赛事:2018世界杯",
          date: "2016-05-03",
          author: "王小虎",
          url: "http://www.baidu.com",
          isOpen: true
        },
        {
          name: "艾因vs杜海勒前瞻 杜海勒征战亚冠状态走低...",
          cont: "赛事:2018世界杯",
          date: "2016-05-03",
          author: "王小虎",
          url: "http://www.baidu.com",
          isOpen: true
        },
        {
          name: "艾因vs杜海勒前瞻 杜海勒征战亚冠状态走低...",
          cont: "赛事:2018世界杯",
          date: "2016-05-03",
          author: "王小虎",
          url: "http://www.baidu.com",
          isOpen: true
        },
        {
          name: "艾因vs杜海勒前瞻 杜海勒征战亚冠状态走低...",
          cont: "赛事:2018世界杯",
          date: "2016-05-03",
          author: "王小虎",
          url: "http://www.baidu.com",
          isOpen: true
        },
        {
          name: "艾因vs杜海勒前瞻 杜海勒征战亚冠状态走低...",
          cont: "赛事:2018世界杯",
          date: "2016-05-03",
          author: "王小虎",
          url: "http://www.baidu.com",
          isOpen: true
        },
        {
          name: "艾因vs杜海勒前瞻 杜海勒征战亚冠状态走低...",
          cont: "赛事:2018世界杯",
          date: "2016-05-03",
          author: "王小虎",
          url: "http://www.baidu.com",
          isOpen: true
        },
        {
          name: "艾因vs杜海勒前瞻 杜海勒征战亚冠状态走低...",
          cont: "赛事:2018世界杯",
          date: "2016-05-03",
          author: "王小虎",
          url: "http://www.baidu.com",
          isOpen: true
        },
        {
          name: "艾因vs杜海勒前瞻 杜海勒征战亚冠状态走低...",
          cont: "赛事:2018世界杯",
          date: "2016-05-03",
          author: "王小虎",
          url: "http://www.baidu.com",
          isOpen: true
        },
        {
          name: "艾因vs杜海勒前瞻 杜海勒征战亚冠状态走低...",
          cont: "赛事:2018世界杯",
          date: "2016-05-03",
          author: "王小虎",
          url: "http://www.baidu.com",
          isOpen: true
        }
      ],
      multipleSelection: []
    };
  },
  mounted() {
    this.$store.commit("setPaging", false);
  },
  methods: {
    handleDelete() {},
    handleEdit() {},
    handleSelectionChange(){}
  }
};
</script>
<style>
.test{
  display: flex;
  transform: scale(.8);
}
</style>
