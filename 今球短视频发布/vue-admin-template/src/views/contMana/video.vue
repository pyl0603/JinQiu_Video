<template>
  <div style="margin:0 2rem">
       <el-menu
          :default-active="activeIndex"
          default-active="1"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1">正常</el-menu-item>
          <el-menu-item index="0">已删除</el-menu-item>
        </el-menu>

   <div>
      <el-table
      :data="
        tableData.filter(
          (data) =>
            !search || data.name.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%;margin:20px 0 20px 0"
    >
      <el-table-column label="发布时间" prop="createTime" width="400">
      </el-table-column>
      <el-table-column label="视频简介" prop="detail" >
      </el-table-column>
      <el-table-column label="视频作者" prop="userInfo.nickname" width="300">
      </el-table-column>
      <el-table-column align="right" width="400">
        <template slot="header" slot-scope="scope">
          <el-row type="flex">
            <el-col :span="2">
              <el-button
              type="primary"
                @click="handlePostVideo(scope.$index, scope.row)"
                >添加内容</el-button
              >
            </el-col>
            <el-col :span="17" :push="5">
              <el-input
                v-model="search"
                placeholder="输入关键字搜索"
              >
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
          </el-row>
        </template>
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
             @click="handleClicCheckout(scope.row)"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.$index, scope.row)"
            >撤回</el-button
          >
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
import moment from "moment";

import axios from "axios";
import { getToken } from "@/utils/auth";

export default {
  data() {
    return {
      total: 100, //资讯总数
      pageSize: 10, //一页多少个资讯
      activeIndex: "1",
      tableData: [
        
      ],
      search: "",
      videolist:{
        pageNum:1,//页
        pageSize:10,//页大小
        state:1//查询状态
      },
      dto:{
        lat:null,
        lon:null
      },
    };
  },
  methods: {
      handleClicCheckout(data) {
      console.log(data.id);
      // 点击查看详情跳转到页面
      this.$router.push({
        path: '/video/index',
        query: { data: data },
      });
      // const res = await getNews(data.id)
    },
    handlePostVideo(index, row) {
      this.$router.push("/video/index");
    },
    handleDelete(index, row) {},
    handleSizeChange(val) {},
        handleSelect(key, keyPath) {
      this.videolist.state = key;
      this.getVideoList()
    },
    handleCurrentChange(val) {
      this.videolist.pageNum = val
      this.getVideoList()
    },
     getVideoList(){
      //  const { state,pageNum,pageSize } = this.videolist
            axios({
        method: "post",
        // url: `http://192.168.1.201:8080${url}`,
        url: `http://192.168.1.33:8080/cloud-news-publish/home/${this.videolist.state}/${this.videolist.pageNum}/${this.videolist.pageSize}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
        data: this.dto,
      }).then((res) => {
        const { list,total,pageSize,pageNum } = res.data.data
        this.tableData = list
        console.log(res.data.data)
        this.total = total
        this.pageSize = pageSize
        // this.pageSize = res.data.data.pageSize;
        // this.total = res.data.data.total;
        // const { list } = res.data.data;
        // this.tableData = list;
        this.tableData.map((item) => {
          item.createTime = moment(item.createTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
      });
    },
  },
  mounted(){
    this.getVideoList()
  }

};
</script>
