<template>
  <div>
    <el-row style="margin: 2rem" justify="center">  
      <el-col class="margin">
        <el-row type="flex">
          <el-col :span="1" ><div style="marginTop:.5rem">视频简介</div></el-col>
          <el-col :span="16"
            ><el-input
              v-model="dto.detail"
              placeholder="请输入视频简介"
            ></el-input
          ></el-col>
        </el-row>
      </el-col>
            <el-col class="margin">
        <el-row type="flex">
          <el-col :span="1" ><div style="marginTop:.5rem">定位信息</div></el-col>
          <el-col :span="16"
            ><el-input
              v-model="dto.position"
              placeholder="请输入定位信息"
            ></el-input
          ></el-col>
        </el-row>
      </el-col>
      
                  <el-col>
              <el-row type="flex" class="margin">
                <el-col :span="1" ><div style="marginTop:.5rem">关联资讯</div></el-col>
                <el-col :span="16">
                  <el-input v-model="NewsValue" @focus="handleClickNews" placeholder="请输入内容"></el-input>
                </el-col>
              </el-row>
            </el-col>
      


              <el-col>
              <el-row type="flex" class="margin">
                <el-col :span="1" ><div style="marginTop:.5rem">关联合集</div></el-col>
                <el-col :span="10">
                  <el-select v-model="CollectionValue" placeholder="请选择">
                    <el-option
                      v-for="item in CollectionOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-col>
      
          <el-col>
              <el-row type="flex" class="margin" >
                <el-col :span="1"   ><div style="marginTop:.5rem">上传视频</div></el-col>
                <el-col :span="16">
                  <div class="video" @click="handleShowVideo">
                  <i class="el-icon-video-camera-solid videoIcon"></i>
                    <video style="width:100%; height:100%; object-fit: fill" :src="dto.videoUrl" class="showVideo"  controls ></video>
              
                  </div>
                </el-col>
              </el-row>
       <el-button type="primary" @click="handleClick" class="submitBtn">发布视频</el-button>
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
          <!-- <el-image
            @click="handleClickImg(fit)"
            style="
              width: 12rem;
              height: 9rem;
              margin: 0.5rem 0.5rem 0 0;
              boxshadow: 1px 1px 10px #888888;
            "
            :src="`http://reserved.oss-cn-shenzhen.aliyuncs.com/${fit}`"
          ></el-image> -->
          <video
           @click="handleClickImg(fit)"
            style="
              width: 12rem;
              height: 9rem;
              margin: 0.5rem 0.5rem 0 0;
              boxshadow: 1px 1px 10px #888888;
            " 
          :src="`http://reserved.oss-cn-shenzhen.aliyuncs.com/${fit}`"></video>
        </div>
      </div>
      <div slot="footer" class="loadingk">
        <i class="el-icon-arrow-down loadings" @click="load"></i>
        <el-button type="success" class="upfileImg"
          >上传视频
          <input
            type="file"
            @change="upvideo"
            class="inputFlie"
            ref="file"
            accept="video/*"
            id="container"
          />
        </el-button>
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = true">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="资讯列表" :visible.sync="dialogTableVisible" >
  <el-table :data="gridData" @cell-click="handleClickCell">
    <el-table-column property="updateTime" label="发布时间" width="240"></el-table-column>
    <el-table-column property="title" label="文章标题" width="400"></el-table-column>
    <el-table-column property="authorUserInfo.nickname" label="文章作者" ></el-table-column>
    <el-table-column
      align="right" width="250" >
      <template slot="header" slot-scope="scope">
          <el-input placeholder="请输入内容" v-model="searchValue" >
    <el-button slot="append" icon="el-icon-search" @click="handleSerach"></el-button>
  </el-input>
  
      </template>
    </el-table-column>
  </el-table>
      <div style="position: absolute; right: 20%; bottom: 3%">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        layout=" prev, pager, next, jumper"
         :total="total"
      >
      </el-pagination>
    </div>
   <div slot="footer" class="loadingk">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogTableVisible = true">确 定</el-button>
      </div>
