<template>
    <div class="song-list-items">
        <div class="list-wrapper" @click="showOuterActions" :style="{width: localWidth}">
            <van-image width="18vw" height="18vw" radius="5" :src="img">
                <template #error v-if="showNewList">
                    <van-icon name="add-o" size="6vw"/>
                </template>
            </van-image>
            <div class="right-wrapper" :style="{width: childWidth}" :class="{'wrapperStyle': showNewList}">
                <p :class="{'van-multi-ellipsis--l2': ellipsis, 'song-list-title': true} ">{{ title }}</p>
                <span>{{ newCount }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                localWidth: '46vw',
                ellipsis: true,
                childWidth: '25vw'
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
                type: [Number, String],
                default: 0
            },
            showNewList: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            newCount() {
                if (!this.showNewList) {
                    // 如果是数字，返回歌曲数，否则返回歌手名
                    return typeof this.count === 'number' ? `${this.count}首` : this.count
                } else {
                    return ''
                }
            }
        },
        methods: {
            showOuterActions() {
                this.$emit('show-actions')
            },
            changeDisplayModel(model) {
                if (model === 'single') {
                    this.localWidth = '92vw'
                    this.ellipsis = false
                    this.childWidth = '74vw'
                } else if (model === 'double') {
                    this.localWidth = '46vw'
                    this.ellipsis = true
                    this.childWidth = '25vw'

                }
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
        display: flex;
    }

    .song-list-title {
        font-size: 13px;
        word-wrap: break-word;
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

    .wrapperStyle {
        display: flex;
        align-items: center;
    }

</style>