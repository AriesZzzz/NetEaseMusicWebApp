<template>
    <div class="search">
        <van-nav-bar @click-left="$router.back()" left-arrow fixed>
            <van-search
                placeholder="请输入搜索关键词"
                slot="title"
                shape="round"
                v-model="searchVal"
                class="nav-bar-search"
                @input="search"
            />
        </van-nav-bar>
        <Stair></Stair>
        <p style="padding-left: 20px;"><b>热搜榜</b></p>
        <div class="list-item" v-show="showHotList">
            <hot-list-item
                v-for="(item, index) in hotList"
                :song-name="item.searchWord"
                :content="item.content"
                :index="index + 1"
                :score="item.score"
                :icon-url="item.iconUrl"
            />
        </div>
        <div class="list-item" v-show="!showHotList">
            <hot-list-item
                v-for="(item, index) in hotList"
                :song-name="item.searchWord"
                :content="item.content"
                :index="index + 1"
                :score="item.score"
                :icon-url="item.iconUrl"
            />
        </div>
        <Stair></Stair>

    </div>
</template>

<script>
    import Stair from 'components/Stair'
    import HotListItem from 'components/HotListItem'
    import {
        reqHotList,
        reqSearchList
    } from 'api'

    export default {
        data() {
            return {
                searchVal: '',
                hotList: [],
                showHotList: true
            }
        },
        created() {
            this.getHotList()
        },
        methods: {
            async getHotList() {
                let result = await reqHotList()
                if (result.data.code === 200) {
                    this.hotList = result.data.data
                }
            },
            async getSearchResult() {
                let result = await reqSearchList(this.searchVal)
                if (result.data.code === 200) {
                    console.log(result)
                }
            },
            // 防抖函数
            debounce(fn, wait) {
                let timeout
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    fn.apply(this)
                }, wait)

            },
            search() {
                if (this.searchVal) {
                    this.debounce(this.getSearchResult, 1000)
                }
            }
        },
        components: {
            Stair,
            HotListItem
        },
    }
</script>

<style>
</style>
