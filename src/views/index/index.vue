<template>
  <van-config-provider :theme="theme">
    <van-popup
      round
      :style="{ height: '75%' }"
      v-model:show="show"
      :close-on-click-overlay="false"
    >
      <div class="close_icon_container">
        <van-icon
          name="close"
          color="#c8c9cc"
          size="2rem"
          @click="closePopup"
        />
      </div>
      <div class="bot_introduce">
        <div>
          本站点推荐社工人肉查询机器人:
          <a class="sgk" href="http://t.me/TMDSGKBOT?start=SGK_CA3R2UDY"
            >@TMDSGKBOT</a
          >
        </div>
        <div>
          点击下方链接免费使用(使用前请确认您的设备上安装了Telegram并配置了中国大陆外的网络代理)
        </div>
        <div>
          免费社工库:
          <a class="sgk" href="http://t.me/TMDSGKBOT?start=SGK_CA3R2UDY"
            >http://t.me/TMDSGKBOT?start=SGK_CA3R2UDY</a
          >
        </div>
      </div>

      <div class="TMDSGK_img_container">
        <img class="TMDSGK_img" src="../../assets/TMDSGK.png" width="300" />
      </div>
    </van-popup>
    <van-pull-refresh
      v-model="isLoading"
      success-text="刷新成功"
      @refresh="onRefresh"
    >
      <!-- <van-overlay :show="showOverLay">
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
      </van-overlay> -->
      <van-nav-bar title="工大通行码">
        <template #right>
          <van-switch
            v-model="openDarkTheme"
            active-color="#2c2c2c"
            inactive-color="#dcdee0"
            @update:model-value="onUpdateSwitchValue"
          >
            <template #node>
              <div class="icon-wrapper">
                <!-- <van-icon :name="openDarkTheme ? 'success' : 'cross'" /> -->
                <van-icon
                  :class="
                    'iconfont ' + (openDarkTheme ? 'icon-moon' : 'icon-sunny')
                  "
                  :class-prefix="openDarkTheme ? 'moon' : 'sunny'"
                />
              </div>
            </template>
          </van-switch>
        </template>
      </van-nav-bar>

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
            label-width="4.5em"
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
            label-width="4.5em"
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
            label-width="4.5em"
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
  </van-config-provider>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getQRCode } from '@/api/getQRCode'
import { showNotify } from 'vant'
import 'vant/es/notify/style'
import { showFailToast } from 'vant'
import 'vant/es/toast/style'
import { showDialog, showConfirmDialog } from 'vant'
import 'vant/es/dialog/style'
import axios from 'axios'
import router from '@/router'
import { setItem, getItem } from '@/utils/storage'

const show = ref(true)
const closePopup = () => {
  show.value = false
}

const theme = ref('')
theme.value = getItem('theme') || 'light'
const openDarkTheme = ref()
openDarkTheme.value = theme.value === 'dark' ? true : false
if (theme.value === 'dark') {
  document.documentElement.style.setProperty(
    '--van-switch-node-background',
    '#cfd3dc'
  )
}
const onUpdateSwitchValue = (newValue) => {
  openDarkTheme.value = newValue
  if (newValue === true) {
    theme.value = 'dark'
    document.documentElement.style.setProperty(
      '--van-switch-node-background',
      '#cfd3dc'
    )
    setItem('theme', 'dark')
  } else {
    theme.value = 'light'
    document.documentElement.style.setProperty(
      '--van-switch-node-background',
      'var(--van-white)'
    )
    setItem('theme', 'light')
  }
}

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
        showFailToast('学号验证失败,请确保学号的真实性')
        loading.value = false
      }
    })
    .catch((err) => {
      showFailToast(err)
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
          showNotify({ type: 'success', message: '获取通行码成功!' })
          setTimeout(() => {
            loading.value = false
            window.location.href = qrcode_url
          }, 1000)
        } else {
          showNotify({ type: 'danger', message: '获取通行码失败!' })
        }
      })
      .catch((err) => {
        showFailToast(err)
        loading.value = false
      })
  }
}
const result = ref('')
const showPicker = ref(false)
const columns = [
  {
    text: '计算机科学与技术学院、软件学院',
    value: '计算机科学与技术学院、软件学院'
  },
  { text: '信息工程学院', value: '信息工程学院' },
  { text: '土木工程学院', value: '土木工程学院' },
  { text: '理学院', value: '理学院' },
  { text: '管理学院', value: '管理学院' },
  { text: '经济学院', value: '经济学院' },
  { text: '教育科学与技术学院', value: '教育科学与技术学院' },
  { text: '化学工程学院', value: '化学工程学院' },
  { text: '生物工程学院', value: '生物工程学院' },
  { text: '药学院 绿色制药协同创新中心', value: '药学院 绿色制药协同创新中心' },
  { text: '环境学院', value: '环境学院' },
  { text: '材料科学与工程学院', value: '材料科学与工程学院' },
  { text: '食品科学与工程学院', value: '食品科学与工程学院' },
  { text: '机械工程学院', value: '机械工程学院' },
  { text: '人文学院', value: '人文学院' },
  { text: '外国语学院', value: '外国语学院' },
  { text: '法学院', value: '法学院' },
  { text: '国际学院', value: '国际学院' },
  { text: '健行学院', value: '健行学院' },
  { text: '公共管理学院', value: '公共管理学院' },
  { text: '马克思主义学院', value: '马克思主义学院' }
]

const onConfirm = ({ selectedOptions }) => {
  result.value = selectedOptions[0].text
  showPicker.value = false
}

const getImageUrl = (name) => {
  return new URL(`../../assets/${name}.png`, import.meta.url).href
}

const showContactDialog = () => {
  // showConfirmDialog({
  //   title: 'Tips',
  //   confirmButtonText: '是的,我想要联系作者',
  //   cancelButtonText: '算了,有点麻烦',
  //   message:
  //     '联系作者前请确认您的设备上安装了Telegram并配置了中国大陆外的网络代理'
  // }).then(() => {
  //   window.location.href = 'https://t.me/popZJUT'
  // })
  showDialog({
    message: '作者暂时失联'
  })
}
// onMounted(() => {
//   setTimeout(() => {
//     showOverLay.value = false
//   }, 1000)
// })
</script>

<style scoped>
.close_icon_container {
  display: flex;
  justify-content: flex-end;
  margin: 10px 20px 0 0;
}

.sgk {
  color: #1296db;
}

.bot_introduce {
  margin: 20px 20px 20px 20px;
  color: #f32828;
}
.TMDSGK_img_container {
  display: flex;
  justify-content: center;
}

.wrapper,
.loadingLogo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
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
