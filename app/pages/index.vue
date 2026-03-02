<template>
    <div class="flex flex-col gap-6">
        <!-- Header -->
        <header class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">
                    สวัสดี, {{ UserName || 'ผู้ใช้' }}
                </h1>
                <p class="text-sm text-slate-500">สรุปค่าใช้จ่ายเดือนนี้</p>
            </div>
            <div
                class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                <img v-if="liffProfile?.pictureUrl" :src="liffProfile.pictureUrl" alt="Profile"
                    class="w-full h-full object-cover" />
                <span v-else>{{ liffProfile?.displayName?.charAt(0) || 'O' }}</span>
            </div>
        </header>

        <!-- Summary Card -->
        <section
            class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
            <div class="mb-4">
                <p class="text-blue-100 text-sm mb-1">ยอดคงเหลือรวม</p>
                <h2 class="text-4xl font-bold">฿{{ balance }}</h2>
            </div>
            <div class="flex gap-4 pt-4 border-t border-blue-500/50">
                <div class="flex-1">
                    <p class="text-blue-200 text-xs mb-1">รายรับ</p>
                    <p class="font-semibold text-sm">฿{{ income }}</p>
                </div>
                <div class="flex-1">
                    <p class="text-blue-200 text-xs mb-1">รายจ่าย</p>
                    <p class="font-semibold text-sm">฿{{ expense }}</p>
                </div>
            </div>
        </section>

        <!-- Recent Transactions -->
        <section>
            <div class="flex justify-between items-end mb-4">
                <h3 class="font-bold text-slate-800">รายการล่าสุด</h3>
                <NuxtLink to="/history" class="text-xs text-blue-600 font-medium">ดูทั้งหมด</NuxtLink>
            </div>

            <div class="flex flex-col gap-3">
                <!-- Empty State -->
                <div v-if="!transactions?.length" class="text-center py-8 text-slate-400 text-sm">
                    ยังไม่มีรายการบันทึก
                </div>

                <!-- List -->
                <div v-for="tx in transactions" :key="tx.id"
                    class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center"
                            :class="tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'">
                            <ArrowDownRightIcon v-if="tx.type === 'income'" class="w-5 h-5" />
                            <ArrowUpRightIcon v-else class="w-5 h-5" />
                        </div>
                        <div>
                            <p class="font-medium text-slate-800 text-sm">{{ tx.title }}</p>
                            <p class="text-xs text-slate-500">{{ tx.note || 'ไม่มีหมายเหตุ' }}</p>
                        </div>
                    </div>
                    <p class="font-bold text-sm" :class="tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'">
                        {{ tx.type === 'income' ? '+' : '-' }}฿{{ tx.amount }}
                    </p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ArrowDownRight, ArrowUpRight } from 'lucide-vue-next'
import { useTransactionStore } from '~/stores/useTransactionStore'
import { ref, computed } from 'vue'
import { useNuxtApp } from 'nuxt/app'

const ArrowDownRightIcon = ArrowDownRight
const ArrowUpRightIcon = ArrowUpRight
const UserName = "Ohm"

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

const income = computed(() => {
    if (!transactions.value) return 0
    return transactions.value.reduce((acc, tx) => tx.type === 'income' ? acc + tx.amount : acc, 0)
})

const expense = computed(() => {
    if (!transactions.value) return 0
    return transactions.value.reduce((acc, tx) => tx.type !== 'income' ? acc + tx.amount : acc, 0)
})

const balance = computed(() => income.value - expense.value)

</script>
