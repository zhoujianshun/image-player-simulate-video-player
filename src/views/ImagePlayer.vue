<template>
  <div class="image-player">
    <!-- 播放器主体区域 -->
    <div class="player-container">
      <img
        :src="bufferA.src"
        alt="播放图片"
        v-show="bufferA.isActive"
        @load="handleImageLoad('A')"
        :class="{ 'fade-in': bufferA.isActive }"
      />
      <img
        :src="bufferB.src"
        alt="播放图片"
        v-show="bufferB.isActive"
        @load="handleImageLoad('B')"
        :class="{ 'fade-in': bufferB.isActive }"
      />
      <div v-if="isLoading" class="loading-indicator">加载中...</div>
    </div>

    <!-- 控制按钮区域 -->
    <div class="controls">
      <button @click="togglePlay">
        {{ isPlaying ? "暂停" : "播放" }}
      </button>
      <span class="progress">
        {{ currentIndex + 1 }} / {{ images.length }}
      </span>
      <!-- 添加帧率选择器 -->
      <div class="fps-selector">
        <span>帧率:</span>
        <select v-model="selectedFps">
          <option v-for="fps in fpsOptions" :key="fps" :value="fps">
            {{ fps }} FPS
          </option>
        </select>
      </div>
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
        // 添加更多图片URL
      ],
      currentIndex: 0, // 当前播放的图片索引
      isPlaying: false, // 播放状态
      playIntervalTimer: null, // 播放定时器
      // 添加双缓冲相关的数据
      bufferA: {
        src: "",
        isActive: true,
        isLoaded: false,
      },
      bufferB: {
        src: "",
        isActive: false,
        isLoaded: false,
      },
      // 添加帧率相关数据
      fpsOptions: [1, 2, 5, 10, 15, 20, 24],
      selectedFps: 5, // 默认5帧每秒
      preloadQueue: [], // 预加载队列
      maxPreloadCount: 5, // 最大预加载数量
      isLoading: false,
    };
  },

  computed: {
    currentImage() {
      return this.images[this.currentIndex];
    },
    // 根据选择的帧率计算播放间隔（毫秒）
    playInterval() {
      // 向下取整
      return Math.floor(1000 / this.selectedFps);
    },
  },
  created() {
    // 生成100张图片
    for (let i = 0; i < 1000; i++) {
      this.images.push(`https://picsum.photos/200?t=${i}`);
    }
    // 初始化第一张图片
    this.bufferA.src = this.images[0];
    // 初始化预加载队列
    this.initPreloadQueue();
  },
  methods: {
    // 初始化预加载队列
    initPreloadQueue() {
      const startIdx = (this.currentIndex + 1) % this.images.length;
      for (let i = 0; i < this.maxPreloadCount; i++) {
        const idx = (startIdx + i) % this.images.length;
        this.preloadImage(this.images[idx]);
      }
    },

    // 预加载图片
    preloadImage(src) {
      if (!this.preloadQueue.includes(src)) {
        const img = new Image();
        img.src = src;
        this.preloadQueue.push(src);
        if (this.preloadQueue.length > this.maxPreloadCount) {
          this.preloadQueue.shift(); // 移除最早的预加载图片
        }
      }
    },

    // 处理图片加载
    handleImageLoad(buffer) {
      if (buffer === "A") {
        this.bufferA.isLoaded = true;
      } else {
        this.bufferB.isLoaded = true;
      }
      this.isLoading = false;
    },

    // 优化后的播放下一张图片方法
    async nextImage() {
      this.isLoading = true;
      const nextIndex = (this.currentIndex + 1) % this.images.length;

      // 切换缓冲区
      this.bufferA.isActive = !this.bufferA.isActive;
      this.bufferB.isActive = !this.bufferB.isActive;

      // 更新当前索引
      this.currentIndex = nextIndex;

      // 预加载下一张图片
      const nextBuffer = this.bufferA.isActive ? this.bufferB : this.bufferA;
      nextBuffer.isLoaded = false;
      nextBuffer.src = this.images[nextIndex];

      // 更新预加载队列
      const preloadIndex =
        (nextIndex + this.maxPreloadCount) % this.images.length;
      this.preloadImage(this.images[preloadIndex]);
    },

    // 优化后的播放控制
    play() {
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.playIntervalTimer = setInterval(() => {
          if (!this.isLoading) {
            this.nextImage();
          }
        }, this.playInterval);
      }
    },

    // 切换播放/暂停状态
    togglePlay() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    },

    // 暂停播放
    pause() {
      this.isPlaying = false;
      if (this.playIntervalTimer) {
        clearInterval(this.playIntervalTimer);
        this.playIntervalTimer = null;
      }
    },
  },

  // 组件销毁时清理定时器
  beforeDestroy() {
    // 清理预加载队列
    this.preloadQueue = [];
    this.pause();
  },

  // 监听帧率变化
  watch: {
    selectedFps() {
      // 如果正在播放，重新开始播放以应用新的帧率
      if (this.isPlaying) {
        this.pause();
        this.$nextTick(() => {
          this.play();
        });
      }
    },
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
  position: absolute;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  will-change: transform; /* 优化渲染性能 */
  transition: opacity 0.2s ease-in-out;
}

.controls {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 20px; /* 增加间距 */
}

button {
  padding: 8px 16px;
  cursor: pointer;
}

.progress {
  font-size: 14px;
}

/* 添加帧率选择器样式 */
.fps-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fps-selector select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  border-radius: 4px;
}

.fade-in {
  /* animation: fadeIn 0.2s ease-in-out; */
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
