<script setup lang="ts"></script>

<template>
  <div class="bar-wrapper">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.bar-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;

  :deep() {
    .divider {
      height: 40px;
      width: 1px;
      margin: 1px 5px;
      background-color:#666;
    }
  }
}
</style>
