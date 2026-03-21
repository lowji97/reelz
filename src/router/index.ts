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
            name: 'profile',
            component: () => import('@/views/Profile.vue'),
        },
    ],
})

export default router
