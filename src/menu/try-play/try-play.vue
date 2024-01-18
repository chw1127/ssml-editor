<script setup lang="ts">
import { ref, watch } from 'vue'
import TryPlayCircle from './try-play-circle.vue'
import TryPlayPanle from './try-play-panle.vue'
import {ElDialog,ElButton } from 'element-plus'
const circleVisible = ref(true)
let dialogFormVisible=ref(false)

watch(() => circleVisible.value, (newVal) => {
  
  dialogFormVisible.value=!newVal
})
watch(() => dialogFormVisible.value, (newVal) => {
  
  circleVisible.value=!newVal
})


</script>

<template>
  
    <div class="ssml-editor-root">
      <TryPlayCircle v-model:visible="circleVisible"></TryPlayCircle>
    </div>
    <!-- <Teleport to="body"> -->
    <div class="avatar-dialog">
        <ElDialog v-model="dialogFormVisible" title="选择角色" :draggable="true" width="60%" align-center>
        <TryPlayPanle></TryPlayPanle>
        <template #footer>
          <span class="dialog-footer">
            <ElButton type="primary" @click="dialogFormVisible = false">
              确认
            </ElButton>
          </span>
        </template>
        </ElDialog>
    </div>
   
  <!-- </Teleport> -->
</template>

<style lang="scss" scoped>
.ssml-editor-root{
  display: flex;
  flex-direction: row;
}
.avatar-dialog{
  :deep(.el-dialog__body){
    padding:10px 10px;
    box-sizing: border-box;
  }
}

</style>
