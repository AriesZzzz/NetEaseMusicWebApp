<template>
    <div class="account">
        <van-image
            width="100vw"
            height="40vh"
            fit="cover"
            :src="profile.backgroundUrl"
            :style="{ position: 'absolute',zIndex: -1}"/>

        <div class="overlay">
            <van-row type="flex" justify="center">
                <van-col span="5">
                    <van-image
                        width="20vw"
                        height="20vw"
                        round
                        :src="profile.avatarUrl"
                    />
                </van-col>
            </van-row>

            <p>
                {{profile.nickname}}
            </p>
            <p>
                <span>关注 {{profile.follows}}</span>
                <span>粉丝 {{profile.followeds}}</span>
            </p>
        </div>
        <van-row type="flex" class="user-info">
            <van-col span="5" offset="2">
                <h3>基本信息</h3>
            </van-col>
            <van-col span="3" offset="12">
                <van-button type="default" round size="mini" @click="$router.push({name: 'userInfo'})">更新资料</van-button>
            </van-col>
        </van-row>
        <div class="text-container">
            <p class="info-text"><span style="color: #666">村龄：</span>
                <span style="font-size: 14px;color: #444;">
                {{userInfo.createDays}}天
            </span>
                <span style="font-size: 14px;color: #666;">
                ({{userInfo.createTime | dateFormatter}}注册)
            </span>
            </p>
            <p class="info-text">
                <span style="color: #666">年龄：</span>
                <span style="font-size: 14px;color: #444;">
               {{profile.birthday | ageFormatter}}
            </span>
            </p>
            <p class="info-text">
                <span style="color: #666">性别：</span>
                <span style="font-size: 14px;color: #444;">
                {{profile.gender === 1 ? '男' : '女'}}
            </span>

            </p>
            <p class="info-text">
                <span style="color: #666">地区：</span>
                <span style="font-size: 14px;color: #444;">
                {{ area }}
                    <!--四川省 成都市-->
            </span>

            </p>
            <p class="info-text">
                <span style="color: #666">个人介绍：</span>
                <span style="font-size: 14px;color: #444;">
               {{profile.signature}}
            </span>
            </p>
        </div>
        <div style="width: 84vw;margin: 4vh auto;">
            <van-button type="danger" @click="logout" size="large" round>退出登录</van-button>
        </div>

    </div>
</template>

<script>
    import {
        reqLogout,
        reqUserInfo
    } from 'api'
    import {
        OK
    } from 'common/constant'
    import {
        mapMutations,
        mapState
    } from 'vuex'
    import {
        findArea
    } from 'utils'
    export default {
        data() {
            return {
            }
        },
        computed: {
            ...mapState([
                'uid',
                'userInfo'
            ]),
            profile() {
                return this.userInfo ? this.userInfo.profile : {}
            },
            area() {
                let {province, city} = findArea(this.profile.province, this.profile.city)
                return province + city
            }
        },
        created() {
            this.getUserInfo()
        },
        methods: {
            ...mapMutations([
                'removeUserInfo',
                'setUserInfo'
            ]),
             logout() {
                this.$dialog.confirm({
                    message: '确认退出登录吗？',
                })
                    .then(async () => {
                        const result = await reqLogout()
                        if (result.data.code === OK) {
                            this.$toast('退出登录')
                            this.removeUserInfo()
                            this.$session.remove('token')
                            this.$router.replace({name: 'find'})
                        }
                    })
                    .catch(() => {
                        // on cancel
                    });

            },
            async getUserInfo() {
                const result = await reqUserInfo(this.uid)
                if (result.data.code === OK) {
                    this.setUserInfo(result.data)
                } else {
                    this.$toast(result.statusText)
                }
            },
        },
        filters: {
            ageFormatter(birthday) {
                return new Date().getFullYear() - new Date(birthday).getFullYear()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .overlay {
        width: 100vw;
        height: 40vh;
        background-color: rgba(240, 240, 240, .19);
        box-sizing: border-box;
        padding-top: 14vh;

        p {
            text-align: center;
            color: #fff;
            margin-top: 2vh;

            span {
                margin: 0 5px;
            }
        }
    }

    .user-info {
        margin-top: 2vh;
    }

    .info-text {
        line-height: 4vh;
    }
    .text-container {
        width: 84vw;
        margin: 0 auto;
    }
</style>