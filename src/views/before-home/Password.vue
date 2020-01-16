<template>
  <div class="password">
    <van-nav-bar title="手机号登录" left-arrow @click-left="$router.back()" />

    <van-row type="flex" justify="center" class="password-input">
      <van-col span="22" class="van-hairline--bottom">
        <van-field
          v-model="password"
          type="password"
          clickable
          placeholder="输入密码"
        />
      </van-col>
    </van-row>
    <van-row type="flex" justify="center" class="login">
      <van-col span="22">
        <van-button color="#C20C0C" size="large" round @click="login">立即登录</van-button>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import {
  verifyPassword
} from 'api'
import {
  OK
} from 'common/constant'
import {
  mapMutations
} from 'vuex'
import { Toast } from 'vant'

export default {
  data() {
    return {
      password: ''
    }
  },

  methods: {
    async login() {
      const result = await verifyPassword(this.$route.query.phone, this.password)
      const {code, token, message, account} = result.data
      if (code === OK) {
        this.$session.set('token', token)
        this.setToken(token)
        this.setUid(account.id)
        this.$router.replace({name: 'find'})
      } else {
        Toast(message)
      }
    },
    ...mapMutations([
      'setToken',
      'setUid'
    ])
  }
}
</script>

<style lang="scss" scoped>
.password-input {
  margin: 10vh 0;
}
</style>