<template>
  <div style="margin: 1rem 1rem">
    <el-row>
      <el-col>
        <el-row type="flex" justify="center" :gutter="60">
          <el-col class="boderRight">
            <el-row>
              <el-col class="mgtop">
                <el-row>
                  <el-col> <i>合集标题</i><i class="color">*</i> </el-col>
                  <el-col class="mgtopmin">
                    <el-input
                      type="text"
                      placeholder="请输入内容"
                      v-model="dtoAddCollection.collectionName"
                      maxlength="20"
                      show-word-limit
                    >
                    </el-input>
                  </el-col>
                </el-row>
              </el-col>
              <el-col class="mgtop">
                <el-row>
                  <el-col> <i>合集简介</i> </el-col>
                  <el-col class="mgtopmin">
                    <el-input
                      type="textarea"
                      placeholder="请输入内容"
                      v-model="dtoAddCollection.note"
                      maxlength="200"
                      show-word-limit
                    >
                    </el-input>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col class="mgtop">
            <el-row>
              <el-col> <i>合集封面</i><i class="color">*</i> </el-col>
              <el-col class="mgtopmin">
                <div class="collectionImg" @click="handleShowImg">
                  <i class="el-icon-upload collectionImgIcon"></i>
                  <i class="collectionImgTitle">上传封面合集</i>
                  <el-image class="showimg" :src="dtoAddCollection.mainImage">
                    <div slot="error" class="image-slot"></div>
                  </el-image>
                </div>
              </el-col>
              <el-col class="collectionImgTitle2">
                <div>文件大小不超过5M, 分辨率</div>
                <div>为1080*1080最佳</div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>

      <el-col>
        <el-row>
          <el-col>
            <i>合集作品</i>
            <el-divider></el-divider>
          </el-col>
          <el-col>
            <div class="addwork" @click="handleVideoList">
              <i class="el-icon-folder-add addworkIcon"></i>
              <i class="addworkTitle">添加作品</i>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col class="mgtop">
        <el-button type="primary" @click="handleCreated">创建</el-button>
        <el-button @click="handleRemove">取消</el-button>
      </el-col>
    </el-row>
    <el-dialog
      title="资源库"
      :visible.sync="outerVisible"
      width="67.5%"
      :destroy-on-close="true"
      style="flexflow: wrap"
    >
      <div class="imgrow">
        <div class="imgcol" v-for="fit in url" :key="fit">
          <el-image
            @click="handleClickImg(fit)"
            style="
              width: 12rem;
              height: 9rem;
              margin: 0.5rem 0.5rem 0 0;
              boxshadow: 1px 1px 10px #888888;
            "
            :src="`http://reserved.oss-cn-shenzhen.aliyuncs.com/${fit}`"
          ></el-image>
        </div>
      </div>
      <div slot="footer" class="loadingk">
        <i class="el-icon-arrow-down loadings" @click="load"></i>
        <el-button type="success" class="upfileImg"
          >上传图片
          <input
            type="file"
            class="inputFlie"
            @change="upvideo"
            ref="file"
            accept="image/png, image/gif, image/jpg, image/jpeg, image/bmp;"
            id="container"
          />
        </el-button>
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="outerVisible = true">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="作品列表" :visible.sync="outerVisibleVideo">
      <div class="videorow">
        <div class="videocol" v-for="item in videoList" :key="item.id">
          <el-image
            @click="handleClickImg(item)"
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
        :total="total"
        :page-size="pageSize"
         @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleUpViodeFail">取 消</el-button>
        <el-button type="primary" @click="handleUpvideoList">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import {
  getOssCertificate,
  getNews,
  getLabel,
  getResourceLibrary,
} from "@/api/oss";
import { createCollection } from "@/api/collection.js";
import axios from "axios";
export default {
  data() {
    return {
      total:0,
      pageSize:15,
      pageNum:1,
      videoindex: 99,
      outerVisibleVideo: false,
      nextToken: null,
      outerVisible: false,
      url: [],
      videoList: [],
      dtoAddCollection: {
        collectionName: "",
        mainImage: "",
        note: "",
        videoItems: [],
      },
      videoItems: [],
      videolist: {
        state: 1,
        pageNum: 1,
        pageSize: 15,
      },
      dto: {
        lat: null,
        lon: null,
      },
    };
  },
  methods: {
    async load() {
      const { data } = await getResourceLibrary(this.nextToken);
      const { isLast, keys, nextToken } = data;
      this.nextToken = nextToken;
      this.url.push(...keys);
      console.log(keys, "@@@@");
    },
    // 上传图片
    async upvideo() {
      const file = this.$refs.file.files[0];
      // 获取token
      const res = await getOssCertificate();
      let data = res.data;
      const request = new FormData();
      let name = `${data.dir}${new Date().getTime()}_${file.name}`;
      console.log(data);
      request.append("name", file.name); // Bucket 拥有者的Access Key Id。
      request.append("OSSAccessKeyId", data.accessid); // Bucket 拥有者的Access Key Id。
      request.append("policy", data.policy); // policy规定了请求的表单域的合法性
      request.append("signature", data.signature); // 根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
      request.append("key", data.dir);
      request.append("success_action_status", 200); // 让服务端返回200,不然，默认会返回204
      request.append("file", file);

      axios({
        method: "post",
        url: data.host,
        data: request,
      }).then(async (res) => {
        console.log(res);
        // 上传成功之后的回调
        if (res.status === 200) {
          let url = `${data.host}\/${data.dir}`;
          console.log("上传成功之后的回调", url);
          this.$message("资讯上传成功");
          this.outerVisible = false; //点击图片后关闭
          this.dtoAddCollection.mainImage = `http://reserved.oss-cn-shenzhen.aliyuncs.com/${url}`;
          // this.showImage = false;
          let nextToken2 = null;
          const res = await getResourceLibrary(nextToken2);
          const { isLast, keys, nextToken } = res.data;
          console.log(nextToken);
          this.nextToken = nextToken;
          this.url = [];
          this.url = keys;
        }
      });
    },
    async handleShowImg() {
      this.outerVisible = true;
      const { data } = await getResourceLibrary(this.nextToken);
      const { isLast, keys, nextToken } = data;
      this.nextToken = nextToken;
      this.url = keys;
    },
    handleClickImg(url) {
      this.outerVisible = false; //点击图片后关闭
      this.dtoAddCollection.mainImage = `http://reserved.oss-cn-shenzhen.aliyuncs.com/${url}`;
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
        data: this.dto,
      }).then((res) => {
        const { list, total, pageSize, pageNum } = res.data.data;
        this.videoList = list;
        this.total = total
        this.pageSize = pageSize
        this.pageNum = pageNum
        // this.videoListtotal = total
        // this.videoListpageSize = pageSize
      });
    },
    handleVideoList() {
      this.outerVisibleVideo = true;
    },
     handleCurrentChange(val) {
      this.pageNum = val;
      this.getVideoList();
    },
    handleCheckboxChange(e, item) {
      let number = this.videoindex;
      e
        ? (this.videoindex = this.videoindex - 1)
        : (this.videoindex = this.videoindex + 1);
      this.videoindex === number ? (this.videoindex = this.videoindex - 1) : "";
      if (e) {
        this.videoItems.push({
          videoId: item.id,
          index: this.videoindex,
        });
      } else {
        const res = this.videoItems.filter((i) => {
          return i.videoId != item.id;
        });
        this.videoItems = res;
      }
    },
    handleUpvideoList() {
      this.outerVisibleVideo = false;
      this.dtoAddCollection.videoItems = this.videoItems;
    },
    handleUpViodeFail() {
      this.outerVisibleVideo = false;
      this.videoItems = [];
    },
    async handleCreated() {
      if(!this.dtoAddCollection.collectionName.trim()){
        this.$message({
          message: "合集标题不能为空",
          type: "error",
        });
        return false
      }

      if(!this.dtoAddCollection.mainImage.trim()){
        this.$message({
          message: "合集封面不能为空",
          type: "error",
        });
        return false
      }
      
      if(! this.dtoAddCollection.note.trim()){
        this.$message({
          message: "合集简介不能为空",
          type: "error",
        });
        return false
      }
      const res = await createCollection(this.dtoAddCollection);
      if (res.code === 200) {
        this.$message({
          message: "合集创建成功",
          type: "success",
        });
        this.dtoAddCollection.collectionName = "";
        this.dtoAddCollection.mainImage = "";
        this.dtoAddCollection.note = "";
        this.dtoAddCollection.videoItems = [];
      }
    },
    handleRemove() {
      this.dtoAddCollection.collectionName = "";
      this.dtoAddCollection.mainImage = "";
      this.dtoAddCollection.note = "";
      this.dtoAddCollection.videoItems = [];
    },
  },
  mounted() {
    this.getVideoList();
  },
};
</script>

