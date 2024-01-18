import { type MsttsBackgroundaudio, type MsttsExpressAs, type Prosody, type Voice } from '@/core'
import { defineStore } from 'pinia'
import { shallowReactive } from 'vue'

export const useSSMLStore = defineStore('--editor-ssml', () => {
  const rootVoice = shallowReactive<Voice>({
    type: 'ssml-voice',
    name: "zh-CN-XiaoxiaoNeural",
    remark: '',
    effect: '',
    children: [],
  })

  const rootBackgroundaudio = shallowReactive<MsttsBackgroundaudio>({
    type: 'ssml-mstts:backgroundaudio',
    src: '',
    remark: '',
    children: [],
  })

  const rootExpressAs = shallowReactive<MsttsExpressAs>({
    type: 'ssml-mstts:express-as',
    style: 'cheerful',
    role: 'Default',
    remark: '',
    children: [],
  })

  const rootProsody = shallowReactive<Prosody>({
    type: 'ssml-prosody',
    remark: '',
    children: [],
    rate:'0.9'
  })

  return { rootVoice, rootBackgroundaudio, rootExpressAs, rootProsody }
})
