<script setup lang="ts">
import EditorTitle from './editor-title.vue'
import EditorCore from './editor-core.vue'
import EditorBar from './editor-bar.vue'
import { type IDomEditor } from '@wangeditor/editor'
import { emitter } from '@/event-bus'
import { ref, provide, watch, nextTick } from 'vue'
import { serializeToSSML } from '@/serialize'
import { debounce } from 'lodash';
import xmlFormat from 'xml-formatter'
import {
  TryPlay,
} from '../menu'
const props = withDefaults(
    defineProps<{
        data?: string,
        ssml: string,
        simpleModel:boolean
    }>(),
    {
      data: ``,
      ssml: '',
      simpleModel:false
    }
)


const flag = ref<boolean>(true)

const ssmlData = ref(props.ssml);
const sData = ref(props.data);
watch(
  sData,
    debounce((newValue: string) => {
        emit('update:data', newValue);
    }, 200)
);

watch(
  ssmlData,
    debounce((newValue: string) => {
        emit('update:ssml', newValue);
    }, 200)
);


watch(() => props.data, (newValue) => {
    if (newValue != sData.value) {
      flag.value = false
      console.log("外部数据有更新");
      nextTick(() => {
        flag.value = true
      })
    }
});




const emit = defineEmits<{
  (event: 'created', data: IDomEditor): void;
  (event: 'change', data: string): void;
  (event: 'ssmlChange', data: string): void;
  (event: 'update:ssml', value: string): void;
  (event: 'update:data', value: string): void
}>();

const boxRef = ref<HTMLDivElement>()

// 设置拖拽容器盒子,如果想要在整个页面可拖拽,将boxRef换为ref(document.body)即可
provide('dragContainerBox', boxRef)

function handleCreated(editor: IDomEditor) {
  emit('created', editor)
}

function handleChange(editor: IDomEditor) {
  ssmlData.value=ssmlFormat();
  sData.value=editor.getHtml();
  emit('change', sData.value)
  emit('ssmlChange', ssmlData.value)
}

function handleClick(ev: MouseEvent) {
  emitter.emit('view-click', ev)
}

function handleKeyDown(ev: KeyboardEvent) {
  emitter.emit('view-keydown', ev)
}

const ssmlFormat = () => {
  let ssml=serializeToSSML();
  // console.log("ssml:",ssml);
  let format_ssml= xmlFormat(ssml, {
    indentation: '    ',
    filter: (node) => node.type !== 'Comment',
    collapseContent: true,
    lineSeparator: '\n',
  })
  // console.log(format_ssml);
  return format_ssml
}

emitter.on('tryplay-speaker-select', (speaker) => {
  console.log("tryplay-speaker-select:",speaker);
})
</script>

<template>
  <div
    ref="boxRef"
    class="ssml-editor-root ssml-editor-view"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <div class="editor-box" v-if="flag">
      <EditorTitle></EditorTitle>
      <EditorBar :simple-model="simpleModel"></EditorBar>
      <div class="editor-core-container border pt-1">
        <EditorCore @change="handleChange" @created="handleCreated" :html="data"></EditorCore>
        <TryPlay></TryPlay>
      </div>
      
    </div>
  </div>
  
</template>

<style lang="scss" scoped>
.ssml-editor-view {
  background-color: var(--tool-bg-color);
  .editor-box {
    background-color: var(--tool-bg-grey-color);
  }
}
.editor-core-container{
  display: flex;
  flex-direction: column;
  border:1px solid #eee;
}
</style>
