<template>
  <router-view />
</template>
<script setup>
import { getCurrentInstance } from 'vue'
import { setIp } from '@/api/setIp'
const { proxy } = getCurrentInstance()
try {
  const ip = proxy.returnCitySN.cip
  setIp(ip)
    .then((res) => {
      console.log(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
} catch (error) {
  console.log(error)
}
</script>
