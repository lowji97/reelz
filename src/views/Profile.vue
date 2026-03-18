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
import avatarDefault from '@/assets/images/avatar-default.svg'
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
const toast = useToast()

const isUploading = ref(false)
const isUploadingAvatar = ref(false)
const isDragging = ref(false)
const isError = ref(true)
const isLoadingInfo = ref(true)
const isLoadingAvatar = ref(true)

const userAvatar = ref<string>('')
const avatarTmp = ref<string>('')
const avatarFile = ref<File | null>(null)

const userInfo = reactive({
    name: '',
    desc: '',
    socials: {
        x: '',
        discord: '',
        tg: '',
        github: '',
    },
})

const savedUserInfo = ref({
    name: '',
    desc: '',
    socials: {
        x: '',
        discord: '',
        tg: '',
        github: '',
    },
})

const syncSavedUserInfo = () => {
    savedUserInfo.value = {
        name: userInfo.name,
        desc: userInfo.desc,
        socials: {
            x: userInfo.socials.x,
            discord: userInfo.socials.discord,
            tg: userInfo.socials.tg,
            github: userInfo.socials.github,
        },
    }
}

const isUserInfoDirty = computed(() => {
    return (
        userInfo.name !== savedUserInfo.value.name ||
        userInfo.desc !== savedUserInfo.value.desc ||
        userInfo.socials.x !== savedUserInfo.value.socials.x ||
        userInfo.socials.discord !== savedUserInfo.value.socials.discord ||
        userInfo.socials.tg !== savedUserInfo.value.socials.tg ||
        userInfo.socials.github !== savedUserInfo.value.socials.github
    )
})

const validationErrors = reactive({
    name: '',
    desc: '',
    x: '',
    discord: '',
    tg: '',
    github: '',
})

const avatarNameSuffix = computed(() => {
    if (!userAvatar.value) return ''
    const regex = /(shelbio\/avatar_[a-zA-Z0-9_]+\.(?:jpg|jpeg|png))/i
    const match = userAvatar.value.match(regex)
    return match ? match[1] : ''
})

// Find blob by keyword prefix
const handleFindBlob = async (walletAddress: string, keyword: string): Promise<string | null> => {
    try {
        const blobs = await shelbyClient.coordination.getAccountBlobs({
            account: walletAddress as any,
        })
        const foundBlob = blobs.find((b) => b.name.includes(keyword))

        if (!foundBlob) return null

        const blobName = foundBlob.name
        const suffixMatch = blobName.match(/\/(shelbio\/.+)$/)
        const result = suffixMatch?.[1] ?? null

        return result
    } catch (error) {
        console.error('Error finding blob:', error)
        return null
    }
}

const handleViewBio = () => {
    const address = account.value?.address?.toString()
    if (!address) {
        toast.info('Please connect wallet first')
        return
    }
    router.push(`/bio/${address}`)
}

// Sanitize input: remove HTML and JS
const sanitizeInput = (value: string): string => {
    return value
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
        .trim()
}

// Validation functions
const validateName = (name: string): string => {
    const sanitized = sanitizeInput(name)

    if (!sanitized) {
        return 'Name is required'
    }

    if (sanitized.length > 50) {
        return 'Name must be max 50 characters'
    }

    return ''
}

const validateDesc = (desc: string): string => {
    const sanitized = sanitizeInput(desc)

    if (sanitized.length > 160) {
        return 'Description must be max 160 characters'
    }

    return ''
}

const validateSocialX = (username: string): string => {
    if (!username) return ''

    const regex = /^[A-Za-z_][A-Za-z0-9_]{0,14}$/

    if (!regex.test(username)) {
        return 'X username: 1-15 chars, letters/numbers/underscore, cannot start with number'
    }

    return ''
}

const validateSocialDiscord = (username: string): string => {
    if (!username) return ''

    const regex = /^(?!\.)(?!.*\.\.)([a-z0-9_.]{2,32})(?<!\.)$/

    if (!regex.test(username.toLowerCase())) {
        return 'Discord: 2-32 chars, lowercase letters/numbers/underscore/period, no leading/trailing/consecutive dots'
    }

    return ''
}

