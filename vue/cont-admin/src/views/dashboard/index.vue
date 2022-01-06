<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}{{page}}</div>
    <div class="dashboard-text">roles: <span v-for="role in roles" :key="role">{{ role }}</span></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setTimeout } from 'timers';

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'total',
      'page'
    ])
  },
  mounted(){
    setTimeout(res => {
      this.$store.commit('setTotal',99)
      this.$store.commit('setPaging',true)
    },1000)
  },
  watch:{
    page(newVal){
      console.log(newVal)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
