<template>
  <div class="about">
    <button @click="begin">begin</button>
    <button @click="stop">stop</button>
    <div class="block" :style="{ left: `${left}px` }">{{ stepRate }} | {{ count }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRAF } from '../../../../index'

let flag = true
const stepRate = ref(0)
const left = ref(0)
const count = ref(0)
const render = (rAFs) => {
  const step = 4 * stepRate.value
  if (flag) {
    if (left.value >= 200) {
      flag = false
      count.value += 1
    }
    left.value += step
  } else {
    if (left.value <= 0) {
      flag = true
      if (count.value >= 2) {
        rAFs.stop()
        return
      }
    }
    left.value -= step
  }
}
const rAF = useRAF(render)
const begin = () => {
  rAF.getFps().then(res => {
    stepRate.value = res.stepRate
    count.value = 0
    rAF.begin()
  })
}
const stop = () => {
  rAF.stop()
}
</script>
<style scoped>
.block {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 100px;
  left: 0;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  word-break: break-all;
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
}
</style>
