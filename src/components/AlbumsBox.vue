<template>
  <div class="albums-box">
    <van-image :src="picUrl" width="27vw" radius="4" lazy-load />
    <div class="albums-name van-ellipsis">{{name}}</div>
    <div class="artists-name van-ellipsis">{{artists | artistsNameFormatter}}</div>
  </div>
</template>

<script>
/*
 * 专辑，歌曲，歌单封面展示组件
 */
export default {
  props: {
    artists: Array,
    picUrl: String,
    name: String
  }
}
</script>

<style lang="scss" scoped>
.albums-box {
  width: 30vw;
  position: relative;
  padding: 5px;
  box-sizing: border-box;
}
.albums-name, .artists-name{
  height: 18px;
  font-size: 12px;
  text-align: center;
}
.artists-name {
  font-size: 10px;
  color: #666;
}
</style>
