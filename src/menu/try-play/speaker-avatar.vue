<script setup lang="ts">
import { demoAvatar } from '@/config'
import type { SpeakerAvatarData } from './data'

defineEmits<{ click: [value: string] }>()
defineProps<{ activate?: boolean; data?: SpeakerAvatarData }>()
</script>

<template>
  <div 
  class="anchor-avatar" 
  :class="{ 'activate': activate }"
  @click="$emit('click', data!.value)" 
  >
    <div class="avatar">
      <img
      :src="data?.avatar || demoAvatar()"
      class="rounded-circle"
      style="width: 40px"
      />
    <div class="info">
      <div class="">{{ data?.label }}</div>
      <div class="" style="font-size: 0.8em;">{{ data?.gender=='Female'?'女':'男' }}<span>{{ data?.localeZH }}</span></div>
    </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.anchor-avatar{
  width:190px;
  background-color: #eee;
  border-radius: 5px;
  padding:10px 10px;
}
.anchor-avatar.activate{
  background-color: #87CEFA;
}
.avatar{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.info{
  flex:1;
  padding-left: 4px;
  padding-right: 4px;
  span{
    margin-left: 5px;
  }
}
</style>
