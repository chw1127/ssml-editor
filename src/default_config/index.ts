import type {SSMLEditorConfig } from '@/config'
import { english, bgm, special, scene, style, tag, speaker } from './data/get-data'
import { upload, transfer, conversionSpeaker, play } from './data/get-data'
import { ElNotification } from 'element-plus'
import type { Speaker } from '@/model'
import { emitter } from '@/event-bus'

emitter.on('tryplay-speaker-detail-show', (speaker) => {
  ElNotification.info(speaker.name)
})

async function selectSpeaker(speaker: Speaker, setter: (speaker: Speaker) => void) {
  setter(speaker)
}



function defaultSSMLEditorConfig(): SSMLEditorConfig {
  return {
    effects: { zoom: true, grayscale: true },
    editorConfig: { placeholder: '请输入内容...' },
    handleWarn: (message) => console.warn(message) ,
    handleError: (error) => console.error(error),
    pinyin: {},
    english: { fetchData: english },
    bgm: {
      menus: [
        { label: '默认音效', value: '' }
      ],
      fetchScene: scene,
      fetchStyle: style,
      fetchData: bgm,
    },
    special: {
      menus: [
        { label: '默认音效', value: '' }
      ],
      fetchScene: scene,
      fetchStyle: style,
      fetchData: special,
    },
    conversion: {
      timeoutMilliseconds: 20000,
      audioUpload: upload,
      transfer: transfer,
      fetchSpeaker: conversionSpeaker,
    },
    management: {
      
    },
    tryPlay: {
      play: play,
      fetchData: speaker,
      featchTag: tag,
      fetchStar: () => Promise.resolve(true),
      selectSpeaker: selectSpeaker,
      gender: [
        { label: '全部', value: '' },
        { label: '男声', value: 'Male' },
        { label: '女声', value: 'Female' }
      ],
      category: [
        { label: '常用', value: '常用' },
        { label: '已购', value: '已购' },
        { label: '收藏', value: '收藏' },
        { label: '我的', value: '我的' }
      ],
    },
  }
}
export default defaultSSMLEditorConfig
