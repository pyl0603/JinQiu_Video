<template>
  <div style="margin: 1rem 1rem">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="0">待发布</el-menu-item>
      <el-menu-item index="1">已发布</el-menu-item>
      <el-menu-item index="2">待审核</el-menu-item>
      <el-menu-item index="3">未通过</el-menu-item>
      <el-menu-item index="4">已删除</el-menu-item>
    </el-menu>
    <div style="padding: 12px">
      <el-row v-for="item in list" :key="item.id">
        <el-col>
          <el-row type="flex" :gutter="20">
            <el-col :span="5">
              <div class="Collection">
                <el-image class="CollectionImg" :src="item.mainImage">
                  <div slot="error" class="image-slot"></div>
                </el-image>
                <div class="CollectionText">
                  <i class="el-icon-video-camera icon"></i>
                  <div class="text">{{ item.videoCount }}个作品</div>
                </div>
              </div>
            </el-col>

            <el-col :span="12">
              <el-row class="flexd">
                <el-col>
                  <el-row>
                    <el-col>
                      <h3>{{ item.collectionName }}</h3>
                    </el-col>
                    <el-col>
                      <div class="Introduction">{{ item.note }}</div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col class="dshi">
                  <el-row>
                    <el-col class="scStar">
                      <i class="el-icon-star-off titleicon"></i>
                      <div>{{ item.collectCount }}人收藏</div>
                    </el-col>
                    <el-col class="fabtitle">
                      <div class="bluer">{{item.state}}</div>
                      <div>{{ item.createTime }}</div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>

            <el-col push="2">
              <el-button type="text" class="primary" @click="handleDelete(item)"
                >移除合集</el-button
              >
              <el-button
                type="text"
                class="primary"
                @click="handleVideoAdd(item)"
                >添加视频</el-button
              >
              <el-button
                type="text"
                class="primary"
                @click="handleVideodelete(item)"
                >合集详情</el-button
              >
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      :title="checkDetail ? '合集详情' : '作品列表'"
      :visible.sync="outerVisibleVideo"
    >
      <div class="videorow">
        <div
          class="videocol"
          v-for="item in checkDetail ? detailList : videoList"
          :key="item.id"
        >
          <el-image
            style="
              width: 12rem;
              height: 12rem;
              boxshadow: 5px 5px 5px #ccc;
              border: 1px solid #ccc;
              margin:8px 13px 4px 0;
            "
            :src="`${item.videoImage}`"
          >
          </el-image>
          <el-checkbox
            class="videolistcheckbox"
            @change="handleCheckboxChange($event, item)"
          ></el-checkbox>
          <div class="detail">{{ item.detail }}</div>
        </div>
      </div>
      <div style="position: absolute; right: 200px; bottom: 24px">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="checkDetail ? detailTotal : total"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleUpViodeFail">取 消</el-button>
        <el-button v-if="!checkDetail" type="primary" @click="handleUpvideoList"
          >确认</el-button
        >
        <el-button v-if="checkDetail" type="danger" @click="handleUpvideoList"
          >删除</el-button
        >
      </div>
    </el-dialog>
       <div style="position: absolute; right: 2%; bottom: 4%">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="listTotal"
          :page-size="dto.pageSize"
          @current-change="handleCurrentChangeList"
        >
        </el-pagination>
      </div>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { getToken } from "@/utils/auth";
