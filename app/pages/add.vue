<template>
    <div class="flex flex-col h-full gap-6">
        <header>
            <h1 class="text-2xl font-bold text-slate-800">บันทึกรายการ</h1>
        </header>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-1 flex mb-2">
            <button @click="form.type = 'expense'" disabled
                class="flex-1 py-2 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                :class="form.type === 'expense' ? 'bg-red-50 text-red-600' : 'text-slate-500 hover:bg-slate-50'">
                รายจ่าย
            </button>
            <button @click="form.type = 'income'" disabled
                class="flex-1 py-2 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                :class="form.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50'">
                รายรับ
            </button>
        </div>

        <form @submit.prevent="saveTransaction" class="flex flex-col gap-5 flex-1 pb-10">
            <!-- Amount -->
            <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">จำนวนเงิน (บาท)</label>
                <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">฿</span>
                    <input v-model="form.amount" type="number" placeholder="0.00" required
                        class="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-2xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" />
                </div>
            </div>

            <!-- Category -->
            <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">หมวดหมู่</label>
                <select v-model="form.category" required
                    class="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
                    <option value="" disabled>เลือกหมวดหมู่</option>
                    <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
            </div>

            <!-- Note -->
            <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">จดบันทึก (ตัวเลือก)</label>
                <input v-model="form.note" type="text" placeholder="เช่น ค่าข้าวต้มกุ๊ย"
                    class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" />
            </div>

            <!-- Submit -->
            <button type="submit" disabled
                class="mt-auto w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                :class="form.type === 'expense' ? 'bg-red-500 hover:bg-red-600 shadow-red-200 focus:ring-red-500' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200 focus:ring-emerald-500'">
                บันทึกรายการ
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'nuxt/app'
import { useTransactionStore } from '~/stores/useTransactionStore'

const router = useRouter()
const store = useTransactionStore()

const form = ref({
    type: 'expense',
    amount: '',
    category: '',
    note: ''
})

const expenseCategories = ['อาหาร', 'เดินทาง', 'ช้อปปิ้ง', 'บิล/ค่าใช้จ่าย', 'สุขภาพ', 'อื่นๆ']
const incomeCategories = ['เงินเดือน', 'ธุรกิจ', 'โบนัส', 'อื่นๆ']

const availableCategories = computed(() => {
    return form.value.type === 'expense' ? expenseCategories : incomeCategories
})

const saveTransaction = () => {
    if (!form.value.amount || !form.value.category) return

    store.addTransaction({
        type: form.value.type,
        amount: Number(form.value.amount),
        category: form.value.category,
        note: form.value.note
    })

    router.push('/')
}
</script>
