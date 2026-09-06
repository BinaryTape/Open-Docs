import { normalizeWritersideCodeBlocks } from './normalize-writerside-code-blocks'

export default function markdownItWsCodeblockCdata(md: any) {
  md.core.ruler.before('block', 'ws_codeblock_cdata', (state: any) => {
    state.src = normalizeWritersideCodeBlocks(state.src)
  })
}
