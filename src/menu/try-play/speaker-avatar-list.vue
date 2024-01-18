<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef, toRaw, watch } from 'vue'
import SpeakerAvatar from './speaker-avatar.vue'
import type { FilterSpeaker, Speaker } from '@/model'
import { useTryPlayStore } from '@/stores'
import { getConfig } from '@/config'
import type { SpeakerAvatarData } from './data'
import { emitter } from '@/event-bus'

const props = defineProps<{ filter: FilterSpeaker }>()

const ssmlEditorConfig = getConfig()
const { fetchData } = ssmlEditorConfig.tryPlay
const tryPlayStore = useTryPlayStore()

const dataList = ref<SpeakerAvatarData[]>([])
const speaderCache = shallowRef<Speaker[]>([])

watch(
  () => props.filter,
  async () => {
    await handleFetchData()
  },
)

function handleClick(value: string) {
  const speaker = speaderCache.value.find((v) => v.name === value)
  speaker && tryPlayStore.setSpeaker(speaker)
}

function handleUpdateStarTheCache(speakerId: string, isStar: boolean) {
  const item = speaderCache.value.find((v) => v.id === speakerId)
  if (item) item.isStar = isStar
}

onMounted(() => {
  emitter.on('tryplay-speaker-update-star', handleUpdateStarTheCache)
})

onUnmounted(() => {
  emitter.off('tryplay-speaker-update-star', handleUpdateStarTheCache)
})

onMounted(async () => {
  await handleFetchData()
  if(tryPlayStore.speaker.name==""||tryPlayStore.speaker.name=="zh-CN-XiaoxiaoNeural"){
    if (dataList.value.length > 0) handleClick(dataList.value[0].value)
  }
  
})

async function handleFetchData() {
  try {
    speaderCache.value = await fetchData({ ...toRaw(props.filter) })
  } catch (error) {
    emitter.emit('error', error)
  }
  dataList.value = speaderCache.value.map<SpeakerAvatarData>((v) => ({ 
    label: v.displayName,
    value: v.name,
    avatar: v.avatar,
    isFree: v.isFree,
    gender:v.gender,
    localeZH:v.localeZH
  }))

  console.log("dataList.value:",dataList.value);
}
</script>

<template>
  <div class="avatar-panle">
    <div class="item" v-for="(item, index) in dataList" :key="index">
      <SpeakerAvatar
        :data="item"
        :activate="item.value === tryPlayStore.speaker.name"
        @click="handleClick(item.value)"
      ></SpeakerAvatar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.avatar-panle{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .item{
    margin: 5px;
    cursor: pointer;
  }
}
</style>
