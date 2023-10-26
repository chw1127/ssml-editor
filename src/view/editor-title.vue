<script setup lang="ts">
import { useSSMLStore } from '@/stores'
import { PlayTag } from '@/components'
const { rootBackgroundaudio } = useSSMLStore()
function handleCloseBgm() {
  rootBackgroundaudio.src = ''
  rootBackgroundaudio.remark = ''
}
</script>
<template>
  <div class="editor-title d-flex flex-row align-item-center p-1">
    <PlayTag v-if="rootBackgroundaudio.src" :src="rootBackgroundaudio.src" @close="handleCloseBgm">
      {{ rootBackgroundaudio.remark }}
    </PlayTag>
  </div>
</template>

<style lang="scss" scoped></style>
