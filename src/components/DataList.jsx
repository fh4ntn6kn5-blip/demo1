import { motion } from 'framer-motion'
import { FileText, ChevronRight } from 'lucide-react'

const MOCK_DATA = [
  { id: 1, title: '需求文档 - 用户登录功能', type: 'doc', updatedAt: '2 分钟前' },
  { id: 2, title: 'PRD v2.0 - 核心流程', type: 'doc', updatedAt: '1 小时前' },
  { id: 3, title: '架构设计 - 微服务拆分', type: 'doc', updatedAt: '3 小时前' },
  { id: 4, title: 'API 文档 - 认证接口', type: 'doc', updatedAt: '昨天' },
  { id: 5, title: '会议纪要 - Q1 规划', type: 'doc', updatedAt: '2 天前' },
]

export default function DataList({ items = MOCK_DATA }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-8 border-t border-gray-100 pt-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-800">相关文档列表</h3>
        <span className="text-xs text-gray-500">{items.length} 条结果</span>
      </div>
      <div className="space-y-1">
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-gray-50 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-purple/10 transition-colors">
              <FileText className="w-4 h-4 text-gray-500 group-hover:text-accent-purple transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800 truncate">
                {item.title}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{item.updatedAt}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
