<template>
  <div class="img-box">
    <van-image :src="picUrl" width="27vw" radius="4" lazy-load />
    <span class="playcount">
      <van-icon name="service-o" />
      {{playcount | playCountFormatter}}
    </span>
    <div class="resource-name van-multi-ellipsis--l2">{{name}}</div>
  </div>
</template>

<script>
/*
 * 专辑，歌曲，歌单封面展示组件
 */
export default {
  props: [
    'playcount',
    'picUrl',
    'name'
  ]
}
</script>

<style lang="scss" scoped>
.img-box {
  width: 30vw;
  position: relative;
  padding: 5px;
  box-sizing: border-box;
}
.resource-name {
  height: 29px;
  font-size: 12px;
  line-height: 15px;
}
.playcount {
  position: absolute;
  right: 2vw;
  top: 1vh;
  color: #eee;
  font-size: 10px;
}
</style>