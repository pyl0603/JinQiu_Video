<template>
  <div>
    <div style="margin: 20px;"></div>
    <el-form :label-position="labelPosition" label-width="100px">
      <el-form-item label="推送标题">
        <el-input v-model="dto.title" style="width:73%"></el-input>
      </el-form-item>
      <el-form-item label="推送子标题">
        <el-input v-model="dto.desc" style="width:73%"></el-input>
      </el-form-item>

      <el-row type="flex" justify="space-between">
        <el-col>
          <el-form-item label="推送内容分类">
            <el-select
              v-model="dto.category"
              placeholder="请选择"
              @change="handlleChange"
            >
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联类型">
            <el-select
              v-model="dto.concatType"
              placeholder="请选择"
              @change="handlleChange"
            >
              <el-option
                v-for="item in concatTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="推送平台">
            <el-select
              v-model="dto.osType"
              placeholder="请选择"
              @change="handlleChange"
            >
              <el-option
                v-for="item in platformOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="推送人群">
            <el-select
              v-model="dto.pushType"
              placeholder="请选择"
              @change="handlleChange"
            >
              <el-option
                v-for="item in crowdOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="过期时间">
            <el-date-picker
              @change="handlleChange"
              v-model="dto.expireTime"
              type="datetime"
              placeholder="选择日期时间"
              default-time="12:00:00"
              value-format="timestamp"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="定时发送时间">
            <el-date-picker
              @change="handlleChange"
              v-model="dto.startTime"
              type="datetime"
              placeholder="选择日期时间"
              default-time="12:00:00"
              value-format="timestamp"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="封面">
            <div class="cover" @click="handleShowImg">
              <i class="el-icon-upload coverIcon"></i>
              <i class="coverTitle">上传封面</i>
              <el-image class="showimg" :src="dto.imgUrl"
                ><div slot="error" class="image-slot"></div>
              </el-image>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">提交通知推送</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>

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
        <el-button type="primary" @click="innerVisible = true">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getOssCertificate,
  noticeSend,
  getNews,
  getLabel,
  getResourceLibrary
} from "@/api/oss";
import axios from "axios";
export default {
  data() {
    return {
      labelPosition: "left",
      formLabelAlign: {
        name: "",
        region: "",
        type: ""
      },
      dto: {
        category: null,
        concatType: null,
        desc: "",
        expireTime: null,
        imgUrl: "",
        osType: null,
        pushType: null,
        startTime: null,
        title: ""
      },
      categoryOptions: [
        {
          value: 0,
          label: "系统消息"
        },
        {
          value: 1,
          label: "内容推送"
        }
      ],
      concatTypeOptions: [
        {
          value: 1,
          label: "视频"
        },
        {
          value: 2,
          label: "资讯"
        },
        {
          value: 0,
          label: "无关联"
        }
      ],
      platformOptions: [
        {
          value: 0,
          label: "安卓"
        },
        {
          value: 1,
          label: "IOS"
        },
        {
          value: 2,
          label: "所有平台"
        }
      ],
      crowdOptions: [
        {
          value: 0,
          label: "所有人"
        }
      ],
      outerVisible: false,
      url: [],
      nextToken: null
    };
  },
  methods: {
    handlleChange(e) {},
    handleClickImg(url) {
      this.outerVisible = false; //点击图片后关闭
      this.Information.imgUrl = `http://reserved.oss-cn-shenzhen.aliyuncs.com/${url}`;
    },
    async load() {
      // const { data } = await getResourceLibrary(this.nextToken);
      // const { isLast, keys, nextToken } = data;
      // this.nextToken = nextToken;
      // this.url.push(...keys);
      // console.log(keys, "@@@@");
    },
    async upvideo() {
      const file = this.$refs.file.files[0];
      // 获取token
      const res = await getOssCertificate();
      let data = res.data;
      console.log(data);
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
        data: request
      }).then(async res => {
        console.log(res);
        // 上传成功之后的回调
        if (res.status === 200) {
          let url = `${data.host}\/${data.dir}`;
          console.log("上传成功之后的回调", url);
          this.$message("图片上传成功");
          this.dto.imgUrl = url;
          this.outerVisible = false;

          // const res = await getResourceLibrary(this.nextToken);
          // const { isLast, keys, nextToken } = res.data;
          // console.log(nextToken);
          // this.nextToken = nextToken;
          // this.url = [];
          // this.url = keys;
        }
      });
    },
    async handleShowImg() {
      this.outerVisible = true;
      // const { data } = await getResourceLibrary(this.nextToken);
      // const { isLast, keys, nextToken } = data;
      // this.nextToken = nextToken;
      // this.url = keys;
    },
    async submitForm() {
      if(this.dto.expireTime<this.dto.startTime){
            this.$message({
          message: "过期时间要大于定时发送时间",
          type: "success"
        });
        return false
      }

      const res = await noticeSend(this.dto);
      if (res.code === 200) {
        this.$message({
          message: "通知推送成功",
          type: "success"
        });
        (this.dto.category = null),
          (this.dto.concatType = null),
          (this.dto.desc = ""),
          (this.dto.expireTime = null),
          (this.dto.imgUrl = ""),
          (this.dto.osType = null),
          (this.dto.pushType = null),
          (this.dto.startTime = null),
          (this.dto.title = "");
      } else {
        this.$message({
          message: "通知推送失败",
          type: "error"
        });
      }
    },
    resetForm() {
      (this.dto.category = null),
        (this.dto.concatType = null),
        (this.dto.desc = ""),
        (this.dto.expireTime = null),
        (this.dto.imgUrl = ""),
        (this.dto.osType = null),
        (this.dto.pushType = null),
        (this.dto.startTime = null),
        (this.dto.title = "");
    }
  }
};
</script>
<style lang="scss">
.cover {
  background-color: #eee;
  width: 22rem;
  height: 14rem;
  position: relative;
  .coverIcon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 50px;
  }
  .coverTitle {
    position: absolute;
    left: 50%;
    top: 65%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }
  .showimg {
    position: absolute;
    width: 22rem;
    height: 14rem;
    z-index: 99;
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
</style>
