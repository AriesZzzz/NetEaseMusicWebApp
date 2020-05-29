<template>
    <div class="hotListItem">
        <van-row type="flex" justify="center" class="song-row">
            <van-col span="22">
                    <div class="wrapper">
                        <div class="song-index">
                            <span :style="{color: index <= 3 ? 'red' : ''}">{{index}}</span>
                        </div>
                        <div class="song-list-wrapper">
                            <p class="van-ellipsis song-name">
                                {{songName}}
                                <img :src="iconUrl" alt="" width="15px" />
                            </p>
                            <p
                                class="van-ellipsis artists-name"
                            >{{content}}</p>
                        </div>
                        <span class="ellipsis">{{score}}</span>
                    </div>
            </van-col>
        </van-row>
    </div>

</template>

<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    export default {
        name: "HotListItem",
        props: {
            id: {
                type: Number,
                default: 0
            },
            index: {
                type: Number,
                default: 1
            },
            songName: {
                type: String,
                default: '别说了我爱你'
            },
            content: {
                type: String,
                default: ''
            },
            score: {
                type: Number,
                default: 1
            },
            iconUrl: {
                type: String,
                default: ''
            }
        },
        computed: {

        },
        methods: {

        },
    }
</script>

<style lang="scss" scoped>
    .wrapper {
        display: flex;
        justify-content: flex-start;
        position: relative;
    }
    .ellipsis {
        display: inline-block;
        position: absolute;
        right: 1.5vw;
        color: #ccc;
        font-size: 12px;
        margin-top: 6px;
    }
    .song-list-wrapper {
        width: 70vw;
        margin-left: 3vw;
    }
    .artists-name {
        font-size: 12px;
        line-height: 27px;
        color: #666;
    }
    .song-name {
        margin-top: 1vh;
        height: 3vh;
    }
    .song-row {
        margin-bottom: 2vh;
    }
    .song-index {
        width: 8vw;
        color: #888;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>