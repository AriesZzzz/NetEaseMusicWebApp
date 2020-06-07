<template>
  <div class="hello-music">
    <div class="logo">
      <img src="../../assets/music-logo.webp" alt="" >
    </div>
    <van-row type="flex" justify="center" class="btn-group">
      <van-col span="22">
        <van-button
          round
          type="info"
          color="#fff"
          size="large"
          class="login-by-phone"
          @click="goToLogin"
        >手机号登录</van-button>
        <van-button round type="info" color="#C20C0C" size="large" class="do-not-login">立即体验</van-button>
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  created() {
    // if (this.$cookies.get('MUSIC_U')) {
      
    //   this.$router.replace({ name: 'find' })
    // }
  },
  methods: {
    goToLogin() {
      this.$router.push({ name: 'login' })
    }
  },
}
</script>

<style lang="scss" scoped>
@import "common/scss/variable";
.hello-music {
  height: 100vh;
  background-color: #e30000;
  position: relative;
}
.btn-group {
  width: 80vw;
  position: absolute;
  bottom: 20vh;
  left: 50%;
  margin-left: -40vw;
}
.login-by-phone {
  color: $main-color !important;
  margin-bottom: 3vh;
}
.do-not-login {
  border: 1px solid#fff !important;
}
.logo {
  width: 100vw;
  padding-top: 15vh;
  & > img {
    display: block;
    margin: 0 auto;
  }
}
</style>