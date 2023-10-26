<script setup lang="ts">
import { SSMLEditorView } from '@/view'
import type { IDomEditor } from '@wangeditor/editor'
import {ref } from 'vue';
import {ElButton } from 'element-plus'

function handleCreate(editor: IDomEditor) {
  window.editor = editor
}

const onChange=(editor: IDomEditor)=>{
  console.log("html:",editor.getHtml())
}

const ssmlChange=(ssml: string)=>{
  console.log("ssml:",ssml)
}

const flag = ref<boolean>(true)

let node=ref({
  ssml:"",
  data:""
})
let node1={
  ssml:"",
  data:"我"
}
let node2={
  ssml:"",
  data:"你"
}
const onClick1=()=>{
  // flag.value = false
  node.value=node1
  // nextTick(() => {
  //   flag.value = true
  // })
}

const onClick2=()=>{
  // flag.value = false
  node.value=node2
  // nextTick(() => {
  //   flag.value = true
  // })
}

</script>

<template>
  <!-- <div class="d-flex flex-row justify-content-between">
    <div>菜单栏</div>
    <div>
      <EditorView @created="handleCreate"></EditorView>
    </div>
  </div> -->
  <div> <ElButton  @click="onClick1" type="primary">确定A</ElButton> <ElButton  @click="onClick2" type="primary">确定B</ElButton></div>
  <div class="editor" v-if="flag">
    <SSMLEditorView @created="handleCreate" @change="onChange" @ssml-change="ssmlChange" v-model:data="node.data" v-model:ssml="node.ssml" ref="editor"></SSMLEditorView>
  </div>
  
  <textarea v-model="node.ssml"></textarea>
  <textarea v-model="node.data"></textarea>
</template>

<style scoped>
.editor{width: 80%;margin: 0 auto;margin-bottom: 20px;}
</style>
