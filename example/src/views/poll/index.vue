<template>
  <div class="about">
    Poll
    <button @click="begin">begin</button>
    <button @click="stop">stop</button>
  </div>
</template>

<script setup>
import { usePoll } from '../../../../index'

const poll = usePoll()
function fakeAjax () {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ code: 200, data: {} })
    }, 400)
  })
}
const begin = () => {
  let count = 0
  poll.begin(async () => {
    const resData = await fakeAjax()
    count++
    console.log(resData)
    console.log(count)
  }, 3000)
}
const stop = () => {
  poll.stop()
}
</script>
