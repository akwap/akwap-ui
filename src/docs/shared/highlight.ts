/**
 * Minimal, dependency-free syntax highlighter for the snippets shown in the
 * docs (Vue SFC / HTML, TS/JS, CSS, shell). Output is escaped HTML with
 * token classes coloured by design tokens in CodeBlock.vue.
 */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const wrap = (cls: string, s: string) => `<span class="tk-${cls}">${esc(s)}</span>`

function highlightScript(code: string): string {
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|\b(import|from|export|default|const|let|var|function|return|if|else|for|of|in|new|await|async|type|interface|extends|true|false|null|undefined|as)\b|\b(\d+(?:\.\d+)?)\b/g
  let out = ''
  let last = 0
  for (const m of code.matchAll(re)) {
    out += esc(code.slice(last, m.index))
    out += m[1] ? wrap('comment', m[0]) : m[2] ? wrap('string', m[0]) : m[3] ? wrap('keyword', m[0]) : wrap('number', m[0])
    last = m.index! + m[0].length
  }
  return out + esc(code.slice(last))
}

function highlightCss(code: string): string {
  const re = /(\/\*[\s\S]*?\*\/)|(@[\w-]+)|(--[\w-]+)|([\w-]+)(?=\s*:)|('(?:[^']*)'|"(?:[^"]*)")/g
  let out = ''
  let last = 0
  for (const m of code.matchAll(re)) {
    out += esc(code.slice(last, m.index))
    out += m[1] ? wrap('comment', m[0]) : m[2] ? wrap('keyword', m[0]) : m[3] ? wrap('attr', m[0]) : m[4] ? wrap('tag', m[0]) : wrap('string', m[0])
    last = m.index! + m[0].length
  }
  return out + esc(code.slice(last))
}

function highlightMarkup(code: string): string {
  const re = /(<!--[\s\S]*?-->)|(<\/?)([\w.-]+)|([:@#]?[\w.:-]+)(=)("[^"]*")|(\/?>)/g
  let out = ''
  let last = 0
  for (const m of code.matchAll(re)) {
    out += esc(code.slice(last, m.index))
    if (m[1]) out += wrap('comment', m[0])
    else if (m[2]) out += wrap('punct', m[2]) + wrap('tag', m[3]!)
    else if (m[4]) out += wrap('attr', m[4]) + wrap('punct', m[5]!) + wrap('string', m[6]!)
    else out += wrap('punct', m[0])
    last = m.index! + m[0].length
  }
  return out + esc(code.slice(last))
}

export function highlight(code: string, lang: 'vue' | 'ts' | 'css' | 'bash' | 'html' = 'vue'): string {
  if (lang === 'ts') return highlightScript(code)
  if (lang === 'css') return highlightCss(code)
  if (lang === 'bash') return code.split('\n').map((l) => (l.trim().startsWith('#') ? wrap('comment', l) : esc(l))).join('\n')
  // Vue SFC: split script/style blocks from template markup.
  const parts = code.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>)/)
  return parts
    .map((p) => {
      const m = /^(<(script|style)[^>]*>)([\s\S]*?)(<\/(?:script|style)>)$/.exec(p)
      if (!m) return highlightMarkup(p)
      return highlightMarkup(m[1]!) + (m[2] === 'style' ? highlightCss(m[3]!) : highlightScript(m[3]!)) + highlightMarkup(m[4]!)
    })
    .join('')
}
