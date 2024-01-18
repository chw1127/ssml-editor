<script setup lang="ts">
import { type IDomEditor } from '@wangeditor/editor'
import { ref, shallowRef } from 'vue'
import { BarButton, BarPopover } from '@/components'
import { ChangespeedFn } from './changespeed-fn'
import { rates } from './data'
import type { LabelValue } from '@/model'

const fn = shallowRef<ChangespeedFn>()
const visible = ref(false)

function show() {
  if (visible.value) return
  visible.value = true
}

function hide() {
  if (!visible.value) return
  visible.value = false
}

async function handleClick(editor: IDomEditor) {
  fn.value ??= new ChangespeedFn(editor)
  if (fn.value.isDisabled()) return
  show()
}

function handleItemClick(item: LabelValue) {
  fn.value?.exec({ ...item })
  hide()
}
</script>

<template>
  <BarPopover v-model:visible="visible">
    <template #reference>
      <BarButton icon="changespeed" @click="handleClick">变速</BarButton>
    </template>
    <div
      class="speed-list d-flex flex-column overflow-x-hidden overflow-y-scroll scrollbar"
      style="height: 15rem"
    >
      <div
        v-for="(item, index) in rates"
        :key="index"
        class="item"
        @click="handleItemClick(item)"
      >
        {{ item.label }}
      </div>
    </div>
  </BarPopover>
</template>

<style lang="scss" scoped>
  .speed-list{
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    height:15rem;
    .item{
      padding:2px 4px;
      border-bottom: 1px solid #eee;
    }
  }

</style>
