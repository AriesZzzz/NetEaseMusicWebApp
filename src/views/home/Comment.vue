<template>
    <div class="comments">
        <stair height="45px"></stair>
        <van-nav-bar
            :title="`评论(${songComments.total})`"
            left-arrow
            fixed
            @click-left="$router.back()"
        />
        <van-row type="flex" justify="center">
            <van-col span="22">
                <song-list-items
                    :img="playingSong.album.picUrl"
                    :title="playingSong.name"
                    :count="playingSong.artists | artistsNameFormatter"
                    ref="songInfo"
                />
            </van-col>
        </van-row>
        <van-divider>精彩评论</van-divider>
        <comment-items
            v-for="item in songComments.hotComments"
            :content="item.content"
            :avatarUrl="item.user.avatarUrl"
            :nickName="item.user.nickname"
            :pushTime="item.time"
            :likedCount="item.likedCount"
            :liked="item.liked"
            :cid="item.commentId"
        />
    </div>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import SongListItems from 'components/SongListItems'
    import CommentItems from 'components/CommentItems'
    import Stair from 'components/Stair'
    import {
        reqSongComments
    } from 'api'
    import {
        OK
    } from "common/constant"

    export default {
        name: "comment",
        data() {
            return {}
        },
        created() {

        },
        computed: {
            ...mapState([
                'songComments',
                'playingSong'
            ])
        },
        methods: {
            ...mapMutations([
                'showPlayer',
                'toggleTabBar',
                'setSongComments'
            ]),
            async getSongComments(id) {
                const result = await reqSongComments(id)
                if (result.status === OK) {
                    this.setSongComments(result.data)
                } else {
                    this.$toast(result.statusText)
                }
            },
            setComments() {
                this.getSongComments(this.playingSong.id)
                this.toggleTabBar(false)
                this.$refs.songInfo.changeDisplayModel('single')
            }
        },
        components: {
            SongListItems,
            CommentItems,
            Stair
        },
        watch: {
            $route(newVal, oldVal) {
                if (newVal.name === 'comment') {
                    this.setComments()
                }
            }
        },
        beforeRouteLeave(to, from, next) {
            this.showPlayer(true)
            this.toggleTabBar(true)
            next()
        }
    }
</script>

<style scoped>

</style>