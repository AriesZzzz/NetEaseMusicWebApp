<template>
  <div class="my">
    <van-nav-bar title="我的" :border="false" />
    <van-cell-group title="我的音乐">
      <van-cell title="我喜欢的音乐" icon="like-o" is-link :to="{name: 'likemusic'}" />
      <van-cell title="最近播放" icon="service-o" is-link :to="{name: 'recentplay'}" />
    </van-cell-group>

    <van-row type="flex" justify="center">
      <van-col span="22">
        <van-tabs v-model="activeName" sticky animated swipeable>
          <van-tab :title="createCount" name="createlist">
            <div class="song-list-wrapper">
              <!-- <scroll class="scroll-container" :data="createSongList"> -->
              <!-- <div class="song-list-items-wrapper"> -->
              <song-list-items
                v-for="(item, index) in createSongList"
                :key="index"
                :img="item.coverImgUrl"
                :title="item.name"
                :count="item.trackCount"
              />
              <song-list-items title="新建歌单" :showNewList="true" @show-actions="showNewListActions" />
              <stair />
              <!-- </div> -->
              <!-- </scroll> -->
            </div>
          </van-tab>
          <van-tab :title="collectCount" name="collectlist">
            <div class="song-list-wrapper">
              <song-list-items
                v-for="(item, index) in collectSongList"
                :key="index"
                :img="item.coverImgUrl"
                :title="item.name"
                :count="item.trackCount"
              />
              <stair />
            </div>
          </van-tab>
        </van-tabs>
      </van-col>
    </van-row>
    <van-action-sheet
      v-model="showCreateList"
      :actions="actions"
      @select="onSelect"
      description="请选择"
    />

    <van-popup
      v-model="showInputListName"
      closeable
      close-icon-position="top-left"
      position="bottom"
      round
      close-on-popstate
      :style="{ height: '20vh' }"
    >
      <p class="popup-title">新建歌单</p>
      <van-icon name="success" class="success-input" :style="{color: isOKColor}"/>
      <van-cell-group class="group">
        <van-field v-model="songListTitle" placeholder="歌曲标题" />
      </van-cell-group>
    </van-popup>
  </div>
</template>
<script>
import {
  reqUserInfo,
  reqCreateList
} from 'api'
import {
  mapState, mapMutations
} from 'vuex'
import {
  OK,
  LIKELISTID
} from 'common/constant'
import SongListItems from 'components/SongListItems'
import Scroll from 'components/Scroll'
import Stair from 'components/Stair'
export default {
  data() {
    return {
      isOKColor: '#eee',
      songListTitle: '',
      actions: [
        {
          name: '新建歌单'
        },
        {
          name: '管理歌单'
        },
        {
          name: '切换至单列模式'
        }
      ],
      showInputListName: true,
      showCreateList: false,
      activeName: 'createlist',
      createSongList: [],
      collectSongList: []
    }
  },
  created() {
    // this.getUserInfo()
    this.getCreateList()
  },
  computed: {
    ...mapState([
      'uid'
    ]),
    createCount() {
      return `创建歌单(${this.createSongList.length})`
    },
    collectCount() {
      return `收藏歌单(${this.collectSongList.length})`
    }
  },
  methods: {
    ...mapMutations([
      'setUserInfo'
    ]),
    onSelect(item) {
      switch (item.name) {
        case '新建歌单':
          this.showInputListName = true
          this.showCreateList = false
          break
        case '管理歌单':
          break
        case '切换至单列模式':
          break
      }
    },
    showNewListActions() {
      this.showCreateList = true
    },
    async getUserInfo() {
      const result = await reqUserInfo(this.uid)
      if (result.status === OK) {
        this.setUserInfo(result.data)
      } else {
        this.$toast(result.statusText)
      }
    },
    async getCreateList() {
      const result = await reqCreateList(this.uid)
      if (result.status === OK) {
        this.createSongList = result.data.playlist.filter(item => !item.subscribed && !(item.id === LIKELISTID))
        this.collectSongList = result.data.playlist.filter(item => item.subscribed)
      } else {
        this.$toast(result.statusText)
      }
    }
  },
  watch: {
    songListTitle(newVal, oldVal) {
      if (newVal === '') {
        this.isOKColor = '#eee'
      } else {
        this.isOKColor = '#000'

      }
    }
  },
  components: {
    SongListItems,
    scroll,
    Stair
  }
}
</script>

<style lang="scss" scoped>
.song-list-wrapper {
  width: 92vw;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 2vh;
}
.scroll-container {
  width: 100%;
  height: 50vh;
  overflow: hidden;
}
.popup-title {
  margin-top: 2.5vh;
  text-align: center;
}
.success-input {
  position: absolute;
  top: 16px;
  right: 16px;
}
.group {
  margin-top: 4vh;
}
</style>