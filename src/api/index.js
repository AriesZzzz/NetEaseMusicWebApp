import request from './request'
import {
    BASE
} from 'common/constant'

// 请求 banner
export const reqBanner = () => request(BASE + '/banner')

// 验证手机是否注册
export const verifyNewPhoneNum = (phone) => request(BASE + '/cellphone/existence/check', { phone })

// 验证密码是否正确
export const verifyPassword = (phone, password) => request(BASE + '/login/cellphone', { phone, password })

// 退出登录
export const reqLogout = () => request(BASE + '/logout')

// 请求推荐歌单
export const reqResource = () => request(BASE + '/recommend/resource')

// 请求最新专辑
export const reqNewAlbums = () => request(BASE + '/album/newest')

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