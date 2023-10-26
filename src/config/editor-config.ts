import type { FilterSpeaker, LabelValue } from '@/model'
import type { IEditorConfig } from '@wangeditor/editor'
import type { FilterBarSearch } from '@/components/bar-search'
import type { Speaker } from '@/model'
import {type AudioInfo } from '@/menu/conversion-menu/data'
import type { CancellationToken } from '@/utils'
import { emitter } from '@/event-bus'
import mergeWith from 'lodash.mergewith'
import defaultSSMLEditorConfig from '@/default_config'

type Effects = { zoom: boolean; grayscale: boolean }
type FetchFunction = () => Promise<LabelValue[]>
type WordFetchFunction = (word: string) => Promise<LabelValue[]>
type FilterFetchFunction = (filter: FilterBarSearch) => Promise<LabelValue[]>
type FilterSpeakerFetchFunction = (filter: FilterSpeaker) => Promise<Speaker[]>

type PartialKey = 'effects' | 'bgm' | 'special' | 'tryPlay' | 'conversion' | 'management'
type PartialProps<T, K extends keyof T> = { [P in K]?: Partial<T[P]> }

export type PartialSSMLEditorConfig = Partial<Omit<SSMLEditorConfig, PartialKey>> &
  PartialProps<SSMLEditorConfig, PartialKey>

export interface SSMLEditorConfig {
  effects: Effects
  editorConfig: Partial<IEditorConfig> & {
    placeholder:string
  }
  handleWarn: (message: string) => void
  handleError: (error: unknown) => void
  pinyin: {}
  english: { fetchData: WordFetchFunction }
  bgm: {
    menus: LabelValue[]
    fetchScene: FetchFunction
    fetchStyle: FetchFunction
    fetchData: FilterFetchFunction
  }
  special: {
    menus: LabelValue[]
    fetchScene: FetchFunction
    fetchStyle: FetchFunction
    fetchData: FilterFetchFunction
  }
  tryPlay: {
    play: (ssmlGetter: () => string) => Promise<AudioInfo>
    gender: LabelValue[]
    category: LabelValue[]
    fetchData: FilterSpeakerFetchFunction
    featchTag: FetchFunction
    fetchStar: (speaker: string, star: boolean) => Promise<boolean>
    selectSpeaker?: (speaker: Speaker, setter: (speaker: Speaker) => void) => void
  }
  conversion: {
    timeoutMilliseconds: number
    audioUpload: (file: File, token: CancellationToken) => Promise<AudioInfo>
    transfer: (opt: { audioId: string; speakerId: string }) => Promise<AudioInfo>
    fetchSpeaker: () => Promise<Speaker[]>
  }
  management: {
    
  }
}

// function resolveList() {
//   return () => Promise.resolve([])
// }

// function defaultSSMLEditorConfig(): SSMLEditorConfig {
//   return {
//     effects: { zoom: true, grayscale: true },
//     editorConfig: { placeholder: '请输入内容...' },
//     handleWarn: (message) => console.warn(message) ,
//     handleError: (error) => console.error(error),
//     pinyin: {},
//     english: { fetchData: resolveList() },
//     bgm: {
//       menus: [
//         { label: '默认音效', value: '' }
//       ],
//       fetchScene: resolveList(),
//       fetchStyle: resolveList(),
//       fetchData: resolveList(),
//     },
//     special: {
//       menus: [
//         { label: '默认音效', value: '' }
//       ],
//       fetchScene: resolveList(),
//       fetchStyle: resolveList(),
//       fetchData: resolveList(),
//     },
//     conversion: {
//       timeoutMilliseconds: 20000,
//       audioUpload: () => Promise.resolve(defaultAudioInfo()),
//       transfer: () => Promise.resolve(defaultAudioInfo()),
//       fetchSpeaker: resolveList(),
//     },
//     management: {
      
//     },
//     tryPlay: {
//       play: () => Promise.resolve(defaultAudioInfo()),
//       fetchData: resolveList(),
//       featchTag: resolveList(),
//       fetchStar: () => Promise.resolve(true),
//       gender: [
//         { label: '全部', value: '' },
//         { label: '男声', value: 'Male' },
//         { label: '女声', value: 'Female' },
//       ],
//       category: [
//         { label: '常用', value: '常用' },
//         { label: '已购', value: '已购' },
//         { label: '收藏', value: '收藏' },
//         { label: '我的', value: '我的' },
//       ],
//     },
//   }
// }

function mergeSSMLEditorConfig(config?: PartialSSMLEditorConfig): SSMLEditorConfig {
  const defaultConfig = defaultSSMLEditorConfig();
  return mergeWith(defaultConfig, config, (objValue, srcValue) => {
    if (Array.isArray(objValue) && Array.isArray(srcValue)) return srcValue
  })
}

type CacheKey = 'editor-config'
const cache = {} as Record<CacheKey, unknown>

export function setConfig(config?: PartialSSMLEditorConfig) {
  const ssmlEditorConfig = mergeSSMLEditorConfig(config)
  emitter.on('error', ssmlEditorConfig.handleError)
  emitter.on('warn', ssmlEditorConfig.handleWarn)
  cache['editor-config'] = ssmlEditorConfig
}

export function getConfig() {
  const config = cache['editor-config']
  if (!config) throw new Error('SSMLEditorConfig is undefined')
  return config as SSMLEditorConfig
}
