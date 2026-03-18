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
        <!-- Loading state - chờ wallet init -->
        <div v-if="isLoading" class="loading">
            <SpecialButton title="Connecting..." height="1.75rem" :disabled="true" />
        </div>

        <!-- Not connected -->
        <div v-else-if="!connected" class="disconnected">
            <SpecialButton
                title="Connect"
                height="1.75rem"
                :disabled="isConnecting"
                @click="handleConnect"
            />
        </div>

        <!-- Connected -->
        <div v-else class="connected-wrapper">
            <button
                class="drawer-toggle"
                type="button"
                aria-label="Open wallet details"
                @click="isDrawerOpen = true"
            >
                <img src="@/assets/images/wallet.svg" alt="Wallet" width="16" height="16" />
            </button>

            <div v-if="isDrawerOpen" class="drawer-backdrop" @click="isDrawerOpen = false"></div>

            <div class="connected" :class="{ 'drawer-open': isDrawerOpen }">
                <div class="network-badge">
                    <img
                        src="@/assets/images/globe.svg"
                        alt="Network"
                        class="network-icon"
                        width="14"
                        height="14"
                    />
                    <span class="network-name">{{ networkName }}</span>
                </div>

                <div class="balance-badge">
                    <img
                        src="@/assets/images/shelbyUSD.svg"
                        alt="Balance"
                        class="balance-icon"
                        width="14"
                        height="14"
                    />
                    <span class="balance-amount">{{ isLoadingBalance ? '...' : balance }}</span>
                </div>

                <code class="wallet-address">{{
                    shortenAddress(account?.address?.toString())
                }}</code>

                <!-- Actions -->
                <div class="actions">
                    <button @click="handleDisconnect" id="disconnect-button">
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

<style lang="scss" scoped>
#connect-wallet {
    #connect-button {
        background-color: #ff77c9;
        border: unset;
        border-radius: 4px;
        height: 28px;
        padding: 0 12px;
        color: #ffffff;
        cursor: pointer;
        &.connecting {
            cursor: not-allowed;
            opacity: 0.7;
        }
    }

    .connected-wrapper {
        .drawer-toggle {
            display: none;
            background-color: #ffc2e1;
            border: 1px solid #ff77c9;
            border-radius: 6px;
            height: 28px;
            width: 28px;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            @media screen and (max-width: 767px) {
                display: flex;
            }
        }

        .drawer-backdrop {
            display: none;
            @media screen and (max-width: 767px) {
                display: block;
                position: fixed;
                background: rgba(0, 0, 0, 0.4);
                z-index: 9998;
                width: 100vw;
                height: 100dvh;
                top: -11px;
                right: -17px;
            }
        }

        .connected {
            display: flex;
            align-items: center;
            gap: 8px;
            .network-badge {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 0 8px;
                border-radius: 4px;
                height: 28px;
                font-size: 12px;
                .network-name {
                    color: #ff77c9;
                    font-weight: 500;
                }
                @media screen and (max-width: 767px) {
                    padding: 0;
                    height: 28px;
                }
            }

            .balance-badge {
                display: flex;
                align-items: center;
                gap: 4px;
                border: 1px solid #ff77c9;
                padding: 0 8px;
                border-radius: 4px;
                height: 28px;
                font-size: 12px;
                .balance-icon {
                    background-color: #ffffff;
                    padding: 1px;
                    border-radius: 99px;
                }
                .balance-amount {
                    color: #ff77c9;
                }
                @media screen and (max-width: 767px) {
                    padding: 0;
                    border: unset;
                }
            }

            .wallet-address {
                background-color: #ffc2e1;
                color: #322312;
                padding: 0 8px;
                border-radius: 4px;
                font-size: 12px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                @media screen and (max-width: 767px) {
                    padding: 0;
                    background-color: transparent;
                    color: #ffffff;
                }
            }

            #disconnect-button {
                background-color: #dc3545;
                border: unset;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                height: 28px;
                width: 28px;
                cursor: pointer;
            }
            @media screen and (max-width: 767px) {
                background-color: #322311;
                padding: 16px;
                flex-wrap: wrap;
                flex-direction: column;
                border-radius: 16px 16px 0 0;
                gap: 8px;
                position: fixed;
                bottom: calc(-120px - 100dvh);
                right: -17px;
                width: 100vw;
                align-items: center;
                z-index: 9999;
                transition: bottom 0.25s ease;
                &.drawer-open {
                    bottom: calc(48px - 100dvh);
                }
            }
        }
    }
}
</style>
