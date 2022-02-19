<template>
  <div>
    <el-row type="flex" style="margintop: 20px">
      <el-col>
        <el-menu
          style="width: 100%; padding: 0 30px 0 30px"
          :default-active="activeIndex"
          default-active="0"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="0">未审核</el-menu-item>
          <el-menu-item index="1">审核未通过</el-menu-item>
          <el-menu-item index="2">审核通过</el-menu-item>
          <el-menu-item index="3">已删除</el-menu-item>
        </el-menu>
      </el-col>
      <!-- <el-col :span="4" style="paddingRight:20px">
        <el-row type="flex">
          <el-col :span="4">
        <el-button type="primary" @click="handleClickPush">添加内容</el-button>
          </el-col>
          <el-col :span="20" :push="6">
            <el-input
          placeholder="输入文章标题搜索"
          v-model="searchValue"
          class="input-with-select"
        >
          <el-button @click="handleClickSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
          </el-col>
        </el-row>
      </el-col> -->
    </el-row>

   <div style="margin:0 2rem">
      <el-table
      :data="
        tableData.filter(
          (data) =>
            !search || data.name.toLowerCase().includes(search.toLowerCase())
        )
      "
      
    >
      <el-table-column label="发布时间"  prop="createTime" width="300" >
      </el-table-column>
      <el-table-column label="文章标题" prop="title" >
      </el-table-column>
      <el-table-column
        label="文章作者"
       width="250"
        prop="authorUserInfo.nickname"
      >
      </el-table-column>
      <el-table-column label="文章类型" width="200" prop="type">
      </el-table-column>
      <el-table-column align="right" width="400">
        <template slot="header" slot-scope="scope">
          <el-row type="flex">
            <el-col :span="1" >
              <el-button
              type="primary"
                @click="handleClickPush(scope.$index, scope.row)"
                >添加内容</el-button
              >
            </el-col>
            <el-col :span="17" :push="6">
              <el-input
                placeholder="输入文章标题搜索"
                v-model="searchValue"
                class="input-with-select"
              >
                <el-button @click="handleClickSearch" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
          </el-row>
        </template>

        <template slot-scope="scope">
          <el-button
            @click="handleClickWithdraw(scope.row)"
            v-if="showBtn"
            type="text"
            size="small"
            >删除</el-button
          >
          <!-- <el-button
            @click="handleClickFail(scope.row)"
            type="text"
            size="small"
            >不通过</el-button
          >
          <el-button
            @click="handleClicKpassThrough(scope.row)"
            type="text"
            size="small"
            >通过</el-button
          > -->
          <el-button
            @click="handleClicCheckout(scope.row)"
            type="text"
            size="small"
            >编辑</el-button
          >
          <!-- <el-button
            @click="handleClicRecommend(scope.row)"
            type="text"
            size="small"
            >推荐</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>

   </div>



    <div style="position: absolute; right: 2%; bottom: 9%">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getToken } from "@/utils/auth";
import {
  WithdrawNews,
  FailNews,
  KpassThroughNews,
  recommendNews,
} from "@/api/oss";
import moment from "moment";
export default {
  data() {
    return {
      showBtn:true,
      switchValue: "",
      total: 0,
      pageSize: 0,
      dto: {
        dto:{
          matchId: null,
          searchText: '',
          tagId: null,
          tagIsTeam: null,
          tagTeamType: null
        },
        pageNum: 1,
        pageSize: 10,
        state: 0,
      },
      activeIndex: "1",
      tableData: [],
      search: "",
      searchValue: "",
    };
  },
  methods: {
    async handleClickWithdraw(data) {
      const res = await WithdrawNews(data.id);
      if (res.code === 200) {
        this.getdataList();
      }
    },
    async handleClickFail(data) {
      const res = await FailNews(data.id);
      if (res.code === 200) {
        this.getdataList();
      }
    },
    async handleClicKpassThrough(data) {
      const res = await KpassThroughNews(data.id);
      if (res.code === 200) {
        this.getdataList();
      }
    },
    // 
    async handleClicRecommend(data) {
      const res = await recommendNews(data.id);
      if (res.code === 200) {
        this.getdataList();
      }
    },
    async handleClicCheckout(data) {
      console.log(data.id);
      // 点击查看详情跳转到页面
      this.$router.push({
        path: "/addCont/index",
        query: { id: data.id },
      });
      // const res = await getNews(data.id)
    },
    handleSizeChange(val) {
      console.log(val);
    },
    handleCurrentChange(val) {
      this.dto.pageNum = val;
      this.getdataList();
    },
    handleClickSearch() {
      this.dto.dto.searchText = this.searchValue;
      this.getdataList();
    },
    handleClickPush() {
      this.$router.push("/addCont/index");
    },
    getdataList() {
      // this.dto.state = -1
        // URL: 'http://192.168.1.201:8080', // url =  url + request url
      // URL: 'http://192.168.1.31:8080', // url =  url + request url
      //URL: 'http://192.168.1.33:8080', // url =  url + request url
      axios({
        method: "post",
        // url: `http://192.168.1.201:8080${url}`,
        url: `http://192.168.1.33:8080/cloud-news-publish/news/search/${this.dto.pageNum}/${this.dto.pageSize}/${this.dto.state}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
        data: this.dto,
      }).then((res) => {
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
        const { list } = res.data.data;
        this.tableData = list;
        this.tableData.map((item) => {
          item.type === 0
            ? (item.type = "赛前分析")
            : item.type === 1
            ? (item.type = "快讯")
            : item.type === 2
            ? (item.type = "战报")
            : "无类型";
          item.createTime = moment(item.createTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
        console.log(res);
      })
    },
    handleSelect(key, keyPath) {
      this.dto.state = key;
      this.dto.state ==3?this.showBtn = false:this.showBtn =true
      this.getdataList();
    },
  },
  mounted() {
    this.getdataList();
  },
};
</script>
<style>
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
