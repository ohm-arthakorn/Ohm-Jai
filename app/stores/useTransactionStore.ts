import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export interface Transaction {
    id: string
    type: 'income' | 'expense'
    amount: number
    category: string
    note?: string
    date: string
}

export const useTransactionStore = defineStore('transactions', () => {
    const transactions = ref<Transaction[]>([])
    const isHydrated = ref(false)

    // Initialize from LocalStorage
    if (process.client) {
        const saved = localStorage.getItem('budget_transactions')
        if (saved) {
            try {
                transactions.value = JSON.parse(saved)
            } catch (e) {
                console.error('Failed to parse transactions', e)
            }
        }
        isHydrated.value = true
    }

    // Save to LocalStorage whenever transactions change
    watch(transactions, (newVal) => {
        if (process.client) {
            localStorage.setItem('budget_transactions', JSON.stringify(newVal))
        }
    }, { deep: true })

    // Computed properties
    const totalIncome = computed(() => {
        return transactions.value
            .filter((t: Transaction) => t.type === 'income')
            .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0)
    })

    const totalExpense = computed(() => {
        return transactions.value
            .filter((t: Transaction) => t.type === 'expense')
            .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0)
    })

    const balance = computed(() => {
        return totalIncome.value - totalExpense.value
    })

    const recentTransactions = computed(() => {
        return [...transactions.value]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    })

    const groupedTransactions = computed(() => {
        const groups: Record<string, Transaction[]> = {}
        const sorted = [...recentTransactions.value]

        sorted.forEach((tx: Transaction) => {
            const d = new Date(tx.date)
            const dateStr = d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
            if (!groups[dateStr]) {
                groups[dateStr] = []
            }
            groups[dateStr].push(tx)
        })
        return groups
    })

    // Actions
    function addTransaction(transaction: Omit<Transaction, 'id' | 'date'>) {
        transactions.value.push({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...transaction
        })
    }

    function deleteTransaction(id: string) {
        transactions.value = transactions.value.filter(t => t.id !== id)
    }

    return {
        transactions,
        isHydrated,
        totalIncome,
        totalExpense,
        balance,
        recentTransactions,
        groupedTransactions,
        addTransaction,
        deleteTransaction
    }
})
