import liff from '@line/liff'
import { ref } from 'vue'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async (nuxtApp: any) => {
    const isLiffInit = ref(false)
    const liffProfile = ref<{ userId: string; displayName: string; pictureUrl?: string } | null>(null)
    const liffError = ref<string | null>(null)

    const initLiff = async () => {
        try {
            // Provide a mock mode if developing locally without a LIFF ID
            const liffId = import.meta.env.VITE_LIFF_ID || ''

            if (!liffId) {
                console.info('No LIFF ID found. Running in LIFF Mock mode.')
                liffProfile.value = {
                    userId: 'mock-user-id-001',
                    displayName: 'คุณโอม (Dev)',
                    pictureUrl: 'https://ui-avatars.com/api/?name=Ohm&background=eff6ff&color=2563eb&size=128'
                }
                isLiffInit.value = true
                return
            }

            await liff.init({ liffId })
            isLiffInit.value = true

            if (liff.isLoggedIn()) {
                const profile = await liff.getProfile()
                liffProfile.value = {
                    userId: profile.userId,
                    displayName: profile.displayName,
                    pictureUrl: profile.pictureUrl
                }
            } else {
                // Automatically prompt to log in when running inside LINE, or external browser
                liff.login()
            }
        } catch (err: any) {
            console.error('LIFF initialization failed', err)
            liffError.value = err.message
        }
    }

    // Auto initialize on load
    if (process.client) {
        initLiff()
    }

    return {
        provide: {
            liff: {
                isInit: isLiffInit,
                profile: liffProfile,
                error: liffError,
                login: () => liff.login(),
                logout: () => {
                    liff.logout()
                    liffProfile.value = null
                }
            }
        }
    }
})