const validateSocialGithub = (username: string): string => {
    if (!username) return ''

    const regex = /^(?!-)(?!.*--)[A-Za-z0-9-]{1,39}(?<!-)$/

    if (!regex.test(username)) {
        return 'GitHub: 1-39 chars, letters/numbers/hyphens, no leading/trailing/consecutive hyphens'
    }

    return ''
}

const validateSocialTelegram = (username: string): string => {
    if (!username) return ''

    const regex = /^[A-Za-z][A-Za-z0-9_]{4,31}$/

    if (!regex.test(username)) {
        return 'Telegram: 5-32 chars, must start with letter, letters/numbers/underscore only'
    }

    return ''
}

// Validate individual field on input
const validateField = (field: string) => {
    switch (field) {
        case 'name':
            validationErrors.name = validateName(userInfo.name)
            break
        case 'desc':
            validationErrors.desc = validateDesc(userInfo.desc)
            break
        case 'x':
            validationErrors.x = validateSocialX(userInfo.socials.x)
            break
        case 'discord':
            validationErrors.discord = validateSocialDiscord(userInfo.socials.discord)
            break
        case 'tg':
            validationErrors.tg = validateSocialTelegram(userInfo.socials.tg)
            break
        case 'github':
            validationErrors.github = validateSocialGithub(userInfo.socials.github)
            break
    }

    // Update overall error state
    isError.value = !!(
        validationErrors.name ||
        validationErrors.desc ||
        validationErrors.x ||
        validationErrors.discord ||
        validationErrors.tg ||
        validationErrors.github
    )
}

// Handle file selection and create preview
const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    isDragging.value = true
}
const handleDragLeave = () => {
    isDragging.value = false
}
const handleFileSelect = (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error('Only JPG and PNG images are allowed!')
        return
    }

    if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB!')
        return
    }

    // Store file and create preview
    avatarFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
        avatarTmp.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
}
const handleAvatarClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/jpeg,image/png,image/jpg'
    input.onchange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) handleFileSelect(file)
    }
    input.click()
}
const handleAvatarDrop = (e: DragEvent) => {
    e.preventDefault()
    isDragging.value = false

    const file = e.dataTransfer?.files?.[0]
    if (file) handleFileSelect(file)
}
const handleCancelAvatar = () => {
    avatarTmp.value = ''
    avatarFile.value = null
}

// Delete existing blobs
const handleDeleteBlob = async (keyword: string) => {
    const toastId = toast.loading('Preparing to delete blob...')
    if (!connected.value || !account.value) {
        toast.update(toastId, {
            message: 'Please connect wallet first!',
            type: 'error',
        })
        return
    }

    if (!keyword) {
        toast.update(toastId, {
            message: 'No blob keyword provided!',
            type: 'error',
        })
        return
    }

    try {
        isUploadingAvatar.value = true
        toast.update(toastId, {
            message: 'Finding blob...',
            type: 'loading',
        })

        const walletAddress = account.value.address.toString()
        const blobNameSuffix = await handleFindBlob(walletAddress, keyword)

        if (!blobNameSuffix) {
            toast.update(toastId, {
                message: 'No blob found to delete!',
                type: 'error',
            })
            return
        }

        toast.update(toastId, {
            message: 'Submitting delete blob...',
            type: 'loading',
        })

        const deletePayload = ShelbyBlobClient.createDeleteBlobPayload({
            blobName: blobNameSuffix as string,
        })

        const deleteTransaction = { data: deletePayload as any }
        const deleteSubmitted = await signAndSubmitTransaction(deleteTransaction)

        await aptosClient.waitForTransaction({
            transactionHash: deleteSubmitted.hash,
        })

        // Refresh balance after transaction
        triggerBalanceRefresh()

        toast.update(toastId, {
            message: 'Blob deleted successfully!',
            type: 'success',
        })
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Cannot delete blob'
        toast.update(toastId, {
            message: errorMessage,
            type: 'error',
        })
    } finally {
        isUploadingAvatar.value = false
    }
}

