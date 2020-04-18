import request from './request'
import {
    BASE
} from 'common/constant'

// 请求 banner, 防止浏览器从内存中读取数据
export const reqBanner = () => request(BASE + '/banner', { time: Date.now() })

// 验证手机是否注册
export const verifyNewPhoneNum = (phone) => request(BASE + '/cellphone/existence/check', { phone })

// 验证密码是否正确
export const verifyPassword = (phone, password) => request(BASE + '/login/cellphone', { phone, password })

// 退出登录
export const reqLogout = () => request(BASE + '/logout')

// 请求推荐歌单, 防止浏览器从内存中读取数据
export const reqResource = () => request(BASE + '/recommend/resource', { time: Date.now() })

// 请求最新专辑, 防止浏览器从内存中读取数据
export const reqNewAlbums = () => request(BASE + '/album/newest', { time: Date.now() })

// 请求每日推荐歌曲
export const reqRecommendSongs = () => request(BASE + '/recommend/songs')

// 验证音乐是否可用
export const verifySongExist = (id) => request(BASE + '/check/music', { id })

/*
    通过音乐ID获取到的音乐 url 获取到的 .mp3 文件无法播放音频，
    API文档建议只是用 id 就可以播放
 */
// 请求歌曲url
export const reqSong = (id) => request(BASE + '/song/url', { id })

// 请求歌曲信息
export const reqSongInfo = (ids) => request(BASE + '/song/detail', { ids })

// 请求歌词
export const reqLyric = (id) => request(BASE + '/lyric', { id })

// 请求歌曲评论
export const reqSongComments = (id) => request(BASE + '/comment/music', { id })

// 喜欢歌曲/取消喜欢
export const reqIsLikeSong = (id, isLike) => request(BASE + '/like', { id, like: isLike })

// 获取喜欢列表
export const reqLikeList = (uid) => request(BASE + '/likelist', { uid })

// 请求用户详情
export const reqUserInfo = (uid) => request(BASE + '/user/detail', { uid })

// 请求用户歌单
export const reqCreateList = (uid) => request(BASE + '/user/playlist', { uid, time: Date.now() })

// 新建歌单
export const reqCreateNewList = (name) => request(BASE + '/playlist/create', { name })

// 获取歌单详情
export const reqPlayListDetail = (id) => request(BASE + '/playlist/detail', { id, time: Date.now() })

// 对歌单添加或删除歌曲
export const updatePlayList = (op, pid, tracks) => request(BASE + '/playlist/tracks', { op, pid, tracks })

// 给评论点赞
export const reqLikeComment = (id, cid, t, type = 0) => request(BASE + '/comment/like', {id, cid, t, type})