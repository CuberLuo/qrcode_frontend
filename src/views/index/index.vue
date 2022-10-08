<template>
  <van-pull-refresh
    v-model="isLoading"
    success-text="刷新成功"
    @refresh="onRefresh"
  >
    <van-overlay :show="showOverLay">
      <div class="wrapper">
        <div class="block">
          <van-loading
            class="loadingLogo"
            type="spinner"
            color="#1989fa"
            size="50px"
            text-size="20px"
            >加载中...</van-loading
          >
        </div>
      </div>
    </van-overlay>
    <van-nav-bar title="工大通行码" />

    <van-notice-bar
      left-icon="info-o"
      color="#1989fa"
      background="#ecf9ff"
      text="请支持钉钉正版浙江工业大学通行码。若因使用本站点伪通行码被查，后果自负！"
    />

    <div class="container">
      <img src="@/assets/health_code.svg" class="logo" />
    </div>

    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="username"
          label="姓名"
          label-width="5.5em"
          placeholder="姓名"
          :rules="[
            { required: true, message: '请填写姓名' },
            { validator: validatorName, message: '请填写您的真实姓名' }
          ]"
        />
        <van-field
          v-model="sno"
          type="number"
          name="sno"
          label="学号"
          label-width="5.5em"
          placeholder="学号"
          maxlength="12"
          :rules="[
            { required: true, message: '请填写学号' },
            { validator: validatorSno, message: '学号格式有误' }
          ]"
        />
        <van-field
          v-model="result"
          is-link
          readonly
          name="picker"
          label="学院"
          label-width="5.5em"
          placeholder="点击选择学院"
          @click="showPicker = true"
          :rules="[{ required: true, message: '请选择学院' }]"
        />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-picker
            :columns="columns"
            @confirm="onConfirm"
            @cancel="showPicker = false"
          />
        </van-popup>
      </van-cell-group>
      <div style="margin: 16px">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          :loading="loading"
        >
          点击获取通行码
        </van-button>
      </div>
    </van-form>
    <br />

    <van-divider
      :style="{
        color: '#1989fa',
        borderColor: '#1989fa',
        padding: '0 16px'
      }"
      class="contact"
    >
      联系作者:&nbsp;
      <van-tag plain type="primary">
        <div class="contactMe" @click="showContactDialog()">
          <img src="@/assets/telegram.svg" class="telegramLogo" />
          <span class="linkSpan">https://t.me/popZJUT</span>
        </div>
      </van-tag>
    </van-divider>
    <div class="adContainer">
      <div @click="router.push('/download')">
        <van-image width="100%" :src="getImageUrl('ad')" />
      </div>
    </div>
  </van-pull-refresh>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getQRCode } from '@/api/getQRCode'
import { Notify } from 'vant'
import 'vant/es/notify/style'
import { Toast } from 'vant'
import 'vant/es/toast/style'
import { Dialog } from 'vant'
import 'vant/es/dialog/style'
import axios from 'axios'
import router from '@/router'

const showOverLay = ref(true)
const username = ref('')
const sno = ref('')
const loading = ref(false)
//刷新相关js代码
const isLoading = ref(false)
const onRefresh = () => {
  window.location.reload()
}

const validatorName = (value) => {
  return /^[\u4e00-\u9fa5]{2,4}$/.test(value)
}
const validatorSno = (value) => {
  if (value.length != 12 && value.length != 10) {
    return false
  } else {
    if (value.length == 12) {
      const grade = Number(value.substring(0, 4))
      if (grade < 2018 || grade > new Date().getFullYear()) {
        return false
      } else {
        return true
      }
    } else if (value.length == 10) {
      if (Number(value.substring(0, 3)) != 211) {
        return false
      } else {
        return true
      }
    }
  }
}

const onSubmit = async (values) => {
  loading.value = true
  let realSno = false
  const zjut_hsurl =
    'http://mryb.zjut.edu.cn/htk/baseInfo/getQRCode?mobile=' + values.sno
  await axios
    .get(zjut_hsurl)
    .then((res) => {
      if (res.data.success === true) {
        realSno = true
      } else {
        Toast.fail('学号验证失败,请确保学号的真实性')
        loading.value = false
      }
    })
    .catch((err) => {
      Toast.fail(err)
      loading.value = false
    })
  console.log(values) //控制台打印values
  if (realSno === true) {
    getQRCode(values)
      .then((res) => {
        if (res.data.code === 10000) {
          const token = res.data.data
          const qrcode_url =
            'http://1.15.134.164:8080/qrcode/%E6%B5%99%E6%B1%9F%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E9%80%9A%E8%A1%8C%E7%A0%81.html?' +
            'username=' +
            username.value +
            '&college=' +
            result.value +
            '&token=' +
            token
          Notify({ type: 'success', message: '获取通行码成功!' })
          setTimeout(() => {
            loading.value = false
            window.location.href = qrcode_url
          }, 1000)
        } else {
          Notify({ type: 'danger', message: '获取通行码失败!' })
        }
      })
      .catch((err) => {
        Toast.fail(err)
        loading.value = false
      })
  }
}
const result = ref('')
const showPicker = ref(false)
const columns = [
  '计算机科学与技术学院、软件学院',
  '信息工程学院',
  '土木工程学院',
  '理学院',
  '管理学院',
  '经济学院',
  '教育科学与技术学院',
  '化学工程学院',
  '生物工程学院',
  '药学院 绿色制药协同创新中心',
  '环境学院',
  '材料科学与工程学院',
  '食品科学与工程学院',
  '机械工程学院',
  '人文学院',
  '外国语学院',
  '设计与建筑学院',
  '法学院',
  '国际学院',
  '健行学院',
  '公共管理学院',
  '马克思主义学院'
]

const onConfirm = (value) => {
  result.value = value
  showPicker.value = false
}

const getImageUrl = (name) => {
  return new URL(`../../assets/${name}.png`, import.meta.url).href
}

const showContactDialog = () => {
  Dialog.confirm({
    title: 'Tips',
    confirmButtonText: '是的,我想要联系作者',
    cancelButtonText: '算了,有点麻烦',
    message:
      '联系作者前请确认您的设备上安装了Telegram并配置了中国大陆外的网络代理'
  }).then(() => {
    window.location.href = 'https://t.me/popZJUT'
  })
}
onMounted(() => {
  setTimeout(() => {
    showOverLay.value = false
  }, 1000)
})
</script>

<style scoped>
.wrapper,
.loadingLogo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
/* .block {
  width: 100px;
  height: 100px;
  background-color: #fff;
} */
.container {
  display: flex;
}
.logo {
  width: 200px;
  margin: auto;
}
.contactMe {
  color: #1989fa;
}

.telegramLogo,
.linkSpan {
  vertical-align: middle;
}

.adContainer {
  margin-top: 30px;
}
</style>
