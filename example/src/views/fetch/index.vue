<template>
  <div class="index">
    Index
    <input type="file" name="file" ref="fileRef">
    <button @click="getData">getData</button>
  </div>
</template>

<script setup>
import { useFetch } from '../../../../index'
import { ref } from 'vue'
const api = useFetch()
// api.setFetchHeaders({
//   Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDk2NzU4OTYsInVzZXJfbmFtZSI6ImFkbWluIiwianRpIjoiZjE1MjljODgtYmVhZS00NGM0LWE2ZjEtYWM1MjdhZTNiMWM1IiwiY2xpZW50X2lkIjoiZHViaGUtY2xpZW50Iiwic2NvcGUiOlsiYWxsIl19.4t7vrFLccYFbI8nwywdwbkJIo_ntwsbZ07Lsvmf5Co0'
// })
const fileRef = ref(null)
const getData = () => {
  // getSystemDictData_Type$Enterprise__scale
  // getApiV1StudioProject
  // const data = new FormData()
  // const file = fileRef.value.files[0]
  // data.append('file', file)
  // api.postCommonUploadAttachment({
  //   data,
  //   useUpload: true
  // })
  //   .then(res => {
  //     console.log(res)
  //   })
  //   .catch(() => {
  //     console.log()
  //   })
  // api.putBook$(1, {
  //   data: {
  //     name: '时间简史'
  //   },
  //   useForm: true
  // })
  //   .then(res => {
  //     console.log(res)
  //   })
  //   .catch(() => {
  //     console.log()
  //   })
  // api.getApiV1StudioProject({ timeout: 100 })
  //   .then(res => {
  //     console.log(res)
  //   })
  //   .catch(() => {
  //     console.log()
  //   })
}
getData()
</script>
