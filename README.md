# image-player-simulate-video-player

浏览器快速播放图片，模仿播放视频
技术特点：双缓冲+预加载

第一版：直接快速播放网络图片，效果非常差，1秒5帧都无法满足

第二版：使用双缓冲策略，网页上使用两个image标签轮流显示，显示效果有提升，但是不大

第三版：加入预加载策略，增加一个长度为5的预加载队列，用于预先去网络请求图片，每显示一张图片的时候，都会去更新预加载队列，删除最早加入的图片，并开始预加载新的图片。效果提升明显，内网环境下可满足每秒20帧的要求

优化点：双缓冲+预加载


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