// Handle upload avatar
const handleUploadAvatar = async () => {
    const toastId = toast.loading('Starting avatar upload...')

    if (!connected.value || !account.value) {
        toast.update(toastId, {
            message: 'Please connect wallet first!',
            type: 'error',
        })
        return
    }

    if (!avatarFile.value) {
        toast.update(toastId, {
            message: 'No avatar found!',
            type: 'error',
        })
        return
    }

    try {
        isUploadingAvatar.value = true
        // === STEP 1: Delete old blob (optional) ===
        toast.update(toastId, {
            message: 'Checking existing avatar blob...',
            type: 'loading',
        })
        const walletAddress = account.value.address.toString()
        const bioCode = `${walletAddress.slice(0, 6)}${walletAddress.slice(-4)}`
        const oldBlobName = await handleFindBlob(walletAddress, `shelbio/avatar_${bioCode}`)
        if (oldBlobName) {
            toast.update(toastId, {
                message: 'Deleting old avatar...',
                type: 'loading',
            })

            const deletePayload = ShelbyBlobClient.createDeleteBlobPayload({
                blobName: oldBlobName as string,
            })

            const deleteTransaction = { data: deletePayload as any }
            const deleteSubmitted = await signAndSubmitTransaction(deleteTransaction)

            await aptosClient.waitForTransaction({
                transactionHash: deleteSubmitted.hash,
            })
        }

        // === STEP 2: Prepare file data ===
        toast.update(toastId, {
            message: 'Processing image data...',
            type: 'loading',
        })
        const timestamp = Date.now()
        const fileExt = avatarFile.value.name.split('.').pop()
        const newBlobName = `shelbio/avatar_${bioCode}_${timestamp}.${fileExt}`

        // === STEP 3: File Encoding ===
        const arrayBuffer = await avatarFile.value.arrayBuffer()
        const fileData = new Uint8Array(arrayBuffer)
        toast.update(toastId, {
            message: 'Encoding file...',
            type: 'loading',
        })
        const provider = await createDefaultErasureCodingProvider()
        const commitments = await generateCommitments(provider, fileData)

        // === STEP 4: On-Chain Registration ===
        toast.update(toastId, {
            message: 'Registering on blockchain...',
            type: 'loading',
        })
        const payload = ShelbyBlobClient.createRegisterBlobPayload({
            account: walletAddress as any,
            blobName: newBlobName,
            blobMerkleRoot: commitments.blob_merkle_root,
            numChunksets: expectedTotalChunksets(commitments.raw_data_size),
            expirationMicros: (Date.now() + 30 * 24 * 60 * 60 * 1000) * 1000,
            blobSize: commitments.raw_data_size,
            encoding: 0,
        })

        const transaction = { data: payload as any }
        const transactionSubmitted = await signAndSubmitTransaction(transaction)

        await aptosClient.waitForTransaction({
            transactionHash: transactionSubmitted.hash,
        })

        triggerBalanceRefresh()

        // === STEP 5: RPC Upload ===
        toast.update(toastId, {
            message: 'Uploading to storage...',
            type: 'loading',
        })
        await shelbyClient.rpc.putBlob({
            account: walletAddress as any,
            blobName: newBlobName,
            blobData: fileData,
        })

        const avatarUrl = `https://api.testnet.shelby.xyz/shelby/v1/blobs/${walletAddress}/${newBlobName}`
        userAvatar.value = avatarUrl
        avatarTmp.value = ''
        avatarFile.value = null

        toast.update(toastId, {
            message: 'Avatar upload successful!',
            type: 'success',
        })
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Cannot upload avatar'
        toast.update(toastId, {
            message: errorMessage,
            type: 'error',
        })
    } finally {
        isUploadingAvatar.value = false
    }
}

