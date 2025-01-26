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
      <span class="progress">
        {{ currentIndex + 1 }} / {{ images.length }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImagePlayer",

  data() {
    return {
      // 图片列表数组
      images: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
        "https://example.com/image3.jpg",
        // 添加更多图片URL
      ],
      currentIndex: 0, // 当前播放的图片索引
      isPlaying: false, // 播放状态
      playInterval: null, // 播放定时器
    };
  },

  computed: {
    currentImage() {
      return this.images[this.currentIndex];
    },
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
      // 设置每200ms播放一张图片（即每秒5张）
      this.playInterval = setInterval(() => {
        this.nextImage();
      }, 200);
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
</style>
