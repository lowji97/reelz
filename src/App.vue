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
    padding-left: 16px;
    padding-right: 16px;
    max-width: 767px;
    margin: 0 auto;
    main {
        width: 100%;
        min-height: calc(100vh - 60px);
        background-color: grey;
    }
}
</style>
