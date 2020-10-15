import { Data } from '@/shims-global'
import { Dialog } from 'element-ui'
import { ElDialog } from 'element-ui/types/dialog'
import Vue from 'vue'
import { VNode } from 'vue/types/umd'

interface ModalProps {
  [key: string]: any
  on?: Data
  props?: Partial<ElDialog>
  render: () => VNode | VNode[]
  footer?: (close: () => void) => VNode | VNode[]
  title?: () => string | VNode | VNode[]
}

export function createModal(attrs: ModalProps) {
  const div = document.createElement('div')
  document.body.appendChild(div)

  return new Vue({
    el: div,
    data() {
      return {
        visible: true
      }
    },
    methods: {
      close() {
        this.visible = false
        div.parentNode?.removeChild(div)
      }
    },
    render() {
      const { props, render, on, title, footer, ...others } = attrs
      return (
        <Dialog
          {...others}
          visible={this.visible}
          props={{
            width: '700px',
            ...props
          }}
          on={{
            ...on,
            'update:visible': val => (this.visible = val),
            closed: this.close
          }}
          scopedSlots={{
            default: render,
            title
          }}
        >
          {footer ? <div slot='footer'>{footer?.(this.close)}</div> : null}
        </Dialog>
      )
    }
  })
}
