<script setup lang="ts">
import RightPanle from './right-panle.vue'
import LeftPanle from './left-panle.vue'

// const emit = defineEmits<{ 'update:visible': [value: boolean] }>()

</script>

<template>
  <div class="try-play-body">
        <div class="try-play-left">
          <LeftPanle></LeftPanle>
        </div>
        <div class="try-play-right">
          <RightPanle></RightPanle>
        </div>
      </div>
</template>

<style lang="scss" scoped>
  .try-play-body {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    height: 60vh;
    .try-play-left{
      flex:1;
      overflow-y: auto;
    }
  }

  ::-webkit-scrollbar {
    width: 2px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0);
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(177, 177, 177, 0.5);
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(162, 161, 161, 0.5);
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb:active {
    background: rgba(184, 182, 182, 0.5);
    border-radius: 8px;
  }


</style>
