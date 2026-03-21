<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
    title: string
    disabled?: boolean
    height?: string
    bgColor?: string
    color?: string
}>()

const height = computed(() => props.height || '2.5rem')
const width = computed(() => `calc(${height.value} * 0.3)`)
const bgColor = computed(() => props.bgColor || '#ffffff')
const color = computed(() => props.color || '#000')
</script>

<template>
    <button
        :disabled="disabled"
        :class="[{ 'opacity-60 cursor-not-allowed': disabled }, 'relative bg-transparent p-0']"
        :style="{ height: height, paddingRight: width }"
    >
        <div class="absolute right-[0.5px] top-0" :style="{ width: width, height: height }">
            <svg
                width="12"
                height="40"
                viewBox="0 0 12 40"
                :fill="bgColor"
                xmlns="http://www.w3.org/2000/svg"
                class="w-full h-full"
            >
                <path
                    d="M8 0H0v40h.492a6 6 0 0 0 5.204-3.014l4.712-8.212A12 12 0 0 0 12 22.802V4a4 4 0 0 0-4-4Z"
                ></path>
            </svg>
        </div>
        <span
            class="text-xs flex items-center justify-center font-bold rounded-l-xs h-full"
            :style="{
                color: color,
                backgroundColor: bgColor,
                paddingLeft: `calc(${width} + 2px)`,
                paddingRight: '5px',
            }"
        >
            {{ title }}
        </span>
    </button>
</template>
