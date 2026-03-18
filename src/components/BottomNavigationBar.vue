<script lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
</script>

<template>
    <div class="bottom-nav-bar">
        <router-link :to="'/'" class="nav-item">
            <image src="@/assets/images/home-icon.svg" alt="Home" class="nav-icon" />
            <span>Home</span>
        </router-link>
        <button class="main-upload">Upload</button>
        <router-link :to="'/profile'" class="nav-item">
            <image src="@/assets/images/profile-icon.svg" alt="Profile" class="nav-icon" />
            <span>Profile</span>
        </router-link>
    </div>
</template>

<style lang="scss" scoped>
.bottom-nav-bar {
    height: 60px;
    background-color: #000;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #fff;
        text-decoration: none;

        .nav-icon {
            width: 24px;
            height: 24px;
            margin-bottom: 4px;
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
