import { type DirectiveBinding } from 'vue'

//帮助提示弹出框v-dialog:[config.cid]="config.name"
export const vDialog = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { id, value, delay } = binding.value
    const pos = el.getBoundingClientRect()
    const wrapper = document.createElement('div')
    wrapper.innerText = value
    wrapper.setAttribute('tid', id)
    wrapper.setAttribute('class', 'tip-dialog-wrapper absolute text-xs text-gray-500 bg-white py-2 px-4 rounded shadow-md hidden hover:block')
    document.querySelector('body')?.appendChild(wrapper)
    const w = document.querySelector(`body .tip-dialog-wrapper[tid=${id}]`)
    w?.setAttribute('style', `;top:${pos.top - 8}px;left:${pos.left + 14}px;`)
    const wClass = w?.classList
    el.onmouseover = function (e: MouseEvent) {
      if (delay) {
        const pos = (e.target as HTMLElement).getBoundingClientRect()
        w?.setAttribute('style', `;top:${pos.top - 30}px;left:${pos.left - 30}px;`)
      }
      wClass?.remove('hidden')
    }
    el.onmouseleave = function (e: MouseEvent) {
      wClass?.add('hidden')
    }
  },
}
//focus
export const vFocus = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (binding.value) {
      el.focus()
    }
  },
}
//click outside
export const vClickOutside = {
  mounted(el: any, binding: DirectiveBinding) {
    el.clickOutsideHandler = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideHandler, { capture: true })
  },
  onUnmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideHandler)
    delete el.clickOutsideHandler
  },
}

export const directives = {
  dialog: vDialog,
  focus: vFocus,
  clickOutside: vClickOutside,
}
