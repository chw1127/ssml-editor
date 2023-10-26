<script setup lang="ts">
import { ElSlider} from 'element-plus'
import PlayButton from './play-button.vue'
import type { CSSProperties } from 'vue'
import { reactive, ref, onUnmounted, computed, watch, onMounted } from 'vue'
import { formatTime } from '@/utils'
import { getConfig } from '@/config'
import StyleAvatar from './style-avatar.vue'
import { defaultSpeed, defaultPitch } from './data'
import { useSSMLStore, useTryPlayStore } from '@/stores'
import { defaultFilterSpeaker, type Speaker } from '@/model'
import { emitter } from '@/event-bus'
import type { Arrayable } from 'element-plus/lib/utils/typescript'

interface Mark {
  style: CSSProperties
  label: string
}

type Marks = Record<number, Mark | string>

const ssmlEditorConfig = getConfig()
const { rootProsody, rootExpressAs } = useSSMLStore()
const { category, fetchData } = ssmlEditorConfig.tryPlay
const tryPlayStore = useTryPlayStore()

const timeMax = tryPlayStore.audioPlayer.duration
const currentTime = tryPlayStore.audioPlayer.currentTime
const time = ref(0)
const isInput = ref(false)

const speedRange = ref([0, 2.0])
const speed = ref(1)

const pitchRange = ref([-10, 10])
const pitch = ref(0)

const timeMaxText = computed(() => formatTime(timeMax.value))
const timeText = computed(() => formatTime(time.value))

const speedMarks = reactive<Marks>(defaultSpeed())
const pitchMarks = reactive<Marks>(defaultPitch())

const flag = ref('')
const speakerList = ref<Speaker[]>([])

onMounted(async () => {
  await handleCategoryClick(category[0].value)
})

onMounted(() => {
  emitter.on('tryplay-speaker-update-star', handleUpdateStarTheCache)
})

onUnmounted(() => {
  emitter.off('tryplay-speaker-update-star', handleUpdateStarTheCache)
})

watch(
  () => tryPlayStore.speaker,
  (newValue) => {
    newValue.roles.length > 0 && handleRoleClick(newValue.roles[0].value)
    newValue.styles.length > 0 && handleStyleClick(newValue.styles[0].value)
  },
  { immediate: true },
)

watch(
  pitch,
  (value) => {
    rootProsody.pitch = value.toString()
  },
  { immediate: true },
)

watch(
  speed,
  (value) => {
    rootProsody.rate = value.toString()
  },
  { immediate: true },
)

watch(currentTime, (newValue) => {
  if (!isInput.value) time.value = newValue
})


function handleUpdateStarTheCache(speakerId: string, isStar: boolean) {
  const speakerCache = speakerList.value.find((v) => v.id === speakerId)
  if (speakerCache) speakerCache.isStar = isStar
}

function handleRoleClick(value: string) {
  rootExpressAs.role = value
}

function handleStyleClick(value: string) {
  rootExpressAs.style = value
}

async function handleCategoryClick(value: string) {
  flag.value = value
  try {
    speakerList.value = await fetchData({ ...defaultFilterSpeaker(), category: value })
  } catch (error) {
    emitter.emit('error', error)
  }
}


function handleTimeInput() {
  isInput.value = true
}

function handleTimeChange(time: Arrayable<number>) {
  if (!(time instanceof Array)) {
    currentTime.value = time
    tryPlayStore.audioPlayer.play()
  }
  isInput.value = false
}

</script>

<template>
  <div class="right-panle w-100 px-3 text-white" style="font-size: 1rem">
    <div class="mt-2 d-flex text-center justify-content-between align-items-center">
      <div class="me-auto d-flex flex-row align-items-center">
        <PlayButton></PlayButton>
        <div class="ms-2 d-flex flex-column justify-content-between">
          <div class="d-flex dlex-row column-gap-2 align-items-end">
            <span class="fs-6">{{ tryPlayStore.speaker.displayName }}</span>
            <span style="font-size: 0.5rem">{{ speed }}x</span>
          </div>
          <div style="font-size: 0.7rem;margin-top: 5px;">{{ tryPlayStore.speaker.name }}</div>
        </div>
      </div>
      <div class="d-flex flex-column align-items-end" style="width: 100px;">
        <div class="mt-1" style="font-size: .7em;">
          <span>{{ timeText }}</span>
          <span>/</span>
          <span>{{ timeMaxText }}</span>
        </div>
        <ElSlider
          :max="timeMax"
          v-model="time"
          size="small"
          @input="handleTimeInput"
          @change="handleTimeChange"
          :format-tooltip="formatTime"
        ></ElSlider>
      </div>
    </div>
    <div class="mt-2" style="font-size: 0.8em;">角色风格：</div>
    <div
      class="role-list mt-2 d-flex flex-row flex-wrap justify-content-start align-items-center row-gap-2 column-gap-3 p-2"
    >
      <div
        @click="handleRoleClick(item.value)"
        v-for="(item, index) in tryPlayStore.speaker.roles"
        :key="index"
        class="rounded-pill px-1"
        :class="{ 'border': item.value === (rootExpressAs.role || '') }"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="mt-2" style="font-size: 0.8em;">说话风格：</div>
    <ul
      class="mt-2 d-flex flex-row flex-wrap justify-content-start align-items-center row-gap-1 column-gap-2 p-2"
    >
      <li
        class="mx-2"
        @click="handleStyleClick(item.value)"
        v-for="(item, index) in tryPlayStore.speaker.styles"
        :key="index"
      >
        <StyleAvatar
          :activate="item.value === (rootExpressAs.style || '')"
          :data="item"
        ></StyleAvatar>
      </li>
    </ul>
    <div class="right-box mt-2">
      <div>
        <span>语速：{{ speed }}x</span>
      </div>
      <ElSlider
        v-model="speed"
        :min="speedRange[0]"
        :max="speedRange[1]"
        :step="0.05"
        :marks="speedMarks"
        size="small"
      ></ElSlider>
    </div>
    <div class="right-box">
      <div>
        <span>语调：{{ pitch }}</span>
      </div>
      <ElSlider
        v-model="pitch"
        :min="pitchRange[0]"
        :max="pitchRange[1]"
        :step="0.2"
        :marks="pitchMarks"
        size="small"
      ></ElSlider>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.right-box {
  height: 75px;
  font-size:.8em
}
</style>
