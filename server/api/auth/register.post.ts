import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) =>{
    const body = await readBody(event)
    const {username, password} = body
    
    // ตรวจสอบว่ามีการกรอกข้อมูล username และ password ครบไหม ? : มีการแสดงผลตอบกลับไปเป็น Error code 400
    if(!username || !password){
        throw createError({
            statusCode: 400,
            statusMessage: "กรุณากรอก username และ password ให้ครบถ้วน"
        })
    }
    // มีการใช้งาน Hash Function สำหรับการ Encrypt Password ของ User เพื่อเพิ่ม Security
    const hashedPassword = await bcrypt.hash(password, 10)

    try{
        const newUsers = await prisma.users.create({
            data: {
                username: username,
                password: hashedPassword
            },
        })
        console.log(newUsers)
        return {
            success: true,
            message: "สมัครสมาชิกสำเร็จ !",
            UserId: newUsers.id
        }
    }
    catch(error:any){
        if(error.code === 'P2002'){
            throw createError({
                statusCode: 409,
                statusMessage: "ชื่อนี้มีผู้ใช้งานแล้ว !"
            })
        }

        throw createError({
            statusCode: 500,
            statusMessage: "เกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล"
        })
    }
})

