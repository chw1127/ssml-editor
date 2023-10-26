<script setup lang="ts">
import { demoAvatar } from '@/config'
import type { SpeakerAvatarData } from './data'

defineEmits<{ click: [value: string] }>()
defineProps<{ activate?: boolean; data?: SpeakerAvatarData }>()
</script>

<template>
  <div 
  class="anchor-avatar p-2" 
  :class="{ 'border border-2 border-warning': activate }"
  @click="$emit('click', data!.value)" 
  style="width:210px; border:1px solid #aaa;border-radius: 5px;"
  >
    <div class="d-flex flex-row ">
      <img
      :src="data?.avatar || demoAvatar()"
      class="rounded-circle"
      style="height: 40px"
    />
    <div class="flex-1 px-2">
      <div class="anchor-avatar-name text-white">{{ data?.label }}</div>
      <div class="anchor-gender text-white" style="font-size: 0.8em;">{{ data?.gender=='Female'?'女':'男' }}</div>
    </div>
    </div>
    <div class="mt-1">
      <span class="locale rounded-pill px-2" style=" background-color: #eee; color:#666;font-size: 0.7em;">{{ data?.localeZH }}</span>
    </div>
    
  </div>
</template>

<style lang="scss" scoped>
</style>
