<template>
  <div class="my">

  </div>
</template>
<script>
import {
  reqUserInfo
} from 'api'
import {
  mapState, mapMutations
} from 'vuex'
import {
  OK
} from 'common/constant'
export default {
  data() {
    return {
      
    }
  },
  created() {
    this.getUserInfo()
  },
  computed: {
    ...mapState([
      'uid'
    ])
  },
  methods: {
    ...mapMutations([
      'setUserInfo'
    ]),
    async getUserInfo() {
      console.log(1);
      const result = await reqUserInfo(this.uid)
      if (result.status === OK) {
        this.setUserInfo(result.data)
      } else {
        this.$toast(result.statusText)
      }
    } 
  }
}
</script>

<style>

</style>