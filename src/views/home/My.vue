<template>
  <div class="my">
    <van-nav-bar title="我的" :border="false" />
    <scroll class="scroll-container" :data="createSongList">
      <div class="container">
        <van-cell-group title="我的音乐">
          <van-cell
            title="我喜欢的音乐"
            icon="like-o"
            is-link
            :to="{name: 'songlist', params: { id: 'like_list'}}"
          />
          <!--<van-cell title="最近播放" icon="service-o" is-link :to="{name: 'recentplay'}" />-->
        </van-cell-group>

        <van-row type="flex" justify="center">
          <van-col span="22">
            <van-tabs v-model="activeName" animated swipeable>
              <van-tab :title="createCount" name="createlist">
                <div class="song-list-wrapper">
                    <song-list-items
                      v-for="(item, index) in createSongList"
                      :key="index"
                      :img="item.coverImgUrl"
                      :title="item.name"
                      :count="item.trackCount"
                      @click.native="showPlayListDetails(item.id)"
                      ref="song_list_items"
                    />
                  <song-list-items
                    title="新建歌单"
                    :showNewList="true"
                    img
                    @show-actions="showNewListActions"
                  />
                </div>
              </van-tab>
              <van-tab :title="collectCount" name="collectlist" :style="{borderLeft: '1px solid #fff'}">
                <div class="song-list-wrapper">
                  <song-list-items
                    v-for="(item, index) in collectSongList"
                    :key="index"
                    :img="item.coverImgUrl"
                    :title="item.name"
                    :count="item.trackCount"
                    @click.native="showPlayListDetails(item.id)"
                  />
                  <stair />
                </div>
              </van-tab>
            </van-tabs>
          </van-col>
        </van-row>
        <!-- <stair /> -->
      </div>
    </scroll>

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
      <van-icon
        name="success"
        class="success-input"
        :style="{color: isOKColor}"
        @click="createNewList"
      />
      <van-cell-group class="group">
        <van-field v-model="songListTitle" placeholder="歌曲标题" />
      </van-cell-group>
    </van-popup>
  </div>
</template>
<script>
import {
  reqUserInfo,
  reqCreateList,
  reqCreateNewList
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
          name: '切换至单列模式'
        }
      ],
      showInputListName: false,
      showCreateList: false,
      activeName: 'createlist',
      createSongListLocal: [],
      collectSongList: []
    }
  },
  created() {
    // this.getUserInfo()
    this.getCreateList()
  },
  computed: {
    ...mapState([
      'uid',
      'createSongList'
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
      'setUserInfo',
      'createSongListGlobal'
    ]),
    showPlayListDetails(pid) {
      this.$router.push({ name: 'songlist', params: { id: pid } })
    },
    async createNewList() {
      if (this.isOKColor === '#000') {
        const loading = this.$toast.loading({
          message: '创建中...',
          forbidClick: true
        })
        const result = await reqCreateNewList(this.songListTitle)
        loading.clear()
        if (result.status === OK) {
          this.$toast('创建歌单成功')
          this.showInputListName = false
          this.createSongListLocal.unshift(result.data.playlist)
          this.createSongListGlobal(this.createSongListLocal)
          this.songListTitle = ''
        } else {
          this.$toast(result.statusText)
        }
      }

    },
    onSelect(item) {
      switch (item.name) {
        case '新建歌单':
          this.showInputListName = true
          this.showCreateList = false
          break
        case '切换至单列模式':
          this.showCreateList = false
          this.$refs.song_list_items.forEach(item => {
            item.changeDisplayModel('single')
          })
          this.actions[1].name = '切换至双列模式'
          break
        case '切换至双列模式':
          this.showCreateList = false
          this.$refs.song_list_items.forEach(item => {
            item.changeDisplayModel('double')
          })
          this.actions[1].name = '切换至单列模式'
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
        this.createSongListLocal = result.data.playlist.filter(item => !item.subscribed && !(item.id === LIKELISTID))
        this.createSongListGlobal(this.createSongListLocal)
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
    Scroll,
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
  height: 85vh;
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