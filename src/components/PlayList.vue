<template>
  <div class="play-list">
    <scroll :data="playList" class="song-scroll" ref="playList">
      <div class="play-list-wrapper">
        <div class="current-playList">
          <van-row v-for="item in playList" :key="item.id" class="play-list-row">
            <van-col span="22" class="play-list-col">
              <p
                class="van-ellipsis play-items"
                :class="{'current-play': playingSong.id === item.id}"
                @click.stop="playCurrentSong(item)"
              >
                <van-icon name="volume-o" v-show="playingSong.id === item.id" />
                <span class="song-name">{{item.name}}</span>

                <span class="artists-name">- {{item.artists | artistsNameFormatter}}</span>
              </p>
            </van-col>
            <van-col span="2">
              <van-icon name="cross" @click.stop="deleteList(item.id)" />
            </van-col>
          </van-row>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import {
  mapGetters,
  mapMutations,
  mapState,
  mapActions
} from 'vuex'
import Scroll from 'components/Scroll';
import Stair from 'components/Stair';
export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'playList',
      'playingSong'
    ]),
    ...mapState([
      'playing'
    ])
  },
  methods: {
    ...mapMutations([
      'playCurrentSong',
      'clearPlayList',
      'clearPlayingSong',
      'showPlayer',
      'deleteOneInPlayList'
    ]),
    ...mapActions([
      'togglePrevOrNext'
    ]),
    deleteList(id) {
      if (id === this.playingSong.id) {
        if (this.playList.length === 1) {
          // 当删除列表最后一个时，重置所有选项
          this.deleteOneInPlayList(id)
          this.$emit('reset-all-options') 
          return
        }
        
        this.togglePrevOrNext('next')
      }


      this.deleteOneInPlayList(id)
      this.$refs.playList.refresh()
    },
    scrollToCur() {
      let current = document.querySelector(".current-play")
      this.$refs.playList.scrollToElement(current, 1000)
    },
    refresh() {
      this.$refs.playList.refresh()
    }
  },
  watch: {
    playingSong(newVal, OldVal) {
      this.$nextTick(() => {
        this.scrollToCur()
      })

    }
  },
  components: {
    Stair,
    Scroll
  }

}
</script>

<style lang="scss" scoped>
@import "common/scss/variable.scss";
.play-list-row {
  margin: 3vh 0;
  line-height: 3vh;
  border-bottom: 1px solid #eee;
}
.play-items {
  height: 4vh;
}

.song-scroll {
  width: 100%;
  height: 55vh;
  overflow: hidden;
}
.song-name {
  margin-left: 1vw;
}
.artists-name {
  color: #666;
  font-size: 12px;
}
.current-play {
  color: $main-color;
  > span {
    color: $main-color;
  }
}
</style>