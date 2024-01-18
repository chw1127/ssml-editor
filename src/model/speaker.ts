import type { LabelValue } from './label-value'

export interface Speaker {
  id: string
  name: string
  displayName: string
  category: string
  avatar: string
  isFree: boolean
  isStar: boolean
  isSupper24K: boolean
  gender:string
  localeZH:string
  roles: (LabelValue & { avatar?: string; emoji?: string })[]
  styles: (LabelValue & { avatar?: string; emoji?: string })[]
}

export function defaultSpeaker(): Speaker {
  return {
    id: 'zh-CN-XiaoxiaoNeural',
    category: '',
    avatar: '',
    isFree: false,
    isStar: false,
    isSupper24K: false,
    gender:"Female",
    localeZH:"中文(普通话，简体)",
    roles: [],
    styles: [],
    name: "zh-CN-XiaoxiaoNeural",
    displayName: "晓晓",
  }
}

export interface FilterSpeaker {
  word: string
  topFlag: string
  category: string
  gender: string
  tag: string
}

export function defaultFilterSpeaker(): FilterSpeaker {
  return {
    word: '',
    topFlag: '',
    category: '',
    gender: '',
    tag: '',
  }
}
