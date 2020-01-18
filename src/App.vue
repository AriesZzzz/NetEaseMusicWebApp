<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import {
  mapMutations
} from 'vuex'
export default {
  created() {
    const token = this.$session.get('token')
    const uid = this.$session.get('uid')
    if (token && uid) {
      this.setToken(token)
      this.setUid(uid)
    }
  },
  methods: {
    ...mapMutations([
      'setToken',
      'setUid'
    ])
  }
}
</script>
<style lang="scss">
</style>
