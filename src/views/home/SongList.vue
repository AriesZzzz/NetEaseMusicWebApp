<template>
  <div class="song-list-model">
    <van-nav-bar title="歌单" left-arrow @click-left="$router.back()"></van-nav-bar>
    <div class="container">
        
      <van-search placeholder="请输入搜索关键词" v-model="value" shape="round"/>

      <div class="list-title">
        <van-row type="flex" justify="center">
          <van-col span="10">
            <van-image width="50px" height="50px" />
          </van-col>
          <van-col span="12">
            <p class="van-multi-ellipsis--l2">我喜欢的音乐</p>
            <p class="van-ellipsis">
              <van-image width="15px" height="15px" round />用户名
              <van-icon name="arrow" />
            </p>
          </van-col>
        </van-row>
      </div>

      <van-grid :border="false">
        <van-grid-item icon="chat-o" text="4" />
        <van-grid-item icon="share" text="分享" />
        <van-grid-item icon="passed" text="多选" />
        <van-grid-item icon="more-o" text="更多" />
      </van-grid>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
</style>