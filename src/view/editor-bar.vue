<script setup lang="ts">
import {
  PlayMenu,
  PinyinMenu,
  ReadMenu,
  DigitalMenu,
  ContinuousMenu,
  AliasMenu,
  EnglishMenu,
  ChangespeedMenu,
  RhythmMenu,
  SpecialMenu,
  MuteMenu,
  BgmMenu,
  ConversionMenu,
  ManagementMenu
} from '../menu'

withDefaults(
  defineProps<{
    simpleModel: boolean
  }>(),
  {
    simpleModel: false
  }
)

</script>

<template>
  <div class="editor-bar">
    <PlayMenu></PlayMenu>
    <PinyinMenu></PinyinMenu>
    <MuteMenu></MuteMenu>
    <DigitalMenu></DigitalMenu>
    <ReadMenu></ReadMenu>
    <ChangespeedMenu></ChangespeedMenu>
    <ManagementMenu></ManagementMenu>
    <ConversionMenu v-if="!simpleModel"></ConversionMenu>
    <RhythmMenu></RhythmMenu>
    <ContinuousMenu></ContinuousMenu>
    <AliasMenu></AliasMenu>
    <EnglishMenu></EnglishMenu>
    <SpecialMenu v-if="!simpleModel"></SpecialMenu>
    <BgmMenu v-if="!simpleModel"></BgmMenu>
  </div>
  <!-- <TryPlay v-if="!simpleModel"></TryPlay> -->
</template>

<style lang="scss" scoped>
.editor-bar {
  background-color: #eee;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
