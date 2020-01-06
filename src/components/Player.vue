<template>
  <div class="player" @touchmove.prevent>
    <div class="blur-wrapper"></div>
    <div class="overlay" :style="{backgroundImage: `url(${blurPicUrl})`}"></div>
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

    <div class="album-lyric-wrapper">
      <div class="rotateAlbumWrapper">
        <van-image width="50vw" round :src="blurPicUrl" />
      </div>
    </div>

    <footer class="player-controls">
      <van-row class="progress">
        <van-col span="2">
          <span class="time">{{begin}}</span>
        </van-col>
        <van-col span="20">
          <van-progress :percentage="50" stroke-width="3" />
        </van-col>

        <van-col span="2">
          <span class="time">{{end}}</span>
        </van-col>
      </van-row>

      <van-row type="flex" justify="space-around">
        <!-- 播放模式 -->
        <van-col span="3" class="controls">
          <van-icon
            class-prefix="icon"
            name="iconfontdanquxunhuan2eps"
            tag="span"
            v-show="playMode === 'single'"
          />
          <van-icon class-prefix="icon" name="suiji" tag="span" v-show="playMode === 'shuffle'" />
          <van-icon
            class-prefix="icon"
            name="iconfontdanquxunhuan2eps1"
            tag="span"
            v-show="playMode === 'circle'"
          />
        </van-col>
        <!-- /播放模式 -->

        <!-- 上一曲 -->
        <van-col span="3" class="controls">
          <van-icon
            class-prefix="icon"
            name="shangyishou"
            tag="span"
          />
        </van-col>
        <!-- /上一曲 -->

        <!-- 播放/暂停 -->
        <van-col span="6" class="play-and-pause controls">
          <van-icon name="play-circle-o" v-show="!playing" @click="play" color="#eee" />

          <van-icon name="pause-circle-o" v-show="playing" @click="pause" color="#eee" />
        </van-col>
        <!-- / 播放/暂停 -->

        <!-- 下一曲 -->
        <van-col span="3" class="controls">
          <van-icon class-prefix="icon" name="xiayishou" tag="span" />
        </van-col>
        <!-- /下一曲 -->
        <!-- 歌曲列表 -->
        <van-col span="3" class="controls">
          <van-icon class-prefix="icon" name="liebiao" tag="span" />
        </van-col>
        <!-- 歌曲列表 -->
      </van-row>
    </footer>

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
    <audio autoplay loop ref="audio" id="audio">
      <source type="audio/mpeg" src />
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
      ],
      begin: '00:00',
      end: '05:20',
      playing: true,
      playMode: 'single'
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
      this.playing = true
      this.$refs.audio.play()
    },
    autoPlay() {
      this.playing = true
      // 使用计算属性渲染不能播放歌曲
      this.$refs.audio.src = this.songUrl
      this.$refs.audio.play()
    },
    pause() {
      this.playing = false
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
      // this.autoPlay()
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
}
.blur-wrapper {
  width: 100vw;
  height: 100vh;
  position: absolute;
  background-color: #eee;
}
.overlay {
  width: 100vw;
  height: 100vh;
  position: absolute;
  background-size: 300vw;
  background-repeat: no-repeat;
  background-position: center;
  filter: blur(7px) opacity(90%);
}
.van-nav-bar {
  background-color: transparent !important;
}
.artists-name {
  display: inline-block;
  width: 50vw;
  font-size: 12px;
  color: #eee;
  position: absolute;
  top: 34px;
  left: 50vw;
  margin-left: -25vw;
  text-align: center;
  z-index: 1;
}
.album-lyric-wrapper {
  width: 100vw;
}
.rotateAlbumWrapper {
  width: 80vw;
  height: 80vw;
  box-sizing: border-box;
  border-radius: 50vw;
  padding: 15vw;
  margin: 15vh auto 0;
  background: url("../assets/唱片.png") center center;
  background-size: cover;
  animation: rotateAlbum 20s linear infinite;
}
@keyframes rotateAlbum {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.player-controls {
  width: 100vw;
  position: fixed;
  bottom: 4vh;
}
.van-nav-bar__title {
  color: #fff;
}
.play-and-pause {
  > i {
    font-size: 18vw;
  }
}
.controls {
  display: flex;
  align-items: center;
  justify-content: center;
}
.time {
  font-size: 14px;
}
</style>