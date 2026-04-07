<template>
    <div class="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
        <!-- ส่วนของ Header เปลี่ยนเป็นแก้ไขรายการ -->
        <h2 class="text-2xl font-bold mb-4 text-slate-800">แก้ไขรายการ</h2>

        <!-- สถานะกำลังรอเชื่อมต่อกับฐานข้อมูลเพื่อกวาดข้อมูลเดิมมาถมใส่กล่องหน้าเว็บ -->
        <div v-if="pending" class="text-center py-10 text-slate-400">
            กำลังดึงข้อมูลเก่า...
        </div>

        <form v-else @submit.prevent="updateTransaction" class="space-y-4">

            <!-- ส่วนของการแก้ไขจำนวนเงิน -->
            <div>
                <label class="block text-sm font-bold">จำนวนเงิน (บาท)</label>
                <input v-model="form.amount" type="number" step="0.01" class="w-full border p-2 rounded" required />
            </div>

            <!-- ส่วนของการปรับประเภท -->
            <div class="flex gap-4">
                <button @click="changeType('income')"
                    :class="['border p-1 px-4 rounded-lg transition', form.type === 'income' ? 'bg-green-500 text-white shadow' : 'text-slate-600']"
                    type="button">รายรับ</button>

                <button @click="changeType('expense')"
                    :class="['border p-1 px-4 rounded-lg transition', form.type === 'expense' ? 'bg-red-500 text-white shadow' : 'text-slate-600']"
                    type="button">รายจ่าย</button>
            </div>

            <!-- หมวดหมู่ -->
            <div>
                <label class="block text-sm font-medium">หมวดหมู่</label>
                <select v-model="form.category" class="w-full border p-2 rounded">
                    <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
            </div>

            <!-- วันที่ -->
            <div>
                <label class="block text-sm font-medium">วันที่</label>
                <input v-model="form.date" type="date" class="w-full border p-2 rounded" />
            </div>

            <div class="flex gap-2">
                <!-- ปุ่มยกเลิก เปลี่ยนใจไม่แก้แล้ว ให้กลับไปหน้าประวัติ -->
                <button type="button" @click="navigateTo('/history')" class="w-1/3 bg-slate-200 text-slate-700 p-2 rounded hover:bg-slate-300 transition font-medium">
                    ยกเลิก
                </button>
                <button type="submit" class="w-2/3 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition font-bold">
                    บันทึกการเปลี่ยนแปลง
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// การใช้ useRoute() จะเป็นการดึงค่าจาก URL มาใช้งาน
const route = useRoute()
const transactionId = route.params.id

// สร้างตัวแปร Buffer สำหรับเก็บข้อมูล
const form = ref({
    amount: 0,
    type: 'expense',
    category: '',
    date: ''
})

const categoryType = {
    "expense": ["ค่าเดินทาง", "ค่าอาหาร", "เติมเกม", "ซื้อของ", "ซื้อของ 7-11"],
    "income": ["ค่าขนม", "เงินเดือน", "ค่า TA"],
}

const availableCategories = computed(() => {
    return categoryType[form.value.type] || []
})

// ฟังก์ชันตอนคนกดสลับโหมดรายรับ รายจ่าย ให้หมวดหมู่มันเปลี่ยนตามไปด้วย
const changeType = (newType) => {
    form.value.type = newType
    form.value.category = categoryType[newType][0] // จับสลับไปเป็นตัวแรกของหมวดนั้นๆ อัตโนมัติ
}

/*
    ส่วนของการดึงข้อมูลมาแสดง
 */

// สร้างตัวแปรสำหรับการรอข้อมูลโดยมีการใช้งานผ่าน API [id].get.ts เพื่อเป็นการดึงข้อมูลที่มีอยู่แล้วจาก UserId
const { pending } = await useAsyncData(`edit-transaction-${transactionId}`, async () => {
    try {
        // ลองดึงข้อมูลจาก transactionId ที่ได้จาก URL มาตรวจสอบผ่าน API ว่ามีไหม ? ให้นำข้อมูลลงตัวแปร
        const data = await $fetch(`/api/transaction/${transactionId}`)
        form.value.amount = data.amount
        form.value.type = data.type
        form.value.category = data.category
        
        const dateObj = new Date(data.date)
        form.value.date = dateObj.toISOString().split('T')[0]
        
        return data
    } catch (err) {
        alert('ดึงข้อมูลผิดพลาด หรือท่านไม่มีสิทธิ์แก้ไข')
        navigateTo('/history') // เตะกลับไปหน้าแรกกันการแฮ็ก
    }
})

/*
    ส่วนของการแก้ไขข้อมูล
 */

// สร้าง function สำหรับการแก้ไขหรืออัพเดทข้อมูล
const updateTransaction = async () => {
    try {
        await $fetch(`/api/transaction/${transactionId}`, {
            method: 'PUT',
            body: {
                ...form.value
            }
        })
        alert('อัปเดตรายการสำเร็จ!')
        navigateTo('/history') // อัปเดตเสร็จให้วาร์ปกลับไปหน้าประวัติดูผลงาน
    } catch (err) {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    }
}
</script>
