<template>
  <div class="song-list-items">
    <div class="list-wrapper" @click="showOuterActions">
      <van-image width="18vw" height="18vw" radius="5" :src="img" >
        <template v-slot:error v-if="showNewList">
          <van-icon name="add-o" size="6vw"/>
        </template>
      </van-image>
      <div class="right-wrapper" :style="showNewList ? wrapperStyle : ''">
        <p class="van-multi-ellipsis--l2 song-list-title">{{ title }}</p>
        <span>{{ newCount }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wrapperStyle: {
        display: 'flex',
        alignItems: 'center',
      }
    }
  },
  props: {
    img: {
      type: String
    },
    title: {
      type: String,
      default: '别说了我爱你'
    },
    count: {
      type: Number
    },
    showNewList: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    newCount() {
      if (!this.showNewList) {
        return `${this.count}首`
      } else {
        return ''
      }
    }
  },
  methods: {
    showOuterActions() {
      this.$emit('show-actions')
    }
  }
}
</script>

<style lang="scss" scoped>
.song-list-items {
  margin-top: 2vh;
}
.list-wrapper {
  width: 46vw;
  // width: 92vw;
  display: flex;
}
.song-list-title {
  font-size: 13px;
  word-wrap:break-word
}
.right-wrapper {
  width: 25vw;
  padding: 1vh;
  box-sizing: border-box;
  position: relative;
  > span {
    font-size: 10px;
    color: #555;
    position: absolute;
    bottom: 4px;
  }
}
</style>