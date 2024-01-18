<script setup lang="ts">
import type { StyleAvatarData } from './data'
defineEmits<{ click: [value: string] }>()
defineProps<{ activate?: boolean; data?: StyleAvatarData }>()

</script>

<template>
  <div
    class="anchor-avatar"
    :class="{ 'activate': activate }"
    @click="$emit('click', data!.value)"
  >
  {{ data?.label }}
  </div>
</template>

<style lang="scss" scoped>
.anchor-avatar{
  margin: 0 5px;
  padding:2px 5px;
  cursor: pointer;
}
.anchor-avatar.activate{
  background-color: #eee;
  border-radius: 5px;
}
</style>
