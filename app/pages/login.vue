<!-- ส่วนของ Frontend แสดงหน้าจอ Login -->
<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">

      <!-- ส่วนของ header -->
      <h1 class="text-3xl font-bold text-center py-2">💸</h1>
      <h2 class="text-2xl font-bold text-center mb-8">เข้าสู่ระบบ</h2>

      <!-- ส่วนสำหรับการกรอก username และ password -->
      <form action="" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <input v-model="username" type="text" placeholder="Username" class="w-full p-3 border rounded" />
          <input v-model="password" type="password" placeholder="Password" class="w-full p-3 border rounded" />

          <!-- ส่วนที่จะแสดงเมื่อ username และ password ไม่ถูกต้อง -->
          <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>

          <!-- ปุ่มสำหรับการส่งข้อมูล username และ password -->
          <button @click="handleLogin" :disabled="loading"
            class="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
            {{ loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<!-- ส่วนของ Backend ทำหน้าที่จัดการเรื่องของระบบ Login -->
<script setup lang="ts">

/*
  มีการกำหนดให้ไม่ใช้งาน layout ใน nuxt
*/
definePageMeta({
  layout: false
})

// สร้างตัวแปรสำหรับการเก็บข้อมูล username และ password 
const username = ref('')
const password = ref('')
const errorMessage = ref('')  // สร้างตัวแปรสำหรับการเก็บข้อความ error
const loading = ref(false)    // กำหนดให้ state การ login = false เพื่อเป็นการยืนยันว่ายังไม่ได้มีการ login

/*  
    function สำหรับการส่งข้อมูลไปยังเส้น API login.post.ts 
    ที่ทำหน้าที่จัดการเรื่องของการ Login จะมีการตรวจสอบ username และ password
*/
const handleLogin = async () => {
  loading.value = true    // กำหนดให้ state การ login = true => มีการล็อกอิน
  errorMessage.value = ''

  try {
    const data = await $fetch('/api/auth/login', {
      // มีการใช้งาน $fetch เพื่อเป็นการใช้งาน HTTPS Request เพื่อใช้งานรูปแบบ POST ไปยัง API = login.post.ts
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      }
    })

    if (data.success) {
      // ถ้าการตรวจสอบ username และ password ถูกต้องไหม ? ประกาศตัวแปรชื่อ authCookie สำหรับการเก็บ session ในการ login
      const authCookie = useCookie('auth_token')
      authCookie.value = 'authenticated'

      // จากนั้นจะทำการส่ง user ไปยังหน้า index.vue
      navigateTo('/')
    }
  } catch (error: any) {
    // ถ้ามีการตรวจสอบ username และ password ไม่ถูกต้อง จะมีการ return error ไป
    errorMessage.value = 'กรุณาตรวจสอบ username และ password อีกครั้ง !'
  } finally {
    // ไม่ว่าจะมีการล็อกอินสำเร็จ หรือไม่สำเร็จ จะมีการทำให้ state login = false อีกครั้ง
    loading.value = false
  }
}
</script>