// Handle upload info data
const handleUploadInfo = async () => {
    const toastId = toast.loading('Starting info upload...')
    if (!connected.value || !account.value) {
        toast.update(toastId, {
            message: 'Please connect wallet first!',
            type: 'error',
        })
        return
    }

    if (!userInfo.name) {
        toast.update(toastId, {
            message: 'Name is required!',
            type: 'error',
        })
        return
    }

    try {
        isUploading.value = true
        // === STEP 1: Delete old blob (optional) ===
        toast.update(toastId, {
            message: 'Checking existing info blob...',
            type: 'loading',
        })
        const walletAddress = account.value.address.toString()
        const bioCode = `${walletAddress.slice(0, 6)}${walletAddress.slice(-4)}`
        const oldBlobName = await handleFindBlob(walletAddress, `shelbio/info_${bioCode}`)
        if (oldBlobName) {
            toast.update(toastId, {
                message: 'Deleting old info...',
                type: 'loading',
            })

            const deletePayload = ShelbyBlobClient.createDeleteBlobPayload({
                blobName: oldBlobName as string,
            })

            const deleteTransaction = { data: deletePayload as any }
            const deleteSubmitted = await signAndSubmitTransaction(deleteTransaction)

            await aptosClient.waitForTransaction({
                transactionHash: deleteSubmitted.hash,
            })
        }

        // === STEP 2: Prepare data ===
        toast.update(toastId, {
            message: 'Preparing data...',
            type: 'loading',
        })
        const timestamp = Date.now()
        const blobName = `shelbio/info_${bioCode}_${timestamp}.json`
        const dataToUpload = {
            name: sanitizeInput(userInfo.name),
            desc: sanitizeInput(userInfo.desc),
            socials: {
                x: userInfo.socials.x,
                discord: userInfo.socials.discord.toLowerCase(),
                tg: userInfo.socials.tg,
                github: userInfo.socials.github,
            },
            owner: walletAddress,
            timestamp: timestamp,
            app: 'Shelbio-v1',
        }

        const jsonString = JSON.stringify(dataToUpload, null, 2)
        const fileData = new TextEncoder().encode(jsonString)

        // === STEP 3: File Encoding ===
        toast.update(toastId, {
            message: 'Encoding file...',
            type: 'loading',
        })
        const provider = await createDefaultErasureCodingProvider()
        const commitments = await generateCommitments(provider, fileData)

        // === STEP 4: On-Chain Registration ===
        toast.update(toastId, {
            message: 'Registering on blockchain...',
            type: 'loading',
        })
        const payload = ShelbyBlobClient.createRegisterBlobPayload({
            account: walletAddress as any,
            blobName: blobName,
            blobMerkleRoot: commitments.blob_merkle_root,
            numChunksets: expectedTotalChunksets(commitments.raw_data_size),
            expirationMicros: (Date.now() + 30 * 24 * 60 * 60 * 1000) * 1000,
            blobSize: commitments.raw_data_size,
            encoding: 0,
        })

        const transaction = {
            data: payload as any,
        }

        const transactionSubmitted = await signAndSubmitTransaction(transaction)

        await aptosClient.waitForTransaction({
            transactionHash: transactionSubmitted.hash,
        })

        triggerBalanceRefresh()

        // === STEP 5: RPC Upload ===
        toast.update(toastId, {
            message: 'Uploading to storage...',
            type: 'loading',
        })
        await shelbyClient.rpc.putBlob({
            account: walletAddress as any,
            blobName: blobName,
            blobData: fileData,
        })

        syncSavedUserInfo()

        toast.update(toastId, {
            message: 'Info data upload successful!',
            type: 'success',
        })
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Cannot upload data'
        toast.update(toastId, {
            message: errorMessage,
            type: 'error',
        })
    } finally {
        isUploading.value = false
    }
}

