<script setup lang="ts">
import { useDraggable } from '@vueuse/core'
import { onMounted, onUnmounted, ref,  watch } from 'vue'
import { type Position } from '@vueuse/core'
// import { useConstrainDragBounds } from './constrain-drag-bounds'
import { emitter } from '@/event-bus'

import {ElDialog } from 'element-plus'
const emit = defineEmits<{ 'update:visible': [value: boolean]; close: [] }>()
const props = defineProps<{
  visible: boolean
  initialValue?: Position
}>()

const boxRef = ref<HTMLElement>()
const dragRef = ref<HTMLElement>()
const referenceRef = ref<HTMLElement>()
// const dragContainerBoxRef = inject<Ref<HTMLElement | undefined>>('dragContainerBox')
const allowClose = ref(true)

const { position } = useDraggable(dragRef, { initialValue: props.initialValue })
// const { style } = useConstrainDragBounds(boxRef, dragContainerBoxRef, position)

function setPosition(opt: Position) {
  position.value = opt
}

defineExpose({
  setPosition,
  withoutAutoClose,
})

onMounted(() => {
  emitter.on('view-click', handleViewClick)
  document.addEventListener('keydown', handleKeyDownEsc)
})

onUnmounted(() => {
  emitter.off('view-click', handleViewClick)
  document.removeEventListener('keydown', handleKeyDownEsc)
})

function handleViewClick(ev: MouseEvent) {
  allowClose.value && isOthreClick(ev) && handleClose()
}

function withoutAutoClose(callback: VoidFunction) {
  try {
    allowClose.value = false
    callback()
  } finally {
    setTimeout(() => (allowClose.value = true))
  }
}

function isOthreClick(ev: MouseEvent) {
  const target = ev.target as HTMLElement
  if (!boxRef.value || !referenceRef.value) return false
  if (referenceRef.value.contains(target)) return false
  if (boxRef.value.contains(target)) return false
  return true
}

function handleClose() {
  emit('update:visible', false)
  emit('close')
}
let showDialog=ref(false)
watch(() => props.visible, (newVal) => {
  showDialog.value=newVal
})

watch(() => showDialog.value, (newVal) => {
  if(!newVal){
    handleClose();
  }
})

function handleKeyDownEsc(event: KeyboardEvent) {
  event.code === 'Escape' && handleClose()
}
</script>

<template>
  <div ref="referenceRef" @mousedown.prevent>
    <slot name="reference"></slot>
  </div>
  <Teleport to="body">
    <ElDialog v-model="showDialog" title="选择角色" :draggable="true" width="60%" align-center>
      <slot></slot>
    </ElDialog>
    <!-- <div
      v-show="visible"
      ref="boxRef"
      class="drag-box"
      style="position: fixed"
      :style="style"
      @mousedown.prevent
    >
      <div class="header">
        <div ref="dragRef" style="flex:1; height: 40px; cursor: move"></div>
        <span @click="handleClose" class="btn iconfont icon-close fs-5"></span>
      </div>
      <slot></slot>
    </div> -->
  </Teleport>
</template>

<style lang="scss" scoped>
.drag-box {
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 0 5px 5px -4px rgba(0, 0, 0, .5);
  z-index: 2;
  padding:2px 5px;
}
.header{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  background-color: #fff;
}
</style>
