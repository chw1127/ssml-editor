import { SlateRange, type IDomEditor, SlateTransforms } from '@wangeditor/editor'
import BaseFn from '../base-fn'
import { EMITTER_EVENT } from '@/constant'
import { emitter } from '@/event-bus'
import type { LabelValue } from '@/model'
import type { Prosody } from '@/core'

export class ChangespeedFn extends BaseFn {
  protected readonly key: string = 'changespeed'

  public constructor(editor: IDomEditor) {
    super(editor)
  }

  public isDisabled(): boolean {
    if (super.isDisabled()) return true
    const { selection } = this.editor
    if (selection == null) return true

    if (SlateRange.isCollapsed(selection)) {
      emitter.emit(EMITTER_EVENT.ERROR, '请框选要变速的句子')
      return true
    }

    return false
  }

  exec(opt: LabelValue) {
    this.editor.restoreSelection()
    if (this.isDisabled()) return
    const value = this.getValue()
    if (value == null) return

    const node: Prosody = {
      type: 'ssml-prosody',
      remark: opt.label,
      rate: Number(opt.value),
      children: [{ text: value }]
    }

    SlateTransforms.insertNodes(this.editor, node)
  }
}