// Handle load info data
const handleLoadInfo = async (walletAddress: string) => {
    const toastId = toast.loading('Starting info load...')
    if (!walletAddress) {
        toast.update(toastId, {
            message: 'No address specified!',
            type: 'error',
        })
        return
    }

    try {
        toast.update(toastId, {
            message: 'Loading bio info...',
            type: 'loading',
        })
        isLoadingInfo.value = true

        const bioCode = `${walletAddress.slice(0, 6)}${walletAddress.slice(-4)}`
        const blobName = await handleFindBlob(walletAddress, `shelbio/info_${bioCode}`)

        if (!blobName) {
            toast.update(toastId, {
                message: 'Bio info not found',
                type: 'info',
            })
            return
        }

        const infoUrl = `https://api.testnet.shelby.xyz/shelby/v1/blobs/${walletAddress}/${blobName}`
        const response = await fetch(infoUrl)

        if (!response.ok) {
            toast.update(toastId, {
                message: 'Bio info not found',
                type: 'info',
            })
            return
        }

        const infoData = await response.json()
        userInfo.name = infoData.name || ''
        userInfo.desc = infoData.desc || ''
        userInfo.socials.x = infoData.socials?.x || ''
        userInfo.socials.discord = infoData.socials?.discord || ''
        userInfo.socials.tg = infoData.socials?.tg || ''
        userInfo.socials.github = infoData.socials?.github || ''
        syncSavedUserInfo()
        toast.update(toastId, {
            message: 'Bio info loaded',
            type: 'success',
        })
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Cannot load info data'
        console.error('Error loading info data:', error)
        toast.update(toastId, {
            message: errorMessage,
            type: 'error',
        })
    } finally {
        isLoadingInfo.value = false
    }
}

