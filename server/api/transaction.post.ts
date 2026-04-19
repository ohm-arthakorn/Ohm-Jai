/*
  API เอาไว้สำหรับการส่งข้อมูลที่ User กรอกส่งผ่าน api/transaction แล้วส่งขึ้นไปยังฐานข้อมูล
*/

export default defineEventHandler(async (event) => {

  // สร้างตัวแปรสำหรับการเก็บข้อมูลชั่วคราว 
  const body = await readBody(event)
  const { amount, type, category, date } = body 

  // อ่าน Cookie เพื่อดูว่าใครคือผู้ใช้งานปัจจุบัน auth_token คือ UserId
  const authCookie = getCookie(event, 'auth_token')
  if (!authCookie) {
    throw createError({ statusCode: 401, message: 'กรุณาเข้าสู่ระบบก่อน' })
  }
  const currentUserId = parseInt(authCookie)

  try {
    // สร้างตัวแปรที่มีการเก็บข้อมูลที่ส่งมายัง API ตัวนี้ แล้วให้ Prisma จัดการสร้างข้อมูลลงฐานข้อมูล
    const newTransaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount), // parseFloat() คือการแปลงข้อความตัวเลข ให้เป็น ตัวเลขทศนิยม
        type,
        category,
        date: new Date(date),
        UserId: currentUserId,   // ดึงไอดีที่ได้จาก Cookie มาใส่โดยอัตโนมัติ
      }
    })
    return { success: true, data: newTransaction }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'บันทึกข้อมูลไม่สำเร็จ',
    })
  }
})