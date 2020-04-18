<template>
  <div class="drag-sort">
    <van-nav-bar :left-text="checkedItem" left-arrow @click-left="goBack" fixed />
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
      <van-tabbar-item icon="play-circle-o" @click="playNext">下一首播放</van-tabbar-item>
      <van-tabbar-item icon="add-o" @click="addItemToPlayList">加入歌单</van-tabbar-item>
      <van-tabbar-item icon="delete" @click="deleteCheckedItem">删除</van-tabbar-item>
      <van-tabbar-item icon="plus" @click="checkAll">{{checkedText}}</van-tabbar-item>
    </van-tabbar>
    <van-popup v-model="showPopUp" class="pop-up-container">
      <van-row type="flex" justify="center">
        <van-col span="24">收藏到歌单</van-col>
      </van-row>
      <song-list-items
        v-for="(item, index) in createSongList"
        :key="index"
        :img="item.coverImgUrl"
        :title="item.name"
        :count="item.trackCount"
        @click.native="addSongsToList(item.id)"
      />
    </van-popup>
  </div>
</template>

<script>
import {
  mapMutations,
  mapGetters,
  mapState
} from 'vuex'
import {
  updatePlayList,
  reqCreateList
} from 'api'
import {
  LIKELISTID,
  OK
} from 'common/constant'
import DragSortItems from 'components/DragSortItems'
import Stair from 'components/Stair'
import SongListItems from 'components/SongListItems'

export default {
  data() {
    return {
      active: 0,
      results: [],
      checked: false,
      checkedText: '全选',
      showPopUp: false
    }
  },
  created() {
    this.toggleTabBar(false)
  },
  computed: {
    ...mapState([
      'createSongList',
      'uid'
    ]),
    ...mapGetters([
      'newSongs'
    ]),
    dragList() {
      return this.newSongs.slice(0)
    },
    checkedItem() {
      return `已选择${this.results.length}项`
    }
  },
  methods: {
    ...mapMutations([
      'toggleTabBar',
      'refreshNewSongs',
      'createSongListGlobal',
      'playCheckedSong'
    ]),
    async addSongsToList(playListId) {
      const loading = this.$toast.loading({
        message: '正在添加...',
        forbidClick: true
      })
      const result = await updatePlayList('add', playListId, this.results.toString())
      if (result.status === OK) {
        loading.clear()
        this.showPopUp = false
        const response = await reqCreateList(this.uid)
        if (response.status === OK) {
          const createSongList = response.data.playlist.filter(item => !item.subscribed && !(item.id === LIKELISTID))
          this.createSongListGlobal(createSongList)
        } else {
          this.$toast(response.statusText)
        }
        this.$toast('添加成功!')
      } else {
        this.$toast(result.statusText)
      }
    },
    playNext() {
      if (!this.results.length) {
        this.$toast('请选择要播放的歌曲')
      } else {
        let tmpArr = this.newSongs.filter(item => {
          return this.results.includes(item.id)
        })
        this.playCheckedSong(tmpArr)
      }
    },
    addItemToPlayList() {
      if (!this.results.length) {
        this.$toast('请选择要添加到歌单中的歌曲')
      } else {
        this.showPopUp = true
      }
    },
    deleteCheckedItem() {
      if (!this.results.length) {
        this.$toast('请选择要删除的歌曲')
      } else {
        this.$dialog.confirm({
          message: '确定将所选音乐从该列表删除？'
        }).then(async () => {
          const loading = this.$toast.loading({
            message: '正在删除...',
            forbidClick: true
          })
          let playListId = this.$route.params.id === 'like_list' ? LIKELISTID : this.$route.params.id
          const result = await updatePlayList('del', playListId, this.results.toString())
          if (result.status === OK) {
            loading.clear()
            const tmpArr = this.dragList.filter(item => {
              let index = this.results.indexOf(item.id)
              return index < 0
            })
            // 更新删除后的数据
            this.refreshNewSongs(tmpArr)
            this.$toast('删除成功!')
          } else {
            this.$toast(result.statusText)
          }
        }).catch(() => {

        })

      }
    },
    goBack() {
      this.$router.back()
    },
    checkAll() {
      if (this.checked) {
        this.checked = false
        this.checkedText = '全选'
        this.$refs.checkbox_group.toggleAll(false)
      } else {
        this.checked = true
        this.checkedText = '取消全选'
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
    Stair,
    SongListItems
  },
  beforeRouteLeave(to, from, next) {
    this.toggleTabBar(true)
    // 将已选框取消
    this.$refs.checkbox_group.toggleAll(false)
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
.pop-up-container {
  width: 80vw;
  height: 60vh;
  padding: 15px;
  box-sizing: border-box;
}
</style>