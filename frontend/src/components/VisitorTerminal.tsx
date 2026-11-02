import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { CornerDownLeft } from 'lucide-react'
import { apiUrl } from '../lib/api'

export const VisitorTerminal: React.FC = () => {
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalLogs, setTerminalLogs] = useState<Array<{ text: string; type: 'input' | 'output' }>>([
    { text: "Hi, this is Quadri's terminal.", type: 'output' },
    { text: 'Type a command and press enter, or pick one below.', type: 'output' }
  ])
  const terminalEndRef = useRef<HTMLDivElement>(null)

  const handleTerminalCommand = async (cmdStr?: string) => {
    const rawInput = (cmdStr || terminalInput).trim()
    if (!rawInput) return

    const command = rawInput.toLowerCase()

    if (command === 'clear') {
      setTerminalLogs([])
      setTerminalInput('')
      return
    }

    if (command === 'guestbook') {
      setTerminalLogs((prev) => [
        ...prev,
        { text: '$ guestbook', type: 'input' },
        { text: 'Opening digital guestbook at /guestbook...', type: 'output' }
      ])
      setTerminalInput('')
      setTimeout(() => {
        window.location.href = '/guestbook'
      }, 500)
      return
    }

    const processingMsg = 'AI: PROCESSING...'
    const wakingMsg = 'AI: Waking backend server (Render cold-start ~20-30s)...'

    setTerminalLogs((prev) => [...prev, { text: `$ ${rawInput}`, type: 'input' }])
    setTerminalInput('')
    setTerminalLogs((prev) => [...prev, { text: processingMsg, type: 'output' }])

    const wakeTimer = setTimeout(() => {
      setTerminalLogs((prev) =>
        prev.map((l) => (l.text === processingMsg ? { ...l, text: wakingMsg } : l))
      )
    }, 2500)

    try {
      const res = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: rawInput })
      })

      let reply = ''
      if (res.ok) {
        const json = await res.json()
        reply = json.reply
      }

      if (!reply) {
        reply =
          "I am Quadri's AI Assistant! Ask me anything about Quadri's software engineering projects, AI research, academic background, or how to get in touch."
      }

      setTerminalLogs((prev) => {
        const filtered = prev.filter((l) => l.text !== processingMsg && l.text !== wakingMsg)
        return [...filtered, { text: reply, type: 'output' }]
      })
    } catch {
      setTerminalLogs((prev) => {
        const filtered = prev.filter((l) => l.text !== processingMsg && l.text !== wakingMsg)
        return [
          ...filtered,
          {
            text: "AI service temporarily unreachable. Type 'clear' to reset terminal or email amooquadri555@gmail.com.",
            type: 'output'
          }
        ]
      })
    } finally {
      clearTimeout(wakeTimer)
    }

    setTimeout(() => {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-12 rounded-lg border border-[#233554] bg-[#0b1d36]"
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#233554]">
        <span className="font-mono text-xs text-[#8892b0]">guest@amoo-quadri.vercel.app</span>
        <span className="text-xs text-[#495670] hidden sm:inline">Ask about my work, or pick a command</span>
      </div>

      <div className="h-44 overflow-y-auto px-5 py-4 space-y-2 font-mono text-[13px] leading-relaxed scrollbar-none">
        {terminalLogs.map((log, i) => (
          <div key={i} className={log.type === 'input' ? 'text-[#64ffda]' : 'text-[#a8b2d1]'}>
            {log.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      <div className="border-t border-[#233554] px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleTerminalCommand()
          }}
          className="flex items-center gap-2 flex-1 min-w-0"
        >
          <span className="font-mono text-sm text-[#64ffda]">$</span>
          <input
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            placeholder="type a command or question"
            aria-label="Terminal command"
            className="bg-transparent text-[13px] text-[#ccd6f6] placeholder-[#495670] focus:outline-none w-full font-mono"
          />
          <button type="submit" aria-label="Send command" className="text-[#495670] hover:text-[#64ffda] transition-colors">
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
          {['help', 'guestbook', 'skills', 'projects', 'contact', 'clear'].map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => handleTerminalCommand(cmd)}
              className="text-[#8892b0] hover:text-[#64ffda] underline-offset-4 hover:underline transition-colors cursor-pointer"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default VisitorTerminal
