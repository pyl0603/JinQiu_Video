<template>
  <div>
<el-form :label-position="labelPosition" label-width="80px" :model="dto">
  <el-form-item label="默认分数"
      prop="scoreByInit"
    :rules="[
      { required: true, message: '默认分数不能为空'},
      { type: 'number', message: '分数必须为数字值'}
    ]"
  >
    <el-input v-model.number="dto.scoreByInit" type="number"  style="width:50rem"></el-input>
  </el-form-item>
  <el-form-item label="评论得分"
     prop="scoreByComment"
    :rules="[
      { required: true, message: '评论分数不能为空'},
      { type: 'number', message: '分数必须为数字值'}
    ]"
  >
    <el-input v-model.number="dto.scoreByComment" type="number" style="width:50rem"></el-input>
  </el-form-item>
  <el-form-item label="每日扣分"
     prop="scoreByLessDay"
    :rules="[
      { required: true, message: '每日扣分不能为空'},
      { type: 'number', message: '分数必须为数字值'}
    ]"
  >
    <el-input v-model.number="dto.scoreByLessDay" type="number" style="width:50rem"></el-input>
  </el-form-item>
    <el-form-item label="点赞得分"
         prop="scoreByLike"
    :rules="[
      { required: true, message: '点赞得分不能为空'},
      { type: 'number', message: '分数必须为数字值'}
    ]"
    >
    <el-input v-model.number="dto.scoreByLike" type="number" style="width:50rem"></el-input>
  </el-form-item>
    <el-form-item label="分享得分"
        prop="scoreByShare"
    :rules="[
      { required: true, message: '分享得分不能为空'},
      { type: 'number', message: '分数必须为数字值'}
    ]"
    >
    <el-input v-model.number="dto.scoreByShare" type="number" style="width:50rem"></el-input>
  </el-form-item>
    <el-form-item label="分数上限"
          prop="scoreMax"
    :rules="[
      { required: true, message: '分数上限不能为空'},
      { type: 'number', message: '分数必须为数字值'}
    ]"
    >
    <el-input v-model.number="dto.scoreMax" type="number" style="width:50rem"></el-input>
  </el-form-item>
   <el-form-item size="large">
    <el-button type="dqx-btn" @click="SubmitSetting">智能推荐</el-button>
  </el-form-item>
</el-form>
  </div>
</template>
<script>
import { settingVideo } from '@/api/video'
  export default {
    data() {
      return {
        labelPosition: 'left',
        formLabelAlign: {
          name: '',
          region: '',
          type: ''
        },
        dto:{
          scoreByInit:null,
          scoreByComment:null,
          scoreByLessDay:null,
          scoreByLike:null,
          scoreByShare:null,
          scoreMax:null
        }
      };
    },
    methods:{
      async SubmitSetting(){
      const res = await settingVideo(this.dto)
      if(res.code ===200){
             this.$message({
          message: '视频智能推荐设置成功',
          type: 'success'
        });
      }
      }
    }
  }
</script>