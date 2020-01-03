<template>
  <div class="player">
    <!-- navbar -->
    <van-nav-bar title="标题"  left-arrow @click-left="$router.back()">
    </van-nav-bar>
    <!-- /navbar -->
    <audio controls autoplay ref="audio" v-show="false">
      <source :src="songUrl" type="audio/mpeg" />您的浏览器不支持 audio 元素。
    </audio>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import {
  SONGURL
} from 'common/constant'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'playList'
    ]),
    songUrl() {
      return SONGURL(this.$route.params.id)
    }
  },
  methods: {
    play() {
      this.$refs.audio.play()
    },
    pause() {
      this.$refs.audio.pause()

    }
  },
}
</script>

<style lang="scss" scoped>
.player {
  z-index: 999 !important;
  width: 100vw;
}
</style>