<script setup lang="ts">
import { defaultFilterSpeaker, type FilterSpeaker } from '@/model'
import SpeakerAvatarList from './speaker-avatar-list.vue'
import SimpleTagList from './simple-tag-list.vue'
import { ref} from 'vue'

const boxRef = ref<HTMLDivElement>()
const filter = ref<FilterSpeaker>(defaultFilterSpeaker())

</script>

<template>
  <div class="left-panle" ref="boxRef">
    <SimpleTagList v-model:filter="filter"></SimpleTagList>
    <div class="py-1 border-top border-secondary"></div>
    <SpeakerAvatarList :filter="filter"></SpeakerAvatarList>
  </div>
</template>

<style lang="scss" scoped></style>
