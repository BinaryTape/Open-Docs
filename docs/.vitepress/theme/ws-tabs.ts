import { inBrowser } from 'vitepress'

export function useWsTabs() {
  if (inBrowser) {
    window.addEventListener('click', (e) => {
      const el = e.target as HTMLInputElement

      if (el.matches('.ws-tabs-container input')) {
        // input <- .ws-tablist <- .ws-tabs-container
        const group = el.parentElement?.parentElement
        if (!group) return

        const inputs = group.querySelectorAll('input')
        inputs.forEach(input => {
          if (input !== el && input.checked) {
            input.checked = false
          }
        })

        const i = Array.from(inputs).indexOf(el)
        if (i < 0) return

        const blocks = group.querySelector('.ws-tabcontents')
        if (!blocks) return

        const current = Array.from(blocks.children).find((child) =>
          child.classList.contains('active')
        )
        if (!current) return

        const next = blocks.children[i]
        if (!next || current === next) return

        current.classList.remove('active')
        next.classList.add('active')

        const label = group?.querySelector(`label[for="${el.id}"]`)
        label?.scrollIntoView({ block: 'nearest' })
      }
    })
  }
}