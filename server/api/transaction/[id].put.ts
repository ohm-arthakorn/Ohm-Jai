import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // 1. รับข้อมูลจาก URL ว่าจะแก้รายการที่เท่าไหร่
  const idStr = event.context.params?.id
  const id = parseInt(idStr as string)
  
  // แกะกล่องพัสดุรับข้อมูลที่ผู้ใช้พิมพ์แก้เสร็จแล้ว (จาก Body)
  const body = await readBody(event)
  const { amount, type, category, date } = body

  // 2. อ่านป้าย Cookie ยืนยันตัวตนคนกดบันทึกแก้ไข
  const authCookie = getCookie(event, 'auth_token')
  if (!authCookie) {
    throw createError({ statusCode: 401, message: 'กรุณาเข้าสู่ระบบก่อนแก้ไข' })
  }
  const currentUserId = parseInt(authCookie)

  try {
    // 3. ป้องกันการลักไก่แก้ของคนอื่น: สแกนหาก่อนว่าเค้าเป็นเจ้าของตัวจริงไหมเหมือนเดิม
    const existingTx = await prisma.transaction.findFirst({
      where: { 
        id: id,
        UserId: currentUserId
      }
    })

    if (!existingTx) {
      throw createError({ statusCode: 404, message: 'ไม่พบรายการ หรือคุณไม่มีสิทธิ์แก้ไขบัญชีของคนอื่น' })
    }

    // 4. เมื่อผ่านการสแกนความปลอดภัย ก็สั่งอัปเดตข้อมูลใหม่ (data) เอาไปทับข้อมูลเดิม (where id) ทันที 
    const updatedTransaction = await prisma.transaction.update({
      where: { id: id },
      data: {
        amount: parseFloat(amount),
        type,
        category,
        date: new Date(date),
      }
    })

    // แจ้งหน้าบ้านว่าอัปเดตเรียบร้อย!
    return { success: true, data: updatedTransaction }

  } catch (error) {
    throw createError({ statusCode: 500, message: 'เกิดปัญหาฝั่งหลังบ้าน ไม่สามารถบันทึกการแก้ไขได้' })
  }
})
