import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'common/scss/reset.scss'
import 'common/icon/iconfont.css'
import Cookie from 'vue-cookies'
import Session from 'vue-session'
// import fastclick from 'fastclick'
import {
  Button,
  NavBar,
  Icon,
  Tabbar, TabbarItem,
  Search,
  Toast,
  Swipe, SwipeItem,
  Lazyload,
  Image,
  Row, Col,
  Grid, GridItem,
  NumberKeyboard,
  Field,
  Divider,
  PasswordInput,
  Loading,
  Cell, List, SwipeCell,
  Sticky,
  PullRefresh,
  Notify,
  ActionSheet,
  Progress
} from 'vant'

Vue.use(Cookie)
Vue.use(Session)

Vue.use(Button)
  .use(NavBar)
  .use(Icon)
  .use(Tabbar).use(TabbarItem)
  .use(Search)
  .use(Toast)
  .use(Swipe).use(SwipeItem)
  .use(Lazyload)
  .use(Image)
  .use(Row).use(Col)
  .use(Grid).use(GridItem)
  .use(NumberKeyboard)
  .use(Field)
  .use(Divider)
  .use(PasswordInput)
  .use(Loading)
  .use(Cell).use(List).use(SwipeCell)
  .use(Sticky)
  .use(PullRefresh)
  .use(Notify)
  .use(ActionSheet)
  .use(Progress)

/* 解决手机浏览器 click 300ms延迟, 会使输入框双击才能聚焦 */

// fastclick.attach(document.body)

/* 阻止启动生产消息 */
Vue.config.productionTip = false

/* 定义全局过滤器 */

// 格式化播放数
Vue.filter('playCountFormatter', count => {
  if (!count) return ''
  if ((count + '').length <= 8) {
    return Math.floor(count / 10000) + '万'
  }
  return (count / 100000000).toFixed(2) + '亿'
})

// 格式化歌手名
Vue.filter('artistsNameFormatter', artists => {
  if (!Array.isArray(artists)) return 'Not Array'
  if (artists.length === 1) return artists[0].name
  let tmp = []
  artists.forEach(artist => {
    tmp.push(artist.name)
  })
  return tmp.join('/')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


