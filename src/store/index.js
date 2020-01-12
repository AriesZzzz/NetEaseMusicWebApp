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
Vue.use(Vuex)

// 格式化歌曲信息
function Song(name, id, artists, album) {
  this.name = name
  this.id = id
  this.artists = artists
  this.album = album
}
function Album(name, id, blurPicUrl, picUrl, publishTime) {
  this.name = name
  this.id = id
  this.blurPicUrl = blurPicUrl
  this.picUrl = picUrl
  this.publishTime = publishTime
}
function Artists(name, id) {
  this.name = name
  this.id = id
}

const songs_formatter = (songs) => {
  let tmpSongs = []
  let tmpSongItem = {}
  let tmpArtists = []
  let tmpAlbum = {}
  let tmpName = ''
  songs.forEach(song => {
    let { name, id, artists, album, transName } = song
    tmpAlbum = new Album(album.name, album.id, album.blurPicUrl, album.picUrl, album.publishTime)
    tmpName = `${name}${transName ? `(${transName})` : ''}`
    artists.forEach(artist => {
      tmpArtists.push(new Artists(artist.name, artist.id))
    })
    tmpSongItem = new Song(tmpName, id, tmpArtists, tmpAlbum)
    tmpSongs.push(tmpSongItem)
    tmpArtists = [] // 改变原来数组的地址
  })
  return tmpSongs
}

export default new Vuex.Store({
  state: {
    userToken: '',  // 用户 token
    playList: [], // 播放列表
    newSongs: [], // 格式化后的歌曲
    isShowPlayer: false, // 是否展示播放页面
    playingSong: {}, // 正在播放的歌曲
    playing: true, // 是否正在播放
    songIndex: 0, // 歌曲在播放列表中的索引
    playMode: 'circle', // 播放模式
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
    getToken(state, token) {
      state.userToken = token
    },
    initToken(state, initToken) {
      state.userToken = initToken
    },
    playAllSong(state, songList) {
      state.playList = JSON.parse(JSON.stringify(songList))
    },
    playSingleSong(state, song) {
      state.playList.push(song)
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
    findSongIndexById(state, songId) {
      state.songIndex = state.playList.findIndex(song => {
        return song.id === songId
      })
    },
    clearPlayList(state) {
      state.playList.length = 0
    },
    clearPlayingSong(state) {
      state.playingSong = {}
    },
    togglePlayMode(state, playMode) {
      state.playMode = playMode
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
    deleteOneInPlayList({ state, commit }, songId) {
      commit('findSongIndexById', songId)
      if (state.songIndex !== -1) {
        state.playList.splice(state.songIndex, 1)
      }
    },
    togglePrevOrNext({ state, commit }, prevOrNext) {
      if (prevOrNext === 'prev') {
        // 上一曲
        commit('findSongIndexById', state.playingSong.id)
        if (state.songIndex === 0) {
          // 如果当前歌曲是第一首
          commit('playCurrentSong', state.playList[state.playList.length - 1])
        } else {
          commit('playCurrentSong', state.playList[state.songIndex - 1])
        }
      } else {
        // 下一曲
        commit('findSongIndexById', state.playingSong.id)
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
