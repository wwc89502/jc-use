<template>
  <div class="about">
    <button @click="begin">begin</button>
    <button @click="stop">stop</button>
    <div class="block" :style="{ left: `${left}px` }">{{stepRate}}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRAF } from '../../../../index'

let flag = true
const stepRate = ref(0)
const left = ref(0)
function render () {
  const step = 2 * stepRate.value
  if (flag) {
    if (left.value >= 400) {
      flag = false
    }
    left.value += step
  } else {
    if (left.value <= 0) {
      flag = true
    }
    left.value -= step
  }
}
const rAF = useRAF(render)
const begin = () => {
  rAF.getFps().then(res => {
    stepRate.value = res.stepRate
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
