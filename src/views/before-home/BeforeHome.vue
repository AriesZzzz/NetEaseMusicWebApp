<template>
  <div class="beforehome">
    <transition name="slide">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
</style>
