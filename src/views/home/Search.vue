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
        <div class="list-item" v-show="showHotList">
            <p style="padding: 20px;"><b>热搜榜</b></p>
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
            <p style="padding: 20px;"><b>搜索结果</b></p>
            <search-list-item
                v-for="(item, index) in searchList"
                :index="index + 1"
                :song-name="item.name"
                :content="item.content"
                :artists="item.artists"
                :album="item.album"
                @click.native="play(item)"
            />
        </div>
        <Stair></Stair>

    </div>
</template>

<script>
    import Stair from 'components/Stair'
    import HotListItem from 'components/HotListItem'
    import SearchListItem from 'components/SearchListItem'
    import {
        reqHotList,
        reqSearchList
    } from 'api'
    import {
        mapMutations,
        mapActions
    } from 'vuex'
    export default {
        name: 'Search',
        data() {
            return {
                searchVal: '',
                hotList: [],
                showHotList: true,
                timer: 0,
                searchList: []
            }
        },
        created() {
            this.getHotList()
        },
        methods: {
            ...mapMutations([
                'playCurrentSong',
                'showPlayer',
                'playCheckedSong'
            ]),
            ...mapActions([
                'verifySong'
            ]),
            async getHotList() {
                let result = await reqHotList()
                if (result.data.code === 200) {
                    this.hotList = result.data.data
                }
            },
            async getSearchResult() {
                let result = await reqSearchList(this.searchVal)
                if (result.data.code === 200) {
                    this.searchList = result.data.result.songs.slice(0, 20)

                }
            },
            // 防抖函数
            debounce(fn, wait) {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    fn.apply(this)
                }, wait)
            },
            search() {
                if (this.searchVal) {
                    this.debounce(this.getSearchResult, 1000)
                }
            },
            play(song) {
                if (this.verifySong(song.id)) {
                    this.showPlayer(true)
                    this.playCurrentSong(song)
                }
            }
        },
        watch: {
            searchVal(newVal) {
                this.showHotList = !newVal
            }
        },
        components: {
            Stair,
            HotListItem,
            SearchListItem
        },
    }
</script>

<style>
</style>
