<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
    <div class="reels-container"></div>
</template>

<style lang="scss" scoped>
.reels-container {
    background-color: #000;
}
</style>
