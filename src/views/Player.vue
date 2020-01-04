<template>
  <div class="player">
    <!-- navbar -->
    <van-nav-bar :title="songName" left-arrow @click-left="$router.back()"></van-nav-bar>
    <span class="artists-name" @click="goToArtist">{{songArtists | artistsNameFormatter}}></span>
    <!-- /navbar -->
    <audio controls autoplay ref="audio">
      <source :src="songUrl" type="audio/mpeg" />您的浏览器不支持 audio 元素。
    </audio>
    <van-action-sheet
      v-model="show"
      :actions="songArtists"
      @select="onSelect"
      description="该歌曲有多个歌手"
    />
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
  name: 'player',
  data() {
    return {
      show: false,

    }
  },
  computed: {
    ...mapGetters([
      'playList'
    ]),
    songUrl() {
      return SONGURL(this.$route.params.id)
    },
    songName() {
      return this.$route.query.song.name
    },
    songArtists() {
      return this.$route.query.song.artists
    }
  },
  methods: {
    play() {
      this.$refs.audio.play()
    },
    pause() {
      this.$refs.audio.pause()

    },
    onSelect() {

    },
    goToArtist() {
      if (this.songArtists.length > 1) {
        this.show = true
      }

    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  z-index: 999 !important;
  width: 100vw;
}
.artists-name {
  display: inline-block;
  width: 50vw;
  font-size: 12px;
  color: #666;
  position: absolute;
  top: 34px;
  left: 50vw;
  margin-left: -25vw;
  text-align: center;
  z-index: 3;
}
</style>