import '@wangeditor/editor/dist/css/style.css'
import './assets/main.scss'

import type { App, Plugin } from 'vue'
import { createPinia } from 'pinia'

import EditorComponentsPlugin from './components'
import EditorMenuPlugin from './menu'
import EditorViewPlugin, { EditorView } from './view'
import { type SSMLEditorConfig, createGlobalEditorConfig } from './config'
import SSMLCorePlugin from './core'
import { useEditorStore } from './stores'
import { emitter } from './event-bus'
import { EMITTER_EVENT } from './constant'

import type { FilterBarSearch } from './components/bar-search'
import type { AudioInfo } from './menu/conversion-menu/data'
import type { RecentUsageSpeaker } from './menu/management-menu/data'

export * from './constant'
export * from './model'
export * from './config'
export * from './utils'
export * from './serialize'

export default <Plugin>{
  install(app: App, config?: SSMLEditorConfig) {
    if (!app.config.globalProperties.$pinia) {
      app.use(createPinia())
    }
    app.use(() => {
      const { setGlobalEditConfig } = useEditorStore()
      const globalEditorConfig = createGlobalEditorConfig(config)
      setGlobalEditConfig(globalEditorConfig)
      emitter.on(EMITTER_EVENT.ERROR, globalEditorConfig.handleError)
    })
    app.use(SSMLCorePlugin)
    app.use(EditorComponentsPlugin)
    app.use(EditorMenuPlugin)
    app.use(EditorViewPlugin)
  },
}

export { EditorView }

export type { FilterBarSearch, AudioInfo, RecentUsageSpeaker }
