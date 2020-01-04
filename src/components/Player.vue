<template>
  <div class="player" @touchmove.prevent>
    <!-- navbar -->
    <van-nav-bar
      :title="songName"
      left-arrow
      @click-left="hidePlayer"
      @click-right="share"
      fixed
      :border="false"
    >
      <van-icon name="share" slot="right" size="24" />
    </van-nav-bar>
    <span class="artists-name" @click="goToArtist">{{songArtists | artistsNameFormatter}} ></span>
    <!-- /navbar -->

    <div class="container" :style="{backgroundImage: `url(${blurPicUrl})`}"></div>
    <div class="rotateAlbumWrapper">
      <van-image width="50vw" round :src="blurPicUrl" />
    </div>

    <van-action-sheet
      v-model="showArtists"
      :actions="songArtists"
      @select="onArtistsSelect"
      description="该歌曲有多个歌手"
    />
    <van-action-sheet
      v-model="showShare"
      :actions="shareData"
      @select="onShareSelect"
      description="分享"
    />
    <audio autoplay loop ref="audio">
      <source type="audio/mpeg" />
    </audio>
  </div>
</template>

<script>
import {
  mapGetters,
  mapMutations
} from 'vuex'
import {
  SONGURL
} from 'common/constant'
export default {
  data() {
    return {
      showArtists: false,
      showShare: false,
      shareData: [
        { name: '云音乐动态' },
        { name: '微信' },
        { name: 'QQ好友' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'playList',
      'playingSong',
      'isShowPlayer'
    ]),
    songUrl() {
      return SONGURL(this.playingSong.id)
    },
    songName() {
      return this.playingSong.name
    },
    songArtists() {
      return this.playingSong.artists
    },
    blurPicUrl() {
      return this.playingSong.album.blurPicUrl
    }
  },
  methods: {
    play() {
      this.$refs.audio.src = this.songUrl
      this.$refs.audio.play()
    },
    pause() {
      this.$refs.audio.pause()
    },
    share() {
      this.showShare = true
    },
    onArtistsSelect() {

    },
    onShareSelect() {

    },
    goToArtist() {
      if (this.songArtists.length > 1) {
        this.showArtists = true
      }

    },
    hidePlayer() {
      this.showPlayer(false)
    },
    ...mapMutations([
      'showPlayer'
    ])
  },
  watch: {
    songUrl(newVal, oldVal) {
      this.play()
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  z-index: 999 !important;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
}
.container {
  width: 100vw;
  height: 100vh;
  background-size: 200% 200%;
  background-repeat: no-repeat;
  background-position: center;
  filter: blur(15px) opacity(55%) grayscale(27%);
}
.van-nav-bar {
  background-color: transparent !important;
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
  z-index: 1000;
}
.rotateAlbumWrapper {
  position: absolute;
  top: 50vh;
  margin-top: -40vw;
  left: 50vw;
  margin-left: -25vw;
  border-radius: 50vw;
  border: 6px solid #eee;
  animation: rotateAlbum 20s linear infinite;
}
@keyframes rotateAlbum {
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(360deg)
  }
}
</style>