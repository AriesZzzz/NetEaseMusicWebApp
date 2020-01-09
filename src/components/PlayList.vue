<template>
  <div class="play-list">
    <!-- <scroll :data="playList" class="song-scroll"> -->
    <div class="play-list-wrapper">
      <van-row v-for="item in playList" :key="item.id" class="play-list-row">
        <van-col span="22" class="play-list-col">
          <p class="van-ellipsis play-items" :class="{'current-play': playingSong.id === item.id}">
            <van-icon name="volume-o" v-show="playingSong.id === item.id" />
            <span class="song-name">{{item.name}}</span>
            -
            <span class="artists-name">{{item.artists | artistsNameFormatter}}</span>
          </p>
        </van-col>
        <van-col span="2">
          <van-icon name="cross" />
        </van-col>
      </van-row>
      <stair height="5vh" />
    </div>
    <!-- </scroll> -->
  </div>
</template>

<script>
import {
  mapGetters,
  mapMutations,
  mapState
} from 'vuex'
// import Scroll from 'components/Scroll';
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
    scrollToCur() {
      document.querySelector(".current-play").scrollIntoView()
    }
  },
  components: {
    Stair
  }

}
</script>

<style lang="scss" scoped>
@import "common/scss/variable.scss";
.play-list-row {
  margin: 3vh 0;
}
.play-items {
  height: 4vh;
}

// .song-scroll {
//   height: 53vh;
//   overflow: hidden;
// }
.song-name {
  margin-left: 1vw;
}
.artists-name {
  color: #666;
  font-size: 14px;
}
.current-play {
  color: $main-color;
  > span {
    color: $main-color;
  }
}
</style>