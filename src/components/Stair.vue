<template>
  <div class="stair" :style="{height}"></div>
</template>

<script>
export default {
    props: {
        height: {
            type: String,
            default: '50px'
        }
    }
}
</script>
