<template>
  <div class="recommend-songs">
    <stair height="46px" />
    <!-- navbar -->

    <van-nav-bar :border="false" left-arrow @click-left="$router.back()" fixed></van-nav-bar>

    <!-- /navbar -->

    <!-- 歌曲列表 -->
    <div class="container">
      <van-row
        type="flex"
        class="song-row"
        justify="center"
        v-for="item in songList"
        :key="item.id"
        @click="play(item)"
      >
        <van-col span="22">
          <van-swipe-cell :stop-propagation="false">
            <div class="wrapper">
              <van-image
                width="50"
                height="50"
                lazy-load
                :src="item.album.picUrl"
                fit="cover"
                radius="5px"
              />
              <div class="song-list-wrapper">
                <p class="van-ellipsis song-name">{{item.name}}</p>
                <p
                  class="van-ellipsis artists-name"
                >{{item.artists | artistsNameFormatter}} - {{item.album.name}}</p>
              </div>
              <van-icon name="ellipsis" class="ellipsis" />
            </div>
            <template slot="right">
              <van-button
                type="danger"
                color="#E35454"
                text="不感兴趣"
                style="border: 1px solid #fff;"
              />
              <van-button type="primary" text="收藏" style="border: 1px #fff;" />
            </template>
          </van-swipe-cell>
        </van-col>
      </van-row>

      <!-- /歌曲列表 -->
    </div>
    <stair />
  </div>
</template>

<script>
import {
  reqRecommendSongs
} from 'api'
import {
  OK
} from 'common/constant'
import Stair from 'components/Stair'
import {
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex';
import { Toast } from 'vant';

export default {
  data() {
    return {
      songList: [],
      loading: false,
      finished: false
    }
  },
  created() {
    this.getRecommendSongs()
  },
  computed: {
    ...mapGetters([
      'playList',
      'newSongs'
    ])
  },
  methods: {
    onRefresh() {
      console.log(1)

    },
    onLoad() {
      console.log(1)
    },
    async getRecommendSongs() {
      const result = await reqRecommendSongs()
      if (result.status === OK) {
        this.songsFormatter(result.data.recommend)
        this.songList = this.newSongs
      } else {
        Toast(result.statusText)
      }
    },
    play(song) {

      if (this.verifySong(song.id)) {
        this.showPlayer(true)
        this.playCurrentSong(song)
        // 播放列表中有值时，不执行 playAllSong
        if (this.playList.length === 0) {
          this.playAllSong(this.songList)
        }

      }

    },
    ...mapMutations([
      'playAllSong',
      'songsFormatter',
      'showPlayer',
      'playCurrentSong'
    ]),
    ...mapActions([
      'verifySong'
    ])
  },
  components: {
    Stair
  }
}
</script>

<style lang="scss" scoped>
@import "common/scss/variable";
.wrapper {
  display: flex;
  justify-content: flex-start;
  position: relative;
}
.ellipsis {
  position: absolute;
  right: 1.5vw;
  transform: rotate(90deg);
}
.song-list-wrapper {
  width: 60vw;
  margin-left: 3vw;
}
.artists-name {
  font-size: 12px;
  line-height: 27px;
  color: #666;
}
.ellipsis {
  margin-top: 2.5vh;
}
.song-name {
  margin-top: 1vh;
  height: 3vh;
}
.song-row {
  margin-bottom: 2vh;
}
</style>