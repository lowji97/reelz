<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ShelbyClient } from '@shelby-protocol/sdk/browser'
import { Network } from '@aptos-labs/ts-sdk'

const shelbyClient = new ShelbyClient({
    network: Network.TESTNET as any,
    apiKey: 'aptoslabs_ByNsZA8N5ei_FLzhZb7TaQKK1Y3M3XFPGUnL2J8PaHbBc',
})

const videos = ref<string[]>([])

const handleFindBlob = async (walletAddress: string, keyword: string): Promise<string | null> => {
    try {
        const blobs = await shelbyClient.coordination.getAccountBlobs({
            account: walletAddress as any,
        })
        const foundBlob = blobs.find((b) => b.name.includes(keyword))

        if (!foundBlob) return null

        const blobName = foundBlob.name
        const suffixMatch = blobName.match(/\/(reelz\/.+)$/)
        const result = suffixMatch?.[1] ?? null

        return result
    } catch (error) {
        console.error('Error finding blob:', error)
        return null
    }
}

const _handlLoadVideo = async (walletAddress: string) => {
    if (!walletAddress) return

    try {
        const keywords = ['demo1', 'demo2']
        const foundUrls: string[] = []

        for (const k of keywords) {
            const blobName = await handleFindBlob(walletAddress, `reelz/uploads/videos/${k}`)
            console.log('Found blob name for', k, blobName)
            if (blobName) {
                const videoUrl = `https://api.testnet.shelby.xyz/shelby/v1/blobs/${walletAddress}/${blobName}`
                foundUrls.push(videoUrl)
            } else {
                console.warn(`No blob found for ${k}`)
            }
        }

        // update reactive videos array so template renders them
        videos.value = foundUrls
    } catch (error) {
        console.error('Error loading videos:', error)
    }
}

onMounted(() => {
    const demoWalletAddress = '0xe3c89c5a808a5501110bfa0bc955c49ec29c95bf853ca2948f860ff27771cc06'
    _handlLoadVideo(demoWalletAddress)
})
</script>

<template>
    <div class="h-full overflow-y-scroll snap-y snap-mandatory bg-black">
        <template v-if="videos.length">
            <div v-for="(src, idx) in videos" :key="idx" class="h-full relative snap-start">
                <video
                    :src="src"
                    autoplay
                    loop
                    muted
                    playsinline
                    class="w-full h-full object-cover"
                />

                <div
                    class="absolute inset-0 flex items-end bg-gradient-to-t from-black via-black/50 to-transparent"
                >
                    <div class="w-full flex items-end justify-between px-4 pb-5 gap-3">
                        <div class="flex-1 min-w-0 flex flex-col gap-1 text-white">
                            <p class="text-sm font-semibold drop-shadow">@karennne · 1-28</p>
                            <div
                                class="flex flex-wrap gap-2 text-sm font-semibold drop-shadow text-white/90"
                            >
                                <span>#avicii</span>
                                <span>#wflove</span>
                            </div>
                            <div
                                class="flex items-center gap-2 mt-1 text-xs text-white/90 overflow-hidden"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    class="w-3 h-3 opacity-90"
                                >
                                    <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
                                </svg>
                                <span class="text-xs truncate">Avicii - Waiting For Love (ft.</span>
                            </div>
                        </div>

                        <div class="flex flex-col items-center gap-5 flex-shrink-0">
                            <div class="relative mb-1">
                                <img
                                    class="w-11 h-11 rounded-full border-2 border-white object-cover"
                                    src="https://i.pravatar.cc/80?img=47"
                                    alt="avatar"
                                />
                                <div
                                    class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-red-500 text-white text-[14px] font-bold flex items-center justify-center"
                                >
                                    +
                                </div>
                            </div>

                            <button
                                class="flex flex-col items-center gap-1 bg-transparent border-0 p-0 text-white"
                            >
                                <img
                                    src="@/assets/images/heart-icon.svg"
                                    alt="like"
                                    class="w-8 h-8 drop-shadow"
                                />
                                <span class="text-xs font-semibold drop-shadow">4445</span>
                            </button>

                            <button
                                class="flex flex-col items-center gap-1 bg-transparent border-0 p-0 text-white"
                            >
                                <img
                                    src="@/assets/images/message-icon.svg"
                                    alt="message"
                                    class="w-8 h-8 drop-shadow"
                                />
                                <span class="text-xs font-semibold drop-shadow">64</span>
                            </button>

                            <button
                                class="flex flex-col items-center gap-1 bg-transparent border-0 p-0 text-white"
                            >
                                <img
                                    src="@/assets/images/share-icon.svg"
                                    alt="share"
                                    class="w-8 h-8 drop-shadow"
                                />
                                <span class="text-xs font-semibold drop-shadow">Share</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped></style>
