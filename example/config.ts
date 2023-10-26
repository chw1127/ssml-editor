import type { PartialSSMLEditorConfig } from '@/config'
import { english, bgm, special, scene, style, tag, speaker, star } from './api'
import { upload, transfer, conversionSpeaker, play } from './api'
import { ElMessage, ElNotification } from 'element-plus'
import type { Speaker } from '@/model'
import { emitter } from '@/event-bus'

emitter.on('tryplay-speaker-detail-show', (speaker) => {
  ElNotification.info(speaker.name)
})

async function selectSpeaker(speaker: Speaker, setter: (speaker: Speaker) => void) {
  setter(speaker)
}



const config: PartialSSMLEditorConfig = {
  effects: { grayscale: false, zoom: true },
  editorConfig: { placeholder:"请输入"},
  handleWarn: (message) => {
    ElMessage.warning({ message: message, grouping: true })
  },
  handleError: (error) => {
    if (typeof error === 'string') {
      ElMessage.error({ message: error, grouping: true })
    } else if (error instanceof Error) {
      ElMessage.error({ message: error.message, grouping: true })
    } else {
      console.error(error)
    }
  },
  // 音标菜单请求音标用
  english: { fetchData: english }, 
  // 配乐菜单 搜索,切换选项卡时请求数据用
  bgm: { fetchData: bgm, fetchScene: scene, fetchStyle: style },
  // 音效菜单 搜索,切换选项卡时请求数据用
  special: { fetchData: special, fetchScene: scene, fetchStyle: style },
  // 试听面板 数据结构和其他配置(支持自定义配音师类别,性别,等数据)
  tryPlay: {
    featchTag: tag,
    fetchData: speaker,
    fetchStar: star,
    play: play,
    selectSpeaker: selectSpeaker,
  },
  // 局部变音
  conversion: {
    timeoutMilliseconds: 20000, // 文件上传超时时间
    audioUpload: upload, // 上传音频文件
    transfer: transfer,  // 将上传的音频文件转换为指定配音师音色的接口
    fetchSpeaker: conversionSpeaker, // 请求支持 transfer 接口的配音师列表数据
  },
  // 多人配音
  management: {
    
  },
}

export default config
