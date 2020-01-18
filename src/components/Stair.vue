<template>
  <div class="stair" :style="{width: '100%', height}"></div>
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
