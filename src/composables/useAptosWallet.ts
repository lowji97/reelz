import { useWallet } from '@aptos-labs/wallet-adapter-vue'
import { ref } from 'vue'

let walletInstance: ReturnType<typeof useWallet> | null = null
const balanceRefreshTrigger = ref(0)

export function useAptosWallet() {
    if (!walletInstance) {
        walletInstance = useWallet({
            optInWallets: ['Petra'],
            onError: (error) => {
                console.error('Wallet error:', error)
            },
        })
        walletInstance.autoConnect.value = true
    }

    // Add custom method to trigger balance refresh
    const triggerBalanceRefresh = () => {
        balanceRefreshTrigger.value++
    }

    return {
        ...walletInstance,
        balanceRefreshTrigger,
        triggerBalanceRefresh,
    }
}
