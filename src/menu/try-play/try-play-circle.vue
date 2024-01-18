<script setup lang="ts">
import { ref,computed} from 'vue'
import { useTryPlayStore } from '@/stores'
import { demoAvatar } from '@/config'
const emit = defineEmits<{ 'update:visible': [value: boolean] }>()
defineProps<{ visible: boolean }>()

const boxRef = ref<HTMLDivElement>()

const tryPlayStore = useTryPlayStore()

const avatarThumb = computed(() => {
  return tryPlayStore.speaker.avatar||demoAvatar()
})


function handleMouseup() {
  return emit('update:visible', false)
}
</script>

<template>
  <div
    ref="boxRef"
    class="try-play-circel"
    @click="handleMouseup"
  >
    <div class="avatar">
      <img class="thumb" :src="avatarThumb">
      <div class="name">{{ tryPlayStore.speaker.displayName }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.try-play-circel {
  background-color: #eee;
  padding:5px 20px;
  border-radius: 60px;
  cursor: pointer;
  .avatar {
     display: flex;
     flex-direction: row;
     align-items: center;
    .thumb{
      width:30px;
      height:30px;
    }
    .name{
      margin-left: 10px;
    }
  }
}
</style>
