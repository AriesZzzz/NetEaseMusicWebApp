<template>
  <div class="recommend-songs">
    <!-- navbar -->
    <van-sticky>
      <van-nav-bar :border="false" left-arrow @click-left="$router.back()"></van-nav-bar>
    </van-sticky>

    <!-- /navbar -->

    <!-- 歌曲列表 -->
    <div class="container">
      <van-row
        type="flex"
        class="song-row"
        justify="center"
        v-for="item in songList"
        :key="item.id"
        @click="play(item.id)"
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
      'playList'
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
       debugger
      if (result.status === OK) {
        this.songList = this.songsFormatter(result.data.recommend)// 1.在这里格式化
      } else {
        Toast(result.statusText)
      }
    },
    play(songId) {
      // 2.在这里将格式化后的songList赋值给playList
      
      if (this.verifySong(songId)) {
        this.playAllSong(songId)
        this.$router.push({ path: `/player/${songId}` })
      }

    },
    ...mapMutations([
      'playAllSong',
      'songsFormatter'
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