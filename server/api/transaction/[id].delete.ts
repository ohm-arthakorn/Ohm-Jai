import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // รับข้อมูลจาก URL ที่ได้มีการส่งผ่าน API มาแล้วทำการนำ id ของรายการที่ได้มาเปลี่ยนแปลงเป็นตัวเลข
  const idStr = event.context.params?.id
  const id = parseInt(idStr as string)

  // ตรวจสอบ User ว่าไม่มีการล็อกอินไหม ? ให้ส่ง Error พร้อมกับให้ Login ใหม่
  const authCookie = getCookie(event, 'auth_token')
  if (!authCookie) {
    throw createError({ statusCode: 401, message: 'กรุณาเข้าสู่ระบบก่อนทำการลบ' })
  }
  const currentUserId = parseInt(authCookie)

  try {
    // ทำการหาข้อมูลรายการธุรกรรมของ User โดยทำการตรวจสอบ 2 อย่าง 1.id ของรายการธุรกรรม 2.UserId
    const existingTx = await prisma.transaction.findFirst({
      where: { 
        id: id,
        UserId: currentUserId 
      }
    })

    // หาข้อมูลไม่เจอ ? ให้ส่ง Error
    if (!existingTx) {
      throw createError({ statusCode: 404, message: 'ไม่พบรายการนี้ หรือคุณไม่มีสิทธิ์ลบ' })
    }

    // ถ้ามีข้อมูล ? ทำการลบข้อมูล
    await prisma.transaction.delete({
      where: { id: id }
    })

    // ลบเสร็จส่งสัญญาณกลับบอกหน้าบ้านว่าสำเร็จ
    return { success: true, message: 'ลบข้อมูลเสร็จสิ้นเรียบร้อย' }

  } catch (error) {
    throw createError({ statusCode: 500, message: 'เกิดปัญหาฝั่งหลังบ้าน ข้อมูลยังไม่ถูกลบ' })
  }
})
