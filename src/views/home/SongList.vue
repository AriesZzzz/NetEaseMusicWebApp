<template>
  <div class="song-list-model">
    <van-nav-bar title="歌单" left-arrow @click-left="$router.back()"></van-nav-bar>
    <scroll class="scroll-container" :data="songList">
      <div class="container">
        <van-search placeholder="搜索歌单内歌曲" v-model="searchVal" shape="round" />

        <div class="list-title">
          <van-row type="flex" justify="center">
            <van-col span="10">
              <van-image width="30vw" height="30vw" radius="5px" :src="songListImgUrl" />
            </van-col>
            <van-col span="12" style="position: relative;">
              <p class="van-multi-ellipsis--l2">{{songListName}}</p>
              <p class="creator-info van-ellipsis">
                <van-image width="40px" height="40px" round :src="creatorAvatarUrl" />
                {{creatorName}}
                <van-icon name="arrow" />
              </p>
            </van-col>
          </van-row>
        </div>

        <van-grid :border="false">
          <van-grid-item icon="chat-o" text="4" />
          <van-grid-item icon="share" text="分享" />
          <van-grid-item icon="passed" text="多选" />
          <van-grid-item icon="more-o" text="更多" />
        </van-grid>

        <van-row type="flex" justify="center">
          <van-col span="22" class="play-all van-hairline--top">
            <span class="play-all-text">
              <van-icon name="play-circle-o" size="18px" />
            </span>
            播放全部
            <span class="count">(共{{ songList.length }}首)</span>
          </van-col>
        </van-row>
        <div class="song-wrapper">
          <song-list-model
            v-for="(item, index) in songList"
            :key="item.id"
            :id="item.id"
            :index="index + 1"
            :songName="item.name"
            :artists="item.artists"
            :album="item.album"
            @click.native="play(item)"
          />
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import {
  reqLikeList,
  reqSongInfo,
  reqUserInfo
} from 'api'
import {
  mapState,
  mapMutations,
  mapGetters,
  mapActions
} from 'vuex'
import {
  OK
} from 'common/constant'
import SongListModel from 'components/SongListModel'
import Scroll from 'components/Scroll'
export default {
  data() {
    return {
      searchVal: '',
      creatorAvatarUrl: '',
      creatorName: '',
      songListTitle: '',
      songListPlayCount: '',
      songListCommentsCount: 0,
      songList: [],
    }
  },
  computed: {
    ...mapState([
      'uid',
      'likeIds',
      'newSongs'
    ]),
    songListImgUrl() {
      return this.songList[0] ? this.songList[0].album.picUrl : ''
    },
    songListName() {
      return this.$route.params.id === 'like_list' ? '我喜欢的音乐' : this.songListTitle
    }
  },
  created() {
    this.getLikeList()
    this.getCreatorInfo()
  },
  methods: {
    ...mapMutations([
      'setLikeListIds',
      'songsFormatter',
      'toggleTabBar',
      'playCurrentSong',
      'playAllSong',
      'showPlayer'
    ]),
    ...mapActions([
      'verifySong'
    ]),
    async getLikeList() {
      const loading = this.$toast.loading({
        message: '正在努力加载...',
        forbidClick: true
      })
      const result = await reqLikeList(this.uid)
      if (result.status === OK) {
        this.setLikeListIds(result.data.ids)
        const songInfo = await reqSongInfo(this.likeIds.toString())
        loading.clear()
        if (songInfo.status === OK) {
          this.songsFormatter(songInfo.data.songs)
          this.songList = this.newSongs
        } else {
          this.$toast(songInfo.statusText)
        }

      } else {
        this.$toast(result.statusText)
      }
    },
    async getCreatorInfo() {
      const result = await reqUserInfo(this.uid)
      if (result.status === OK) {
        this.creatorName = result.data.profile.nickname
        this.creatorAvatarUrl = result.data.profile.avatarUrl
      } else {
        this.$toast(result.statusText)
      }
    },
    play(song) {
      if (this.verifySong(song.id)) {
        this.showPlayer(true)
        this.playCurrentSong(song)
        this.playAllSong(this.songList)
      }
    }
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal.params.id) this.toggleTabBar(false)
      if (newVal.params.id !== 'like_list') {
        console.log('其他歌单')
      } else {
        if (oldVal !== 'like_list') {
          this.getLikeList()
          this.getCreatorInfo()
        } 
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    this.toggleTabBar(true)
    next()
  },
  components: {
    SongListModel,
    Scroll
  }
}
</script>

<style lang="scss" scoped>
.play-all {
  padding: 20px 2vw;
}
.count {
  font-size: 14px;
  color: #888;
}
.scroll-container {
  width: 100%;
  height: 93vh;
  overflow: hidden;
}
.play-all-text {
  display: inline-block;
  width: 8vw;
}
.creator-info {
  position: absolute;
  bottom: 16px;
  right: 4vw;
}
</style>