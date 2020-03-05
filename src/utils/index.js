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
        let { name, id, transName, tns } = song
        let artists = song.artists || song.ar
        let album = song.album || song.al
        tmpAlbum = new Album(album.name, album.id, album.blurPicUrl, album.picUrl, album.publishTime)
        tmpName = `${name}${transName ? `(${transName})` : `${tns ? `(${tns.toString()})` : ''}`}`
        artists.forEach(artist => {
            tmpArtists.push(new Artists(artist.name, artist.id))
        })
        tmpSongItem = new Song(tmpName, id, tmpArtists, tmpAlbum)
        tmpSongs.push(tmpSongItem)
        tmpArtists = [] // 改变原来数组的地址
    })
    return tmpSongs
}
// 优化随机算法
const getRandomSong = (playList, max) => {
    let tmpPlayList = playList.slice(0) // 浅拷贝
    tmpPlayList.sort(() => (0.5 - Math.random().toFixed(2)))
    return tmpPlayList[Math.floor(Math.random().toFixed(2) * max)]
}

const findSongIndexById = (playList, songId) => {
    return playList.findIndex(song => {
        return song.id === songId
    })
}

const findLikeId = (likeIds, likeId) => {
    return likeIds.findIndex(item => {
        return item === likeId
    })
}

export {
    songs_formatter,
    getRandomSong,
    findSongIndexById,
    findLikeId
}