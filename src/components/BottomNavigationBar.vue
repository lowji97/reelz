<script lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
</script>

<template>
    <div class="bottom-nav-bar">
        <router-link :to="'/'" class="nav-item">
            <img src="@/assets/images/home-icon.svg" alt="Home" class="nav-icon" />
            <span>Home</span>
        </router-link>
        <button class="main-upload">Upload</button>
        <router-link :to="'/profile'" class="nav-item">
            <img src="@/assets/images/profile-icon.svg" alt="Profile" class="nav-icon" />
            <span>Profile</span>
        </router-link>
    </div>
</template>

<style lang="scss" scoped>
.bottom-nav-bar {
    min-height: 60px;
    padding: 8px 16px;
    background-color: #000;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        .nav-icon {
            width: 20px;
            height: 20px;
        }
        span {
            color: #fff;
            font-size: 10px;
            font-weight: 300;
        }
    }

    .main-upload {
        background-color: #fff;
        color: #000;
        border-radius: 30px;
        padding: 8px 16px;
        font-weight: bold;
        border: none;
        cursor: pointer;

        &:hover {
            background-color: #eee;
        }
    }
}
</style>
