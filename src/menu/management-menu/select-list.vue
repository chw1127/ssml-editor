<script setup lang="ts">
import type { LabelValue } from '@/model'
import { ref } from 'vue'

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const props = defineProps<{ modelValue: string; dataList: LabelValue[] }>()

const listRef = ref<HTMLElement>()

function handleSelect(item: LabelValue) {
  emit('update:modelValue', item.value)
}

function scrollIntoViewTheItem() {
  if (!listRef.value) return
  for (let i = 0; i < props.dataList.length; i++) {
    if (props.dataList[i].value === props.modelValue) {
      listRef.value.children[i]?.scrollIntoView({ behavior: 'smooth' })
      return
    }
  }
}

defineExpose({
  scrollIntoViewTheItem,
})
</script>

<template>
  <div class="select-list" style="width: 120px">
    <div class="slot">
      <slot></slot>
    </div>
    <ul
      ref="listRef"
      class=""
      style="height: 150px"
    >
      <li
        class="select-item"
        v-for="(item, index) in dataList"
        :class="{ activate: item.value === modelValue }"
        :key="index"
        @click="handleSelect(item)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.select-list {
  background-color: #fff;
  .slot{
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding:4px 0;
  }
  ul{
    list-style: none;
    padding:0;
    border:1px solid #eee;
    overflow-x: hidden;
    overflow-y: auto;
    .select-item{
      font-size: 1rem;
      padding:2px 5px;
      text-align: center;
      overflow-x: hidden;
    }
  }
  .activate {
    color: #fff;
    background-color: #3583fb;
  }
}
</style>
