export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('auth_token')

  // 1. กำหนดรายชื่อหน้าที่ "ใครก็เข้าได้" โดยไม่ต้อง Login 
  const allowedRoutes = ['/login', '/register']

  // 2. เช็คเงื่อนไข: ถ้าไม่มี Token และหน้าที่จะไปไม่อยู่ในรายการที่ยกเว้น
  if (!token.value && !allowedRoutes.includes(to.path)) {
    // เตะกลับไปที่หน้า login
    return navigateTo('/login')
  }
})