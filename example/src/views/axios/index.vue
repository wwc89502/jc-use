<template>
  <div class="about">
    About
    <button @click="getData">getData</button>
  </div>
</template>

<script setup>
import { useAxios } from '../../../../index'

const api = useAxios()
api.setAxiosHeaders({
  Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDk2NzU4OTYsInVzZXJfbmFtZSI6ImFkbWluIiwianRpIjoiZjE1MjljODgtYmVhZS00NGM0LWE2ZjEtYWM1MjdhZTNiMWM1IiwiY2xpZW50X2lkIjoiZHViaGUtY2xpZW50Iiwic2NvcGUiOlsiYWxsIl19.4t7vrFLccYFbI8nwywdwbkJIo_ntwsbZ07Lsvmf5Co0'
})

const getData = () => {
  api.getApiV1DataLabel_GroupQuery({
    params: {
      current: 1,
      size: 10,
      type: 0
    }
  })
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.error(err)
    })
}
getData()
</script>
