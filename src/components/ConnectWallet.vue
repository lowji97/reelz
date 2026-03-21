<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useAptosWallet } from '@/composables/useAptosWallet'
import { useToast } from '@/composables/useToast'
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk'
import SpecialButton from './SpecialButton.vue'

const {
    connect,
    disconnect,
    connected,
    account,
    network,
    wallets,
    signMessage,
    isLoading,
    balanceRefreshTrigger,
} = useAptosWallet()
const toast = useToast()

const isConnecting = ref(false)
const isSigning = ref(false)
const balance = ref<string>('0')
const isLoadingBalance = ref(false)
const isDrawerOpen = ref(false)
const networkName = computed(() => {
    const name = network.value?.name?.toUpperCase()
    return name || 'Unknown'
})

// Watch connected state để fetch balance
watch(connected, (isConnected) => {
    if (isConnected) {
        fetchBalance()
    } else {
        balance.value = '0'
    }
})

// Watch balance refresh trigger để auto-refresh balance sau transaction
watch(balanceRefreshTrigger, () => {
    if (connected.value) {
        fetchBalance()
    }
})

// Fetch balance
async function fetchBalance() {
    if (!account.value?.address) {
        console.error('Failed to fetch balance: connected account not found')
        return
    }

    try {
        isLoadingBalance.value = true

        const config = new AptosConfig({
            network: Network.TESTNET,
        })
        const aptos = new Aptos(config)

        const resources = await aptos.getAccountCoinsData({
            accountAddress: account.value.address.toString(),
        })

        const shelbyUSD = resources.find(
            (coin) =>
                coin.asset_type ===
                '0x1b18363a9f1fe5e6ebf247daba5cc1c18052bb232efdc4c50f556053922d98e1',
        )

        if (shelbyUSD) {
            const aptAmount = Number(shelbyUSD.amount) / 100_000_000
            balance.value = aptAmount.toFixed(4)
        }
    } catch (error) {
        console.error('Failed to fetch balance:', error)
        balance.value = '0'
    } finally {
        isLoadingBalance.value = false
    }
}

// Handle connect
async function handleConnect() {
    const toastId = toast.loading('Connecting to wallet...')
    try {
        isConnecting.value = true

        // Find Petra wallet
        const petraWallet = wallets?.value?.find((w) => w.name === 'Petra')

        if (!petraWallet) {
            toast.update(toastId, {
                type: 'error',
                message: 'Petra wallet not found',
            })
            return
        }

        await connect(petraWallet.name)
        toast.update(toastId, {
            type: 'success',
            message: 'Connected successfully',
        })
    } catch (error: any) {
        toast.update(toastId, {
            type: 'error',
            message: error.message || 'Failed to connect wallet',
        })
    } finally {
        isConnecting.value = false
    }
}

// Handle disconnect
async function handleDisconnect() {
    const toastId = toast.loading('Disconnecting...')
    try {
        await disconnect()
        balance.value = '0'
        toast.update(toastId, {
            type: 'success',
            message: 'Disconnected successfully',
        })
    } catch (error: any) {
        toast.update(toastId, {
            type: 'error',
            message: error.message || 'Failed to disconnect wallet',
        })
    }
}

async function handleSignMessage() {
    const toastId = toast.loading('Signing message...')
    if (!account.value) {
        toast.update(toastId, {
            type: 'error',
            message: 'Connected account not found',
        })
        return
    }

    try {
        isSigning.value = true

        const message = `Prove ownership of wallet\nAddress: ${account.value.address}\nTimestamp: ${new Date().toISOString()}`
        const nonce = Math.random().toString(36).substring(7)

        const response = await signMessage({
            message,
            nonce,
        })

        toast.update(toastId, {
            type: 'success',
            message: 'Message signed successfully',
        })
    } catch (error: any) {
        toast.update(toastId, {
            type: 'error',
            message: error.message || 'Failed to sign message',
        })
    } finally {
        isSigning.value = false
    }
}

// Shorten address
function shortenAddress(address?: string): string {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}
</script>

<template>
    <div id="connect-wallet">
        <!-- Loading state -->
        <div v-if="isLoading" class="loading">
            <SpecialButton title="Connecting..." height="25px" :disabled="true" />
        </div>

        <!-- Not connected -->
        <div v-else-if="!connected" class="disconnected">
            <SpecialButton
                title="Connect"
                height="25px"
                :disabled="isConnecting"
                @click="handleConnect"
            />
        </div>

        <!-- Connected -->
        <div v-else class="connected-wrapper">
            <button
                class="flex md:hidden bg-white border border-white rounded-md h-7 w-7 items-center justify-center cursor-pointer"
                type="button"
                aria-label="Open wallet details"
                @click="isDrawerOpen = true"
            >
                <img src="@/assets/images/wallet.svg" alt="Wallet" width="16" height="16" />
            </button>

            <div
                v-if="isDrawerOpen"
                class="fixed inset-0 bg-black/50 z-40 md:hidden"
                @click="isDrawerOpen = false"
            ></div>

            <div
                class="connected flex items-center gap-2 md:flex-row transform md:transform-none fixed md:static right-0 md:right-auto w-screen md:w-auto bg-[#322311] md:bg-transparent p-4 md:p-0 flex-wrap md:flex-nowrap rounded-tl-lg rounded-tr-lg md:rounded-none translate-y-full md:translate-y-0 transition-transform duration-200 z-50"
                :class="{ 'translate-y-0': isDrawerOpen }"
            >
                <div class="network-badge flex items-center gap-2 px-2 rounded h-7 text-sm">
                    <img src="@/assets/images/globe.svg" alt="Network" width="14" height="14" />
                    <span class="text-white font-medium">{{ networkName }}</span>
                </div>

                <div
                    class="balance-badge flex items-center gap-2 border border-white px-2 rounded h-7 text-sm"
                >
                    <img
                        src="@/assets/images/shelbyUSD.svg"
                        alt="Balance"
                        width="14"
                        height="14"
                        class="bg-white p-[1px] rounded-full"
                    />
                    <span class="text-white">{{ isLoadingBalance ? '...' : balance }}</span>
                </div>

                <code
                    class="wallet-address px-2 rounded h-7 flex items-center text-sm bg-transparent md:bg-white md:text-[#322312] text-white"
                >
                    {{ shortenAddress(account?.address?.toString()) }}
                </code>

                <!-- Actions -->
                <div class="actions">
                    <button
                        @click="handleDisconnect"
                        id="disconnect-button"
                        class="bg-red-600 border-0 flex items-center justify-center rounded h-7 w-7 cursor-pointer"
                    >
                        <img
                            src="@/assets/images/logout.svg"
                            alt="Disconnect"
                            width="16"
                            height="16"
                        />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
