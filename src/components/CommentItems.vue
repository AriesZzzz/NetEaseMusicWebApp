<template>
    <div class="comment-items">
        <van-row type="flex" justify="center">
            <van-col span="4" style="display: flex;justify-content: center;">
                <van-image
                    round
                    width="10vw"
                    height="10vw"
                    :src="avatarUrl"
                />
            </van-col>
            <van-col span="13">
                <p>{{nickName}}</p>
                <p style="font-size: 12px;margin-top: 5px;">{{pushTime | dateFormatter}}</p>
            </van-col>
            <van-col span="4" :style="{textAlign: 'center',fontSize: '14px', lineHeight: '30px', color: tmpLiked ?  '#dc2419' : ''}">
                {{tmpLikedCount}}
            </van-col>
            <van-col span="2">
                <van-icon name="good-job-o" :color="tmpLiked ?  '#dc2419' : ''" size="25" @click="getLiked"/>
            </van-col>
        </van-row>
        <van-row type="flex" justify="center">
            <van-col span="3"></van-col>
            <van-col span="18">
                <p style="line-height: 26px;">{{ content }}</p>
            </van-col>
        </van-row>
        <van-divider></van-divider>

    </div>
</template>

<script>
    import {
        reqLikeComment
    } from "api"
    import {
        mapState
    } from 'vuex'
    import {
        OK
    } from "common/constant"

    export default {
        name: "commentItems",
        props: {
            content: String,
            avatarUrl: String,
            nickName: String,
            pushTime: Number,
            likedCount: Number,
            liked: Boolean,
            cid: Number
        },
        data() {
            return {
                tmpLiked: false,
                tmpLikedCount: 0
            }
        },
        computed: {
            ...mapState([
                'playingSong'
            ])
        },
        mounted() {
            this.tmpLiked = this.liked
            this.tmpLikedCount = this.likedCount
        },
        methods: {
            async getLiked() {
                let isLike = this.tmpLiked ? 0 : 1 // 0 取消点赞，1 点赞
                const result = await reqLikeComment(this.playingSong.id, this.cid, isLike)
                if (result.data.code === OK) {
                    this.tmpLiked = !this.tmpLiked
                    isLike ? this.tmpLikedCount++ : this.tmpLikedCount--
                } else {
                    this.$toast(result.statusText)
                }
            }
        },
        watch: {
            // $route(newVal, oldVal) {
            //     if (newVal.name === 'comment') {
            //         this.tmpLiked = this.liked
            //         this.tmpLikedCount = this.likedCount
            //     }
            //
            // }
        }
    }
</script>

<style scoped>

</style>