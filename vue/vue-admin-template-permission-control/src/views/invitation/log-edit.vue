<template>
  <div>
    <el-row>
      <el-col :span="12"><em>订单号：</em>{{ item.id }}</el-col>
      <el-col :span="12"><em>订单时间：</em>{{ item.createdAt | formatTime}}</el-col>
    </el-row>
    <div class="for-edit" v-if="orderMsg">
      <el-row class="mt20">
        <el-col :span="12"><em>礼品等级：</em>{{ item.vo.group.title }}</el-col>
        <el-col :span="12"><em>商品简称：</em>{{ item.vo.title }}</el-col>
      </el-row>
      <el-row class="mt20">
        <el-col :span="12"
          ><em>收件人：</em
          ><el-input
            placeholder="请输入收件人"
            v-model="item.receiver"
            :readonly="orderMsg&&deliver"
          ></el-input
        ></el-col>
        <el-col :span="12"
          ><em>手机号码：</em
          ><el-input
            placeholder="请输入手机号码"
            v-model="item.contact"
            :readonly="orderMsg&&deliver"
          ></el-input
        ></el-col>
      </el-row>
      <el-row class="mt20">
        <el-col :span="12"
          ><em>收货地址：</em
          ><el-input
            placeholder="请输入收货地址"
            v-model="item.address"
            :readonly="orderMsg&&deliver"
          ></el-input
        ></el-col>
        <el-col :span="12"
          ><em>备注：</em
          ><el-input placeholder="请输入备注" v-model="item.remark" :readonly="orderMsg&&deliver"></el-input
        ></el-col>
      </el-row>
    </div>
    <el-row class="mt20" v-if="deliver">
      <el-col :span="12"
        ><em>运单号码：</em
        ><el-input
          placeholder="请输入运单号码"
          v-model="item.trackingNumber"
        ></el-input
      ></el-col>
    </el-row>
    <el-row class="tac mt20">
      <el-button type="dqx-btn" @click="opt">保存</el-button>
      <el-button @click="cancle">取消</el-button>
    </el-row>
  </div>
</template>
<script>
import { editDelivUser, sendDeliv, putTrackNo } from "@/api/active.js";
import { formatTime } from "@/utils/index.js";
export default {
  props: {
    deliver: {
      type: Boolean,
      default: false
    },
    orderMsg: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    }
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  data() {
    return {
      isAdd: true,
      id: null,
      item: {
        address: "",
        contact: "",
        goodsId: 3,
        id: "",
        receiver: "",
        remark: "",
        createdAt: null,
        sendTime: null,
        status: { value: null, display: "" },
        trackingNumber: null,
        vo: {
          title: "",
          group: {
            title: ""
          }
        }
      }
    };
  },
  created() {
    this.item = this.data;
    this.id = this.data.id;
  },
  methods: {
    // 保存
    opt() {
      if (!this.orderMsg && this.deliver) {
        sendDeliv(this.id,{ value: this.item.trackingNumber }).then(res => {
          this.$message("操作成功");
          this.$emit("getlist");
        });
      } else if (this.orderMsg && !this.deliver) {
        editDelivUser(this.id,this.item).then(res => {
          this.$message("操作成功");
          this.$emit("getlist");
        });
      } else {
        putTrackNo(this.id,{ value: this.item.trackingNumber }).then(res => {
          this.$message("操作成功");
          this.$emit("getlist");
        });
      }
    },
    // 取消
    cancle() {
      this.$emit("getlist");
    }
  },
  watch: {
    data(newVal) {
      this.item = newVal;
      this.id = newVal.id;
      console.log(newVal);
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: calc(100% - 200px);
}
em {
  display: inline-block;
  width: 80px;
  // text-align: right;
}
</style>
