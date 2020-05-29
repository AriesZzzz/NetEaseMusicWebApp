<template>
    <div class="user-info">
        <van-nav-bar title="我的资料" left-arrow @click-left="$router.back()"/>

        <van-field v-model="nickname" label="昵称"/>

        <van-field v-model="gender" label="性别" @click="showGender = true"/>

        <van-action-sheet v-model="showGender" :actions="genderActions" @select="onGenderSelect"/>

        <van-field v-model="birthday" label="生日" @click="showDate = true"/>
        <van-action-sheet v-model="showDate">
            <van-datetime-picker
                v-model="currentDate"
                type="date"
                title="选择年月日"
                :min-date="minDate"
                :max-date="maxDate"
                @confirm="confirmDate"
                @cancel="showDate = false"
            />
        </van-action-sheet>

        <van-field v-model="areaValue" label="地区" @click="showCurrArea"/>
        <van-action-sheet v-model="showArea">
            <van-area
                :area-list="areaList"
                :columns-num="2"
                :value="cityCode"
                @confirm="confirmArea"
                @cancel="showArea = false"
            />
        </van-action-sheet>


        <van-field
            v-model="signature"
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
    import areaData from '../../assets/area'
    import {
        updateUserInfo
    } from 'api'
    export default {
        name: "UserInfo",
        data() {
            return {
                gender: '',
                signature: '',
                nickname: '',
                showGender: false,
                genderActions: [
                    {name: '男', subname: ''},
                    {name: '女', subname: ''}
                ],
                showDate: false,
                birthday: '',
                cityCode: '',
                showArea: false,
                areaValue: '',
                minDate: new Date(1920, 0, 1),
                maxDate: new Date(),
                currentDate: new Date(),
                province: '',
                city: '',
                cityInfo: {
                    province: 510000,
                    city: 510100,
                }
            }
        },
        created() {
            this.profile.gender === 1 ? this.gender = '男' : this.gender = '女'
            this.birthday = this.dateFormatter(this.profile.birthday)
            this.genderActions.forEach(item => {
                if (item.name === this.gender)
                    item.subname = '已选'
            })
            this.areaValue = this.area
            this.currentDate = new Date(this.profile.birthday)
            this.signature = this.profile.signature
            this.nickname = this.profile.nickname
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
            areaList() {
                return areaData
            }
        },
        methods: {
            confirmDate(date) {
                this.birthday =  this.dateFormatter(this.currentDate)
                this.showDate = false
            },
            confirmArea(areaArr) {
                let {province, city} = findArea(areaArr[0].code, areaArr[1].code)
                this.cityInfo = {
                    province: areaArr[0].code,
                    city: areaArr[1].code
                }
                this.areaValue = province + city
                this.showArea = false
            },
            showCurrArea() {
                this.showArea = true
                this.cityCode = this.profile.city + ''
            },
            async submitUserInfo() {
                let args = {
                    gender: this.gender === '男' ? 1 : 2,
                    signature: this.signature,
                    nickname: this.nickname,
                    birthday: new Date(this.currentDate).getTime(),
                    city: this.cityInfo.city,
                    province: this.cityInfo.province
                }
                let result = await updateUserInfo(args)
                if (result.status === 200) {
                    this.$toast('修改成功')
                    console.log(result.data)
                } else {
                    this.$toast(result.statusText)
                }
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
            dateFormatter(date) {
                let afterTime = new Date(date)
                return `${afterTime.getFullYear()}-${afterTime.getMonth() + 1}-${afterTime.getDate()}`
            }
        }
    }
</script>

<style scoped>

</style>