<script setup lang="ts">
defineEmits<{ click: [value: string] }>()
defineProps<{ activate?: boolean; value?: string }>()
</script>

<template>
  <span
    class="tag-item d-inline-block text-white text-center text-nowrap text-truncate"
    :class="{ 'border border-white rounded-pill': activate }"
    @click="$emit('click', value)"
    style="height: 20px; min-width: 60px; max-width: 160px;  cursor: pointer;font-size: .9rem; line-height: 20px;"
  >
    <slot></slot>
  </span>
</template>

<style lang="scss" scoped></style>
