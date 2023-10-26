<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef, toRaw } from 'vue'
import { type IDomEditor, createEditor } from '@wangeditor/editor'
import { getConfig } from '@/config'
import { useEditorStore } from '@/stores'
import Core from '@/core'
import { emitter } from '@/event-bus'
// import { sleep } from '@/utils'

const emit = defineEmits<{ created: [editor: IDomEditor]; change: [editor: IDomEditor] }>()
const { setEditor} = useEditorStore()
const ssmlEditorConfig = getConfig()

const boxRef = ref(null)
const editorRef = shallowRef<IDomEditor>()

const props = withDefaults(
    defineProps<{
        html?: string,
    }>(),
    {
      html: '',
    }
)

// watch(() => props.html, () => {
//   if (!editorRef.value) return;
//   initEditorHtml(editorRef.value)
// });


onMounted(() => {
  Core.install()
  initEditor()
  initEffects()
})

onUnmounted(() => {
  editorRef.value?.destroy()
})

function initEditor() {
  if (!boxRef.value) return
  const editor = createEditor({
    selector: boxRef.value! as Element,
    mode: 'simple',
    config: {
      ...toRaw(ssmlEditorConfig.editorConfig),
      onCreated(editor) {
        emitter.emit('editor-created', editor)
        emit('created', editor)
        ssmlEditorConfig.editorConfig.onCreated?.(editor)
        // initEditorHtml(editor)
      },
      onChange(editor) {
        emit('change', editor)
        ssmlEditorConfig.editorConfig.onChange?.(editor)
      }
      
    },
    html:props.html
  })

  editorRef.value = editor
  setEditor(editor)
}

function initEffects() {
  if (ssmlEditorConfig.effects.zoom) {
    document.querySelector('.w-e-text-container')?.classList.add('allow-zoom')
  }
  if (ssmlEditorConfig.effects.grayscale) {
    document.querySelector('.w-e-text-container')?.classList.add('allow-grayscale')
  }
}

// async function initEditorHtml(editor: IDomEditor) {
//   // const readHtml = ssmlEditorConfig.editorConfig.readHtml
//   // if (readHtml) {
//   //   const html = await readHtml()
//   //   html && editor.setHtml(html)
//   //   await sleep(500)
//   //   editor.focus(true)
//   // }

//   const html = props.html;
//   // editor.clear();
//   editor.setHtml(html);
//   // await sleep(500)
//   // editor.focus(true)
// }
</script>

<template>
  <div ref="boxRef" class="editor-core scrollbar" style="height: 400px; overflow-y: hidden"></div>
</template>

<style lang="scss" scoped>
@import '@/assets/scrollbar.scss';

:deep() {
  .w-e-scroll {
    @include scrollBar();
  }
}
</style>
