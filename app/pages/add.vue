<template>
    <div class="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
        <!-- ส่วนของ Header  -->
        <h2 class="text-2xl font-bold mb-4 text-slate-800">บันทึกรายการใหม่</h2>

        <!-- ส่วนของ form สำหรับการส่งข้อมูลรายการ e.g. รายรับ หรือรายจ่าย -->
        <form @submit.prevent="saveTransaction" class="space-y-4">

            <!-- ส่วนของการใส่จำนวนเงิน -->
            <div>
                <label class="block text-sm font-bold">จำนวนเงิน (บาท)</label>
                <input v-model="form.amount" type="number" step="0.01" class="w-full border p-2 rounded" required />
            </div>

            <!-- ส่วนของการเลือกประเภทว่าเป็นรายรับ หรือรายจ่าย -->
            <div class="flex gap-4">

                <!-- ปุ่มสำหรับการเลือกรายรับ จะมีการแสดงให้ปุ่มเป็นสีเขียว ถ้ามีการเลือกรายรับ และมีการระบุตัวแปร form.type = 'income' -->
                <button @click="form.type = 'income'"
                    :class="['border p-1 px-4 rounded-lg transition', form.type === 'income' ? 'bg-green-500 text-white shadow' : 'text-slate-600']"
                    type="button">รายรับ</button>

                <!-- ปุ่มสำหรับการเลือกรายจ่าย จะมีการแสดงให้ปุ่มเป็นสีแดง ถ้ามีการเลือกรายจ่าย และมีการระบุตัวแปร form.type = 'expense' -->
                <button @click="form.type = 'expense'"
                    :class="['border p-1 px-4 rounded-lg transition', form.type === 'expense' ? 'bg-red-500 text-white shadow' : 'text-slate-600']"
                    type="button">รายจ่าย</button>
            </div>

            <!-- ส่วนของการใส่หมวดหมู่ว่าเป็นประเภทไหน เช่น ค่าเดินทาง ค่าอาหาร -->
            <div>
                <label class="block text-sm font-medium">หมวดหมู่</label>
                <select v-model="form.category" class="w-full border p-2 rounded">
                    <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
            </div>

            <!-- ส่วนของการใส่วันที่ -->
            <div>
                <label class="block text-sm font-medium">วันที่</label>
                <input v-model="form.date" type="date" class="w-full border p-2 rounded" />
            </div>

            <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                บันทึกข้อมูล
            </button>
        </form>
    </div>
</template>

<script setup>
const auth = useCookie('auth_token')    // มีการประกาศตัวแปร auth สำหรับการดึง Cookie 
// สร้างตัวแปรชื่อ form สำหรับการเป็น Buffer ในการเก็บข้อมูล
const form = ref({
    amount: 0,          // เก็บจำนวนเงิน (บาท)
    type: 'expense',    // ประเภทของธุรกรรม e.g. รายรับ/รายจ่าย
    category: 'อาหาร',  // หมวดหมู่ของธุรกรรม e.g. ค่าเดินทาง ค่าอาหาร etc.
    date: new Date().toISOString().split('T')[0]
})

// สร้างตัวแปรประเภท object สำหรับการเก็บ array 2 ตัวที่ประกอบด้วย income (รายรับ), expense (รายจ่าย)
const categoryType = {
    "expense": ["ค่าเดินทาง", "ค่าอาหาร", "เติมเกม", "ซื้อของ", "ซื้อของ 7-11"],
    "income": ["ค่าขนม", "เงินเดือน", "ค่า TA"],
}

/*
    บรรทัดนี้จะมีการสร้างตัวแปรที่มีการเปลี่ยนแปลง array เป็นประเภทที่ได้มีการเลือก
    เช่น     ถ้า user มีการเลือก 'รายรับ' -> จะมีการเปลี่ยน form.type = 'income'
            ดังนั้น form.value.type = form.type = 'income'
            ตัวแปร availableCategories ก็จะมีการเปลี่ยนเป็น categoryType['income'] หรือ []
*/
const availableCategories = computed(() => {
    return categoryType[form.value.type] || []
})

/*
    เมื่อมีการเลือกประเภทของธุรกรรมจะมีการเลือก category ตัวแรกให้เสมอ
*/
watch(() => form.value.type, (newType) => {
    form.value.category = categoryType[newType][0]
}, { immediate: true })

// ฟังก์ชันสำหรับการส่งข้อมูลไปยัง API Transaction เพื่อบันทึกข้อมูลลงฐานข้อมูล
const saveTransaction = async () => {
    try {
        const response = await $fetch('/api/transaction', {
            method: 'POST',
            body: {
                ...form.value,
                UserId: 4   // ในอนาคตควรจะมีการดึงข้อมูล Users จาก Session/Cookie 
            }
        })
        alert('บันทึกรายการสำเร็จ !')
    } catch (err) {
        alert(err)
    }
}
</script>
