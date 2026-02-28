<template>
    <div class="flex flex-col gap-6">
        <header>
            <h1 class="text-2xl font-bold text-slate-800">ประวัติรายการ</h1>
        </header>

        <div class="flex flex-col gap-4">
            <div v-if="transactions.length === 0" class="text-center py-10 text-slate-400">
                ยังไม่มีรายการ
            </div>

            <div v-for="(group, date) in groupedTransactions" :key="date" class="flex flex-col gap-3">
                <h3 class="text-xs font-bold text-slate-500 pl-2">{{ date }}</h3>

                <div class="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-50">
                    <div v-for="tx in group" :key="tx.id" class="p-4 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                                :class="tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'">
                                <ArrowDownRightIcon v-if="tx.type === 'income'" class="w-5 h-5" />
                                <ArrowUpRightIcon v-else class="w-5 h-5" />
                            </div>
                            <div class="min-w-0">
                                <p class="font-medium text-slate-800 text-sm truncate">{{ tx.category }}</p>
                                <p class="text-xs text-slate-500 truncate">{{ tx.note || 'ไม่มีหมายเหตุ' }}</p>
                            </div>
                        </div>
                        <div class="text-right shrink-0 ml-2">
                            <p class="font-bold text-sm"
                                :class="tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'">
                                {{ tx.type === 'income' ? '+' : '-' }}฿{{ tx.amount.toLocaleString() }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ArrowDownRight, ArrowUpRight } from 'lucide-vue-next'
import { useTransactionStore } from '~/stores/useTransactionStore'

const ArrowDownRightIcon = ArrowDownRight
const ArrowUpRightIcon = ArrowUpRight

const store = useTransactionStore()
const { groupedTransactions, transactions } = storeToRefs(store)
</script>
