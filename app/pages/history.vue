<template>
    <div class="flex flex-col gap-6">
        <header>
            <h1 class="text-2xl font-bold text-slate-800">ประวัติรายการ</h1>
        </header>

        <div class="flex flex-col gap-4">
            <!-- สถานะกำลังโหลด -->
            <div v-if="pending" class="text-center py-10 text-slate-400">
                กำลังโหลดข้อมูล...
            </div>

            <!-- สถานะมีข้อผิดพลาด -->
            <div v-else-if="error" class="text-center py-10 text-red-500">
                เกิดข้อผิดพลาดในการโหลดข้อมูล
            </div>

            <!-- กรณีไม่มีข้อมูล -->
            <div v-else-if="!transactions || transactions.length === 0" class="text-center py-10 text-slate-400">
                ยังไม่มีรายการ
            </div>

            <!-- แสดงข้อมูลที่ถูกจัดกลุ่มตามวันที่ -->
            <template v-else>
                <div v-for="(group, date) in groupedTransactions" :key="date" class="flex flex-col gap-3">
                    <h3 class="text-xs font-bold text-slate-500 pl-2">{{ date }}</h3>

                    <div class="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-50">
                        <div v-for="tx in group" :key="tx.id" class="p-4 flex items-center justify-between">
                            <div class="flex items-center gap-3 w-3/4">
                                <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                                    :class="tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'">
                                    <ArrowDownRightIcon v-if="tx.type === 'income'" class="w-5 h-5" />
                                    <ArrowUpRightIcon v-else class="w-5 h-5" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <p class="font-medium text-slate-800 text-sm truncate">{{ tx.category }}</p>
                                    <p class="text-xs w-full text-slate-500 truncate" :title="tx.note">{{ tx.title ||
                                        tx.note || 'ไม่มีหมายเหตุ' }}</p>
                                </div>
                            </div>
                            <div class="text-right shrink-0 ml-2">
                                <p class="font-bold text-sm whitespace-nowrap"
                                    :class="tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'">
                                    {{ tx.type === 'income' ? '+' : '-' }}฿{{ Number(tx.amount).toLocaleString() }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowDownRight, ArrowUpRight } from 'lucide-vue-next'


const ArrowDownRightIcon = ArrowDownRight
const ArrowUpRightIcon = ArrowUpRight

// ดึงข้อมูลจาก Supabase
const supabase = useSupabaseClient()

// กำหนด Key เป็น history-transactions เพื่อไม่ให้ไปชนกับหน้า Test 
const { data: transactions, pending, error } = await useAsyncData('history-transactions', async () => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
})

// ฟังก์ชันสำหรับจัดกลุ่มข้อมูลที่ดึงมาจาก Supabase ให้เรียงตามวันที่ (เหมือนที่ Pinia เคยทำให้)
const groupedTransactions = computed(() => {
    if (!transactions.value) return {}

    const groups = {}

    transactions.value.forEach(tx => {
        // ดึงวันที่จากฟิลด์ created_at มาทำเป็น Date object
        const dateObj = new Date(tx.date)

        // จัด Format ของวันที่ให้เป็น Th อย่างสวยงาม
        const dateString = new Intl.DateTimeFormat('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric' // ใช้วิธีแสดงปีด้วย เผื่อข้อมูลมีหลายปี
        }).format(dateObj)

        // ถ้าคีย์วันที่นั้นยังไม่มีการสร้างกลุ่ม ให้สร้างขึ้นมาใหม่ (เหมือนสร้าง Array เปล่ารอรับข้อมูล)
        if (!groups[dateString]) {
            groups[dateString] = []
        }

        groups[dateString].push(tx)
    })

    return groups
})
</script>
