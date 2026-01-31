import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
import MentionPopover from './MentionPopover'

const sugarAvatar = new URL(
  '../../img/infoflow 2026-01-31 17-57-18.png',
  import.meta.url
).href

const INITIAL_CONTENT_HTML = `
  <h3 style="font-size:16px;font-weight:600;color:#111827;margin:0 0 10px 0;">部门指标</h3>
  <div style="border:1px solid #EEF0F3;border-radius:12px;overflow:hidden;margin-bottom:16px;background:#FFFFFF;">
    <div style="display:grid;grid-template-columns:120px 200px 80px 140px 140px 140px 220px 120px;font-size:12px;font-weight:600;color:#6B7280;background:#F7F8FA;">
      <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">类型</div>
      <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">指标名称</div>
      <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">单位</div>
      <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">26年目标值</div>
      <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">26年Q1目标值</div>
      <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">Q4末基线值</div>
      <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">计算方法</div>
      <div style="padding:8px 10px;">备注</div>
    </div>
    <div style="display:grid;grid-template-columns:120px 200px 80px 140px 140px 140px 220px 120px;font-size:12px;color:#374151;">
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">公司和业务降本</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">业务工时节省</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">人月</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">800人月（+10%）</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">180人月</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">727.3人月</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">被赋能业务原人工时 - 现人工时</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;">Q1:72.8; Q2:153.2</div>
    </div>
    <div style="display:grid;grid-template-columns:120px 200px 80px 140px 140px 140px 220px 120px;font-size:12px;color:#374151;">
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">月人均交付需求数</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">平台化赋能交付需求数</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">个</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">-</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">-</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">-</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">各项开放能力赋能业务的交付需求数</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;">-</div>
    </div>
    <div style="display:grid;grid-template-columns:120px 200px 80px 140px 140px 140px 220px 120px;font-size:12px;color:#374151;">
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">-</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">研发工时节省</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">人月</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">209人月（+10%）</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">50人月</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">190人月</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">开发者原研发工时 - 现研发工时</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;">-</div>
    </div>
  </div>

  <h3 style="font-size:16px;font-weight:600;color:#111827;margin:0 0 10px 0;">团队关键指标</h3>
  <div style="border:1px solid #EEF0F3;border-radius:12px;overflow:hidden;margin-bottom:16px;background:#FFFFFF;">
    <div style="display:grid;grid-template-columns:240px 80px 140px 140px 140px 220px;font-size:12px;font-weight:600;color:#6B7280;background:#F7F8FA;">
      <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">指标名称</div>
      <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">单位</div>
      <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">26年目标值</div>
      <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">26年Q1目标值</div>
      <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">Q4末基线值</div>
      <div style="padding:8px 10px;">计算方法</div>
    </div>
    <div style="display:grid;grid-template-columns:240px 80px 140px 140px 140px 220px;font-size:12px;color:#374151;">
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">智能体参与读/写/管理的文档占比</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">%</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">10%</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">5.8%</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">4.8%</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;">智能体参与读/写/管理的日均文档数 / 活跃的日均文档数</div>
    </div>
    <div style="display:grid;grid-template-columns:240px 80px 140px 140px 140px 220px;font-size:12px;color:#374151;">
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">知识库“随心搭”组件日均交互次数</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">次/日</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">-</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">-</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">-</div>
      <div style="padding:8px 10px;border-top:1px solid #EEF0F3;">-</div>
    </div>
  </div>

  <h3 style="font-size:16px;font-weight:600;color:#111827;margin:0 0 10px 0;">项目进展</h3>
  <p style="margin:0 0 20px 0;font-size:14px;color:#4B5563;line-height:1.6;">
    O1：【知识管理】打造人与智能体协同的开放知识库，AI内化实现文档新体验，打通文档上下游断点，赋能工作流提效
  </p>
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

  const editorRef = useRef(null)
  const inputRef = useRef(null)
  const editorScrollRef = useRef(null)
  const selectionRef = useRef(null)
  const pendingDashboardRef = useRef(null)
  const generationTimerRef = useRef([])
  const statusTypeTimerRef = useRef(null)
  const statusLineRef = useRef(null)

  const mentionItemsCount = 5

  const initialContentHtml = `
    <h3 style="font-size:16px;font-weight:600;color:#111827;margin:0 0 10px 0;">部门指标</h3>
    <div style="border:1px solid #EEF0F3;border-radius:12px;overflow:hidden;margin-bottom:16px;background:#FFFFFF;">
      <div style="display:grid;grid-template-columns:120px 200px 80px 140px 140px 140px 220px 120px;font-size:12px;font-weight:600;color:#6B7280;background:#F7F8FA;">
        <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">类型</div>
        <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">指标名称</div>
        <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">单位</div>
        <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">26年目标值</div>
        <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">26年Q1目标值</div>
        <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">Q4末基线值</div>
        <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">计算方法</div>
        <div style="padding:8px 10px;">备注</div>
      </div>
      <div style="display:grid;grid-template-columns:120px 200px 80px 140px 140px 140px 220px 120px;font-size:12px;color:#374151;">
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">公司和业务降本</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">业务工时节省</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">人月</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">800人月（+10%）</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">180人月</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">727.3人月</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">被赋能业务原人工时 - 现人工时</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;">Q1:72.8; Q2:153.2</div>
      </div>
      <div style="display:grid;grid-template-columns:120px 200px 80px 140px 140px 140px 220px 120px;font-size:12px;color:#374151;">
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">月人均交付需求数</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">平台化赋能交付需求数</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">个</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">-</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">-</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">-</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">各项开放能力赋能业务的交付需求数</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;">-</div>
      </div>
      <div style="display:grid;grid-template-columns:120px 200px 80px 140px 140px 140px 220px 120px;font-size:12px;color:#374151;">
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">-</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">研发工时节省</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">人月</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">209人月（+10%）</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">50人月</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">190人月</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">开发者原研发工时 - 现研发工时</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;">-</div>
      </div>
    </div>

    <h3 style="font-size:16px;font-weight:600;color:#111827;margin:0 0 10px 0;">团队关键指标</h3>
    <div style="border:1px solid #EEF0F3;border-radius:12px;overflow:hidden;margin-bottom:16px;background:#FFFFFF;">
      <div style="display:grid;grid-template-columns:240px 80px 140px 140px 140px 220px;font-size:12px;font-weight:600;color:#6B7280;background:#F7F8FA;">
        <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">指标名称</div>
        <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">单位</div>
        <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">26年目标值</div>
        <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">26年Q1目标值</div>
        <div style="padding:8px 10px;border-right:1px solid #EEF0F3;">Q4末基线值</div>
        <div style="padding:8px 10px;">计算方法</div>
      </div>
      <div style="display:grid;grid-template-columns:240px 80px 140px 140px 140px 220px;font-size:12px;color:#374151;">
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">智能体参与读/写/管理的文档占比</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">%</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">10%</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">5.8%</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">4.8%</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;">智能体参与读/写/管理的日均文档数 / 活跃的日均文档数</div>
      </div>
      <div style="display:grid;grid-template-columns:240px 80px 140px 140px 140px 220px;font-size:12px;color:#374151;">
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">知识库“随心搭”组件日均交互次数</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">次/日</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">-</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">-</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;border-right:1px solid #EEF0F3;">-</div>
        <div style="padding:8px 10px;border-top:1px solid #EEF0F3;">-</div>
      </div>
    </div>

    <h3 style="font-size:16px;font-weight:600;color:#111827;margin:0 0 10px 0;">项目进展</h3>
    <p style="margin:0 0 20px 0;font-size:14px;color:#4B5563;line-height:1.6;">
      O1：【知识管理】打造人与智能体协同的开放知识库，AI内化实现文档新体验，打通文档上下游断点，赋能工作流提效
    </p>
  <p style="margin:0;">
    <br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br />
  </p>
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

  const captureSelection = useCallback(() => {
    const editor = editorRef.current
    if (!editor) return
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    const range = selection.getRangeAt(0)
    if (!editor.contains(range.startContainer)) return
    selectionRef.current = range.cloneRange()
  }, [])

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
          <span style="font-size:13px; color:#4B5563; font-weight:700; letter-spacing:0.2px;">本周数据 · 知识库方向周报</span>
          <span style="font-size:12px; color:#9CA3AF;">${queryText}</span>
          <span style="margin-left:auto; font-size:11px; color:#6366F1; background:rgba(99,102,241,0.12); padding:4px 8px; border-radius:999px;">AI 生成</span>
        </div>

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
    </main>
  )
}
