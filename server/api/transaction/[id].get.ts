import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // 1. รับ ID ของหน้าที่จะทำการแก้ไข (ตรงกับตัวเลขท้าย URL)
  const idStr = event.context.params?.id
  const id = parseInt(idStr as string)

  // 2. เช็คตัวตนคนขอดู (จากกล่อง Cookie) เพื่อความปลอดภัย
  const authCookie = getCookie(event, 'auth_token')
  if (!authCookie) {
    throw createError({ statusCode: 401, message: 'กรุณาเข้าสู่ระบบก่อน' })
  }
  const currentUserId = parseInt(authCookie)

  try {
    // 3. ดึงข้อมูลรายการจากฐานข้อมูล โดยมีเงื่อนไขล็อคว่า id ต้องตรง และ UserId ต้องเป็นของคนนี้ด้วย! ห้ามขอดูของคนอื่น!
    const transaction = await prisma.transaction.findFirst({
      where: { 
        id: id,
        UserId: currentUserId
      }
    })

    // ถ้าไม่มีข้อมูลแปลว่า มั่วเลขมา หรือไม่ใช่ของตัวเอง ระบบจะดีดออกทันที
    if (!transaction) {
      throw createError({ statusCode: 404, message: 'ไม่พบรายการที่ท่านต้องการดู หรือท่านไม่มีสิทธิ์' })
    }

    // 4. ส่งก้อนข้อมูลกลับไปให้หน้าจอ (เอาไปถมให้เต็มกล่อง input ทุกช่องในหน้า edit อัตโนมัติ)
    return transaction

  } catch (error) {
    throw createError({ statusCode: 500, message: 'เกิดปัญหาฝั่งหลังบ้าน ข้อมูลดึงไม่ได้' })
  }
})
