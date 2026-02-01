import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Plus, Sparkles, ChevronDown, Zap } from 'lucide-react'
import MentionPopover from './MentionPopover'

const sugarAvatar = new URL(
  '../../img/infoflow 2026-01-31 17-57-18.png',
  import.meta.url
).href
const sugarOrb = new URL('../../img/downloaded-file.mp4', import.meta.url).href

const INITIAL_CONTENT_HTML = `
  <h3 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 12px 0;">项目一：随心搭</h3>
  <p style="margin:0 0 14px 0;color:#374151;line-height:1.7;">
    知识库“随心搭”优化业务系统API联动和代码质检、拓展沉淀开箱即用组件模板，提升使用频次，释放泛研发生产力。
  </p>

  <h4 style="font-size:14px;font-weight:600;color:#111827;margin:0 0 8px 0;">能力建设</h4>
  <p style="margin:0 0 10px 0;color:#4B5563;">PM：<span style="color:#3377ff;">@李港</span>；RD：<span style="color:#3377ff;">@谢郁</span> <span style="color:#3377ff;">@贾铮</span></p>
  <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">1、数据监控</p>
  <ul style="margin:0 0 10px 18px;color:#4B5563;">
    <li>本周数据</li>
    <li style="height:24px;"></li>
    <li style="margin-top:6px;">累计数据</li>
  </ul>
  <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">2、本周上线</p>
  <ul style="margin:0 0 10px 18px;color:#4B5563;">
    <li>侧边栏适配</li>
  </ul>
  <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">3、本周其他进展</p>
  <ul style="margin:0 0 16px 18px;color:#4B5563;">
    <li>后端随心搭一体化</li>
    <li style="margin-top:6px;">随心搭画布产品化</li>
  </ul>

  <h4 style="font-size:14px;font-weight:600;color:#111827;margin:0 0 8px 0;">业务赋能</h4>
  <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">1、本周上线</p>
  <p style="margin:0 0 12px 0;color:#4B5563;">—</p>
  <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">2、本周其他进展</p>
  <p style="margin:0 0 18px 0;color:#4B5563;">—</p>

  <h3 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 12px 0;">项目二：内外协同</h3>
  <p style="margin:0 0 14px 0;color:#374151;line-height:1.7;">
    知识库“API/SDK”优化精细化操作技能、简化数字员工调用，扩大应用场景，提升智能体参与读/写/管理的文档占比
  </p>

  <h4 style="font-size:14px;font-weight:600;color:#111827;margin:0 0 8px 0;">能力建设</h4>
  <p style="margin:0 0 10px 0;color:#4B5563;">PM：<span style="color:#3377ff;">@李港</span>；RD：<span style="color:#3377ff;">@谢郁</span> <span style="color:#3377ff;">@姚泰南</span> <span style="color:#3377ff;">@侯园梅</span></p>
  <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">1、数据监控</p>
  <ul style="margin:0 0 10px 18px;color:#4B5563;">
    <li>本周数据</li>
    <li style="height:24px;"></li>
    <li style="margin-top:6px;">累计数据</li>
  </ul>
  <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">2、本周上线</p>
  <ul style="margin:0 0 10px 18px;color:#4B5563;">
    <li>侧边栏适配</li>
  </ul>
  <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">3、本周其他进展</p>
  <p style="margin:0 0 16px 0;color:#4B5563;">—</p>

  <h4 style="font-size:14px;font-weight:600;color:#111827;margin:0 0 8px 0;">业务赋能</h4>
  <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">1、本周上线</p>
  <p style="margin:0 0 12px 0;color:#4B5563;">—</p>
  <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">2、本周其他进展</p>
  <p style="margin:0;color:#4B5563;">—</p>
`

