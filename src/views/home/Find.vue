<template>
  <div class="find">
    <stair height="46px" />
    <!-- NavBar -->
    <van-nav-bar @click-right="onClickRight" fixed :border="false">
      <van-search
        placeholder="请输入搜索关键词"
        slot="title"
        shape="round"
        @focus="goToSearch"
        class="nav-bar-search"
      />
    </van-nav-bar>
    <!-- /NavBar -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="container">
        <!-- Swipe -->
        <van-row type="flex" justify="center">
          <van-col span="22">
            <van-swipe
              :autoplay="3000"
              indicator-color="#E35454"
              :stop-propagation="false"
              class="swipe-style"
            >
              <van-swipe-item v-for="(image, index) in images" :key="index" @click="swipeTo">
                <van-image lazy-load :src="image.imageUrl" fit="contain" redius="20"></van-image>
                <span
                  class="banner-info"
                  :style="{backgroundColor: image.titleColor === 'blue' ? '#3e93db' : '#E35454'}"
                >{{image.typeTitle}}</span>
              </van-swipe-item>
            </van-swipe>
          </van-col>
        </van-row>
        <!-- /Swipe -->

        <!-- 分类 -->
        <van-row type="flex" justify="center">
          <van-col span="22">
            <van-grid :border="false">
              <van-grid-item icon="calender-o" text="每日推荐" @click="goToRecommendSongs" />
              <van-grid-item icon="notes-o" text="新歌速递" />
              <van-grid-item icon="medal-o" text="排行榜" />
              <van-grid-item icon="manager-o" text="歌手" />
            </van-grid>
          </van-col>
        </van-row>
        <!-- /分类 -->

        <!-- 分割线 -->
        <van-divider />
        <!-- /分割线 -->

        <!-- 推荐歌单 -->
        <van-row type="flex" class="recommend-title">
          <van-col span="5" offset="2">
            <h3>推荐歌单</h3>
          </van-col>
          <van-col span="3" offset="12">
            <van-button type="default" round size="mini">歌单广场</van-button>
          </van-col>
        </van-row>

        <div class="resource-wrapper">
          <img-box
            v-for="item in resource"
            :key="item.id"
            :playcount="item.playcount"
            :pic-url="item.picUrl"
            :name="item.name"
          />
        </div>

        <!-- /推荐歌单 -->

        <!-- 分割线 -->
        <van-divider />
        <!-- /分割线 -->

        <!-- 最新专辑-->
        <van-row type="flex" class="recommend-title">
          <van-col span="5" offset="2">
            <h3>最新专辑</h3>
          </van-col>
          <van-col span="3" offset="12">
            <van-button type="default" round size="mini">更多专辑</van-button>
          </van-col>
        </van-row>

        <div class="resource-wrapper">
          <albums-box
            v-for="item in albums"
            :key="item.id"
            :artists="item.artists"
            :pic-url="item.picUrl"
            :name="item.name"
          />
        </div>
        <!-- /最新专辑-->
        <stair />
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import {
  reqBanner,
  reqResource,
  reqNewAlbums
} from 'api'
import {
  OK
} from 'common/constant'
import ImgBox from 'components/ImgBox'
import AlbumsBox from 'components/AlbumsBox'
import Stair from 'components/Stair'

import {
  Toast
} from 'vant'
export default {
  data() {
    return {
      images: [],
      resource: [],
      albums: [],
      isLoading: false
    }
  },
  created() {
    this.getBanner()
    this.getResource()
    this.getNewAlbums()
  },
  methods: {
    async getBanner() {
      const result = await reqBanner()
      if (result.status === OK) {
        this.images = result.data.banners
      } else {
        Toast(result.statusText)
      }
    },
    async getResource() {
      const result = await reqResource()
      if (result.status === OK) {
        let tmp = result.data.recommend.slice(0, 9)
        this.resource = tmp
      } else {
        Toast(result.statusText)
      }
    },
    async getNewAlbums() {
      const result = await reqNewAlbums()
      if (result.status === OK) {
        this.albums = result.data.albums
      } else {
        Toast(result.statusText)
      }

    },
    goToSearch() {
      this.$router.push({ name: 'search' })
    },
    onClickRight() {
      console.log('右边')
    },
    swipeTo() {
      console.log(111)
    },
    onRefresh() {
      this.isLoading = true
      this.getBanner()
      this.getResource()
      this.getNewAlbums()
      Toast('刷新成功');
      this.isLoading = false;
    },
    goToRecommendSongs() {
      this.$notify({
        message: '根据你的音乐口味，为你推荐好音乐',
        color: '#666',
        background: 'transparent',
        duration: 2000
      })
      this.$router.push({ name: 'recommendsongs' })
    }
  },
  components: {
    ImgBox,
    AlbumsBox,
    Stair
  }
}
</script>

<style lang="scss" scoped>
@import "common/scss/variable";

.swipe-style {
  margin-top: 1vh;
  border-radius: 10px;
}
.banner-info {
  display: block;
  height: 12px;
  position: absolute;
  right: 0;
  bottom: 2px;
  border-radius: 2px;
  color: #eee;
  background-color: $main-color;
  font-size: 8px;
  padding: 3px;
  line-height: 12px;
}
.nav-bar-search {
  padding: 5px 12px;
}
.recommend-title {
  margin-bottom: 2vh;
}
.resource-wrapper {
  width: 92vw;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.scroll-container {
  width: 100%;
  height: 85vh;
  overflow: hidden;
}
</style>