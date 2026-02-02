import { useState } from 'react'
import { ChevronRight, Folder, FolderOpen, FileText, Search } from 'lucide-react'

const treeData = [
  {
    id: '1',
    name: '产品文档',
    type: 'folder',
    expanded: true,
    children: [
      { id: '1-1', name: '需求文档.md', type: 'file' },
      { id: '1-2', name: 'PRD v2.0.md', type: 'file' },
    ],
  },
  {
    id: '2',
    name: '技术方案',
    type: 'folder',
    expanded: true,
    children: [
      { id: '2-1', name: '架构设计.md', type: 'file' },
      { id: '2-2', name: 'API 文档.md', type: 'file' },
    ],
  },
  {
    id: '3',
    name: '会议纪要',
    type: 'folder',
    expanded: true,
    children: [{ id: '3-1', name: '2024 Q1 规划.md', type: 'file' }],
  },
  {
    id: '4',
    name: '数据看板',
    type: 'folder',
    expanded: true,
    children: [
      { id: '4-1', name: '李港组团队周报.md', type: 'file' },
      { id: '4-2', name: '指标追踪.md', type: 'file' },
    ],
  },
]

function TreeNode({ node, level = 0, onSelect, selectedName }) {
  const [expanded, setExpanded] = useState(node.expanded ?? false)

  if (node.type === 'file') {
    const isSelected = node.name === selectedName
    return (
      <button
        onClick={() => onSelect?.(node)}
        className={`w-full min-w-0 box-border pr-2 flex items-center gap-2 py-1.5 text-left text-sm rounded-lg transition-colors ${
          isSelected ? 'bg-accent-purple/10 text-accent-purple' : 'text-gray-700 hover:bg-white/70'
        }`}
        style={{ paddingLeft: `${level * 16}px` }}
      >
        <div
          className={`w-6 h-6 rounded-md border shadow-[0_6px_14px_-12px_rgba(0,0,0,0.18)] flex items-center justify-center ${
            isSelected ? 'bg-accent-purple/10 border-accent-purple/20' : 'bg-white/80 border-white/70'
          }`}
        >
          <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-accent-purple' : 'text-gray-500'}`} />
        </div>
        <span className="truncate flex-1 min-w-0">{node.name}</span>
      </button>
    )
  }

  return (
    <div className="select-none">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full min-w-0 box-border pr-2 flex items-center gap-2 py-1.5 text-left text-sm text-gray-800 hover:bg-white/70 rounded-lg transition-colors"
        style={{ paddingLeft: `${level * 16}px` }}
      >
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-100/80 to-blue-200/40 border border-indigo-100/70 shadow-[0_6px_14px_-12px_rgba(0,0,0,0.2)] flex items-center justify-center">
          {expanded ? (
            <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
          ) : (
            <Folder className="w-3.5 h-3.5 text-indigo-600" />
          )}
        </div>
        <ChevronRight
          className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`}
        />
        <span className="truncate flex-1 min-w-0">{node.name}</span>
      </button>
      {expanded && node.children && (
        <div className="mt-0.5">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedName={selectedName}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ onSelectDoc, selectedName }) {
  return (
    <aside className="w-[200px] h-screen shrink-0 bg-transparent">
      <div className="h-full overflow-y-auto py-5 px-4">
        <div className="text-xs text-gray-500">知识库</div>
        <div className="text-lg font-semibold text-gray-900 mt-1">知识库小组</div>

        <div className="mt-5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/50 border border-white/60">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索项目或文档..."
              className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="text-xs font-medium text-gray-500 mb-2">项目目录</div>
          <div className="space-y-1">
            {treeData.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                onSelect={onSelectDoc}
                selectedName={selectedName}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
