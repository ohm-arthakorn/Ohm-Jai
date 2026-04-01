import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const {username, password} = body

    const users = await prisma.users.findUnique({
        where: {username}
    })

    if(!users || !(await bcrypt.compare(password, users.password))){
        throw createError({
            statusCode: 401,
            statusMessage: "ชื่อหรือรหัสผ่านไม่ถูกต้อง"
        })
    }

    return {
        success: true,
        user: {
            id: users.id,
            username: users.username
        }
    }
})
