<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
    <div class="scroller">
        <div class="reel-container">
            <video src="@/assets/images/demo1.mp4" autoplay loop muted playsinline></video>
            <div class="reel-overlay">
                <div class="reel-bottom">
                    <div class="reel-content">
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
                    <div class="reel-actions">
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
        <div class="reel-container">
            <video src="@/assets/images/demo2.mp4" autoplay loop muted playsinline></video>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.scroller {
    height: 100%;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    scrollbar-width: none;

    .reel-container {
        position: relative;
        height: 100%;
        scroll-snap-align: start;

        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .reel-overlay {
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

            .reel-bottom {
                width: 100%;
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                padding: 0 16px 20px;
                gap: 12px;
            }

            .reel-content {
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

            .reel-actions {
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
