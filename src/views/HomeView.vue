<template>
  <div>
    <ImagePlayer2 />
    <ImagePlayer />
  </div>
</template>

<script>
import ImagePlayer2 from "./ImagePlayer2.vue";
import ImagePlayer from "./ImagePlayer.vue";
export default {
  components: { ImagePlayer2, ImagePlayer },
  created() {
    console.log("HomeView created");
    // 如果是localhost或者127.0.0.1，则加载ImagePlayer2，否则加载ImagePlayer
    // if (
    //   window.location.hostname === "localhost" ||
    //   window.location.hostname === "127.0.0.1"
    // ) {
    //   this.showImagePlayer2 = true;
    // }
  },
};
</script>