</el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import {
  getOssCertificate,
  getImage,
  uploadNews,
  getNews,
  getLabel,
  getResourceLibrary,
} from "@/api/oss";
import moment from "moment";
import axios from "axios";
export default {
  data() {
    return {
      searchValue:'',
      outerVisible:false,
      url:'',
      nextToken:null,
      file: "", //视频文件
      videoName: "", //视频名字
      CollectionValue: "", //关联合集
      NewsValue: "", //关联资讯
      NewsList:{
        dto:{
            matchId: null,
            searchText:"",
            tagId: null,
            tagIsTeam: null,
            tagTeamType: null
        },
        pageNum:1,
        pageSize:10,
        // searchText:'',
        // status:3
        state:-1,
      },
      total:0,
      dialogTableVisible:false,
      gridData:[],
      dto:{
        detail:'',//视频简介 1
        newsId:-1,//资讯id
        point:{
          lat:null,
          lon:null
        },
        position:'',//定位信息
        videoTime:0,//视频时长/毫秒 1
        videoUrl:'',//视频链接1
      },
      
      NewsOptions: [
        
      ],
      CollectionOptions: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
      ],
    };
  },
  methods: {
    handleSerach(){
      this.getNewsList()
      this.NewsList.dto.searchText = this.searchValue
    },
    handleClickCell({id,title}){
      this.dto.newsId = id
      this.NewsValue = title
      this.dialogTableVisible = false
      this.searchValue = ''

    },
        handleCurrentChange(val) {

    this.NewsList.pageNum = val;
      this.getNewsList()
  
    },
    getNewsList(){
        // URL: 'http://192.168.1.201:8080', // url =  url + request url
      // URL: 'http://192.168.1.31:8080', // url =  url + request url
      //URL: 'http://192.168.1.33:8080', // url =  url + request url
      axios({
        method: "post",
        // url: `http://192.168.1.201:8080${url}`,
        // url: `http://192.168.1.33:8080/cloud-news-publish/news/search`,
        url: `http://192.168.1.33:8080/cloud-news-publish/news/search/${this.NewsList.pageNum}/${this.NewsList.pageSize}/${this.NewsList.state}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
        data: this.NewsList,
      }).then((res) => {
        console.log(res);
       const { list,total } = res.data.data
       this.total = total
         this.gridData = list
          this.gridData.map((item) => {
          item.updateTime = moment(item.updateTime).format(
            "YYYY-MM-DD HH:mm:ss"
          )
        })
      })
    },
    async handleClickNews(){
      this.dialogTableVisible = true
      console.log('1');
      this.getNewsList()
    },
    async handleShowVideo(){
    this.outerVisible = true;
      const { data } = await getResourceLibrary(this.nextToken);
      // const { isLast, keys, nextToken } = data;
      // this.nextToken = nextToken;
      // this.url = keys;
    },
    async load() {//加载资源库
      // const { data } = await getResourceLibrary(this.nextToken);
      // const { isLast, keys, nextToken } = data;
      // this.nextToken = nextToken;
      // this.url.push(...keys);
    },
        async upvideo(e) {
          
      var that = this
        const file = this.$refs.file.files[0];
         const  videourl =  URL.createObjectURL(file)
         const audioElement = new Audio(videourl)
          audioElement.addEventListener("loadedmetadata", function (_event) {
         const  duration = audioElement.duration; // 得到上传视频的时间长度
         that.dto.videoTime =  duration*1000
      });


      //上传视频
      console.log(this.$refs.file.files,'time');
      
      // 获取token
      const res = await getOssCertificate();
      let data = res.data;
      const request = new FormData();
      // let name = `${data.dir}${new Date().getTime()}_${file.name}`;
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
      }).then((res) => {
        // 上传成功之后的回调
        if (res.status === 200) {
          let url = `${data.host}\/${data.dir}`;
          console.log("上传成功之后的回调", url);
          this.$message("视频上传成功");
          this.dto.videoUrl = url
          this.outerVisible = false;
        }
      });
    },
    async handleClick(){
      // 发布视频
      // 做非空判断
      if (!this.dto.videoUrl) {
        this.$message({
          message: "未上传视频",
          type: "error",
        });
      } else if (!this.dto.detail ) {
        this.$message({
          message: "视频简介不能为空",
          type: "error",
        });
      }else{
      axios({
          method: "post",
          // baseURL: 'http://192.168.1.201:8080', // url = base url + request url
          // baseURL: 'http://192.168.1.31:8080', // url = base url + request url
          // baseURL: 'http://192.168.1.33:8080', // url = base url + request url
          // url: "http://192.168.1.201:8080/cloud-news-publish/news/publish",
          url: "http://192.168.1.33:8080/cloud-news-publish/home/upload",
          data: this.dto,
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
        }).then(() => {
          this.dto.detail = ''
          this.dto.newsId = ''
          this.dto.position = ''
          this.dto.videoTime = ''
          this.dto.videoUrl = ''
          this.searchValue = ''
          this.NewsValue = ''
          this.$message({
            message: "视频发布成功",
            type: "success",
          });
        });
      }
      }
    },
    async created(){
      console.log(this.$route.query.data);
      if(this.$route.query.data){
        const { detail,position,newsId,videoUrl} = this.$route.query.data
        this.dto.detail = detail
        this.dto.newsId = newsId
        this.dto.position = position
        this.dto.videoUrl = videoUrl
        if(newsId!==-1){
          const res = await getNews(newsId)
        const { title, digest, type, content, tags,  mainImageUrl } =
        res.data;
        this.NewsValue = title
        }
      }
    }
}
</script>

<style>
.title {
  line-height: 250%;

}
.niiub{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: calc(100%-300px);
  background-color: #409eff;
  border-radius: 50%;
  border: 1px solid #ccc;
  box-shadow: 5px 5px 5px #ccc;
  display: none;
}
.margin {
  margin: 1rem 0;
}
.video {
  width: 22rem;
  height: 40rem;
  background-color: #eee;
  position: relative;
}
.videoFile {
  width: 100%;
  height: calc(100% - 10%);
  opacity: 0;
  z-index: 100;
}
.videoIcon{
  position: absolute;
  font-size: 4rem;
  color: #ccc;
  z-index: 11;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.showVideo{
  position: absolute;
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
.showimg {
  position: absolute;
  width: 12rem;
  height: 8rem;
  z-index: 99;
}
.imgrow {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.submitBtn{
  position: absolute;
  right: 30%;
  bottom: 2%;
}
</style>