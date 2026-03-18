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
const bgColor = computed(() => props.bgColor || '#ff77c9')
const color = computed(() => props.color || '#ffffff')
</script>

<template>
    <button class="special-button" :disabled="disabled">
        <div class="button-edge">
            <svg
                width="12"
                height="40"
                viewBox="0 0 12 40"
                fill="#ff77c9"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M8 0H0v40h.492a6 6 0 0 0 5.204-3.014l4.712-8.212A12 12 0 0 0 12 22.802V4a4 4 0 0 0-4-4Z"
                ></path>
            </svg>
        </div>
        <span>{{ title }}</span>
    </button>
</template>

<style lang="scss" scoped>
.special-button {
    position: relative;
    border: none;
    cursor: pointer;
    padding: 0 v-bind(width) 0 0;
    background-color: transparent;
    height: v-bind(height);
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        .button-edge {
            svg {
                fill: v-bind(bgColor);
            }
        }
        span {
            background-color: v-bind(bgColor);
        }
    }

    .button-edge {
        width: v-bind(width);
        height: v-bind(height);
        position: absolute;
        right: 0.5px;
        top: 0;
        svg {
            height: 100%;
            width: 100%;
            fill: v-bind(bgColor);
        }
    }

    span {
        color: v-bind(color);
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        background-color: v-bind(bgColor);
        padding: 0 5px 0 calc(v-bind(width) + 5px);
        border-radius: 0.25rem 0 0 0.25rem;
    }
}
</style>
