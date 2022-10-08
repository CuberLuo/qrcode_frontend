<template>
  <van-config-provider :theme="theme">
    <van-nav-bar
      title="图片加密器下载"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <!-- <van-cell
    center
    title="Github"
    value="下载方式1"
    label="https://github.com/ShuaiKeAng/photo-encryption-APP/releases"
    @click="goto1"
  />
  <van-cell
    center
    title="百度网盘(提取码:8888)"
    value="下载方式2"
    label="https://pan.baidu.com/wap/init?surl=asSjUbdX1NXp3HwyvnBinA"
    @click="goto2"
  />
  <van-cell
    center
    title="apk下载"
    value="下载方式3"
    label="https://github.com/ShuaiKeAng/photo-encryption-APP/releases/download/v1.3.0/app-release.apk"
    @click="goto3"
  /> -->
    <div class="downloadPanel">
      <div>百度网盘(提取码:8888)</div>
      <div>
        <a href="https://pan.baidu.com/wap/init?surl=asSjUbdX1NXp3HwyvnBinA"
          >https://pan.baidu.com/wap/init?surl=asSjUbdX1NXp3HwyvnBinA</a
        >
      </div>
    </div>
  </van-config-provider>
</template>

<script setup>
import { ref } from 'vue'
import router from '@/router'
import { getItem } from '@/utils/storage'
const onClickLeft = () => {
  router.push('/')
}
const theme = ref('')
theme.value = getItem('theme') || 'light'
// const goto1 = () => {
//   window.location.href =
//     'https://github.com/ShuaiKeAng/photo-encryption-APP/releases'
// }
// const goto2 = () => {
//   window.location.href =
//     'https://pan.baidu.com/wap/init?surl=asSjUbdX1NXp3HwyvnBinA'
// }
// const goto3 = () => {
//   window.location.href =
//     'https://github.com/ShuaiKeAng/photo-encryption-APP/releases/download/v1.3.0/app-release.apk'
// }
</script>

<style scoped>
.downloadPanel {
  background-color: aliceblue;
}
</style>
