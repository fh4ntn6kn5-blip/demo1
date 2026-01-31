import { useState } from 'react'
import Sidebar from './components/Sidebar'
import MainEditor from './components/MainEditor'

export default function App() {
  const [currentDoc, setCurrentDoc] = useState('模拟场景-知识库团队周报')
  const [selectedDocName, setSelectedDocName] = useState(null)

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#F6F7FB]">
      <div className="relative flex-1 flex min-w-0">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_15%_10%,rgba(99,102,241,0.11),transparent_60%),radial-gradient(50%_60%_at_85%_15%,rgba(236,72,153,0.10),transparent_60%),radial-gradient(55%_70%_at_80%_85%,rgba(56,189,248,0.09),transparent_65%)]" />
        <Sidebar
          selectedName={selectedDocName}
          onSelectDoc={(doc) => {
            setSelectedDocName(doc?.name || null)
            setCurrentDoc(doc?.name || '未命名文档')
          }}
        />
        <MainEditor docTitle={currentDoc} />
      </div>
    </div>
  )
}
