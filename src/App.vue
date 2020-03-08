<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import {
  mapMutations,
  mapState
} from 'vuex'
import {
  reqLikeList
} from 'api'
import {
  OK
} from 'common/constant'
export default {
  created() {
    const token = this.$session.get('token')
    const uid = this.$session.get('uid')
    if (token && uid) {
      this.setToken(token)
      this.setUid(uid)
    }

    // 在界面刚初始化时就获取喜欢列表，防止由于未进入喜欢列表而导致无法点亮爱心
    this.getLikeList()
  },
  computed: {
    ...mapState([
      'uid'
    ])
  },
  methods: {
    ...mapMutations([
      'setToken',
      'setUid',
      'setLikeListIds'
    ]),
     async getLikeList() {
      const result = await reqLikeList(this.uid)
      if (result.status === OK) {
        this.setLikeListIds(result.data.ids)
      } else {
        this.$toast(result.statusText)
      }
    },
  }
}
</script>
<style lang="scss">
</style>
