<template>
  <div class="drag-sort">
    <van-nav-bar left-text="已选择0项" left-arrow @click-left="goBack" fixed />
    <stair />
    <div class="drag-sort-container">
      <van-checkbox-group v-model="results" checked-color="#E35454" ref="checkbox_group">
        <van-row v-for="item in newSongs" :key="item.id">
          <van-col span="3" class="song-index">
            <van-checkbox :name="item.id" />
          </van-col>
          <van-col span="18">
            <drag-sort-items
              :id="item.id"
              :songName="item.name"
              :artists="item.artists"
              :album="item.album"
            />
          </van-col>
        </van-row>
      </van-checkbox-group>
    </div>
    <stair />
    <van-tabbar v-model="active">
      <van-tabbar-item icon="play-circle-o">下一首播放</van-tabbar-item>
      <van-tabbar-item icon="add-o">加入歌单</van-tabbar-item>
      <van-tabbar-item icon="delete">删除</van-tabbar-item>
      <van-tabbar-item icon="plus" @click="checkAll">全选</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import {
  mapMutations,
  mapGetters
} from 'vuex'
import DragSortItems from 'components/DragSortItems'
import Stair from 'components/Stair'

export default {
  data() {
    return {
      active: 0,
      results: [],
      checked: false
    }
  },
  computed: {
    ...mapGetters([
      'newSongs'
    ]),
    dragList() {
      return this.newSongs.slice(0)
    }
  },
  methods: {
    ...mapMutations([
      'toggleTabBar'
    ]),
    goBack() {
      this.$router.back()
    },
    checkAll() {
      if (this.checked) {
        this.checked = false
        this.$refs.checkbox_group.toggleAll(false)
      } else {
        this.checked = true
        this.$refs.checkbox_group.toggleAll(true)
      }
      
    }
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal.name === 'dragsort') {
        this.toggleTabBar(false)
      }
    }
  },
  components: {
    DragSortItems,
    Stair
  },
  beforeRouteLeave(to, from, next) {
    this.toggleTabBar(true)
    next()
  },
}
</script>

<style lang="scss" scoped>
.van-tabbar-item--active {
  color: #646566;
}
.flip-list {
  transition: transform 1s;
}
.song-index {
  height: 10vh;
  box-sizing: border-box;
  padding: 2vw;
  margin-left: 4vw;
}
</style>