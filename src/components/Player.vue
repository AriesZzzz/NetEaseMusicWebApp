<template>
  <div class="player" @touchmove.prevent>
    <audio autoplay ref="audio" :src="songUrl" id="audioPlayer"></audio>
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
      <van-row class="play-info" v-show="showAlbum">
        <van-col span="6" @click.stop="setLikeSong">
          <van-icon class-prefix="icon" name="03" v-show="!isLike" />
          <van-icon class-prefix="icon" name="xin-" v-show="isLike" />
        </van-col>
        <van-col span="6">
          <van-icon name="star-o" />
        </van-col>
        <van-col span="6">
          <van-icon name="chat-o" :info="commentsCount" @click.stop="goToSongComments" />
        </van-col>
        <van-col span="6">
          <van-icon name="ellipsis" @click.stop="getSongInfo" />
        </van-col>
      </van-row>
      <!-- 滚动歌词 -->
      <scroll
        class="lyric"
        v-show="!showAlbum"
        ref="lyricList"
        :data="currentLyric && currentLyric.lines"
      >
        <div class="lyric-wrapper">
          <div class="current-lyric" v-if="currentLyric">
            <p
              ref="lyricLine"
              class="text"
              :style="{lineHeight: lyricLineHeight}"
              v-for="(line, index) in currentLyric.lines"
              :class="{'current': currentLineNum === index}"
              :key="index"
              v-html="line.txt"
            ></p>
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
        <van-col span="3" class="controls" @click="changePlayMode">
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
            @click="togglePrevOrNext('prev')"
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
          <van-icon
            class-prefix="icon"
            name="xiayishou"
            tag="span"
            @click="togglePrevOrNext('next')"
          />
        </van-col>
        <!-- /下一曲 -->
        <!-- 歌曲列表 -->
        <van-col span="3" class="controls">
          <van-icon class-prefix="icon" name="liebiao" tag="span" @click="showPlayListMenu" />
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
    <van-popup
      v-model="showPlayList"
      round
      position="bottom"
      :style="{ height: '70vh'}"
      class="popup"
    >
      <van-row type="flex" justify="center" class="collectAllSong">
        <van-col span="9">
          <span>当前播放({{playList.length}})</span>
        </van-col>
        <van-col span="13">
          <van-icon name="plus" />收藏全部
        </van-col>
        <van-col span="2">
          <!-- 清空播放列表 -->
          <van-icon name="delete" @click="clearAllPlayList" />
        </van-col>
      </van-row>

      <!-- 播放列表 -->
      <play-list ref="playlist" @reset-all-options="resetAllOptions" @pause="pause" />
      <!-- /播放列表 -->

      <div class="bottom-close" @click="showPlayList = !showPlayList">关闭</div>
    </van-popup>
    <!-- 歌曲信息展示 -->
    <van-action-sheet
      v-model="showSongInfo"
      :actions="infoActions"
      @select="onInfoSelect"
      cancel-text="取消"
    />
    <!-- / 歌曲信息展示 -->
    <!-- / 上拉菜单 -->
  </div>
</template>

