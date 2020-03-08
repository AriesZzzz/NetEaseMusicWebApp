<template>
  <div class="song-list">
    <van-row type="flex" justify="center" class="song-row">
      <van-col span="22">
        <van-swipe-cell>
          <div class="wrapper" :style="{color: uselessColor}">
            <div class="song-index" :style="{color}">
              <span v-if="playingSong.id === id"><van-icon name="volume-o" /></span>
              <span v-else>{{index}}</span>
              </div>
            <div class="song-list-wrapper">
              <p class="van-ellipsis song-name" :style="{color}">{{songName}}</p>
              <p
                class="van-ellipsis artists-name"
              >{{artists | artistsNameFormatter}} - {{album.name}}</p>
            </div>
            <van-icon name="ellipsis" class="ellipsis" />
          </div>
          <template slot="right">
            <van-button type="primary" text="收藏" style="border: 1px #fff;" />
          </template>
        </van-swipe-cell>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  props: {
    id: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 1
    },
    songName: {
      type: String,
      default: '别说了我爱你'
    },
    artists: {
      type: Array,
      default() {
        return [
          { name: '', id: '' }
        ]
      }
    },
    album: {
      type: Object,
      default() {
        return {
          name: "",
          id: "",
          blurPicUrl: "",
          picUrl: ""
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'playingSong'
    ]),
    color() {
      return (this.playingSong.id === this.id) ? '#E35454' : ''
    },
    uselessColor() {
      return (this.verifySong(this.id)) ? '' : '#eee'
    }
  },
  methods: {
    ...mapActions([
      'verifySong'
    ]),
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: flex-start;
  position: relative;
}
.ellipsis {
  position: absolute;
  right: 1.5vw;
  transform: rotate(90deg);
  margin-top: 2.5vh;
}
.song-list-wrapper {
  width: 70vw;
  margin-left: 3vw;
}
.artists-name {
  font-size: 12px;
  line-height: 27px;
  color: #666;
}
.song-name {
  margin-top: 1vh;
  height: 3vh;
}
.song-row {
  margin-bottom: 2vh;
}
.song-index {
  width: 8vw;
  color: #888;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>