<style lang="scss">
.collectionImg {
  position: relative;
  width: 14rem;
  height: 14rem;
  border: 1px solid black;
  .collectionImgIcon {
    font-size: 5rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -65%);
  }
  .collectionImgTitle {
    position: absolute;
    left: 50%;
    top: 65%;
    transform: translate(-50%, 0);
  }
}
.color {
  color: red;
}
.boderRight {
  border-right: 1px solid #ddd;
}
.mgtop {
  margin-top: 2rem;
}
.mgtopmin {
  margin-top: 1rem;
}
.collectionImgTitle2 {
  color: #ccc;
  margin-top: 1rem;
}
.addwork {
  background: #eee;
  width: 12rem;
  height: 12rem;
  position: relative;
  border: 1px solid black;
  .addworkIcon {
    font-size: 4rem;
    position: absolute;
    left: 50%;
    top: 25%;
    transform: translateX(-50%);
  }
  .addworkTitle {
    position: absolute;
    left: 50%;
    top: 65%;
    transform: translateX(-50%);
  }
}
.upfileImg {
  position: relative;
  width: 6rem;
  height: 2.5rem;
}
.inputFlie {
  position: absolute;
  opacity: 0;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.imgrow {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.loadingk {
  position: relative;
}
.loadings {
  position: absolute;
  left: 50%;
  font-size: 2rem;
  color: #ccc;
  transform: translateX(-50%);
}
.loadings:hover {
  color: #409eff;
}
.videorow {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  // justify-content: space-between;
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
.showimg {
  position: absolute;
  // width: 14rem;
  // height: 14rem;
  width: 100%;
  height: 100%;
  z-index: 99;
}
</style>
