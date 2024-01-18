<script setup lang="ts">
import { defaultFilterSpeaker, type LabelValue, type Speaker } from '@/model'
import { ElButton } from 'element-plus'
import { ElSlider} from 'element-plus'
import { computed, onMounted, reactive, ref, shallowRef, watch, type CSSProperties } from 'vue'
import {type ContentData } from './data'
import { type SubmitData } from './data'
import { useElementVisibility } from '@vueuse/core'
import { getConfig,demoAvatar } from '@/config'
import { defaultSpeed,defaultPitch } from './data'
const emit = defineEmits<{
  submit: [data: SubmitData]
  'update:contentData': [data: ContentData]
}>()
const props = defineProps<{ contentData: ContentData }>()

const ssmlEditorConfig = getConfig()
const { tryPlay } = ssmlEditorConfig

const boxRef = ref<HTMLDivElement>()
const showMore = ref(false)
const searchInput = ref('')

const speakerCache = shallowRef<Speaker[]>([])
const dataListCategory = ref<LabelValue[]>([{ label: '全部类型', value: '' }, ...tryPlay.category])
const dataListSpeaker = ref<LabelValue[]>([])
const dataListRole = ref<LabelValue[]>([])
const dataListStyle = ref<LabelValue[]>([])

const visible = useElementVisibility(boxRef)

interface Mark {
  style: CSSProperties
  label: string
}

type Marks = Record<number, Mark | string>

const speedRange = ref([0, 2.0])
const speedMarks = reactive<Marks>(defaultSpeed())
const pitchRange = ref([-10, 10])
const pitchMarks = reactive<Marks>(defaultPitch())

const contentDataRef = computed(() => props.contentData)

onMounted(async () => {
  contentDataRef.value.category = dataListCategory.value[0].value
  await handleFetchData()
})

watch(visible, (newValue) => {
  showMore.value = false

  if (newValue && searchInput.value) {
    searchInput.value = ''
    handleFetchData()
  }
})

const speed = computed({
    get() {
        return  Number(contentDataRef.value.speed)
    },
    set(value) {
      contentDataRef.value.speed=String(value)
    }
})

const pitch = computed({
  get() {
        return  Number(contentDataRef.value.pitch)
    },
    set(value) {
      contentDataRef.value.pitch=String(value)
    }
})

// async function handleSelectCategory(category: string) {
//   contentDataRef.value.category = category
//   await handleFetchData()
// }

async function handleFetchData() {
  const speakers = await tryPlay.fetchData({
    ...defaultFilterSpeaker(),
    word: searchInput.value,
    category: props.contentData.category,
  })

  console.log("speakers:",speakers)
  speakerCache.value = speakers
  dataListSpeaker.value = speakers.map((v) => ({ label: v.displayName, value: v.name }))

  if (speakers.length > 0) {
    dataListRole.value = speakers[0].roles
    dataListStyle.value = speakers[0].styles
    contentDataRef.value.name = speakers[0].name

    if (dataListRole.value.length > 0) {
      contentDataRef.value.role = dataListRole.value[0].value
    }
    if (dataListStyle.value.length > 0) {
      contentDataRef.value.style = dataListStyle.value[0].value
    }
  } else {
    dataListRole.value = []
    dataListStyle.value = []
    contentDataRef.value.role = ''
    contentDataRef.value.style = ''
  }
}

function handleSelectSpeaker(name: string) {
  const speader = speakerCache.value.find((v) => v.name === name)
  function setter(speader: Speaker) {
    contentDataRef.value.name = speader.name

    dataListRole.value = speader.roles
    dataListStyle.value = speader.styles

    if (dataListRole.value.length > 0) {
      contentDataRef.value.role = dataListRole.value[0].value
    }
    if (dataListStyle.value.length > 0) {
      contentDataRef.value.style = dataListStyle.value[0].value
    }
  }

  if (speader) {
    if (ssmlEditorConfig.tryPlay.selectSpeaker) {
      ssmlEditorConfig.tryPlay.selectSpeaker(speader, setter)
    } else {
      setter(speader)
    }
  }
}

async function handleSubmit(label?: string) {
  const speakerLabel =
    dataListSpeaker.value.find((v) => v.value === contentDataRef.value.name)?.label || '-'
  const roleLabel =
    dataListRole.value.find((v) => v.value === contentDataRef.value.role)?.label || '-'
  const styleLabel =
    dataListStyle.value.find((v) => v.value === contentDataRef.value.style)?.label || '-'

  const data: SubmitData = {
    category: contentDataRef.value.category,
    name: contentDataRef.value.name,
    label:
      label ||
      `${speakerLabel}|${roleLabel}|${styleLabel}|${contentDataRef.value.speed}|${contentDataRef.value.pitch}`,
    value: contentDataRef.value.name,
    role: contentDataRef.value.role,
    style: contentDataRef.value.style,
    speed: contentDataRef.value.speed,
    pitch: contentDataRef.value.pitch,
  }
  emit('submit', data)
}

