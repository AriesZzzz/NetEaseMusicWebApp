# mymusic

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run start
```

### Compiles and minifies for production

```
npm run build
```

### lyric-parser

lyric.js

```
this.lines.push({
time: parseInt(result[1]) * 60 * 1000 +
        parseInt(result[2]) * 1000 +
        (parseInt(result[3]) || 0),
txt: txt
});
```

这个插件的针对`网易云音乐API`的返回歌词格式的时间计算有 bug，本来 JS 字符串遇到 `*` 会自动转换成数字，但是在这里自动转换会有 bug，需要将源码中的上述转换 时分秒 到 毫秒 的代码，全部手动`parseInt()`转换成数字

该 bug 可导致：
play() 函数调用后，歌词好像不会滚动

看了源码之后：
和我之前猜想的一样，内部的计时器`setTimeout`，并不是没有调用，而是因为歌词间隔时间计算 bug，导致`delay`--`间隔时间`很大，毫秒转换多了一个或几个 0 ，导致短时间内看不到滚动

### better-scroll

在实现播放列表时，使用了 VantUI 的 Popup 组件作为容器，基于 better-scroll 封装的 scroll 组件，bug 不断。

- 多次确认了基本使用方法，没有问题
- 歌词的滚动很流畅，但是播放列表很卡顿，甚至无法执行上拉操作
- 给外层容器设置了固定高度和`overflow:hidden`，反而无法滚动
- 而且最揪心的是在没改过代码的前提下，scroll 有时能用，有时不能用，直接给我整出心理阴影
- 唉，去看看 issue 吧

解决：

```
 this.scroll = new BScroll(this.$refs.wrapper, {
       probeType: this.probeType,
       click: this.click,
       bindToWrapper: true
     })
```

### Vue devtools 数据不同步
devtools 中显示的 `playList`长度 与 代码中的数组长度不一致。
表现为：点击删除一首歌时，代码中`playList.length`减 1 ，但devtools中的`playList`没有同步刷新，在删除第2首歌后，devtools中`playList`长度才会减1，但永远比代码中的长度多 1.也就是说devtools中显示的是上一次的长度

在随意切换一下别的任何状态(暂停，播放，切歌)后，devtools 中显示就跟代码中同步了

思考：
- 我用删除方法是 `action` 方法，会不会有异步的问题，没有同步刷新？
- 但我并没有异步请求，写的是同步代码

解决：
- 就是`action` 方法的原因，我将删除函数改为了`mutation`方法，devtools就同步显示了
- 以后真不敢随便乱用`action`了，我以为它就只是为了让我能自由调用其他方法，结果还给我强行异步
