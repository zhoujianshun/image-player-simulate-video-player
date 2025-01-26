<template>
  <div class="image-player">
    <!-- 播放器主体区域 -->
    <div class="player-container">
      <img :src="currentImage" alt="播放图片" v-if="currentImage" />
    </div>

    <!-- 控制按钮区域 -->
    <div class="controls">
      <button @click="togglePlay">
        {{ isPlaying ? "暂停" : "播放" }}
      </button>
      <select v-model="frameRate" @change="updateFrameRate">
        <option v-for="rate in frameRates" :key="rate" :value="rate">
          {{ rate }} 帧/秒
        </option>
      </select>
      <span class="progress">
        {{ currentIndex + 1 }} / {{ images.length }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImagePlayer2",

  data() {
    return {
      // 图片列表数组
      images: [
        // 添加更多图片URL
      ],
      currentIndex: 0, // 当前播放的图片索引
      isPlaying: false, // 播放状态
      playInterval: null, // 播放定时器
      frameRate: 5, // 默认帧率
      frameRates: [1, 2, 5, 10, 15], // 可选帧率列表
    };
  },

  computed: {
    currentImage() {
      return this.images[this.currentIndex];
    },
  },
  created() {
    // 生成100张图片
    for (let i = 0; i < 1000; i++) {
      this.images.push(`https://picsum.photos/200?t=${i}`);
    }
  },
  methods: {
    // 切换播放/暂停状态
    togglePlay() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    },

    // 开始播放
    play() {
      this.isPlaying = true;
      const interval = Math.floor(1000 / this.frameRate); // 根据帧率计算间隔时间
      this.playInterval = setInterval(() => {
        this.nextImage();
      }, interval);
    },

    // 暂停播放
    pause() {
      this.isPlaying = false;
      if (this.playInterval) {
        clearInterval(this.playInterval);
        this.playInterval = null;
      }
    },

    // 播放下一张图片
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },

    updateFrameRate() {
      if (this.isPlaying) {
        // 如果正在播放，需要重新启动定时器
        this.pause();
        this.play();
      }
    },
  },

  // 组件销毁时清理定时器
  beforeDestroy() {
    this.pause();
  },
};
</script>

<style scoped>
.image-player {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.player-container {
  width: 100%;
  aspect-ratio: 16/9;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.player-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.controls {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}

.progress {
  font-size: 14px;
}

select {
  padding: 8px;
  cursor: pointer;
  margin: 0 10px;
}
</style>