import {
  collectionDeleteVideo,
  CollectionList,
  deleteCollection,
  checkCollectionVideos,
  addVideoCollection,
} from "@/api/collection.js";
export default {
  data() {
    return {
      listTotal:0,
      detailTotal: 0,
      checkDetail: false,
      total: 0,
      pageSize: 15,
      pageNum: 1,
      outerVisibleVideo: false,
      videoList: [],
      detailList: [],
      activeIndex: "2",
      dto: {
        pageNum: 1,
        pageSize: 4,
        state: 2,
      },
      list: [],
      dtoList: {
        lat: null,
        lon: null,
      },
      videolist: {
        state: 1,
        pageNum: 1,
        pageSize: 15,
      },
      addVideo: {
        collectionId: null,
        videoId: [],
      },
      videosParmas: {
        pageNum: 1,
        pageSize: 15,
        collectionId: null,
      },
    };
  },
  methods: {
    handleSelect(key) {
      this.dto.state = key;
      this.getCollectionList();
    },
    async getCollectionList() {
      const res = await CollectionList(this.dto);
      if (res.code === 200) {
        const { list, total, pageNum, pageSize } = res.data;
        this.listTotal = total
        this.dto.pageNum = pageNum
        this.dto.pageSize = pageSize
        this.list = list;
        this.list.map((item) => {
          item.state === 0
            ? (item.state = "待发布")
            : item.state === 1
            ? (item.state = "已发布")
            : item.state === 2
            ? (item.state = "待审核")
            : item.state === 3
            ? (item.state = "审核失败")
            : item.state === 4
            ? (item.state = "已删除")
            : "";

          item.createTime = moment(item.createTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
      }
    },
    async handleDelete(e) {
      const res = await deleteCollection(e.id);
      if (res.code === 200) {
        this.$message({
          message: "成功删除合集",
          type: "success",
        });
        this.getCollectionList();
      }
    },
    async handleVideoAdd(e) {
      this.addVideo.videoId = []
      console.log(e);
      this.outerVisibleVideo = true;
      this.checkDetail = false;
      this.addVideo.collectionId = e.id
      console.log(this.addVideo.collectionId);
    },
    handleCheckboxChange(e, item) {
      if (e) {
        this.addVideo.videoId.push(item.id);
        console.log(this.addVideo.videoId);
      } else {
        const res = this.addVideo.videoId.filter((i) => {
          return i != item.id;
        });
        this.addVideo.videoId = res;
        console.log(this.addVideo.videoId);
      }
    },
    handleUpViodeFail() {
      this.outerVisibleVideo = false;
      this.videoItems = [];
    },
    handleUpvideoList() {
      this.outerVisibleVideo = false;
      if (this.checkDetail) {
        collectionDeleteVideo(this.addVideo).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: "合集视频已删除",
              type: "success",
            });
          }
        });
      } else {
        addVideoCollection(this.addVideo).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: "视频已添加到合集",
              type: "success",
            });
          }
        });
      }

      // this.dtoAddCollection.videoItems = this.videoItems;
      // 添加请求
    },
    async handleCurrentChange(val) {
      this.checkDetail
        ? (this.videosParmas.pageNum = val)
        : (this.videolist.pageNum = val);
      this.checkDetail ? this.checkVideoList() : this.getVideoList();
    },
    handleCurrentChangeList(val){
this.dto.pageNum = val
this.getCollectionList();
    },
    getVideoList() {
      axios({
        method: "post",
        // url: `http://192.168.1.201:8080${url}`,
        url: `http://192.168.1.33:8080/cloud-news-publish/home/${this.videolist.state}/${this.videolist.pageNum}/${this.videolist.pageSize}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
        data: this.dtoList,
      }).then((res) => {
        const { list, total, pageSize, pageNum } = res.data.data;
        this.videoList = list;
        this.total = total;
        this.pageSize = pageSize;
        this.pageNum = pageNum;
        // this.videoListtotal = total
        // this.videoListpageSize = pageSize
      });
    },
    async checkVideoList() {
      const res = await checkCollectionVideos(this.videosParmas);
      if (res.code === 200) {
        const { list, total, pageNum,pageSize } = res.data;
        this.detailList = list;
        this.detailTotal = total;
        this.pageSize = pageSize;
      }
    },
    async handleVideodelete(e) {
      this.addVideo.videoId = []
      this.outerVisibleVideo = true;
      this.checkDetail = true;
      this.addVideo.collectionId = e.id
      this.videosParmas.collectionId = e.id;
      this.checkVideoList();
    },
  },
  mounted() {
    this.getCollectionList();
    this.getVideoList();
  },
};
</script>

<style lang="scss">
.Collection {
  position: relative;
  width: 12rem;
  height: 12rem;
  .CollectionImg {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .CollectionText {
    z-index: 2;
    position: absolute;
    right: 3px;
    bottom: 4px;
    display: flex;
    align-items: center;
    .icon {
      color: #eee;
      font-size: 1.5rem;
    }
    .text {
      line-height: 50%;
      margin-left: 5px;
      color: white;
      font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
        Microsoft YaHei, Arial, sans-serif;
    }
  }
}
.Introduction {
  font-size: 18px;
}
.scStar {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  .titleicon {
    color: black;
    font-size: 25px;
    margin-right: 1rem;
  }
}
.fabtitle {
  display: flex;
  align-items: center;
  .bluer {
    color: rgb(50, 104, 255);
    margin-right: 1rem;
  }
}
.flexd {
  display: flex;
  flex-direction: column;
}
.dshi {
  margin-top: 3rem;
}
.primary {
  margin-top: 10rem;
}
.videorow {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  // justify-content: space-between;
  justify-content: start;
}
.videocol {
  position: relative;
}
.videolistcheckbox {
  position: absolute;
  left: 4%;
  bottom: 24%;
}
.detail {
  margin: 1rem 0;
  width: 10rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