export default function MainEditor({ docTitle = '未命名文档' }) {
  const [title, setTitle] = useState(docTitle)
  const [editorHasContent, setEditorHasContent] = useState(false)
  const [showMention, setShowMention] = useState(false)
  const [mentionPosition, setMentionPosition] = useState({ x: 0, y: 0 })
  const [sugarPosition, setSugarPosition] = useState({ x: 0, y: 0 })
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [sugarMode, setSugarMode] = useState(false)
  const [sugarInput, setSugarInput] = useState('')
  const [lastInsertHint, setLastInsertHint] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState('')
  const [showContextHint, setShowContextHint] = useState(false)
  const [contextPanelOpen, setContextPanelOpen] = useState(false)
  const [contextStep, setContextStep] = useState(0)
  const [contextDone, setContextDone] = useState(false)
  const [contextChartReady, setContextChartReady] = useState(false)
  const [contextSummaryText, setContextSummaryText] = useState('')
  const [contextChartText, setContextChartText] = useState('')
  const [contextDataLineCount, setContextDataLineCount] = useState(0)
  const [isOrbHover, setIsOrbHover] = useState(false)

  const editorRef = useRef(null)
  const inputRef = useRef(null)
  const editorScrollRef = useRef(null)
  const selectionRef = useRef(null)
  const pendingDashboardRef = useRef(null)
  const generationTimerRef = useRef([])
  const statusTypeTimerRef = useRef(null)
  const statusLineRef = useRef(null)
  const contextTimerRef = useRef([])
  const contextSummaryTimerRef = useRef(null)
  const contextChartTimerRef = useRef(null)
  const contextDataTimerRef = useRef(null)
  const contextScrollRef = useRef(null)
  const dataAnchorRef = useRef(null)

  const mentionItemsCount = 5
  const contextSummaryFull =
    '已检测到你在编辑"随心搭""数据监控"，已为你汇总"知识库团队周报-随心搭"相关数据、项目进展、用户反馈。'
  const contextChartFull = '正在智能生成可视化数据图表...'
  const contextDataLines = [
    { text: '本周数据：', type: 'title' },
    { text: '生产侧：', type: 'section' },
    { text: '搭建组件数量：5993（+1.94%）', type: 'item' },
    { text: '发布组件数量：4034（+7.77%）', type: 'item' },
    { text: '发布组件人数：1005（+2.34%）', type: 'item' },
    { text: '0-1搭建：991（+22.95%）', type: 'highlight' },
    { text: '复用：3043（+3.61%）', type: 'item' },
    { text: '复用模版：1432（+10.15%）', type: 'item' },
    { text: '复用非模版：1611（-1.59%）', type: 'highlight' },
    { text: '消费侧：', type: 'section' },
    { text: '日均活跃：3086（+2.15%）', type: 'item' },
    { text: '周活跃：8281（+3.24%）', type: 'item' },
    { text: '组件日均展示次数：34742（+25.21%）', type: 'item' },
    { text: '组件日均交互次数：189291（+57.66%）', type: 'highlight' },
    { text: '组件日均展示人数：5587（+5.61%）', type: 'item' },
    { text: '组件日均交互人数：2927（+5.94%）', type: 'item' },
    { text: '本周日均触达人次（交互UV和）：5440（历史最高）', type: 'highlight' },
    { text: '本周日均触达人次（浏览UV和）：16106（历史最高）', type: 'item' },
  ]

  const initialContentHtml = `
    <h3 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 12px 0;">项目一：随心搭</h3>
    <p style="margin:0 0 14px 0;color:#374151;line-height:1.7;">
      知识库“随心搭”优化业务系统API联动和代码质检、拓展沉淀开箱即用组件模板，提升使用频次，释放泛研发生产力。
    </p>

    <h4 style="font-size:14px;font-weight:600;color:#111827;margin:0 0 8px 0;">能力建设</h4>
    <p style="margin:0 0 10px 0;color:#4B5563;">PM：@李港；RD：@谢郁 @贾铮</p>
    <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">1、数据监控</p>
    <ul style="margin:0 0 10px 18px;color:#4B5563;">
      <li>本周数据</li>
      <li style="margin-top:6px;">累计数据</li>
    </ul>
    <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">2、本周上线</p>
    <ul style="margin:0 0 10px 18px;color:#4B5563;">
      <li>侧边栏适配</li>
    </ul>
    <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">3、本周其他进展</p>
    <ul style="margin:0 0 16px 18px;color:#4B5563;">
      <li>后端随心搭一体化</li>
      <li style="margin-top:6px;">随心搭画布产品化</li>
    </ul>

    <h4 style="font-size:14px;font-weight:600;color:#111827;margin:0 0 8px 0;">业务赋能</h4>
    <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">1、本周上线</p>
    <p style="margin:0 0 12px 0;color:#4B5563;">—</p>
    <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">2、本周其他进展</p>
    <p style="margin:0 0 18px 0;color:#4B5563;">—</p>

    <h3 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 12px 0;">项目二：内外协同</h3>
    <p style="margin:0 0 14px 0;color:#374151;line-height:1.7;">
      知识库“API/SDK”优化精细化操作技能、简化数字员工调用，扩大应用场景，提升智能体参与读/写/管理的文档占比
    </p>

    <h4 style="font-size:14px;font-weight:600;color:#111827;margin:0 0 8px 0;">能力建设</h4>
    <p style="margin:0 0 10px 0;color:#4B5563;">PM：@李港；RD：@谢郁 @姚泰南 @侯园梅</p>
    <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">1、数据监控</p>
    <ul style="margin:0 0 10px 18px;color:#4B5563;">
      <li>本周数据</li>
      <li style="margin-top:6px;">累计数据</li>
    </ul>
    <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">2、本周上线</p>
    <ul style="margin:0 0 10px 18px;color:#4B5563;">
      <li>侧边栏适配</li>
    </ul>
    <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">3、本周其他进展</p>
    <p style="margin:0 0 16px 0;color:#4B5563;">—</p>

    <h4 style="font-size:14px;font-weight:600;color:#111827;margin:0 0 8px 0;">业务赋能</h4>
    <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">1、本周上线</p>
    <p style="margin:0 0 12px 0;color:#4B5563;">—</p>
    <p style="margin:0 0 6px 0;color:#111827;font-weight:600;">2、本周其他进展</p>
    <p style="margin:0;color:#4B5563;">—</p>
  `

  const getCaretRect = useCallback((range) => {
    if (!range) return null
    const rects = range.getClientRects()
    if (rects && rects.length > 0) return rects[0]

    const marker = document.createElement('span')
    marker.textContent = '\u200b'
    marker.style.position = 'relative'
    marker.style.display = 'inline-block'
    marker.style.width = '1px'
    marker.style.height = '1em'

    const tempRange = range.cloneRange()
    tempRange.collapse(true)
    tempRange.insertNode(marker)
    const rect = marker.getBoundingClientRect()
    marker.parentNode?.removeChild(marker)
    return rect
  }, [])

  const handleEditorInput = useCallback(
    (e) => {
      const text = e.target.innerText
      setEditorHasContent(text.length > 0)
      const selection = window.getSelection()
      const range = selection?.getRangeAt(0)

      if (!range) return
      selectionRef.current = range.cloneRange()

      let textBeforeCaret = ''
      if (editorRef.current) {
        const preRange = range.cloneRange()
        preRange.selectNodeContents(editorRef.current)
        preRange.setEnd(range.endContainer, range.endOffset)
        textBeforeCaret = preRange.toString()
      } else {
        textBeforeCaret = text.substring(0, range.startOffset)
      }
      const lastAtIndex = textBeforeCaret.lastIndexOf('@')

      if (lastAtIndex !== -1) {
        const afterAt = textBeforeCaret.slice(lastAtIndex + 1)
        if (!afterAt.includes(' ') && !afterAt.includes('\n')) {
          const rect = getCaretRect(range)
          if (!rect) return
          const container = editorScrollRef.current
          const containerRect = container?.getBoundingClientRect()
          if (containerRect) {
            const left = rect.left - containerRect.left + (container?.scrollLeft || 0)
            const top = rect.bottom - containerRect.top + (container?.scrollTop || 0)
            setMentionPosition({ x: left, y: top + 6 })
          } else {
            setMentionPosition({ x: rect.left, y: rect.bottom + 6 })
          }
          setShowMention(true)
          setHighlightedIndex(0)
          return
        }
      }
      setShowMention(false)
    },
    [getCaretRect]
  )

  const findDataAnchor = useCallback(() => {
    const editor = editorRef.current
    if (!editor) return null
    const candidates = Array.from(editor.querySelectorAll('li, p, span, div'))
    const anchor = candidates.find((node) => (node.textContent || '').trim() === '本周数据')
    if (anchor) dataAnchorRef.current = anchor
    return anchor || dataAnchorRef.current
  }, [])

  const updateContextHint = useCallback(
    (range) => {
      const editor = editorRef.current
      if (!editor || !range || !editor.contains(range.startContainer)) {
        setShowContextHint(false)
        return
      }
      const anchor = findDataAnchor()
      const caretRect = getCaretRect(range)
      if (!anchor || !caretRect) {
        setShowContextHint(false)
        return
      }
      const anchorRect = anchor.getBoundingClientRect()
      // 只在光标位于"本周数据"所在行或其下一行时触发（约50px范围）
      const diff = caretRect.top - anchorRect.top
      const isNear = diff >= -10 && diff <= 50
      setShowContextHint(isNear)
    },
    [findDataAnchor, getCaretRect]
  )

  const captureSelection = useCallback(() => {
    const editor = editorRef.current
    if (!editor) return
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    const range = selection.getRangeAt(0)
    if (!editor.contains(range.startContainer)) return
    selectionRef.current = range.cloneRange()
    updateContextHint(range)
  }, [updateContextHint])

  const selectMentionByIndex = useCallback((index) => {
    const items = [
      { id: 'sugar', type: 'ai' },
      { id: 'member1', type: 'member' },
      { id: 'member2', type: 'member' },
      { id: 'doc1', type: 'doc' },
      { id: 'doc2', type: 'doc' },
    ]
    const selected = items[index]
    if (selected?.id === 'sugar') {
      removeAtTokenAtCaret()
      setSugarMode(true)
      setShowMention(false)
      setSugarPosition(mentionPosition)
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setShowMention(false)
    }
  }, [])

  const handleEditorKeyDown = useCallback(
    (e) => {
      const hint = e.target?.closest?.('[data-ai-hint="true"]')
      if (hint) {
        hint.parentNode?.removeChild(hint)
      }
      if (!showMention) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex((i) => (i + 1) % mentionItemsCount)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex((i) => (i - 1 + mentionItemsCount) % mentionItemsCount)
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        selectMentionByIndex(highlightedIndex)
        return
      }
      if (e.key === 'Escape') {
        setShowMention(false)
        return
      }
    },
    [showMention, highlightedIndex, selectMentionByIndex]
  )

  const handleMentionSelect = (item) => {
    if (item.id === 'sugar') {
      removeAtTokenAtCaret()
      setSugarMode(true)
      setShowMention(false)
      setSugarPosition(mentionPosition)
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setShowMention(false)
    }
  }

  const handleSugarConfirm = () => {
    if (sugarInput.trim()) {
      const query = sugarInput.trim()
      setSugarInput('')
      setSugarMode(false)
      pendingDashboardRef.current = query
      startGenerationSequence()
    }
  }

  const handleExitSugar = () => {
    setSugarMode(false)
    setSugarInput('')
  }

  const ensureStatusLine = (text, attempt = 0) => {
    const editor = editorRef.current
    if (!editor) {
      if (attempt < 10) {
        setTimeout(() => ensureStatusLine(text, attempt + 1), 80)
      }
      return
    }
    if (!statusLineRef.current) {
      const line = document.createElement('div')
      line.setAttribute('data-status-line', 'true')
      line.setAttribute('contenteditable', 'false')
      line.className = 'ai-status-line'
      line.style.cssText =
        'display:block;padding:6px 10px;margin:0 0 8px 0;border-radius:10px;background:rgba(99,102,241,0.08);color:#4F46E5;font-size:12px;font-weight:600;'
      statusLineRef.current = line
    }
    statusLineRef.current.setAttribute('data-status', text)
    statusLineRef.current.style.opacity = '0.35'
    if (statusTypeTimerRef.current) {
      clearInterval(statusTypeTimerRef.current)
      statusTypeTimerRef.current = null
    }
    statusLineRef.current.textContent = ''
    requestAnimationFrame(() => {
      if (statusLineRef.current) statusLineRef.current.style.opacity = '1'
    })
    let i = 0
    statusTypeTimerRef.current = setInterval(() => {
      if (!statusLineRef.current) {
        clearInterval(statusTypeTimerRef.current)
        statusTypeTimerRef.current = null
        return
      }
      statusLineRef.current.textContent = text.slice(0, i + 1)
      i += 1
      if (i >= text.length) {
        clearInterval(statusTypeTimerRef.current)
        statusTypeTimerRef.current = null
      }
    }, 40)
  }

  const clearStatusLine = () => {
    if (statusLineRef.current?.parentNode) {
      statusLineRef.current.parentNode.removeChild(statusLineRef.current)
    }
    statusLineRef.current = null
    if (statusTypeTimerRef.current) {
      clearInterval(statusTypeTimerRef.current)
      statusTypeTimerRef.current = null
    }
  }

  const insertStatusLineAtCaret = (text) => {
    const editor = editorRef.current
    if (!editor) return false
    let range = selectionRef.current
    if (!range || !editor.contains(range.startContainer)) {
      range = document.createRange()
      range.selectNodeContents(editor)
      range.collapse(false)
    }
    if (!statusLineRef.current) return false
    const line = statusLineRef.current
    try {
      range.insertNode(line)
      // place caret after line
      const sel = window.getSelection()
      const nextRange = document.createRange()
      nextRange.setStartAfter(line)
      nextRange.collapse(true)
      sel?.removeAllRanges()
      sel?.addRange(nextRange)
      selectionRef.current = nextRange
    } catch {
      editor.appendChild(line)
    }
    return true
  }

  function removeAtTokenAtCaret() {
    const editor = editorRef.current
    let range = selectionRef.current
    if (!editor || !range) return
    try {
      const node = range.startContainer
      const offset = range.startOffset
      if (node.nodeType === Node.TEXT_NODE && offset > 0) {
        const text = node.textContent || ''
        if (text[offset - 1] === '@') {
          const delRange = range.cloneRange()
          delRange.setStart(node, offset - 1)
          delRange.setEnd(node, offset)
          delRange.deleteContents()
          selectionRef.current = delRange
        }
      }
    } catch {
      // no-op
    }
  }

  const startGenerationSequence = () => {
    setIsGenerating(true)
    setGenerationStep('正在总结本周成员的内容...')
    ensureStatusLine('正在总结本周成员的内容...')
    insertStatusLineAtCaret('正在总结本周成员的内容...')

    const t1 = setTimeout(() => {
      setGenerationStep('正在拆解成员内容的数据信息...')
      ensureStatusLine('正在拆解成员内容的数据信息...')
      insertStatusLineAtCaret('正在拆解成员内容的数据信息...')
    }, 2000)

    const t2 = setTimeout(() => {
      setGenerationStep('正在总结数据呈现信息...')
      ensureStatusLine('正在总结数据呈现信息...')
      insertStatusLineAtCaret('正在总结数据呈现信息...')
    }, 4000)

    const t3 = setTimeout(() => {
      setIsGenerating(false)
      setGenerationStep('')
      clearStatusLine()
      if (pendingDashboardRef.current) {
        const queryText = pendingDashboardRef.current
        pendingDashboardRef.current = null
        insertDashboardInline(queryText)
      }
    }, 6000)

    generationTimerRef.current = [t1, t2, t3]
  }

  const insertDashboardInline = (queryText, attempt = 0) => {
    const editor = editorRef.current
    if (!editor) {
      if (attempt < 10) {
        setTimeout(() => insertDashboardInline(queryText, attempt + 1), 80)
      } else {
        setLastInsertHint('插入失败：编辑器未就绪')
      }
      return
    }

    editor.focus()
    let range = selectionRef.current
    if (!range || !editor.contains(range.startContainer)) {
      range = document.createRange()
      range.selectNodeContents(editor)
      range.collapse(false)
    }

    const dashboardHtml = `
      <div contenteditable="false" style="
        margin: 12px 0;
        padding: 16px 18px;
        border-radius: 16px;
        background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,249,255,0.95));
        border: 1px solid rgba(99, 102, 241, 0.18);
        box-shadow: 0 12px 28px -20px rgba(99, 102, 241, 0.5), 0 2px 6px rgba(0,0,0,0.04);
        position: relative;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif;
      ">
        <div style="
          position:absolute; inset:-20%;
          background: radial-gradient(40% 40% at 0% 0%, rgba(99,102,241,0.10), transparent 60%),
                      radial-gradient(35% 35% at 100% 0%, rgba(236,72,153,0.10), transparent 60%),
                      radial-gradient(40% 50% at 100% 100%, rgba(56,189,248,0.10), transparent 60%);
          pointer-events:none;
        "></div>
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; position:relative;">
          <span style="
            width: 20px; height: 20px; display:inline-flex; align-items:center; justify-content:center;
            border-radius: 6px; background: rgba(99,102,241,0.15); color:#6366F1; font-size:12px; font-weight:600;
            box-shadow: 0 0 0 1px rgba(99,102,241,0.2);
          ">AI</span>
          <span style="font-size:13px; color:#4B5563; font-weight:700; letter-spacing:0.2px;">本周数据 · 随心搭使用频次数据</span>
          <span style="margin-left:auto; font-size:11px; color:#6366F1; background:rgba(99,102,241,0.12); padding:4px 8px; border-radius:999px;">AI 生成</span>
        </div>

        <div style="display:flex; gap:8px; margin-bottom:12px;">
          <button data-tab="week" style="padding:4px 10px; border-radius:999px; border:1px solid rgba(99,102,241,0.3); background:rgba(99,102,241,0.15); color:#4F46E5; font-size:12px; font-weight:600;">本周</button>
          <button data-tab="last" style="padding:4px 10px; border-radius:999px; border:1px solid rgba(229,231,235,0.8); background:rgba(255,255,255,0.7); color:#6B7280; font-size:12px; font-weight:600;">上周</button>
        </div>

        <div data-tab-content="week">
        <div style="display:grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap:10px; margin-bottom:12px; position:relative;">
          <div style="padding:10px 12px; background:rgba(255,255,255,0.95); border-radius:12px; border:1px solid rgba(99,102,241,0.10); box-shadow: 0 8px 18px -14px rgba(99,102,241,0.35);">
            <div style="display:flex; align-items:center; gap:6px; font-size:11px; color:#9CA3AF;">
              <span style="width:18px;height:18px;border-radius:6px;background:rgba(99,102,241,0.12);display:inline-flex;align-items:center;justify-content:center;">🧩</span>
              搭建组件数量
            </div>
            <div style="font-size:18px; font-weight:600; color:#111827;" data-count="5993">5,993</div>
            <div style="font-size:11px; color:#10B981;">+1.94%</div>
          </div>
          <div style="padding:10px 12px; background:rgba(255,255,255,0.95); border-radius:12px; border:1px solid rgba(99,102,241,0.10); box-shadow: 0 8px 18px -14px rgba(99,102,241,0.35);">
            <div style="display:flex; align-items:center; gap:6px; font-size:11px; color:#9CA3AF;">
              <span style="width:18px;height:18px;border-radius:6px;background:rgba(34,197,94,0.12);display:inline-flex;align-items:center;justify-content:center;">🚀</span>
              发布组件数量
            </div>
            <div style="font-size:18px; font-weight:600; color:#111827;" data-count="4034">4,034</div>
            <div style="font-size:11px; color:#10B981;">+7.77%</div>
          </div>
          <div style="padding:10px 12px; background:rgba(255,255,255,0.95); border-radius:12px; border:1px solid rgba(99,102,241,0.10); box-shadow: 0 8px 18px -14px rgba(99,102,241,0.35);">
            <div style="display:flex; align-items:center; gap:6px; font-size:11px; color:#9CA3AF;">
              <span style="width:18px;height:18px;border-radius:6px;background:rgba(56,189,248,0.12);display:inline-flex;align-items:center;justify-content:center;">📈</span>
              日均活跃
            </div>
            <div style="font-size:18px; font-weight:600; color:#111827;" data-count="3086">3,086</div>
            <div style="font-size:11px; color:#10B981;">+2.15%</div>
          </div>
          <div style="padding:10px 12px; background:rgba(255,255,255,0.95); border-radius:12px; border:1px solid rgba(99,102,241,0.10); box-shadow: 0 8px 18px -14px rgba(99,102,241,0.35);">
            <div style="display:flex; align-items:center; gap:6px; font-size:11px; color:#9CA3AF;">
              <span style="width:18px;height:18px;border-radius:6px;background:rgba(168,85,247,0.12);display:inline-flex;align-items:center;justify-content:center;">📅</span>
              周活跃
            </div>
            <div style="font-size:18px; font-weight:600; color:#111827;" data-count="8281">8,281</div>
            <div style="font-size:11px; color:#10B981;">+3.24%</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:12px;">
          <div style="padding:12px; background:rgba(255,255,255,0.95); border-radius:12px; border:1px solid rgba(99,102,241,0.10); box-shadow: 0 10px 20px -16px rgba(99,102,241,0.35);">
            <div style="font-size:13px; color:#4B5563; font-weight:700; margin-bottom:8px;">生产侧</div>
            <div style="display:grid; grid-template-columns: 1fr; gap:8px;">
              <div style="display:flex; align-items:center; justify-content:space-between; font-size:13px; font-weight:600; color:#374151;">
                <span>发布组件人数</span>
                <span><strong>1,005</strong> <span style="color:#10B981;">+2.34%</span></span>
              </div>
              <div style="display:flex; align-items:center; justify-content:space-between; font-size:13px; font-weight:600; color:#374151;">
                <span>0-1 搭建</span>
                <span><strong>991</strong> <span style="color:#10B981;">+22.95%</span></span>
              </div>
              <div style="display:flex; align-items:center; justify-content:space-between; font-size:13px; font-weight:600; color:#374151;">
                <span>复用</span>
                <span><strong>3,043</strong> <span style="color:#10B981;">+3.61%</span></span>
              </div>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                <div style="padding:8px; border:1px solid #EEF0F3; border-radius:8px; background:#FFFFFF;">
                  <div style="font-size:11px; color:#9CA3AF;">发布组件数量</div>
                  <div style="font-size:14px; font-weight:600; color:#111827;" data-count="4034">4,034</div>
                  <div style="font-size:10px; color:#10B981;">+7.77%</div>
                </div>
                <div style="padding:8px; border:1px solid #EEF0F3; border-radius:8px; background:#FFFFFF;">
                  <div style="font-size:11px; color:#9CA3AF;">搭建组件数量</div>
                  <div style="font-size:14px; font-weight:600; color:#111827;" data-count="5993">5,993</div>
                  <div style="font-size:10px; color:#10B981;">+1.94%</div>
                </div>
              </div>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                <div style="padding:8px; border:1px solid #EEF0F3; border-radius:8px; background:#FFFFFF;">
                  <div style="font-size:11px; color:#9CA3AF;">发布渗透率</div>
                  <div style="font-size:14px; font-weight:600; color:#111827;">67.3%</div>
                  <div style="height:6px; margin-top:6px; background:#EEF2FF; border-radius:999px; overflow:hidden;">
                    <div style="width:67%; height:100%; background:linear-gradient(90deg,#6366F1,#A5B4FC);"></div>
                  </div>
                </div>
                <div style="padding:8px; border:1px solid #EEF0F3; border-radius:8px; background:#FFFFFF;">
                  <div style="font-size:11px; color:#9CA3AF;">复用占比</div>
                  <div style="font-size:14px; font-weight:600; color:#111827;">50.8%</div>
                  <div style="height:6px; margin-top:6px; background:#EEF2FF; border-radius:999px; overflow:hidden;">
                    <div style="width:51%; height:100%; background:linear-gradient(90deg,#22C55E,#86EFAC);"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style="padding:12px; background:rgba(255,255,255,0.95); border-radius:12px; border:1px solid rgba(99,102,241,0.10); box-shadow: 0 10px 20px -16px rgba(99,102,241,0.35);">
            <div style="font-size:13px; color:#4B5563; font-weight:700; margin-bottom:8px;">消费侧</div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
              <div style="padding:8px; border:1px solid #EEF0F3; border-radius:8px; background:#FFFFFF;">
                <div style="font-size:11px; color:#9CA3AF;">展示次数</div>
                <div style="font-size:14px; font-weight:600; color:#111827;" data-count="34742">34,742</div>
                <div style="font-size:10px; color:#10B981;">+25.21%</div>
              </div>
              <div style="padding:8px; border:1px solid #EEF0F3; border-radius:8px; background:#FFFFFF;">
                <div style="font-size:11px; color:#9CA3AF;">交互次数</div>
                <div style="font-size:14px; font-weight:600; color:#111827;" data-count="189291">189,291</div>
                <div style="font-size:10px; color:#10B981;">+57.66%</div>
              </div>
              <div style="padding:8px; border:1px solid #EEF0F3; border-radius:8px; background:#FFFFFF;">
                <div style="font-size:11px; color:#9CA3AF;">展示人数</div>
                <div style="font-size:14px; font-weight:600; color:#111827;" data-count="5587">5,587</div>
                <div style="font-size:10px; color:#10B981;">+5.61%</div>
              </div>
              <div style="padding:8px; border:1px solid #EEF0F3; border-radius:8px; background:#FFFFFF;">
                <div style="font-size:11px; color:#9CA3AF;">交互人数</div>
                <div style="font-size:14px; font-weight:600; color:#111827;" data-count="2927">2,927</div>
                <div style="font-size:10px; color:#10B981;">+5.94%</div>
              </div>
            </div>
            <div style="margin-top:10px; padding:8px; border-radius:8px; background:linear-gradient(90deg, rgba(99,102,241,0.12), rgba(56,189,248,0.10)); font-size:11px; color:#4B5563;">
              触达人次（交互UV和）：<strong>5,440</strong>（历史最高） · 触达人次（浏览UV和）：<strong>16,106</strong>（历史最高）
            </div>
          </div>
        </div>
        </div>

        <div data-tab-content="last" style="display:none;">
        <div style="display:grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap:10px; margin-bottom:12px; position:relative;">
          <div style="padding:10px 12px; background:rgba(255,255,255,0.95); border-radius:12px; border:1px solid rgba(99,102,241,0.10); box-shadow: 0 8px 18px -14px rgba(99,102,241,0.35);">
            <div style="display:flex; align-items:center; gap:6px; font-size:11px; color:#9CA3AF;">
              <span style="width:18px;height:18px;border-radius:6px;background:rgba(99,102,241,0.12);display:inline-flex;align-items:center;justify-content:center;">🧩</span>
              搭建组件数量
            </div>
            <div style="font-size:18px; font-weight:600; color:#111827;" data-count="5608">5,608</div>
            <div style="font-size:11px; color:#10B981;">+1.12%</div>
          </div>
          <div style="padding:10px 12px; background:rgba(255,255,255,0.95); border-radius:12px; border:1px solid rgba(99,102,241,0.10); box-shadow: 0 8px 18px -14px rgba(99,102,241,0.35);">
            <div style="display:flex; align-items:center; gap:6px; font-size:11px; color:#9CA3AF;">
              <span style="width:18px;height:18px;border-radius:6px;background:rgba(34,197,94,0.12);display:inline-flex;align-items:center;justify-content:center;">🚀</span>
              发布组件数量
            </div>
            <div style="font-size:18px; font-weight:600; color:#111827;" data-count="3761">3,761</div>
            <div style="font-size:11px; color:#10B981;">+5.41%</div>
          </div>
          <div style="padding:10px 12px; background:rgba(255,255,255,0.95); border-radius:12px; border:1px solid rgba(99,102,241,0.10); box-shadow: 0 8px 18px -14px rgba(99,102,241,0.35);">
            <div style="display:flex; align-items:center; gap:6px; font-size:11px; color:#9CA3AF;">
              <span style="width:18px;height:18px;border-radius:6px;background:rgba(56,189,248,0.12);display:inline-flex;align-items:center;justify-content:center;">📈</span>
              日均活跃
            </div>
            <div style="font-size:18px; font-weight:600; color:#111827;" data-count="2950">2,950</div>
            <div style="font-size:11px; color:#10B981;">+1.76%</div>
          </div>
          <div style="padding:10px 12px; background:rgba(255,255,255,0.95); border-radius:12px; border:1px solid rgba(99,102,241,0.10); box-shadow: 0 8px 18px -14px rgba(99,102,241,0.35);">
            <div style="display:flex; align-items:center; gap:6px; font-size:11px; color:#9CA3AF;">
              <span style="width:18px;height:18px;border-radius:6px;background:rgba(168,85,247,0.12);display:inline-flex;align-items:center;justify-content:center;">📅</span>
              周活跃
            </div>
            <div style="font-size:18px; font-weight:600; color:#111827;" data-count="7990">7,990</div>
            <div style="font-size:11px; color:#10B981;">+2.58%</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:12px;">
          <div style="padding:12px; background:rgba(255,255,255,0.95); border-radius:12px; border:1px solid rgba(99,102,241,0.10); box-shadow: 0 10px 20px -16px rgba(99,102,241,0.35);">
            <div style="font-size:13px; color:#4B5563; font-weight:700; margin-bottom:8px;">生产侧</div>
            <div style="display:grid; grid-template-columns: 1fr; gap:8px;">
              <div style="display:flex; align-items:center; justify-content:space-between; font-size:13px; font-weight:600; color:#374151;">
                <span>发布组件人数</span>
                <span style="color:#111827;" data-count="968">968</span>
              </div>
              <div style="display:flex; align-items:center; justify-content:space-between; font-size:13px; font-weight:600; color:#374151;">
                <span>0-1搭建</span>
                <span style="color:#111827;" data-count="915">915</span>
              </div>
              <div style="display:flex; align-items:center; justify-content:space-between; font-size:13px; font-weight:600; color:#374151;">
                <span>复用模版</span>
                <span style="color:#111827;" data-count="1369">1,369</span>
              </div>
              <div style="display:flex; align-items:center; justify-content:space-between; font-size:13px; font-weight:600; color:#374151;">
                <span>复用非模版</span>
                <span style="color:#111827;" data-count="1528">1,528</span>
              </div>
              <div style="padding:8px; border:1px solid #EEF0F3; border-radius:8px; background:#FFFFFF;">
                <div style="font-size:11px; color:#9CA3AF;">复用占比</div>
                <div style="font-size:14px; font-weight:600; color:#111827;">48.6%</div>
                <div style="height:6px; margin-top:6px; background:#EEF2FF; border-radius:999px; overflow:hidden;">
                  <div style="width:49%; height:100%; background:linear-gradient(90deg,#22C55E,#86EFAC);"></div>
                </div>
              </div>
            </div>
          </div>

          <div style="padding:12px; background:rgba(255,255,255,0.95); border-radius:12px; border:1px solid rgba(99,102,241,0.10); box-shadow: 0 10px 20px -16px rgba(99,102,241,0.35);">
            <div style="font-size:13px; color:#4B5563; font-weight:700; margin-bottom:8px;">消费侧</div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
              <div style="padding:8px; border:1px solid #EEF0F3; border-radius:8px; background:#FFFFFF;">
                <div style="font-size:11px; color:#9CA3AF;">展示次数</div>
                <div style="font-size:14px; font-weight:600; color:#111827;" data-count="32960">32,960</div>
                <div style="font-size:10px; color:#10B981;">+18.8%</div>
              </div>
              <div style="padding:8px; border:1px solid #EEF0F3; border-radius:8px; background:#FFFFFF;">
                <div style="font-size:11px; color:#9CA3AF;">交互次数</div>
                <div style="font-size:14px; font-weight:600; color:#111827;" data-count="167420">167,420</div>
                <div style="font-size:10px; color:#10B981;">+42.3%</div>
              </div>
              <div style="padding:8px; border:1px solid #EEF0F3; border-radius:8px; background:#FFFFFF;">
                <div style="font-size:11px; color:#9CA3AF;">展示人数</div>
                <div style="font-size:14px; font-weight:600; color:#111827;" data-count="5420">5,420</div>
                <div style="font-size:10px; color:#10B981;">+4.1%</div>
              </div>
              <div style="padding:8px; border:1px solid #EEF0F3; border-radius:8px; background:#FFFFFF;">
                <div style="font-size:11px; color:#9CA3AF;">交互人数</div>
                <div style="font-size:14px; font-weight:600; color:#111827;" data-count="2788">2,788</div>
                <div style="font-size:10px; color:#10B981;">+4.6%</div>
              </div>
            </div>
            <div style="margin-top:10px; padding:8px; border-radius:8px; background:linear-gradient(90deg, rgba(99,102,241,0.12), rgba(56,189,248,0.10)); font-size:11px; color:#4B5563;">
              触达人次（交互UV和）：<strong>5,020</strong> · 触达人次（浏览UV和）：<strong>15,220</strong>
            </div>
          </div>
        </div>
        </div>
      </div>
    `

    const wrapper = document.createElement('div')
    wrapper.innerHTML = dashboardHtml
    const dashboardNode = wrapper.firstElementChild
    if (!dashboardNode) return
    dashboardNode.classList.add('ai-dashboard-insert')
    const animateNumbers = (root) => {
      const nodes = root.querySelectorAll('[data-count]')
      nodes.forEach((node) => {
        const target = Number(node.getAttribute('data-count'))
        if (!Number.isFinite(target)) return
        const duration = 900
        const start = performance.now()
        const formatter = new Intl.NumberFormat('en-US')
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          const value = Math.floor(target * progress)
          node.textContent = formatter.format(value)
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      })
    }

    const tabButtons = Array.from(dashboardNode.querySelectorAll('[data-tab]'))
    const tabContents = Array.from(dashboardNode.querySelectorAll('[data-tab-content]'))
    const setTab = (name) => {
      tabContents.forEach((content) => {
        content.style.display = content.getAttribute('data-tab-content') === name ? 'block' : 'none'
      })
      tabButtons.forEach((btn) => {
        const active = btn.getAttribute('data-tab') === name
        btn.style.background = active ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.7)'
        btn.style.color = active ? '#4F46E5' : '#6B7280'
        btn.style.borderColor = active ? 'rgba(99,102,241,0.3)' : 'rgba(229,231,235,0.8)'
      })
      const activeContent = dashboardNode.querySelector(`[data-tab-content="${name}"]`)
      if (activeContent) animateNumbers(activeContent)
    }
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => setTab(btn.getAttribute('data-tab')))
    })
    setTab('week')

    const spacer = document.createElement('p')
    spacer.innerHTML = '<br />'

    try {
      range.deleteContents()
      range.insertNode(spacer)
      range.insertNode(dashboardNode)
      const sel = window.getSelection()
      const nextRange = document.createRange()
      nextRange.setStartAfter(spacer)
      nextRange.collapse(true)
      sel?.removeAllRanges()
      sel?.addRange(nextRange)
    } catch {
      editor.appendChild(dashboardNode)
      editor.appendChild(spacer)
    }
    setEditorHasContent(true)
    requestAnimationFrame(() => animateNumbers(dashboardNode))
    setLastInsertHint('已插入数据面板')
    setTimeout(() => setLastInsertHint(''), 1500)
  }

  const insertDashboardAfterAnchor = (queryText) => {
    const editor = editorRef.current
    if (!editor) {
      insertDashboardInline(queryText)
      return
    }
    const anchor = findDataAnchor()
    if (!anchor) {
      insertDashboardInline(queryText)
      return
    }
    const list = anchor.closest('ul')
    if (list && list.parentNode) {
      const newList = document.createElement('ul')
      const listStyle = list.getAttribute('style')
      if (listStyle) newList.setAttribute('style', listStyle)
      while (anchor.nextSibling) {
        newList.appendChild(anchor.nextSibling)
      }
      if (newList.childNodes.length > 0) {
        list.parentNode.insertBefore(newList, list.nextSibling)
      }
      const range = document.createRange()
      range.setStartAfter(list)
      range.collapse(true)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
      selectionRef.current = range
    }
    insertDashboardInline(queryText)
  }

  const handleContextInsert = () => {
    insertDashboardAfterAnchor('随心搭')
    setContextPanelOpen(false)
  }

  const handleContextRegenerate = () => {
    pendingDashboardRef.current = '随心搭'
    startGenerationSequence()
  }

  const handleContextLocate = () => {
    const anchor = findDataAnchor()
    if (anchor?.scrollIntoView) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleContextEdit = () => {
    editorRef.current?.focus()
  }

  useEffect(() => {
    const onSelectionChange = () => captureSelection()
    document.addEventListener('selectionchange', onSelectionChange)
    return () => document.removeEventListener('selectionchange', onSelectionChange)
  }, [captureSelection])

  useEffect(() => {
    return () => {
      generationTimerRef.current.forEach((t) => clearTimeout(t))
      generationTimerRef.current = []
      clearStatusLine()
    }
  }, [])

  useEffect(() => {
    if (!contextPanelOpen) return
    setContextStep(0)
    setContextDone(false)
    setContextSummaryText('')
    setContextChartText('')
    setContextChartReady(false)
    setContextDataLineCount(0)
    if (contextSummaryTimerRef.current) {
      clearInterval(contextSummaryTimerRef.current)
      contextSummaryTimerRef.current = null
    }
    if (contextChartTimerRef.current) {
      clearInterval(contextChartTimerRef.current)
      contextChartTimerRef.current = null
    }
    if (contextDataTimerRef.current) {
      clearInterval(contextDataTimerRef.current)
      contextDataTimerRef.current = null
    }
    contextTimerRef.current.forEach((t) => clearTimeout(t))
    contextTimerRef.current = []
    const t1 = setTimeout(() => setContextStep(1), 1600)
    const t2 = setTimeout(() => setContextStep(2), 3800)
    const t3 = setTimeout(() => setContextChartReady(true), 8800)
    const t4 = setTimeout(() => setContextDone(true), 9500)
    contextTimerRef.current = [t1, t2, t3, t4]
    return () => {
      contextTimerRef.current.forEach((t) => clearTimeout(t))
      contextTimerRef.current = []
      if (contextSummaryTimerRef.current) {
        clearInterval(contextSummaryTimerRef.current)
        contextSummaryTimerRef.current = null
      }
      if (contextChartTimerRef.current) {
        clearInterval(contextChartTimerRef.current)
        contextChartTimerRef.current = null
      }
      if (contextDataTimerRef.current) {
        clearInterval(contextDataTimerRef.current)
        contextDataTimerRef.current = null
      }
    }
  }, [contextPanelOpen])

  useEffect(() => {
    if (!contextPanelOpen || contextSummaryTimerRef.current) return
    let i = 0
    contextSummaryTimerRef.current = setInterval(() => {
      i += 1
      setContextSummaryText(contextSummaryFull.slice(0, i))
      if (i >= contextSummaryFull.length) {
        clearInterval(contextSummaryTimerRef.current)
        contextSummaryTimerRef.current = null
      }
    }, 30)
    return () => {
      if (contextSummaryTimerRef.current) {
        clearInterval(contextSummaryTimerRef.current)
        contextSummaryTimerRef.current = null
      }
    }
  }, [contextPanelOpen, contextSummaryFull])

  useEffect(() => {
    if (
      !contextPanelOpen ||
      contextStep < 2 ||
      contextDataLineCount < contextDataLines.length ||
      contextChartTimerRef.current
    )
      return
    let i = 0
    contextChartTimerRef.current = setInterval(() => {
      i += 1
      setContextChartText(contextChartFull.slice(0, i))
      if (i >= contextChartFull.length) {
        clearInterval(contextChartTimerRef.current)
        contextChartTimerRef.current = null
      }
    }, 32)
    return () => {
      if (contextChartTimerRef.current) {
        clearInterval(contextChartTimerRef.current)
        contextChartTimerRef.current = null
      }
    }
  }, [contextPanelOpen, contextStep, contextChartFull, contextDataLineCount, contextDataLines.length])

  useEffect(() => {
    if (
      !contextPanelOpen ||
      contextStep < 1 ||
      contextSummaryText.length < contextSummaryFull.length ||
      contextDataTimerRef.current
    )
      return
    contextDataTimerRef.current = setInterval(() => {
      setContextDataLineCount((prev) => {
        const next = Math.min(prev + 1, contextDataLines.length)
        if (next >= contextDataLines.length && contextDataTimerRef.current) {
          clearInterval(contextDataTimerRef.current)
          contextDataTimerRef.current = null
        }
        return next
      })
    }, 90)
    return () => {
      if (contextDataTimerRef.current) {
        clearInterval(contextDataTimerRef.current)
        contextDataTimerRef.current = null
      }
    }
  }, [contextPanelOpen, contextStep, contextSummaryText.length, contextSummaryFull.length, contextDataLines.length])

  useEffect(() => {
    if (!contextPanelOpen) return
    const container = contextScrollRef.current
    if (!container) return
    requestAnimationFrame(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
    })
  }, [contextStep, contextDataLineCount, contextChartReady, contextDone, contextPanelOpen])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    if (editor.innerHTML.trim().length === 0) {
      editor.innerHTML = INITIAL_CONTENT_HTML
      setEditorHasContent(true)
    }
  }, [])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    if (editor.innerHTML.trim().length === 0) {
      editor.innerHTML = initialContentHtml
      setEditorHasContent(true)
    }
  }, [initialContentHtml])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    const headings = Array.from(editor.querySelectorAll('h2'))
    headings.forEach((heading) => {
      if ((heading.textContent || '').trim() === '重点关注') {
        heading.remove()
      }
    })
  }, [])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    if (editor.querySelector('[data-trailing-breaks="true"]')) return
    const spacer = document.createElement('p')
    spacer.setAttribute('data-trailing-breaks', 'true')
    spacer.style.margin = '0'
    spacer.innerHTML = '<br />'.repeat(10)
    editor.appendChild(spacer)
  }, [])

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-transparent">
      <div className="px-[clamp(20px,3vw,56px)] pt-6 pb-2">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <button className="hover:text-gray-800 transition-colors">知识库</button>
          <span>/</span>
          <button className="hover:text-gray-800 transition-colors">产品文档</button>
          <span>/</span>
          <span className="text-gray-800 font-medium">{title}</span>
        </nav>
      </div>

      <div className="px-[clamp(20px,3vw,56px)] pt-2 pb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="无标题"
          className="w-full text-3xl font-semibold text-gray-900 placeholder:text-gray-300 border-none outline-none bg-transparent"
        />
      </div>

      <div className="flex-1 px-[clamp(20px,3vw,56px)] pb-8 overflow-y-auto">
        <div className="max-w-none w-full h-full">
          <div className="relative h-full min-h-[calc(100vh-210px)] bg-white/65 backdrop-blur-2xl rounded-3xl shadow-[0_24px_60px_-40px_rgba(17,24,39,0.32)] border border-white/50 px-10 pt-10 pb-0 flex flex-col overflow-hidden">
            <div ref={editorScrollRef} className="flex-1 overflow-y-auto pr-0 hide-scrollbar">
              <div className="relative min-h-[360px]">
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleEditorInput}
                  onKeyDown={handleEditorKeyDown}
                  onClick={(e) => {
                    const hint = e.target?.closest?.('[data-ai-hint="true"]')
                    if (hint) hint.parentNode?.removeChild(hint)
                    captureSelection()
                  }}
                  onKeyUp={captureSelection}
                  className="min-h-[360px] outline-none text-gray-700 leading-relaxed text-[15px] relative z-10"
                  data-placeholder="输入内容，使用 @ 引用成员或 AI..."
                  onFocus={(e) => {
                    if (!e.target.textContent) e.target.textContent = ''
                  }}
                />

                {!editorHasContent && (
                  <div
                    className="absolute left-0 top-0 text-gray-400 text-[15px] pointer-events-none select-none z-0"
                    aria-hidden
                  >
                    输入内容，使用 @ 引用成员或 AI...
                  </div>
                )}

                {lastInsertHint && (
                  <div className="absolute right-0 top-0 text-xs text-accent-purple bg-accent-purple/10 px-2 py-1 rounded-md">
                    {lastInsertHint}
                  </div>
                )}

                {showMention && (
                  <MentionPopover
                    position={mentionPosition}
                    visible={showMention}
                    onSelect={handleMentionSelect}
                    highlightedIndex={highlightedIndex}
                  />
                )}

                <AnimatePresence>
                  {sugarMode && (
                    <motion.div
                      key="sugar"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute z-20"
                      style={{
                        left: sugarPosition.x,
                        top: sugarPosition.y,
                      }}
                    >
                      <div className="relative rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/20 via-accent-purple/10 to-accent-purple/20 rounded-xl blur-sm" />
                        <div className="relative bg-white rounded-xl border border-accent-purple/30 shadow-glow p-1">
                          <div className="flex items-center gap-3 p-3">
                            <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/70 shadow-[0_8px_18px_-14px_rgba(0,0,0,0.3)] flex-shrink-0">
                              <img
                                src={sugarAvatar}
                                alt="Sugar 智能体"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] font-semibold text-accent-purple tracking-wide">
                                Sugar 智能体
                              </div>
                              <input
                                ref={inputRef}
                                type="text"
                                value={sugarInput}
                                onChange={(e) => setSugarInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSugarConfirm()
                                  if (e.key === 'Escape') handleExitSugar()
                                }}
                                placeholder="输入问题或续写指令"
                                className="w-full text-[15px] text-gray-800 placeholder:text-gray-400 outline-none bg-transparent mt-1"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={handleExitSugar}
                                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                取消
                              </button>
                              <button
                                onClick={handleSugarConfirm}
                                disabled={!sugarInput.trim()}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-purple text-white text-sm font-medium hover:bg-accent-purple-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Send className="w-4 h-4" />
                                确认
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!contextPanelOpen && (
          <motion.div
            key="context-hint"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="fixed top-6 right-8 z-40"
          >
            {/* 单一按钮容器，球体共用 */}
            <button
              onClick={() => setContextPanelOpen(true)}
              onMouseEnter={() => setIsOrbHover(true)}
              onMouseLeave={() => setIsOrbHover(false)}
              className={`relative flex items-center rounded-full transition-all duration-300 ease-out ${
                showContextHint
                  ? 'hint-glow'
                  : ''
              }`}
            >
              {/* 背景层：展开时显示 */}
              <motion.div
                initial={false}
                animate={{
                  width: showContextHint ? 'auto' : 36,
                  paddingLeft: showContextHint ? 16 : 0,
                  paddingRight: showContextHint ? 16 : 0,
                  paddingTop: showContextHint ? 8 : 0,
                  paddingBottom: showContextHint ? 8 : 0,
                }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className={`flex items-center gap-3 rounded-full ${
                  showContextHint
                    ? 'hint-glow-inner bg-white/95 backdrop-blur border border-white/90 shadow-[0_12px_30px_-18px_rgba(17,24,39,0.5)]'
                    : ''
                }`}
              >
                {/* 球体：始终显示，大小随状态微调 */}
                <motion.div
                  initial={false}
                  animate={{
                    width: showContextHint ? 28 : 36,
                    height: showContextHint ? 28 : 36,
                  }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                  className={`rounded-full overflow-hidden ring-1 ring-white/70 flex-shrink-0 ${
                    showContextHint
                      ? 'shadow-[0_8px_18px_-10px_rgba(15,23,42,0.5)]'
                      : 'orb-float shadow-[0_10px_22px_-12px_rgba(15,23,42,0.55)]'
                  }`}
                >
                  <video
                    src={sugarOrb}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </motion.div>

                {/* 文字内容：展开时显示 */}
                <AnimatePresence>
                  {showContextHint && (
                    <motion.div
                      key="hint-text"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="flex items-center gap-3 overflow-hidden whitespace-nowrap text-sm text-gray-700"
                    >
                      <span className="text-accent-purple font-semibold">Sugar 智能体</span>
                      <span>正在为你检测随心搭数据</span>
                      <span className="text-accent-purple font-semibold">查看</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </button>

            {/* hover 提示：仅默认状态下显示 */}
            <AnimatePresence>
              {!showContextHint && isOrbHover && (
                <motion.div
                  key="orb-tip"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 px-3 py-2 rounded-lg bg-white/95 border border-white/80 shadow-[0_12px_26px_-20px_rgba(15,23,42,0.45)] text-xs text-gray-600 whitespace-nowrap pointer-events-none"
                >
                  检测到你在编辑周报，即将为你推荐相关资料.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {contextPanelOpen && (
          <motion.aside
            key="context-panel"
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            className="fixed right-0 top-0 h-screen w-[360px] z-40 bg-white/35 backdrop-blur-[30px] border-l border-white/60 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.4)] overflow-hidden flex flex-col"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -inset-[35%] panel-flow bg-[radial-gradient(40%_40%_at_15%_20%,rgba(99,102,241,0.25),transparent_60%),radial-gradient(35%_35%_at_80%_10%,rgba(236,72,153,0.22),transparent_60%),radial-gradient(45%_45%_at_70%_80%,rgba(56,189,248,0.2),transparent_65%)]" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-white/35 to-white/25" />
            </div>
            <div ref={contextScrollRef} className="flex-1 min-h-0 flex flex-col overflow-y-auto">
              <div className="sticky top-0 z-10 flex items-center justify-between px-5 pt-5 pb-3 bg-white/60 backdrop-blur-[28px] border-b border-white/60">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">Sugar 智能体</span>
                  <span className="text-[11px] text-gray-500">环境感知</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setContextPanelOpen(false)}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    关闭
                  </button>
                </div>
              </div>

              <div className="relative px-5 pb-8 pt-4 flex flex-col gap-4">

              <div className="text-sm text-gray-600 leading-relaxed select-none">
                {contextSummaryText}
              </div>

              {contextSummaryText.length >= contextSummaryFull.length && contextStep >= 1 && (
                <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-[0_14px_30px_-22px_rgba(15,23,42,0.4)]">
                  <div className="text-sm font-semibold text-gray-900">
                    Sugar 已汇总“随心搭”本周数据
                  </div>
                  <div className="text-xs text-gray-500 mt-1">包含生产侧、消费侧搭建数量</div>
                  <div className="mt-3 text-sm leading-relaxed select-none">
                    {contextDataLines.slice(0, contextDataLineCount).map((line, idx) => {
                      const isItem = line.type === 'item' || line.type === 'highlight'
                      const className =
                        line.type === 'title'
                          ? 'font-semibold text-gray-900 mb-2'
                          : line.type === 'section'
                            ? 'font-semibold text-gray-900 mt-3 mb-1'
                            : line.type === 'highlight'
                              ? 'text-emerald-600 font-semibold'
                              : 'text-gray-700'
                      return (
                        <div key={`${line.text}-${idx}`} className={`${className} ${isItem ? 'pl-3' : ''}`}>
                          {isItem ? '• ' : ''}
                          {line.text}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {contextStep >= 2 && contextDataLineCount >= contextDataLines.length && (
                <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.35)]">
                  <div className="text-sm text-gray-700 select-none">{contextChartText}</div>
                  {!contextChartReady && (
                    <div className="mt-4 space-y-3">
                      <div className="h-4 w-2/3 rounded-full bg-gray-200/70 animate-pulse" />
                      <div className="h-28 w-full rounded-2xl bg-gray-200/70 animate-pulse" />
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-12 rounded-xl bg-gray-200/70 animate-pulse" />
                        <div className="h-12 rounded-xl bg-gray-200/70 animate-pulse" />
                        <div className="h-12 rounded-xl bg-gray-200/70 animate-pulse" />
                      </div>
                    </div>
                  )}
                  {contextChartReady && (
                    <div className="mt-4 space-y-3">
                      <div className="text-xs text-gray-500">图表生成完成</div>
                      <div className="rounded-xl border border-gray-200/70 bg-gradient-to-br from-white to-gray-50 p-3 shadow-[0_10px_22px_-18px_rgba(15,23,42,0.4)]">
                        <div className="flex items-center justify-between text-[11px] text-gray-500">
                          <span>生产侧 / 消费侧预览</span>
                          <span className="text-emerald-500">实时</span>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <div className="h-16 rounded-lg bg-gradient-to-b from-indigo-100 to-indigo-200/60" />
                          <div className="h-16 rounded-lg bg-gradient-to-b from-sky-100 to-sky-200/60" />
                          <div className="h-16 rounded-lg bg-gradient-to-b from-emerald-100 to-emerald-200/60" />
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-gray-200/70 overflow-hidden">
                          <div className="h-full w-[62%] bg-accent-purple/60" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {contextDone && (
                <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-[0_14px_30px_-22px_rgba(15,23,42,0.4)]">
                  <div className="text-sm text-gray-700">Sugar已汇总"随心搭"本周数据：包含生产侧、消费侧搭建数量，如右图。提供操作：</div>
                  <div className="mt-3 flex items-center gap-1.5">
                    <button
                      onClick={handleContextInsert}
                      className="px-2.5 py-1 text-xs rounded-full bg-accent-purple text-white hover:bg-accent-purple-dark transition-colors"
                    >
                      插入
                    </button>
                    <button
                      onClick={handleContextEdit}
                      className="px-2.5 py-1 text-xs rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      onClick={handleContextLocate}
                      className="px-2.5 py-1 text-xs rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      定位
                    </button>
                    <button
                      onClick={handleContextRegenerate}
                      className="px-2.5 py-1 text-xs rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      重新生成
                    </button>
                    <button
                      onClick={() => setContextPanelOpen(false)}
                      className="px-2.5 py-1 text-xs rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      丢弃
                    </button>
                  </div>
                </div>
              )}
              </div>
            </div>

            {/* 底部 AI 输入框 */}
            <div className="shrink-0 px-4 pb-4 pt-2 border-t border-white/50 bg-white/50 backdrop-blur-md">
              <div className="rounded-xl bg-white/90 border border-gray-200/80 px-3 py-3 shadow-sm">
                <input
                  type="text"
                  placeholder="输入你的问题..."
                  className="w-full text-sm bg-transparent outline-none placeholder:text-gray-300 mb-3"
                />
                <div className="flex items-center gap-2">
                  <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors text-gray-500">
                    <Plus size={16} />
                  </button>
                  <div className="h-4 w-px bg-gray-200" />
                  <button className="flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-gray-100 transition-colors text-xs text-gray-600">
                    <Sparkles size={12} className="text-accent-purple" />
                    <span>GPT-4o</span>
                    <ChevronDown size={10} />
                  </button>
                  <button className="flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-gray-100 transition-colors text-xs text-gray-600">
                    <Zap size={12} className="text-amber-500" />
                    <span>能力</span>
                    <ChevronDown size={10} />
                  </button>
                  <div className="flex-1" />
                  <button className="w-6 h-6 flex items-center justify-center rounded-md bg-accent-purple text-white hover:bg-accent-purple-dark transition-colors">
                    <Send size={12} />
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </main>
  )
}
