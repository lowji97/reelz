<script lang="ts" setup>
import { RouterView } from 'vue-router'
import connectWallet from '@/components/ConnectWallet.vue'
import BottomNavigationBar from '@/components/BottomNavigationBar.vue'
</script>

<template>
    <div class="relative max-w-[414px] mx-auto">
        <header
            class="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 w-full bg-black/50 backdrop-blur-sm flex items-center justify-between px-4 py-1"
        >
            <h1 class="text-2xl font-[GT_Planar] font-bold tracking-wide text-white">Reelz</h1>
            <connectWallet />
        </header>
        <main class="h-[calc(100vh-60px)]">
            <RouterView />
        </main>
        <BottomNavigationBar />
    </div>
</template>
