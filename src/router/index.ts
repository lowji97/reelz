import { useAptosWallet } from '@/composables/useAptosWallet'
import { createRouter, createWebHistory } from 'vue-router'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'reelz',
            component: import('@/views/Reelz.vue'),
        },
        {
            path: '/:address',
            component: () => import('@/views/Profile.vue'),
            beforeEnter: async (to, from, next) => {
                const wallet = useAptosWallet()
                while (wallet.isLoading.value) {
                    await new Promise((r) => setTimeout(r, 50))
                }
                if (wallet.connected.value) {
                    next()
                } else {
                    toast.info('Please connect wallet first')
                    next({ name: 'homepage' })
                }
            },
        },
    ],
})

export default router
