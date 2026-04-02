// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const auth = useCookie('auth_token')

  // ถ้ายังไม่มี "ตั๋ว" (Cookie) และไม่ได้อยู่ที่หน้า Login -> ให้ดีดไปหน้า Login
  if (!auth.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  // ถ้ามี "ตั๋ว" แล้ว แต่ยังจะกลับไปหน้า Login -> ให้ส่งไปหน้าหลักพอค่ะ
  if (auth.value && to.path === '/login') {
    return navigateTo('/')
  }
}) 