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
    // 用户 token
    userToken: '',
    // 播放列表
    playList: [],
    // 格式化后的歌曲
    newSongs: [],
    // 是否展示播放页面
    isShowPlayer: false,
    // 正在播放的歌曲
    playingSong: {},
    // 是否正在播放
    playing: true
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
      state.playList = songList
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
    }
  },
  modules: {
  }
})
