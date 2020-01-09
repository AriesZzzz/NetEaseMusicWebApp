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

````
npm run build
````

### lyric-parser
lyric.js
````
this.lines.push({
time: parseInt(result[1]) * 60 * 1000 +
        parseInt(result[2]) * 1000 +
        (parseInt(result[3]) || 0),
txt: txt
});
````
这个插件的针对`网易云音乐API`的返回歌词格式的时间计算有bug，本来JS字符串遇到 `*` 会自动转换成数字，但是在这里自动转换会有bug，需要将源码中的上述转换 时分秒 到 毫秒 的代码，全部手动`parseInt()`转换成数字



该bug可导致：
    play() 函数调用后，歌词好像不会滚动

看了源码之后：
    和我之前猜想的一样，内部的计时器`setTimeout`，并不是没有调用，而是因为歌词间隔时间计算bug，导致`delay`--`间隔时间`很大，毫秒转换多了一个或几个 0 ，导致短时间内看不到滚动

 
 ### better-scroll

 在实现播放列表时，使用了VantUI的 Popup 组件作为容器，基于better-scroll封装的 scroll 组件，bug不断。
 - 多次确认了基本使用方法，没有问题
 - 歌词的滚动很流畅，但是播放列表很卡顿，甚至无法执行上拉操作
 - 给外层容器设置了固定高度和`overflow:hidden`，反而无法滚动
 - 而且最揪心的是在没改过代码的前提下，scroll 有时能用，有时不能用，直接给我整出心理阴影
 - 唉，去看看issue吧
