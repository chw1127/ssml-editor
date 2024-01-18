<script setup lang="ts">
import { useEditorStore } from '@/stores'
import { type IDomEditor } from '@wangeditor/editor'
import throttle from 'lodash.throttle'

const emit = defineEmits<{ click: [editor: IDomEditor] }>()
withDefaults(
  defineProps<{
    icon?: string
    disabled?: boolean
  }>(),
  { icon: 'play', disabled: false },
)

const handleClick = throttle(() => {
  const { editor } = useEditorStore()
  if (editor) emit('click', editor)
})
</script>

<template>
  <div
    :disabled="disabled"
    class="bar-button"
    @click="handleClick"
    @mousedown.prevent
  >
    <div class="play-menu-icon">
      <slot name="icon">
        <span class="icon iconfont-moyin " :class="[`moyin-icon_${icon}`]"></span>
      </slot>
    </div>
    <div class="fw-normal" style="font-size: 12px; margin-top: 2px;color:#666;">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .bar-button{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 2px;
    padding:4px 2px;
    width: 40px;
    box-sizing: border-box;
    .play-menu-icon{
      width:20px;
      height:20px;
      display: flex;
      justify-content: center;
      align-items: center;
      
    }
    .icon{
      font-size: 24px;
    }
    .fw-normal{
      display: inline-block;
      justify-content: center;
      flex-wrap: nowrap;
      flex-direction: row;
      font-size: 14px; margin-top: 2px;color:#666;
    }
  }
  .bar-button:hover{
    cursor: pointer;
    background-color: #cecece;
  }

</style>
