<script lang="ts" setup>
import { RouterView } from 'vue-router'
import connectWallet from '@/components/ConnectWallet.vue'
import BottomNavigationBar from '@/components/BottomNavigationBar.vue'
</script>

<template>
    <div class="app-container">
        <main>
            <RouterView />
        </main>
        <BottomNavigationBar />
    </div>
</template>

<style lang="scss" scoped>
.app-container {
    max-width: 414px;
    margin: 0 auto;
    main {
        height: calc(100vh - 60px);
    }
}
</style>
