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
    tmpName = `${name}(${transName})`
    artists.forEach(artist => {
      tmpArtists.push(new Artists(artist.name, artist.id))
    })

    tmpSongItem = new Song(tmpName, id, tmpArtists, tmpAlbum)

    tmpSongs.push(tmpSongItem)
  })
  return tmpSongs
}

export default new Vuex.Store({
  state: {
    userToken: '',
    playList: []
  },
  getters: {
    playList(state) {
      return state.playList
    }
  },
  mutations: {
    getToken(state, token) {
      state.userToken = token
    },
    initToken(state, initToken) {
      state.userToken = initToken
    },
    playAllSong(state, song) {
      state.playList.push(song)
    },
    playSingleSong(state, song) {
      state.playList.push(song)
    },
    songsFormatter(state, songs) {
      return songs_formatter(songs)
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
