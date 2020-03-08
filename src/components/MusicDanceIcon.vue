<template>
  <div class="audio-icon">
    <div :class="{column: true, paused}" style="animation-delay: -1.2s;"></div>
    <div :class="{column: true, paused}"></div>
    <div :class="{column: true, paused}" style="animation-delay: -1.5s;"></div>
    <div :class="{column: true, paused}" style="animation-delay: -0.9s;"></div>
    <div :class="{column: true, paused}" style="animation-delay: -0.6s;"></div>

  </div>
 
</template>
<script>
export default {
  props: {
    paused: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped>

.audio-icon {
  width: 18px;
  height: 18px;
  min-width: 18px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  overflow: hidden;
}
.column {
  width: 2px;
  height: 100%;
  margin-left: 2px;
  background-color: #E35454;
  -webkit-animation: play 0.9s linear infinite alternate;
  animation: play 0.9s linear infinite alternate;
}
.audio-icon .column:first-child {
    margin-left: 0;
}
.audio-icon .column.paused {
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
}
@keyframes play {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  to {
    -webkit-transform: translateY(75%);
    transform: translateY(75%);
  }
}


</style>