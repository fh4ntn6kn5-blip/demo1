"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText } from "lucide-react"
import Image from "next/image"

const MENTION_ITEMS = [
  {
    id: "sugar",
    type: "ai",
    name: "Sugar 智能体",
    desc: "AI 助手，帮你续写、改写、翻译",
    avatar: "/sugar-avatar.png",
  },
  {
    id: "member1",
    type: "member",
    name: "张雨",
    desc: "产品经理",
    badge: "张",
    badgeColor: "text-emerald-700",
    badgeBg: "bg-emerald-100/70",
  },
  {
    id: "member2",
    type: "member",
    name: "林泽",
    desc: "前端开发",
    badge: "林",
    badgeColor: "text-sky-700",
    badgeBg: "bg-sky-100/70",
  },
  {
    id: "doc1",
    type: "doc",
    name: "需求文档.md",
    desc: "产品文档",
  },
  {
    id: "doc2",
    type: "doc",
    name: "架构设计.md",
    desc: "技术方案",
  },
]

export interface MentionItem {
  id: string
  type: string
  name: string
  desc: string
  avatar?: string
  badge?: string
  badgeColor?: string
  badgeBg?: string
}

export default function MentionPopover({
  position,
  visible,
  onSelect,
  highlightedIndex,
}: {
  position: { x: number; y: number }
  visible: boolean
  onSelect: (item: MentionItem) => void
  highlightedIndex: number
}) {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!visible || !popoverRef.current) return
    const el = popoverRef.current.querySelector(`[data-index="${highlightedIndex}"]`)
    el?.scrollIntoView({ block: "nearest" })
  }, [visible, highlightedIndex])

  if (!visible) return null

  return (
    <AnimatePresence>
      <motion.div
        ref={popoverRef}
        initial={{ opacity: 0, scale: 0.98, y: -2 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -2 }}
        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        className="absolute z-50 w-[300px] bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_18px_40px_-24px_rgba(17,24,39,0.35)] border border-white/60 py-2 max-h-72 overflow-hidden"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">引用对象</div>
        {MENTION_ITEMS.map((item, index) => {
          const isHighlighted = index === highlightedIndex
          const isSugar = item.id === "sugar"

          return (
            <button
              key={item.id}
              data-index={index}
              onClick={() => onSelect(item)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                isHighlighted ? "bg-indigo-500/10" : "hover:bg-white/70"
              } ${isSugar && isHighlighted ? "ring-1 ring-inset ring-indigo-500/20" : ""}`}
            >
              {item.avatar ? (
                <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/60 shadow-[0_8px_20px_-14px_rgba(0,0,0,0.3)] flex-shrink-0 relative">
                  <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                </div>
              ) : item.badge ? (
                <div
                  className={`w-9 h-9 rounded-xl border border-white/70 flex items-center justify-center flex-shrink-0 shadow-[0_6px_16px_-12px_rgba(0,0,0,0.2)] ${item.badgeBg}`}
                >
                  <span className={`text-sm font-semibold ${item.badgeColor}`}>{item.badge}</span>
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-white/80 border border-white/70 flex items-center justify-center flex-shrink-0 shadow-[0_6px_16px_-12px_rgba(0,0,0,0.2)]">
                  <FileText className="w-4 h-4 text-gray-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium truncate ${isSugar ? "text-indigo-500" : "text-gray-800"}`}>
                  {item.name}
                </div>
                <div className="text-xs text-gray-500 truncate">{item.desc}</div>
              </div>
              {isSugar && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 font-medium">
                  AI
                </span>
              )}
            </button>
          )
        })}
      </motion.div>
    </AnimatePresence>
  )
}
