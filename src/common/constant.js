export const OK = 200
export const BASE = 'http://localhost:3000'
/*  通过音乐ID获取到的音乐 url 获取到的 .mp3 文件无法播放音频，
    API文档建议只是用 id 拼接的 url 就可以播放
*/
export const SONGURL = (id) => `https://music.163.com/song/media/outer/url?id=${id}.mp3`
// export const BASE = '172.21.146.243:3000'