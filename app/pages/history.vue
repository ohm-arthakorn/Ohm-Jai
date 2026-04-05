<template>
    <div class="flex flex-col gap-6">

        <!-- ส่วนของ Header -->
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
import { ArrowDownRight, ArrowUpRight } from 'lucide-vue-next'
import { computed } from 'vue'

// สร้างตัวแปรสำหรับการเก็บ Icon ลูกศรขึ้นและลูกศรลง
const ArrowDownRightIcon = ArrowDownRight
const ArrowUpRightIcon = ArrowUpRight

// สร้าง function สำหรับการรับข้อมูลโดย API transaction.get.ts มายังตัวแปรนี้ 
const { data: transactions, pending, error } = await useAsyncData('history-all-transactions', async () => {
    /*
        $fetch คือ function สำหรับการเรียก API จาก API เส้นที่มีการเขียนเอง หรือมาจากเว็บไซต์อื่น ๆ
    */
    const response = await $fetch('/api/transaction')   // มีการดึง API จาก API '/api/transaction' แล้วมีการรอข้อมูลด้วยการใช้งาน await
    return response || []   // มีการ return ข้อมูลที่ได้รับจาก API แล้วถ้าในกรณีที่มีการ return null จะมีการคืน []
})

// สร้าง function สำหรับการส่งข้อมูลที่ได้จากการรับ API มาแทนค่าเพื่อแสดงผ่านเว็บไซต์
const groupedTransactions = computed(() => {
    /*
        computed() คือ การห่อ logic ของข้อมูลเอาไว้ แล้วค่อย return ค่าออกไป
    */
    if (!transactions.value) return {}

    // ถ้ามีข้อมูลเรามีการเอาข้อมูลมาเก็บเอาไว้ในตัวแปร acc ย่อมาจากคำว่า Accumulator (ตัวสะสม)
    return transactions.value.reduce((acc, tx) => {

        // สร้างตัวแปรสำหรับการเก็บวันที่ (Date) ที่มีการจัด format แล้วเรียบร้อย
        const dateStr = new Date(tx.date).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
        /*
            ถ้าในตัวแปร acc ยังไม่มี key วันที่ dateStr ให้สร้าง key วันที่ dateStr ขึ้นมาแล้วกำหนดให้มีค่าเป็น Array ว่าง
        */
        if (!acc[dateStr]) {
            acc[dateStr] = []
        }
        /*
            ถ้ามีอยู่แล้วก็ให้เอาค่าไม่ว่าจะเป็น income หรือ expense มาใส่ในตัวแปร acc ที่เป็นวันที่ dateStr     ที่เก็บเป็น array    
        */
        acc[dateStr].push(tx)
        return acc
    }, {})
})
</script>
