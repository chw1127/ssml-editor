<script setup lang="ts"></script>

<template>
  <div class="ssml-editor-bar-wrapper">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.ssml-editor-bar-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #eee;

  :deep() {
    .divider {
      height: 20px;
      width: 1px;
      margin: 1px 5px;
      background-color:#aaa;
    }
  }
}
</style>
