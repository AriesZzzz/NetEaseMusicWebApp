<template>
    <div class="user-info">
        <van-nav-bar title="我的资料" left-arrow @click-left="$router.back()" />

        <van-field v-model="profile.nickname" label="昵称" />

        <van-field v-model="gender" label="性别" @click="showGender = true"/>

        <van-action-sheet v-model="showGender" :actions="genderActions" @select="onGenderSelect" />

        <van-field v-model="birthday" label="生日" @click="showDate = true" :min-date="minDate"/>

        <van-calendar v-model="showDate" @confirm="onDateConfirm" :show-confirm="false"/>

        <van-field v-model="area" label="地区" />
        <van-field
            v-model="profile.signature"
            rows="4"
            autosize
            label="签名"
            type="textarea"
            maxlength="280"
            :placeholder="profile.signature"
            show-word-limit
        />
        <div style="width: 84vw;margin: 4vh auto;">
            <van-button type="info" @click="submitUserInfo" size="large" round>确认修改</van-button>
        </div>
    </div>
</template>

<script>
    import {
        mapState
    } from 'vuex'
    import {
        findArea
    } from 'utils'
    export default {
        name: "UserInfo",
        data() {
            return {
                gender: '',
                signature: '',
                nickname: '',
                showGender: false,
                genderActions: [
                    { name: '男', subname: '' },
                    { name: '女', subname: '' }
                ],
                showDate: false,
                birthday: '',
                minDate: new Date(1920, 0, 1)
            }
        },
        created() {
            this.profile.gender === 1 ? this.gender = '男' : this.gender = '女'
            this.birthday = this.dateFormatter(this.profile.birthday)
            this.genderActions.forEach(item => {
                if (item.name === this.gender)
                    item.subname = '已选'
            })
        },
        computed: {
            ...mapState([
                'userInfo'
            ]),
            profile() {
                return this.userInfo ? this.userInfo.profile : {}
            },
            area() {
                let {province, city} = findArea(this.profile.province, this.profile.city)
                return province + city
            },
        },
        methods: {
            submitUserInfo() {

            },
            onGenderSelect(item) {
                this.showGender = false
                this.gender = item.name

                this.genderActions.forEach(item => {
                    item.subname = ''
                    if (item.name === this.gender)
                        item.subname = '已选'
                })
            },
            onDateConfirm(date) {
                this.showDate = false
                this.birthday = this.dateFormatter(date)
            },
            dateFormatter(date) {
                let afterTime = new Date(date)
                return `${afterTime.getFullYear()}-${afterTime.getMonth() + 1}-${afterTime.getDate()}`
            }
        }
    }
</script>

<style scoped>

</style>