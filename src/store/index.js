import Vue from 'vue'
import Vuex from 'vuex'
import {
  reqSong,
  verifySongExist,

} from 'api'
import {
  OK
} from 'common/constant'
import { Toast } from 'vant'
import {
  songs_formatter,
  getRandomSong,
  findSongIndexById,
  findLikeId
} from '../utils';
Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    userInfo: {}, // 用户信息
    userToken: '',  // 用户 token
    uid: '', // 用户 ID
    playList: [], // 播放列表
    newSongs: [], // 格式化后的歌曲
    isShowPlayer: false, // 是否展示播放页面
    playingSong: {
      name: '',
      id: '',
      artists: [
        {
          name: '',
          id: ''
        }
      ],
      album: {
        name: '',
        id: '',
        blurPicUrl: '',
        picUrl: '',
        publishTime: ''
      }
    }, // 正在播放的歌曲
    playing: true, // 是否正在播放
    playMode: 'circle', // 播放模式
    randomSong: {}, // 随机歌曲,
    songIndex: 0 , // 歌曲索引
    songComments: {}, // 歌曲评论
    likeIds: [], //喜欢列表Id,
    isShowTabBar: true, // 是否展示底部导航栏
    createSongList: [] // 用户创建的歌单

  },
  getters: {
    playList(state) {
      return state.playList
    },
    newSongs(state) {
      return state.newSongs
    },
    isShowPlayer(state) {
      return state.isShowPlayer
    },
    playingSong(state) {
      return state.playingSong
    },
    showPlayList(state) {
      return state.showPlayList
    }
  },
  mutations: {
    createSongListGlobal(state, createSongList) {
      state.createSongList = createSongList
    },
    refreshNewSongs(state, newSongs) {
      state.newSongs = newSongs
    },
    changeLikeIds(state, likeId) {
      const index = findLikeId(state.likeIds, likeId)
      if (index < 0) {
        state.likeIds.push(likeId)
      } else {
        state.likeIds.splice(index, 1)
      }
    },
    toggleTabBar(state, isShowTabBar) {
      state.isShowTabBar = isShowTabBar
    },
    setLikeListIds(state, ids) {
      state.likeIds = ids
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    removeUserInfo(state) {
      state.userToken = ''
      state.uid = ''
    },
    setToken(state, token) {
      state.userToken = token
    },
    setUid(state, uid) {
      state.uid = uid
    },
    playAllSong(state, songList) {
      state.playList = JSON.parse(JSON.stringify(songList))
    },
    playCheckedSong(state, songs) {
      let insertIndex = findSongIndexById(state.playList, state.playingSong.id)
      // 如果播放列表里没有歌曲，则直接播放
      if (!state.playList.length) {
        state.playingSong = songs[0]
        state.playList = songs
        return
      }
      state.playList.splice(insertIndex + 1, 0, ...songs) // 插入已选择的歌曲
    },
    songsFormatter(state, songs) {
      state.newSongs = songs_formatter(songs)
    },
    showPlayer(state, isShowPlayer) {
      state.isShowPlayer = isShowPlayer
    },
    playCurrentSong(state, song) {
      state.playingSong = song
    },
    togglePlaying(state, isPlaying) {
      state.playing = isPlaying
    },
    clearPlayList(state) {
      state.playList = []
    },
    clearPlayingSong(state) {
      state.playingSong = {
        name: '',
        id: '',
        artists: [
          {
            name: '',
            id: ''
          }
        ],
        album: {
          name: '',
          id: '',
          blurPicUrl: '',
          picUrl: '',
          publishTime: ''
        }
      }
    },
    togglePlayMode(state, playMode) {
      state.playMode = playMode
    },
    deleteOneInPlayList(state, songId) {
      state.songIndex = findSongIndexById(state.playList, songId)
      if (state.songIndex !== -1) {
        state.playList.splice(state.songIndex, 1)
      }
    },
    setSongComments(state, comments) {
      state.songComments = comments
    },
    clearSongComments(state) {
      state.songComments = {}
    }
  },
  actions: {
    /* 
    *   通过ID获取到的音乐 .mp3 文件无法播放
    async getSongInfo({commit}, songId) {
      const result = await reqSong(songId)
      console.log(result)
      if (result.status === OK) {
        commit('playSong', result.data.data[0].url)
      }
    }
    */
    // 验证音乐是否存在
    async verifySong({ commit }, songId) {
      const result = await verifySongExist(songId)
      const { success, message } = result.data
      if (result.status === OK) {
        return success
      } else {
        Toast(message)
        return success
      }
    },
  
    playShuffle({ state, commit, dispatch }) {
      // 使用递归，避免连续两次随机数一样
      let tmpRandomSong = getRandomSong(state.playList, state.playList.length)
      if (tmpRandomSong.id === state.randomSong.id) {
        dispatch('playShuffle')
        return
      }
      state.randomSong = tmpRandomSong
      commit('playCurrentSong', state.randomSong )
    },
    togglePrevOrNext({ state, commit, dispatch }, prevOrNext) {
      if (prevOrNext === 'prev') {
        // 上一曲
        state.songIndex = findSongIndexById(state.playList, state.playingSong.id)
        if (state.songIndex === 0) {
          // 如果当前歌曲是第一首
          commit('playCurrentSong', state.playList[state.playList.length - 1])
        } else {
          commit('playCurrentSong', state.playList[state.songIndex - 1])
        }
      } else {
        // 下一曲
        // 如果是随机播放，则直接播放，不用考虑边界情况
        if (state.playMode === 'shuffle') {
          dispatch('playShuffle')
          return
        }
        state.songIndex = findSongIndexById(state.playList, state.playingSong.id)
        if (state.songIndex === state.playList.length - 1) {
          // 如果当前歌曲是最后一首
          commit('playCurrentSong', state.playList[0])
        } else {
          commit('playCurrentSong', state.playList[state.songIndex + 1])
        }
      }
    }
  },
  modules: {
  }
})
