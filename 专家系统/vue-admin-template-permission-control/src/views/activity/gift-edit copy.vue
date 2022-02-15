<template>
  <div>
    <el-row>
      <el-col class="" :span="5">
        类型:
        <el-select
          @change="change"
          class="ml30"
          v-model="value"
          placeholder="类型"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        礼品等级：
        <el-select v-model="groupId" placeholder="请选择" @change="changeGrade">
          <el-option
            :label="item.title"
            :value="item.id"
            v-for="item in option"
            :key="item.id"
            @changes="changes(item.title)"
          ></el-option>
          <!-- <el-option label="礼品2" value="2"></el-option> -->
        </el-select>
      </el-col>
      <el-col :span="6">
        商品简称：
        <el-input
          @input="inputa"
          placeholder="请输入4字以内的商品简称"
          v-model="item.title"
          maxlength="4"
        ></el-input>
      </el-col>
      <el-col :span="8">
        价格：
        <el-input
          @input="inputb"
          placeholder="请输入需消耗人数"
          v-model="item.price"
        ></el-input>
      </el-col>
    </el-row>

    <el-row class="mt20">
      礼品标题：
      <el-input
        @input="inputc"
        maxlength="36"
        placeholder="请输入36字以内的标题"
        v-model="item.fullName"
      ></el-input>
    </el-row>

    <el-row class="mt20">
      <editor
        ref="Editor"
        @chooseImg="isPopImgMany = true"
        @chooseVdo="chooseVdo"
        @cont="cont"
        :imgUrl="imgUrlEdit"
        :isAddImg="isAddImg"
        :contentDet="contentDet"
      ></editor>
    </el-row>
    <el-row class="tac mt20">
      <el-button type="dqx-btn" @click="isAdd ? createData() : updateData()"
        >保存</el-button
      >
      <el-button @click="cancle">取消</el-button>
    </el-row>
    <!-- 富文本图片选择 -->
    <imgManyPop
      ref="imgManyPop"
      @cancel="isPopImgMany = false"
      v-if="isPopImgMany"
      @chooseItem="chooseItemMany"
    ></imgManyPop>
  </div>
</template>
<script>
import { getInvi, addGift, putGift } from "@/api/active.js";
import Editor from "@/views/tinymce-editor/tinymce-editor.vue";
import imgManyPop from "@/views/common/img-list-editor.vue";
export default {
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      options: [
        { value: 2, label: "发帖数" },
        { value: 3, label: "连红数" },
        { value: 4, label: "连黑数" }
      ],
      groupId: '',
      value: "",
      isPopImgMany: false,
      imgUrlEdit: [],
      isAddImg: false, //判断是否选择图片
      contentDet: "", //  详情页赋值给富文本
      id: 0,
      isAdd: true,
      option: [],
      item: {
        display: "",
        title: "",
        fullName: "",
        price: "",
        groupId: "",
        currencyType: 4
        // activityType:0,
      }
    };
  },
  // async created() {
  //   console.log("创建")
  //     let { data } = await getInvi({ activityType: this.value});
  //     this.option = data;
  //     console.log(option)
  //     if (this.data.id) {
  //       this.id = this.data.id;
  //       this.isAdd = false;
  //       this.item = this.data;
  //       this.contentDet = this.data.display;
  //       this.item.display = this.data.display;
  //       // this.item.title = this.data.title;
  //       // this.item.price = this.data.price;
  //       // this.item.fullName = this.data.fullName;
  //       this.item.groupId = this.data.group.id;
  //     } else {
  //       this.item.groupId = data[0].id;
  //     }
  // },
  methods: {
    inputa(e) {
      let value2 = this.value 
      this.$forceUpdate();
      this.$set(this.value,value2)
},
    inputb(e) {
      let value = this.value 
      this.$forceUpdate();
      this.value = value

    },
    inputc(e) {
      let value = this.value 
      this.$forceUpdate();
      this.value = value

    },
    async change() {
      let thst = this;
      this.item.activityType = this.value;
      let data = await getInvi({ activityType: this.value });
      this.option = data.data;
      this.item.groupId = this.option[0].id
    },
    changeGrade(data) {
      // this.item.groupId = data;
      this.item.groupId = data
    },
    // 保存
    async createData() {
      let that = this
      let params = {
        currencyType:4,
        display : that.item.display,
        fullName : that.item.fullName,
        price : that.item.price,
        title : that.item.title,
        groupId : that.item.groupId
      }
      addGift(params).then(res => {
        this.$message("操作成功");
        this.$emit("getlist");
        if(res.code == 0) {
          this.value = ''
        }
      });
    },
    // 修改
    updateData() {
      this.item.currencyType = 4
      putGift(this.id, this.item).then(res => {
        this.$message("操作成功");
        this.$emit("getlist");
      });
    },
    // 取消
    cancle() {
      this.$emit("getlist");
    },
    // 富文本图片选择回调
    chooseItemMany(val) {
      this.imgUrlEdit = val;
      this.isPopImgMany = false;
      this.isAddImg = !this.isAddImg;
    },
    // 富文本内容
    cont(val) {
      this.item.display = val;
    },
    // 富文本选择视频
    chooseVdo() {
      this.$message("暂不支持上传视频");
    }
  },
  components: {
    Editor,
    imgManyPop
  },
  watch: {
    data(newVal) {
      if (newVal.id) {
        this.isAdd = false;
        this.id = newVal.id;
        this.item = newVal;
        this.contentDet = this.data.display;
        this.item.groupId = this.data.group.id;
        this.value = this.data.group.activityType.value;
        // this.groupId = this.data.group.id;
      } else {
        this.isAdd = true;
        this.item.display = "";
        this.item.title = "";
        this.item.price = "";
        this.item.fullName = "";
        this.contentDet = "";
        this.value = "";
      }
    },
    immediate: true,
    deep: true
  },
  created() {
    if(!this.isAdd) {
      let data = getInvi({activityType:this.value});
      // this.id = this.data.id;
      this.option = data.data
    }
  },
  mounted() {
    this.item = this.data;
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: calc(100% - 200px);
}
</style>
