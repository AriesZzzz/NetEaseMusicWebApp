<template>
  <div class="player" @touchmove.prevent>
    <audio autoplay loop ref="audio" :src="songUrl" id="audioPlayer"></audio>
    <!-- 防止player整体透明 -->
    <div class="blur-wrapper"></div>
    <!-- 模糊图片 -->
    <div class="overlay" :style="{backgroundImage: `url(${blurPicUrl})`}"></div>
    <!-- 添加灰度背景色，避免看不清文字 -->
    <div class="overlay-gray"></div>
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

    <!-- 专辑封面 -->

    <div class="album-lyric-wrapper" @click="toggleAlbumLyric">
      <div
        class="rotateAlbumWrapper"
        :style="{animationPlayState: albumAnimation}"
        v-show="showAlbum"
      >
        <van-image width="50vw" round :src="blurPicUrl" />
      </div>
      <!-- 滚动歌词 -->
      <scroll
        class="lyric"
        v-show="!showAlbum"
        ref="lyricList"
        :data="currentLyric && currentLyric.lines"
      >
        <div class="lyric-wrapper">
          <div class="currentLyric" v-if="currentLyric">
            <p
              ref="lyricLine"
              class="text"
              v-for="(line, index) in currentLyric.lines"
              :class="{'current': currentLineNum === index}"
              :key="index"
            >{{line.txt}}</p>
          </div>
          <p class="no-lyric" v-if="!currentLyric">{{upDatecurrentLyric}}</p>
        </div>
      </scroll>
      <!-- / 滚动歌词 -->

      <!-- /专辑封面 -->
    </div>

    <!-- 播放控件 -->
    <footer class="player-controls">
      <van-row class="progress" type="flex" align="center">
        <van-col span="4" class="time">
          <span>{{begin | timeFormatter}}</span>
        </van-col>
        <van-col span="16">
          <van-slider v-model="begin" :min="0" :max="duration" @change="getProgressVal" />
        </van-col>
        <van-col span="4" class="time">
          <span>{{duration | timeFormatter}}</span>
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
          <van-icon class-prefix="icon" name="shangyishou" tag="span" />
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
    <!-- / 播放控件 -->

    <!-- 上拉菜单 -->
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
    <!-- / 上拉菜单 -->
  </div>
</template>

<script>
import {
  mapGetters,
  mapMutations
} from 'vuex'
import {
  SONGURL,
  OK
} from 'common/constant'
import {
  reqLyric
} from 'api'
import Lyric from 'lyric-parser'
import Scroll from 'components/Scroll'
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
      begin: 0, // 歌曲左边进度
      playing: true, // 是否正在播放歌曲
      playMode: 'single', // 播放模式
      presetPic: '../assets/唱片.png', // 预设唱片，防止报错
      albumAnimation: 'running', // 动画暂停/继续
      duration: 0, // 歌曲总时长
      showAlbum: true, // 展示专辑/歌词
      lyricStr: '', // 歌词
      tLyricStr: '', // 翻译歌词
      currentLyric: null, // 歌词对象
      currentLineNum: 0 // 歌词行数
    }
  },
  updated() {
    // 每当 data 更新时调用，就能获取到 DOM 元素
    this.duration = this.$refs.audio.duration
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
      let album = this.playingSong.album
      return album ? album.blurPicUrl : this.presetPic
    },
    upDatecurrentLyric() {
      if (this.lyricStr) {
        return '暂无歌词'
      }
      if (!this.lyricStr) {
        return '歌词加载中'
      }
    },
  },
  methods: {
    async getLyric(id) {
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentLyric = null
      }
      const result = await reqLyric(id)
      if (result.status === OK) {
        this.lyricStr = result.data.lrc.lyric
        this.tLyricStr = result.data.tlyric.lyric
        this.createLyric()

      } else {
        this.currentLyric = null
        this.currentLineNum = 0
        this.$toast(result.statusText)
      }
    },
    createLyric() {
      this.currentLyric = new Lyric(this.lyricStr, this.lyricHanlder)
      if (this.playing) {
        this.currentLyric.play()
        // 歌词重载以后 高亮行设置为 0
        this.currentLineNum = 0
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
    },
    lyricHanlder({ lineNum, txt }) {
      this.currentLineNum = lineNum

      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }

    },
    toggleAlbumLyric() {
      this.showAlbum = !this.showAlbum
    },
    getProgressVal(value) {
      this.$refs.audio.currentTime = parseInt(value)
      if (this.currentLyric) {
        this.currentLyric.seek(this.$refs.audio.currentTime * 1000)
      }
    },
    play() {
      this.albumAnimation = 'running'
      this.playing = true
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    autoPlay() {
      this.albumAnimation = 'running'
      this.playing = true
      this.$refs.audio.play()
    },
    pause() {
      this.albumAnimation = 'paused'
      this.playing = false
      this.$refs.audio.pause()
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
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
    playingSong(newVal, oldVal) {
      this.autoPlay()
      setInterval(() => {
        // 待优化, 歌曲暂停后，begin 值不变，应该停止定时器
        this.begin = document.querySelector("#audioPlayer").currentTime
      }, 1000)

      this.getLyric(newVal.id)


    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="scss" scoped>
.player {
  z-index: 999;
  height: 100vh;
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
  background-size: 180vw;
  background-repeat: no-repeat;
  background-position: center;
  filter: blur(15px) opacity(80%);
}
.overlay-gray {
  width: 100vw;
  height: 100vh;
  position: absolute;
  background-color: rgba(160, 160, 160, 0.5);
  filter: blur(2px);
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
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10vh auto 0;
}
.lyric {
  width: 100%;
  height: 95%;
  z-index: 1;
  overflow: hidden;
}
.text {
  line-height: 40px;
  color: rgba(220, 220, 220, 0.8);
  font-size: 14px;
  text-align: center;
  padding: 0 3vw;
  &.current {
    color: #fff;
  }
}
.rotateAlbumWrapper {
  width: 80vw;
  height: 80vw;
  box-sizing: border-box;
  border-radius: 50vw;
  padding: 15vw;
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
  bottom: 2vh;
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
.progress {
  height: 24px;
  margin-bottom: 2vh;
}
.time {
  font-size: 12px;
  text-align: center;
  color: #eee;
}
</style>