</script>

<template>
  <div ref="boxRef" class="management">
    <!-- <ElForm @submit.prevent="handleSelectCategory('')">
      <ElInput v-model="searchInput" placeholder="请输入名称快速查找配音师"></ElInput>
    </ElForm> -->
    
    <div class="speaker-list">
      <div class="speaker"
          :class="{'activate':contentDataRef.name===item.name}"
      v-for="(item, index) in speakerCache" :key="index" @click="handleSelectSpeaker(item.name)">
        <div class="avatar">
          <img
          :src="item?.avatar || demoAvatar()">
        </div>
        <div class="info">
          <div class="name">{{ item?.displayName }}</div>
          <div class="" style="font-size: 0.8em;">{{ item?.gender=='Female'?'女':'男' }}<span>{{ item?.localeZH }}</span></div>
        </div>

      </div>
    </div>
    
    <div class="role-list">
      <div class="tag">角色风格:</div>
      <div class="role" :class="{'activate':contentDataRef.role===item.value}" v-for="(item, index) in dataListRole" :key="index" @click="contentDataRef.role=item.value">
        {{ item.label }}
      </div>
    </div>

    
    <div class="style-list">
      <div class="tag">说话风格:</div>
      <div class="style" :class="{'activate':contentDataRef.style===item.value}" v-for="(item, index) in dataListStyle" :key="index" @click="contentDataRef.style=item.value">
        {{ item.label }}
      </div>
    </div>

   
    <div class="speed-list">
      <div  class="tag">&ensp;&ensp;&ensp;&ensp;语速:</div>
      <div class="content">
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
    
    <div class="pitch-list">
      <div  class="tag">&ensp;&ensp;&ensp;&ensp;语调:</div>
      <div class="content">
        <ElSlider  
          v-model="pitch"
          :min="pitchRange[0]"
          :max="pitchRange[1]"
          :step="1"
          :marks="pitchMarks"
          size="small"
        ></ElSlider>
      </div>
    </div>

      <!-- <div v-show="!showMore" style="display: flex;flex-direction: row;">
        <SelectList
          @update:modelValue="handleSelectCategory"
          v-model="contentDataRef.category"
          :dataList="dataListCategory"
        >
          <span class="my-3">类型</span>
        </SelectList>
        <SelectList
          @update:modelValue="handleSelectSpeaker"
          :modelValue="contentDataRef.name"
          :dataList="dataListSpeaker"
        >
          <span class="my-3">配音师</span>
        </SelectList>
        <SelectList v-model="contentDataRef.role" :dataList="dataListRole">
          <span class="my-3">角色风格</span>
        </SelectList>
        <SelectList v-model="contentDataRef.style" :dataList="dataListStyle">
          <span class="my-3">说话风格</span>
        </SelectList>
        <SelectList v-model="contentDataRef.speed" :dataList="dataListSpeed">
          <span class="my-3">语速</span>
        </SelectList>
        <SelectList v-model="contentDataRef.pitch" :dataList="dataListPitch">
          <span class="my-3">语调</span>
        </SelectList>
      </div> -->

    <div class="bottom-bar">
      <ElButton  @click="() => handleSubmit()" type="primary">确定</ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.management{
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.bottom-bar{
  display: flex;
  flex-direction: row;
  justify-content: end;
  margin-right: 20px;
  margin-bottom: 10px;
  margin-top: 20px;
}
.speaker-list{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  .speaker{
    width:190px;
    background-color: #eee;
    border-radius: 5px;
    padding:10px 10px;
    margin: 2px;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    .avatar{

      img{
        width: 40px;
      }
    }
    .info{
      margin-left: 5px;
      .name{
        font-weight: bold;
        margin-bottom: 2px;
      }
    }
  }
  .speaker.activate{
    background-color: #409eff;
    color:#fff;
  }
}
.role-list{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  .role{
    margin-right: 10px;
    background-color: #eee;
    padding:4px 8px;
    border-radius: 5px;
    cursor: pointer;
  }
  .role.activate{
    background-color: #409eff;
    color:#fff;
  }
}

.style-list{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  .style{
    margin-right: 10px;
    background-color: #eee;
    padding:4px 8px;
    border-radius: 5px;
    cursor: pointer;
  }
  .style.activate{
    background-color: #409eff;
    color:#fff;
  }
}
.speed-list{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  .content{
    flex:1;
  }
}

.pitch-list{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  .content{
    flex:1;
  }
}
.tag{
  font-weight: bold;
  margin-right: 10px;
}
</style>
