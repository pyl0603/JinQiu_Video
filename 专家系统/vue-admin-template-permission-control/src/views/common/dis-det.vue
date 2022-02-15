<template>
    <div class="dis-det">
        <div class="f24 c171">{{disTitle}}</div>
        <div class="f14 cada mt20">{{disTime|formatTime}}</div>
        <div class="mt20 f18 c424 lineHeight">
           {{disCont}}
        </div>
        <div class="mt20">
            <img :src="item" alt="" v-for="(item,index) in disImg" :key="index" class="mt10">
        </div>
    </div>
</template>
<script>
import { type } from 'os';
import { formatTime } from "@/utils/index.js";
export default {
    props:{
        disTitle:{
            type:String
        },
        disTime:{
            type:Number
        },
        disCont:{
            type:String
        },
        disImg:{
            type:Array
        }

    },
    filters:{
        formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
    }
}
</script>
<style lang="scss" scoped>

</style>

