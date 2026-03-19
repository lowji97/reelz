<script lang="ts" setup>
import { RouterView } from 'vue-router'
import connectWallet from '@/components/ConnectWallet.vue'
import BottomNavigationBar from '@/components/BottomNavigationBar.vue'
</script>

<template>
    <div class="app-container">
        <header>
            <div class="main">
                <h1 class="logo">Reelz</h1>
                <connectWallet />
            </div>
            <div class="sub">
                <a class="active">Following</a>
                <a>For You</a>
            </div>
        </header>
        <main>
            <RouterView />
        </main>
        <BottomNavigationBar />
    </div>
</template>

<style lang="scss" scoped>
.app-container {
    position: relative;
    max-width: 414px;
    margin: 0 auto;
    header {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;
        width: 100%;
        .main {
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            background: rgba(0, 0, 0, 0.5);

            .logo {
                font-size: 20px;
                font-weight: bold;
                color: #fff;
            }
        }
        .sub {
            width: 100%;
            display: flex;
            justify-content: center;
            gap: 16px;
            padding: 16px;
            a {
                color: #fff;
                opacity: 0.6;
                mix-blend-mode: difference;
                &.active {
                    opacity: 1;
                    font-weight: 700;
                }
            }
        }
    }
    main {
        height: calc(100vh - 100px);
    }
}
</style>
