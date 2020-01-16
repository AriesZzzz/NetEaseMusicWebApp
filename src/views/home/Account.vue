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
import {
  mapMutations
} from 'vuex'
export default {
  data() {
    return {
      loading: false
    }
  },
  methods: {
    ...mapMutations([
      'removeUserInfo'
    ]),
    async logout() {
      this.loading = true
      const result = await reqLogout()
      this.loading = false
      if (result.data.code === OK) {
        Toast('退出登录')
        this.removeUserInfo()
        this.$session.remove('token')
        this.$router.replace({name: 'find'})
      }
    }
  },
}
</script>

<style>
</style>