// Handle load avatar
const handleLoadAvatar = async (walletAddress: string) => {
    const toastId = toast.loading('Starting avatar load...')
    if (!walletAddress) {
        toast.update(toastId, {
            message: 'No address specified!',
            type: 'error',
        })
        return
    }

    try {
        toast.update(toastId, {
            message: 'Loading avatar...',
            type: 'loading',
        })
        isLoadingAvatar.value = true

        const bioCode = `${walletAddress.slice(0, 6)}${walletAddress.slice(-4)}`
        const blobName = await handleFindBlob(walletAddress, `shelbio/avatar_${bioCode}`)

        if (!blobName) {
            toast.update(toastId, {
                message: 'No avatar found',
                type: 'info',
            })
        } else {
            const avatarUrl = `https://api.testnet.shelby.xyz/shelby/v1/blobs/${walletAddress}/${blobName}`
            userAvatar.value = avatarUrl
            toast.update(toastId, {
                message: 'Avatar loaded',
                type: 'success',
            })
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Cannot load avatar'
        toast.update(toastId, {
            message: errorMessage,
            type: 'error',
        })
    } finally {
        isLoadingAvatar.value = false
    }
}

// Watch for wallet disconnect
watch(connected, (isConnected) => {
    if (!isConnected) {
        userAvatar.value = ''
        avatarTmp.value = ''
        avatarFile.value = null
        userInfo.name = ''
        userInfo.desc = ''
        userInfo.socials.x = ''
        userInfo.socials.discord = ''
        userInfo.socials.tg = ''
        userInfo.socials.github = ''
        syncSavedUserInfo()
        router.replace({ name: 'homepage' })
    }
})

// Init on mounted
onMounted(async () => {
    if (connected.value && account.value) {
        await handleLoadInfo(account.value.address.toString())
        await handleLoadAvatar(account.value.address.toString())
        isError.value = !!(
            validationErrors.name ||
            validationErrors.desc ||
            validationErrors.x ||
            validationErrors.discord ||
            validationErrors.tg ||
            validationErrors.github
        )
    } else {
        toast.info('Please connect wallet first')
        router.replace({ name: 'homepage' })
    }
})
</script>

<template>
    <div class="container">
        <h3 class="title">Build Your Profile</h3>
        <div id="bio-uploader">
            <div class="avatar">
                <div
                    class="avatar-display"
                    :class="{ 'is-dragging': isDragging }"
                    @click="handleAvatarClick"
                    @dragover="handleDragOver"
                    @dragleave="handleDragLeave"
                    @drop="handleAvatarDrop"
                >
                    <!-- Show temporary preview if exists -->
                    <img
                        v-if="avatarTmp"
                        :src="avatarTmp"
                        alt="Avatar Preview"
                        class="avatar-image"
                    />
                    <!-- Show uploaded avatar if no preview -->
                    <img
                        v-else-if="userAvatar"
                        :src="userAvatar"
                        alt="User Avatar"
                        class="avatar-image"
                    />
                    <!-- Show avatar skleton if loading -->
                    <div v-else-if="isLoadingAvatar" class="avatar-image skeleton"></div>
                    <!-- Show default placeholder -->
                    <div v-else class="default-image">
                        <img :src="avatarDefault" alt="Default Avatar" />
                        <p>Only .jpg .png</p>
                        <p>Maximum size &lt;2MB</p>
                        <p>Click or drag to upload</p>
                    </div>
                </div>
                <!-- Show buttons only when there's a preview -->
                <div v-if="avatarTmp" class="avatar-actions">
                    <SpecialButton
                        title="Upload"
                        height="1.75rem"
                        :disabled="isUploadingAvatar"
                        @click="handleUploadAvatar"
                    />
                    <SpecialButton
                        title="Cancel"
                        height="1.75rem"
                        bgColor="#DC3445"
                        :disabled="isUploadingAvatar"
                        @click="handleCancelAvatar"
                    />
                </div>
            </div>
            <div class="info">
                <div class="form-group" :class="{ 'has-error': validationErrors.name }">
                    <label>
                        <strong>Name <span class="required">*</span></strong>
                        <input
                            :class="{ skeleton: isLoadingInfo }"
                            v-model="userInfo.name"
                            @input="validateField('name')"
                            id="name"
                            type="text"
                            placeholder="Enter your name (max 50 chars)"
                            maxlength="50"
                        />
                    </label>
                    <span v-if="validationErrors.name" class="error-message">{{
                        validationErrors.name
                    }}</span>
                </div>
                <div class="form-group" :class="{ 'has-error': validationErrors.desc }">
                    <label>
                        <strong>Description</strong>
                        <textarea
                            :class="{ skeleton: isLoadingInfo }"
                            v-model="userInfo.desc"
                            @input="validateField('desc')"
                            id="description"
                            placeholder="Enter your description (max 160 chars)"
                            maxlength="160"
                        ></textarea>
                    </label>
                    <span v-if="validationErrors.desc" class="error-message">{{
                        validationErrors.desc
                    }}</span>
                </div>
                <div class="social-label">Social Media</div>
                <div class="form-group social" :class="{ 'has-error': validationErrors.x }">
                    <label for="social-x">
                        <img src="@/assets/images/social-x.svg" alt="X" width="16" height="16" />
                        <input
                            :class="{ skeleton: isLoadingInfo }"
                            v-model="userInfo.socials.x"
                            @input="validateField('x')"
                            id="social-x"
                            type="text"
                            placeholder="Enter your X handle (1-15 chars)"
                            maxlength="15"
                        />
                    </label>
                    <span v-if="validationErrors.x" class="error-message">{{
                        validationErrors.x
                    }}</span>
                </div>
                <div class="form-group social" :class="{ 'has-error': validationErrors.discord }">
                    <label for="social-discord">
                        <img
                            src="@/assets/images/social-discord.svg"
                            alt="Discord"
                            width="16"
                            height="16"
                        />
                        <input
                            :class="{ skeleton: isLoadingInfo }"
                            v-model="userInfo.socials.discord"
                            @input="validateField('discord')"
                            id="social-discord"
                            type="text"
                            placeholder="Enter your Discord username (2-32 chars)"
                            maxlength="32"
                        />
                    </label>
                    <span v-if="validationErrors.discord" class="error-message">{{
                        validationErrors.discord
                    }}</span>
                </div>
                <div class="form-group social" :class="{ 'has-error': validationErrors.tg }">
                    <label for="social-tg">
                        <img
                            src="@/assets/images/social-tg.svg"
                            alt="Telegram"
                            width="16"
                            height="16"
                        />
                        <input
                            :class="{ skeleton: isLoadingInfo }"
                            v-model="userInfo.socials.tg"
                            @input="validateField('tg')"
                            id="social-tg"
                            type="text"
                            placeholder="Enter your Telegram username (5-32 chars)"
                            maxlength="32"
                        />
                    </label>
                    <span v-if="validationErrors.tg" class="error-message">{{
                        validationErrors.tg
                    }}</span>
                </div>
                <div class="form-group social" :class="{ 'has-error': validationErrors.github }">
                    <label for="social-github">
                        <img
                            src="@/assets/images/social-github.svg"
                            alt="GitHub"
                            width="16"
                            height="16"
                        />
                        <input
                            :class="{ skeleton: isLoadingInfo }"
                            v-model="userInfo.socials.github"
                            @input="validateField('github')"
                            id="social-github"
                            type="text"
                            placeholder="Enter your GitHub username (1-39 chars)"
                            maxlength="39"
                        />
                    </label>
                    <span v-if="validationErrors.github" class="error-message">{{
                        validationErrors.github
                    }}</span>
                </div>
            </div>
            <div class="upload-wrapper">
                <SpecialButton
                    :title="isUserInfoDirty || !savedUserInfo.name ? 'Upload' : 'View'"
                    :bgColor="isUserInfoDirty || !savedUserInfo.name ? '#FF77C9' : '#FD8465'"
                    :disabled="isUploading || isLoadingInfo || (isUserInfoDirty && isError)"
                    @click="isUserInfoDirty ? handleUploadInfo() : handleViewBio()"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    max-width: 767px;
    margin: 0 auto;
    .title {
        margin-bottom: 20px;
        text-align: center;
    }
    #bio-uploader {
        .avatar {
            display: flex;
            align-items: center;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 20px;
            .avatar-display {
                width: 125px;
                height: 125px;
                background-color: #ffc2e1;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                position: relative;
                border-radius: 8px;
                border: 1px dashed #322311;
                &:has(.avatar-image) {
                    border: 1px solid transparent;
                }
                .avatar-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 8px;
                }
                .default-image {
                    text-align: center;
                    font-size: 10px;
                    color: #322311;
                    pointer-events: none;
                    border-radius: 8px;
                    img {
                        width: 48px;
                        height: 48px;
                        margin-bottom: 4px;
                    }
                    p {
                        margin: 0 0 2px;
                    }
                }
            }
            .avatar-actions {
                display: flex;
                gap: 12px;
            }
        }
        .info {
            border-radius: 8px;
            padding: 16px;
            background-color: #ffc2e1;
            .social-label {
                margin-bottom: 4px;
            }
            .form-group {
                margin-bottom: 12px;
                &:last-child {
                    margin-bottom: 0;
                }
                &.has-error input,
                &.has-error textarea {
                    border-color: #dc3545;
                }
                label {
                    font-weight: 600;
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 2px;
                    gap: 4px;
                    color: #322311;
                    .required {
                        color: #ff77c9;
                    }
                }
                .error-message {
                    color: #dc3545;
                    font-size: 12px;
                    font-weight: 300;
                    display: block;
                }
                &.social {
                    label {
                        flex-direction: row;
                        align-items: center;
                        gap: 8px;
                        &:last-child {
                            margin-bottom: 0;
                        }
                        img {
                            width: 20px;
                            height: 20px;
                            flex-shrink: 0;
                        }
                        input {
                            flex: 1;
                        }
                    }
                    .error-message {
                        margin-left: 24px;
                    }
                }
            }
        }
    }
    .upload-wrapper {
        text-align: center;
        margin-top: 20px;
    }
}
</style>