<script>
import {
  mapGetters,
  mapMutations,
  mapState,
  mapActions
} from 'vuex'
import {
  SONGURL,
  OK
} from 'common/constant'
import {
  reqLyric,
  reqSongComments,
  reqIsLikeSong
} from 'api'
import Lyric from 'lyric-parser'
import Scroll from 'components/Scroll'
import PlayList from 'components/PlayList'
export default {
  data() {
    return {
      showSongInfo: false,
      isLike: false,
      showPlayList: false,
      showArtists: false,
      showShare: false,
      shareData: [
        { name: '云音乐动态' },
        { name: '微信' },
        { name: 'QQ好友' }
      ],
      begin: 0, // 歌曲左边进度
      presetPic: '../assets/唱片.png', // 预设唱片，防止报错
      albumAnimation: 'running', // 动画暂停/继续
      duration: 0, // 歌曲总时长
      showAlbum: true, // 展示专辑/歌词
      lyricStr: '', // 歌词
      tLyricStr: '', // 翻译歌词
      currentLyric: null, // 歌词对象
      currentTransLyric: null, // 翻译歌词对象
      currentLineNum: 0, // 歌词行数
      timer: 0,
      random: 0,
      lyricLineHeight: '40px'
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
    ...mapState([
      'playing',
      'songIndex',
      'playMode',
      'songComments'
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
    commentsCount() {
      let total = this.songComments.total
      if (total <= 999) return total
      if (total > 999 && total <= 10000) return '999+'
      if (total > 10000 && total <= 100000) return '1w+'
      if (total > 100000) return '10w+'
    },
    infoActions() {
      return [
        { name: `专辑: ${this.playingSong.album.name}` }
      ]
    }
  },
  methods: {
    ...mapMutations([
      'showPlayer',
      'togglePlaying',
      'clearPlayList',
      'showPlayer',
      'clearPlayingSong',
      'playCurrentSong',
      'togglePlayMode',
      'getRandom',
      'setSongComments',
      'clearSongComments'
    ]),
    ...mapActions([
      'togglePrevOrNext',
      'playShuffle'
    ]),
    async setLikeSong() {
      if (this.isLike) {
        const result = await reqIsLikeSong(this.playingSong.id, false)
        if (result.status === OK) {
          this.playingSong.isLike = false
          this.isLike = false
        } else {
          this.$toast(result.statusText)
        }
      } else {
        const result = await reqIsLikeSong(this.playingSong.id)
        if (result.status === OK) {
          this.playingSong.isLike = true
          this.isLike = true
        } else {
          this.$toast(result.statusText)
        }
      }
    },
    goToSongComments() {
      console.log('gotocomments');
    },
    async getSongComments(id) {
      const result = await reqSongComments(id)
      if (result.status === OK) {
        this.setSongComments(result.data)
      } else {
        this.$toast(result.statusText)
      }
    },
    onInfoSelect(item) {

    },
    getSongInfo() {
      this.showSongInfo = true
    },
    changePlayMode() {
      if (this.playMode === 'circle') {
        this.togglePlayMode('single')
      } else if (this.playMode === 'single') {
        this.togglePlayMode('shuffle')
      } else {
        this.togglePlayMode('circle')
      }
    },
    clearAllPlayList() {
      this.$dialog.confirm({
        message: '确定清空播放列表？'
      }).then(() => {
        this.resetAllOptions()
      }).catch(() => {

      })
    },
    showPlayListMenu() {
      this.showPlayList = !this.showPlayList
      this.$nextTick(() => {
        // 调用子组件里的方法，打开播放列表能看到当前播放的歌曲
        // 数组项变化之后需要重新调用refresh()
        this.$refs.playlist.refresh()
        this.$refs.playlist.scrollToCur()
      })

    },
    resetCurrentLyric() {
      // playList 子组件需要调用这个方法来将歌词置空
      this.currentLyric.stop()
      this.currentLyric = null
    },
    resetAllOptions() {
      this.clearPlayList()
      this.clearPlayingSong()
      this.resetCurrentLyric()
      this.currentTransLyric = null
      this.lyricStr = ''
      this.$refs.audio.src = ""
      this.showPlayer(false)
      this.currentLineNum = 0
      this.clearSongComments()
      this.togglePlaying(false)
      clearInterval(this.timer)
    },
    async getLyric(id) {
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.resetCurrentLyric()
      }
      const result = await reqLyric(id)
      if (result.status === OK) {
        this.lyricStr = result.data.lrc.lyric
        this.tLyricStr = result.data.tlyric.lyric
        this.createLyric()

      } else {
        this.resetCurrentLyric()
        this.currentLineNum = 0
        this.$toast(result.statusText)
      }
    },
    createLyric() {
      this.currentLyric = new Lyric(this.lyricStr, this.lyricHanlder)

      if (this.tLyricStr) {
        this.lyricLineHeight = '25px'
        this.currentTransLyric = new Lyric(this.tLyricStr)
        for (let i = 0; i < this.currentTransLyric.lines.length; i++) {
          this.currentLyric.lines[i].txt += `<br>${this.currentTransLyric.lines[i].txt}`
        }

      } else {
        // 根据有无翻译歌词来调整行高
        this.lyricLineHeight = '40px'
      }

      if (this.playing) {
        this.currentLyric.play()
        // 歌词重载以后 高亮行设置为 0
        this.currentLineNum = 0
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
    },
    lyricHanlder({ lineNum, txt }) {
      this.currentLineNum = lineNum

      if (lineNum > 4) {
        // 保证歌词在第4行后才开始滚动
        let lineEl = this.$refs.lyricLine[lineNum - 4]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
    },
    toggleAlbumLyric() {
      this.showAlbum = !this.showAlbum
    },
    getProgressVal(value) {
      this.$refs.audio.currentTime = value
      if (this.currentLyric) {
        this.currentLyric.seek(this.$refs.audio.currentTime * 1000)
      }
    },
    setTimer() {
      this.timer = setInterval(() => {
        this.begin = document.querySelector("#audioPlayer").currentTime
      }, 1000)
    },
    play() {
      this.albumAnimation = 'running'
      this.togglePlaying(true)
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
      this.setTimer()
    },
    pause() {
      this.albumAnimation = 'paused'
      this.togglePlaying(false)
      this.$refs.audio.pause()
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
      clearInterval(this.timer)
    },
    autoPlay() {
      this.albumAnimation = 'running'
      this.togglePlaying(true)
      this.$refs.audio.play()
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
    }
  },
  watch: {
    playingSong(newVal, oldVal) {
      this.autoPlay()
      this.setTimer()
      if (newVal.id) {
        this.getLyric(newVal.id)
        this.getSongComments(newVal.id)
        this.isLike = newVal.isLike
      }
    },
    begin(newVal, oldVal) {
      if (parseInt(newVal) === parseInt(this.duration)) {
        this.togglePlaying(false)
        switch (this.playMode) {
          case 'circle':
            this.togglePrevOrNext('next')
            break
          case 'single':
            this.autoPlay()
            this.$refs.lyricList.scrollTo(0, 0, 1000)
            this.currentLyric.seek(0)
            this.currentLineNum = 0
            break
          case 'shuffle':
            this.playShuffle()
            break
        }
      }
    }
  },
  components: {
    Scroll,
    PlayList
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
  margin: 10vh auto 0;
  position: relative;
}
.lyric {
  width: 100%;
  height: 68vh;
  z-index: 1;
  overflow: hidden;
}
.no-lyric {
  text-align: center;
}
.text {
  color: rgba(220, 220, 220, 0.8);
  font-size: 14px;
  text-align: center;
  padding: 0 3vw;
  &.current {
    color: #fff;
  }
}
.play-info {
  width: 92vw;
  position: absolute;
  bottom: 0;
  > .van-info {
    background-color: transparent !important;
  }
  > div {
    text-align: center;
  }
  i {
    color: #fff;
    font-size: 8vw;
  }
}
.rotateAlbumWrapper {
  width: 80vw;
  height: 80vw;
  margin-top: 5vh;
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
.popup {
  box-sizing: border-box;
  padding: 4vw;
  &::-webkit-scrollbar {
    // 隐藏滚动条
    width: 0 !important;
  }
}
.bottom-close {
  width: 92vw;
  height: 7vh;
  position: fixed;
  bottom: 0;
  background-color: #fff;
  text-align: center;
  line-height: 7vh;
}
.collectAllSong {
  margin-bottom: 3vh;
}
.van-slider__button {
  width: 12px !important;
  height: 12px !important;
}
</style>