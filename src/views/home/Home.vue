<template>
  <div class="home">
    <van-icon
      name="bar-chart-o"
      slot="right"
      size="24"
      class="player-icon"
      @click="showPlayer"
      v-show="!isShowPlayer && !isPlayingListEmpty"
    />

    <player v-show="isShowPlayer" />


    <keep-alive>
      <router-view />
    </keep-alive>

    <van-tabbar v-model="active" v-show="isShowTabBar">
      <van-tabbar-item icon="home-o" replace to="/find">发现</van-tabbar-item>
      <van-tabbar-item icon="music-o" replace to="/my">我的</van-tabbar-item>
      <van-tabbar-item icon="friends-o" info="5" replace to="/cloudvlg">云村</van-tabbar-item>
      <van-tabbar-item icon="user-o" info="20" replace to="/account">账号</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import {
  mapGetters,
  mapMutations,
  mapState
} from 'vuex'
import Player from 'components/Player'
export default {
  data() {
    return {
      active: 0
    }
  },
  created() {
    switch (this.$route.path) {
      case '/find':
        this.active = 0
        break
      case '/my':
        this.active = 1
        break
      case '/cloudvlg':
        this.active = 2
        break
      case '/account':
        this.active = 3
        break
    }
  },
  computed: {
    ...mapState([
      'isShowTabBar'
    ]),
    ...mapGetters([
      'isShowPlayer',
      'playList'
    ]),
    isPlayingListEmpty() {
      return this.playList.length === 0
    }
  },
  methods: {
    showPlayer() {
      this.showPlayer(true)
    },
    ...mapMutations([
      'showPlayer'
    ])
  },
  components: {
    Player
  }
}
</script>

<style lang="scss" scoped>
.player-icon {
  z-index: 1000;
  position: fixed;
  right: 4vw;
  top: 3vw;
}
</style>
