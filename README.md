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

 
