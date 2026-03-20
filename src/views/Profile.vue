<script lang="ts" setup>
import {
    ShelbyClient,
    generateCommitments,
    createDefaultErasureCodingProvider,
    expectedTotalChunksets,
    ShelbyBlobClient,
} from '@shelby-protocol/sdk/browser'
import { Network, Aptos, AptosConfig } from '@aptos-labs/ts-sdk'
import { useAptosWallet } from '@/composables/useAptosWallet'
import { useToast } from '@/composables/useToast'
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SpecialButton from '@/components/SpecialButton.vue'

// Vue Router
const route = useRoute()
const router = useRouter()

// Initialize the Shelby client
const shelbyClient = new ShelbyClient({
    network: Network.TESTNET as any,
    apiKey: 'aptoslabs_ByNsZA8N5ei_FLzhZb7TaQKK1Y3M3XFPGUnL2J8PaHbBc',
})

// Initialize the Aptos client
const aptosClient = new Aptos(
    new AptosConfig({
        network: Network.TESTNET,
    }),
)

const { account, connected, signAndSubmitTransaction, triggerBalanceRefresh } = useAptosWallet()
</script>

<template>
    <div class="container">
        <div class="info">
            <img class="avatar" src="https://i.pravatar.cc/160?img=47" alt="avatar" />
            <p class="handle">@lowji97</p>
            <ul class="follow">
                <li class="col"><strong>14</strong><span>Following</span></li>
                <li class="col"><strong>38</strong><span>Followers</span></li>
                <li class="col"><strong>91</strong><span>Likes</span></li>
            </ul>
            <div class="bio">Just a guy who loves sharing videos on the blockchain!</div>
        </div>
        <div class="actions">
            <button class="action-btn" id="edit">Edit Profile</button>
        </div>
        <div class="gallery">
            <div class="thumb" v-for="n in 18"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    height: 100%;
    padding-top: 60px;
    padding-bottom: 1px;
    overflow-y: scroll;
}

.info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 18px 0;
}

.avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #fff;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
    background: #eee;
}

.handle {
    margin: 0;
    font-weight: 700;
    font-size: 18px;
    color: #111;
}

.follow {
    list-style: none;
    padding: 0;
    margin: 6px 0 0;
    display: flex;
    gap: 28px;
}

.follow .col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: #666;
}

.follow .col strong {
    font-size: 18px;
    color: #111;
}

.bio {
    margin-top: 10px;
    color: #9b9b9b;
    text-align: center;
    font-size: 14px;
    max-width: 340px;
}

.actions {
    display: flex;
    justify-content: center;
    margin-top: 12px;
}

.action-btn#edit {
    border: 1px solid #e6e6e6;
    background: #fff;
    padding: 10px 22px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
}

.gallery {
    margin-top: 18px;
    border-top: 1px solid #f0f0f0;
    padding-top: 8px;
}

.gallery {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
}

.thumb {
    width: 100%;
    aspect-ratio: 3/4;
    background: rgba(0, 0, 0, 0.55);
}
</style>
