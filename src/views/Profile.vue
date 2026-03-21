<script lang="ts" setup>
import {
    ShelbyClient,
    generateCommitments,
    createDefaultErasureCodingProvider,
    expectedTotalChunksets,
    ShelbyBlobClient,
} from '@shelby-protocol/sdk/browser'
import { Network, Aptos, AptosConfig } from '@aptos-labs/ts-sdk'
import { useAptosWallet } from '@/composables/useAptosWallet'
import { useToast } from '@/composables/useToast'
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Vue Router
const route = useRoute()
const router = useRouter()

// Initialize the Shelby client
const shelbyClient = new ShelbyClient({
    network: Network.TESTNET as any,
    apiKey: 'aptoslabs_ByNsZA8N5ei_FLzhZb7TaQKK1Y3M3XFPGUnL2J8PaHbBc',
})

// Initialize the Aptos client
const aptosClient = new Aptos(
    new AptosConfig({
        network: Network.TESTNET,
    }),
)

const { account, connected, signAndSubmitTransaction, triggerBalanceRefresh } = useAptosWallet()
</script>

<template>
    <div class="h-full overflow-y-scroll pt-20 pb-0.5 bg-white">
        <div>
            <div class="flex flex-col items-center gap-2">
                <div class="w-25 h-25 rounded-full overflow-hidden">
                    <img class="object-cover" src="https://i.pravatar.cc/160?img=47" alt="avatar" />
                </div>
                <p class="text-lg text-black">@lowji97</p>
                <ul class="flex gap-7 mt-2">
                    <li class="flex flex-col items-center">
                        <strong class="text-lg text-black">14</strong
                        ><span class="text-xs font-light text-gray-400">Following</span>
                    </li>
                    <li class="flex flex-col items-center">
                        <strong class="text-lg text-black">38</strong
                        ><span class="text-xs font-light text-gray-400">Followers</span>
                    </li>
                    <li class="flex flex-col items-center">
                        <strong class="text-lg text-black">91</strong
                        ><span class="text-xs font-light text-gray-400">Likes</span>
                    </li>
                </ul>
                <div class="mt-3 text-sm font-light text-gray-400">
                    Just a guy who loves sharing videos on the blockchain!
                </div>
                <div class="mt-3">
                    <button class="border border-gray-400 text-black px-5 py-2 rounded-md">
                        Edit Profile
                    </button>
                </div>
            </div>

            <div class="mt-10 grid grid-cols-3 gap-0.5">
                <div v-for="n in 18" :key="n" class="aspect-[3/4] bg-gray-200"></div>
            </div>
        </div>
    </div>
</template>
