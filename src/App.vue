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
    background: #fff;
    header {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        .main {
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;

            .logo {
                font-size: 20px;
                font-weight: bold;
                color: #fff;
            }
        }
    }
    main {
        height: calc(100vh - 60px);
    }
}
</style>
