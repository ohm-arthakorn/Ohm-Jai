/*
  API เอาไว้สำหรับการส่งข้อมูลที่ User กรอกส่งผ่าน api/transaction แล้วส่งขึ้นไปยังฐานข้อมูล
*/

export default defineEventHandler(async (event) => {

  // สร้างตัวแปรสำหรับการเก็บข้อมูลชั่วคราว
  const body = await readBody(event)
  const { amount, type, category, date, UserId } = body

  try {
    // สร้างตัวแปรที่มีการเก็บข้อมูลที่ส่งมายัง API ตัวนี้ แล้วให้ Prisma จัดการสร้างข้อมูลลงฐานข้อมูล
    const newTransaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount), // parseFloat() คืออะไร ?
        type,
        category,
        date: new Date(date),
        UserId: parseInt(UserId),   // parseInt() คืออะไร ?
      }
    })
    return { success: true, data: newTransaction }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'บันทึกข้อมูลไม่สำเร็จค่ะโอม',
    })
  }
})