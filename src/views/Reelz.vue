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
                                <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/>
                            </svg>
                            <span class="music-title">Avicii - Waiting For Love (ft.</span>
                        </div>
                    </div>
                    <div class="reel-actions">
                        <div class="avatar-wrap">
                            <img class="avatar" src="https://i.pravatar.cc/80?img=47" alt="avatar" />
                            <div class="follow-btn">+</div>
                        </div>
                        <button class="action-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            <span>4445</span>
                        </button>
                        <button class="action-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                <circle cx="9" cy="11" r="0.8" fill="currentColor" stroke="none"/>
                                <circle cx="12" cy="11" r="0.8" fill="currentColor" stroke="none"/>
                                <circle cx="15" cy="11" r="0.8" fill="currentColor" stroke="none"/>
                            </svg>
                            <span>64</span>
                        </button>
                        <button class="action-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                                <polyline points="16 6 12 2 8 6"/>
                                <line x1="12" y1="2" x2="12" y2="15"/>
                            </svg>
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
                rgba(0, 0, 0, 0.55) 0%,
                rgba(0, 0, 0, 0.15) 35%,
                transparent 60%
            );

            .reel-bottom {
                width: 100%;
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                padding: 0 12px 28px 16px;
                gap: 12px;
            }

            // ── Content (left) ──────────────────────────────────────
            .reel-content {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-direction: column;
                gap: 6px;
                color: #fff;

                .handle {
                    font-size: 15px;
                    font-weight: 700;
                    letter-spacing: 0.01em;
                    text-shadow: 0 1px 4px rgba(0,0,0,0.4);
                }

                .tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;

                    span {
                        font-size: 14px;
                        font-weight: 600;
                        text-shadow: 0 1px 4px rgba(0,0,0,0.4);
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

            // ── Actions (right) ──────────────────────────────────────
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
                        background: #fe2c55;
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

                    svg {
                        width: 32px;
                        height: 32px;
                        filter: drop-shadow(0 1px 3px rgba(0,0,0,0.5));
                    }

                    span {
                        font-size: 12px;
                        font-weight: 600;
                        text-shadow: 0 1px 3px rgba(0,0,0,0.5);
                    }
                }
            }
        }
    }
}
</style>
