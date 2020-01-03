<template>
  <div class="account">
    <van-button type="danger" @click="logout">退出登录</van-button>
    <!-- <van-loading v-if="loading"/> -->
  </div>
</template>

<script>
import {
  reqLogout
} from 'api'
import {
  OK
} from 'common/constant'
import {
  Toast,
  Loading
} from 'vant'
export default {
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async logout() {
      this.loading = true
      const result = await reqLogout()
      this.loading = false
      if (result.data.code === OK) {
        Toast('退出登录')
        this.$session.remove('token')
        this.$router.replace({name: 'find'})
      }
    }
  },
}
</script>

<style>
</style>