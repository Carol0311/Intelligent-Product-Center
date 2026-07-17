const isHTMLInputElement = (target: EventTarget | null): target is HTMLInputElement => {
  return target !== null && (target as HTMLElement).tagName === 'INPUT'
}
export const keyUp = function (e: Event) {
  if (!isHTMLInputElement(e.target)) return
  if (isNaN(Number(e.target.value))) {
    e.target.value = e.target.value.match(/\d/g)?.join('') || ''
    e.preventDefault()
  }
}
