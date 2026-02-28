<template>
    <div class="min-h-screen pb-20 bg-slate-50 flex flex-col relative text-slate-800 font-sans">
        <!-- Main Content Area -->
        <main class="flex-1 w-full max-w-md mx-auto relative px-4 pt-6">
            <slot />
        </main>

        <!-- Bottom Navigation Bar -->
        <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
            <div class="max-w-md mx-auto flex justify-between items-center px-6 h-16">
                <NuxtLink to="/" class="flex flex-col items-center justify-center w-full text-slate-400"
                    active-class="text-blue-600">
                    <HomeIcon class="w-6 h-6 mb-1" />
                    <span class="text-[10px] font-medium">ภาพรวม</span>
                </NuxtLink>

                <NuxtLink to="/add" class="flex flex-col items-center justify-center w-full relative group">
                    <div
                        class="absolute -top-6 bg-blue-600 rounded-full p-3 shadow-lg shadow-blue-200 text-white group-hover:bg-blue-700 transition-colors">
                        <PlusIcon class="w-7 h-7" />
                    </div>
                    <span class="text-[10px] font-medium text-slate-400 mt-6 relative top-1"
                        :class="{ 'text-blue-600': isAddRoute }">บันทึก</span>
                </NuxtLink>

                <NuxtLink to="/history" class="flex flex-col items-center justify-center w-full text-slate-400"
                    active-class="text-blue-600">
                    <HistoryIcon class="w-6 h-6 mb-1" />
                    <span class="text-[10px] font-medium">ประวัติ</span>
                </NuxtLink>
            </div>
        </nav>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'nuxt/app'
import { Home, Plus, Clock } from 'lucide-vue-next'

const route = useRoute()
const isAddRoute = computed(() => route.path === '/add')

// Renaming for template usage
const HomeIcon = Home
const PlusIcon = Plus
const HistoryIcon = Clock
</script>
