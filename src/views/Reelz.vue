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
    <div class="container">
        <template v-if="videos.length">
            <div v-for="(src, idx) in videos" :key="idx" class="reelz">
                <video :src="src" autoplay loop muted playsinline></video>
                <div class="overlay">
                    <div class="bottom">
                        <div class="content">
                            <p class="handle">@karennne · 1-28</p>
                            <div class="tags">
                                <span>#avicii</span>
                                <span>#wflove</span>
                            </div>
                            <div class="music">
                                <svg viewBox="0 0 24 24" fill="currentColor" class="music-icon">
                                    <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
                                </svg>
                                <span class="music-title">Avicii - Waiting For Love (ft.</span>
                            </div>
                        </div>
                        <div class="actions">
                            <div class="avatar-wrap">
                                <img
                                    class="avatar"
                                    src="https://i.pravatar.cc/80?img=47"
                                    alt="avatar"
                                />
                                <div class="follow-btn">+</div>
                            </div>
                            <button class="action-btn">
                                <img src="@/assets/images/heart-icon.svg" alt="like" />
                                <span>4445</span>
                            </button>
                            <button class="action-btn">
                                <img src="@/assets/images/message-icon.svg" alt="message" />
                                <span>64</span>
                            </button>
                            <button class="action-btn">
                                <img src="@/assets/images/share-icon.svg" alt="share" />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.container {
    height: 100%;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    scrollbar-width: none;
    background-color: #000;
    .reelz {
        position: relative;
        height: 100%;
        scroll-snap-align: start;

        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: flex-end;
            background: linear-gradient(
                to top,
                rgba(0, 0, 0, 1) 0%,
                rgba(0, 0, 0, 0.5) 35%,
                rgba(0, 0, 0, 0.15) 50%,
                transparent 100%
            );

            .bottom {
                width: 100%;
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                padding: 0 16px 20px;
                gap: 12px;
            }

            .content {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-direction: column;
                gap: 6px;
                color: #fff;

                .handle {
                    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
                }

                .tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;

                    span {
                        font-size: 14px;
                        font-weight: 600;
                        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
                    }
                }

                .music {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 2px;
                    overflow: hidden;

                    .music-icon {
                        width: 14px;
                        height: 14px;
                        flex-shrink: 0;
                        opacity: 0.9;
                    }

                    .music-title {
                        font-size: 13px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        opacity: 0.9;
                    }
                }
            }

            .actions {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
                flex-shrink: 0;

                .avatar-wrap {
                    position: relative;
                    margin-bottom: 4px;

                    .avatar {
                        width: 46px;
                        height: 46px;
                        border-radius: 50%;
                        border: 2px solid #fff;
                        object-fit: cover;
                        display: block;
                    }

                    .follow-btn {
                        position: absolute;
                        bottom: -10px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        background: #ea4359;
                        color: #fff;
                        font-size: 16px;
                        line-height: 18px;
                        text-align: center;
                        font-weight: 700;
                    }
                }

                .action-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #fff;
                    padding: 0;

                    img {
                        width: 32px;
                        height: 32px;
                        filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.5));
                    }

                    span {
                        font-size: 12px;
                        font-weight: 600;
                        filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.5));
                    }
                }
            }
        }
    }
}
</style>
