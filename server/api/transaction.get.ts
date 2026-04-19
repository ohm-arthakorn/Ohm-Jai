import { prisma } from '../utils/prisma'

// สร้าง API Endpoint สำหรับดึงข้อมูลรายการธุรกรรม
export default defineEventHandler(async (event) => {
  try {
    // 1. อ่าน Cookie ที่ชื่อว่า auth_token หรือ UserId ออกมา 
    const authCookie = getCookie(event, 'auth_token')
    
    // 2. ถ้ายังไม่ได้ Login ให้โยน Error 401 กลับไป
    if (!authCookie) {
      throw createError({ statusCode: 401, message: 'กรุณาเข้าสู่ระบบก่อน' })
    }
    
    // แปลงข้อความที่อยู่ใน Cookie ให้กลายเป็นตัวเลข (Integer) ไว้ค้นหาในฐานข้อมูล
    const userId = parseInt(authCookie)

    // สร้างตัวแปรสำหรับการรอรับค่าจาก database โดยมี prisma เป็น ORM คอยจัดการให้โดยเอาข้อมูลมาหลาย ๆ ตัว
    const transactions = await prisma.transaction.findMany({
      where:{
        // ดึงข้อมูลเฉพาะของ UserId ที่ตรงกับสติ๊กเกอร์บัตรคิวที่ส่งมา
        UserId: userId
      },
      // โดยมีการเรียงลำดับจากวันที่ล่าสุดไปหาเก่าสุด
      orderBy: {
        date: 'desc'
      }
    })
    return transactions
  } catch (error) {
    console.error('Error fetching transactions:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch transactions',
    })
  }
})
