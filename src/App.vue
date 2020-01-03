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
    if (token) this.initToken(token)
  },
  methods: {
    ...mapMutations([
      'initToken'
    ])
  }
}
</script>
<style lang="scss">
</style>
