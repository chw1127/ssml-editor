<script setup lang="ts">
import { defaultFilterSpeaker, type LabelValue, type Speaker } from '@/model'
import { ElInput, ElForm, ElButton } from 'element-plus'
// import { More } from '@element-plus/icons-vue'
import SelectList from './select-list.vue'
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { speed, pitch,type ContentData } from './data'
import { type SubmitData } from './data'
import { useElementVisibility } from '@vueuse/core'
import { getConfig } from '@/config'

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

const dataListSpeed = ref<LabelValue[]>(speed())
const dataListPitch = ref<LabelValue[]>(pitch())

const visible = useElementVisibility(boxRef)

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

async function handleSelectCategory(category: string) {
  contentDataRef.value.category = category
  await handleFetchData()
}

async function handleFetchData() {
  const speakers = await tryPlay.fetchData({
    ...defaultFilterSpeaker(),
    word: searchInput.value,
    category: props.contentData.category,
  })
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
  <div ref="boxRef" style="height: 360px" class="position-relative px-2 pb-2">
    <ElForm @submit.prevent="handleSelectCategory('')">
      <ElInput v-model="searchInput" placeholder="请输入名称快速查找配音师"></ElInput>
    </ElForm>
    <div class="position-relative">
      <div v-show="!showMore" :class="{ 'd-flex flex-row': !showMore }">
        <!-- <SelectList
          @update:modelValue="handleSelectCategory"
          v-model="contentDataRef.category"
          :dataList="dataListCategory"
        >
          <span class="my-3">类型</span>
        </SelectList> -->
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
      </div>
    </div>

    <div class="position-absolute bottom-0 end-0 d-flex flex-row justify-content-end me-4 mb-3">
      <ElButton  @click="() => handleSubmit()" type="primary">确定</ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
