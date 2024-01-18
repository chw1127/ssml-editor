<script setup lang="ts">
defineEmits<{ click: [value: string] }>()
defineProps<{ activate?: boolean; value?: string }>()
</script>

<template>
  <span
    class="tag-item"
    :class="{ 'activate': activate }"
    @click="$emit('click', value!)"
  >
    <slot></slot>
  </span>
</template>

<style lang="scss" scoped>
  .tag-item{
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    height: 20px; min-width: 60px; max-width: 160px;
    border-radius: 5px;
    margin: 0 5px;
  }
  .tag-item.activate{
    border :1px solid #eee;
    background-color: #eee;
  }

</style>
