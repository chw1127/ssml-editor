<script setup lang="ts">
import { BarWrapper, BarWrapperMenus } from '../components'
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
  ManagementMenu,
  TryPlay,
} from '../menu'

 withDefaults(
    defineProps<{
        simpleModel:boolean
    }>(),
    {
      simpleModel:false
    }
)

</script>

<template>
  <div class="editor-bar">
    <BarWrapper>
      <BarWrapperMenus>
        <PlayMenu></PlayMenu>
      </BarWrapperMenus>
      <BarWrapperMenus>
        <PinyinMenu></PinyinMenu>
        <MuteMenu></MuteMenu>
        
      </BarWrapperMenus>
      <BarWrapperMenus v-if="!simpleModel">
        <ChangespeedMenu></ChangespeedMenu>
        <ManagementMenu></ManagementMenu>
        <ConversionMenu></ConversionMenu>
      </BarWrapperMenus>
      <BarWrapperMenus  v-if="!simpleModel">
        <DigitalMenu></DigitalMenu>
        <ReadMenu></ReadMenu>
        <RhythmMenu></RhythmMenu>
        <ContinuousMenu></ContinuousMenu>
        <AliasMenu></AliasMenu>
        <EnglishMenu></EnglishMenu>
      </BarWrapperMenus>
      <BarWrapperMenus  v-if="!simpleModel">
        <SpecialMenu></SpecialMenu>
        <BgmMenu></BgmMenu>
      </BarWrapperMenus>
    </BarWrapper>
  </div>
  <TryPlay></TryPlay>
</template>

<style lang="scss" scoped></style>
