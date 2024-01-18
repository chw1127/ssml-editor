<script setup lang="ts">
import { ElSlider} from 'element-plus'
import type { CSSProperties } from 'vue'
import { reactive, ref, onUnmounted, watch, onMounted } from 'vue'
import { getConfig } from '@/config'
import StyleAvatar from './style-avatar.vue'
import { defaultSpeed } from './data'
import { useSSMLStore, useTryPlayStore } from '@/stores'
import { defaultFilterSpeaker, type Speaker } from '@/model'
import { emitter } from '@/event-bus'


interface Mark {
  style: CSSProperties
  label: string
}

type Marks = Record<number, Mark | string>

const ssmlEditorConfig = getConfig()
const { rootProsody, rootExpressAs } = useSSMLStore()
const { category, fetchData } = ssmlEditorConfig.tryPlay
const tryPlayStore = useTryPlayStore()

const currentTime = tryPlayStore.audioPlayer.currentTime
const time = ref(0)
const isInput = ref(false)

const speedRange = ref([0, 2.0])
const speed = ref(1)

const pitch = ref(0)
pitch.value= Number(rootProsody.pitch)
speed.value= Number(rootProsody.rate)


const speedMarks = reactive<Marks>(defaultSpeed())

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
  (newValue, oldValue) => {
    console.log("角色变化1：",newValue,"  ",oldValue)
    if(oldValue && newValue.name!==oldValue?.name){
      console.log("角色变化：",newValue)
      newValue.roles.length > 0 && handleRoleClick(newValue.roles[0].value)
      newValue.styles.length > 0 && handleStyleClick(newValue.styles[0].value)
    }
  },
  { immediate: true },
)

watch(
  pitch,
  (value) => {
    rootProsody.pitch = value!.toString()
  },
  { immediate: true },
)

watch(
  speed,
  (value) => {
    rootProsody.rate = value!.toString()
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

</script>

<template>
  <div class="right-panle">
    <div class="role-list">
      <div class="tag">角色风格：</div>
      <div
        @click="handleRoleClick(item.value)"
        v-for="(item, index) in tryPlayStore.speaker.roles"
        :key="index"
        class="role-item"
        :class="{ 'activate': item.value === (rootExpressAs.role || '') }"
      >
        {{ item.label }}
      </div>
    </div>
    <div style="display: flex; flex-direction: row;align-items: center;margin-top: 10px;">
      <div class="tag">说话风格：</div>
      <ul
        class=""
        style="display: flex;flex-direction: row;list-style: none;padding:0;margin: 0;flex-wrap: wrap;"
      >
        <li
          class="mx-2"
          style="margin-right: 5px;"
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
    </div>
    
    <div class="" style="display: flex;flex-direction: row;align-items: center;margin: 10px 0;">
      <div class="tag">
        语速：
      </div>
      <div style="flex:1;padding: 0 20px;">
        <ElSlider
        v-model="speed"
        :min="speedRange[0]"
        :max="speedRange[1]"
        :step="0.1"
        :marks="speedMarks"
        size="small"
      ></ElSlider>
      </div>
      
    </div>
    <!-- <div  style="display: flex;flex-direction: row;align-items: center;margin: 10px 0;">
      <div>
        <span>语调：{{ pitch }}</span>
      </div>
      <div style="flex:1;padding: 0 20px;">
        <ElSlider
          v-model="pitch"
          :min="pitchRange[0]"
          :max="pitchRange[1]"
          :step="0.2"
          :marks="pitchMarks"
          size="small"
        ></ElSlider>
      </div>
    </div> -->
    <!-- <PlayButton></PlayButton> -->
  </div>
</template>

<style lang="scss" scoped>
.role-list{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  flex-wrap: wrap;
}
.role-item{
  margin: 0 5px;
  padding:2px 5px;
  cursor: pointer;
}
.role-item.activate{
  background-color: #eee;
  border-radius: 5px;
}
.tag{
  width: 80px;
  font-weight: bold;
}
</style>
