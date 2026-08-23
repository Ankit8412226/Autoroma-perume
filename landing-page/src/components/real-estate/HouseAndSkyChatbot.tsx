'use client'

import * as React from 'react'
import Link from 'next/link'
import { MessageSquare, X, Send, Sparkles, Building2, ShieldCheck, ArrowUpRight } from 'lucide-react'

interface ChatMessage {
  id: string
  sender: 'user' | 'bot'
  text: string
  properties?: Array<{ title: string; price: string; location: string; slug: string }>
  timestamp: string
}

export function HouseAndSkyChatbot() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Welcome to House & Sky Real Estate Concierge. Ask me about our Bandra penthouses, Goa architectural villas, or confidential off-market viewing access.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  const chatContainerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input
    if (!query.trim() || isLoading) return

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      })

      const data = await res.json()

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'I am happy to assist with your House & Sky property discovery.',
        properties: data.properties,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, botMsg])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'bot',
          text: 'Thank you for reaching out. Connect with our advisory desk directly at +91 022 8800 9900.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const promptSuggestions = [
    'Bandra Penthouses',
    'Goa Villas',
    'Gurgaon Estates',
    'Book Private Tour',
  ]

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-3.5 bg-brand-green text-white rounded-full shadow-2xl hover:bg-brand-dark transition-all duration-300 flex items-center justify-center cursor-pointer group border border-white/20"
        aria-label="Toggle House & Sky AI Concierge"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-5 h-5 text-brand-sky animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline text-white">
              AI Concierge
            </span>
          </div>
        )}
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-22 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white border border-brand-green/20 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[520px] animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header Bar */}
          <div className="bg-brand-dark text-white p-4 flex items-center justify-between border-b border-brand-green/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center border border-white/20">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-serif text-base font-normal text-white">House & Sky Concierge</h4>
                <p className="text-[10px] text-brand-soft font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  AI Real Estate Advisor
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/70 hover:text-white rounded-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-bg-primary">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-lg text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-green text-white rounded-br-none shadow-sm'
                      : 'bg-white border border-brand-green/15 text-brand-charcoal rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Property Cards in Bot Replies */}
                  {msg.properties && msg.properties.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-brand-green/10">
                      {msg.properties.map((prop) => (
                        <div
                          key={prop.slug}
                          className="bg-brand-soft border border-brand-green/20 p-2.5 rounded-md space-y-1"
                        >
                          <span className="text-[9px] uppercase tracking-wider font-bold text-brand-green block">
                            RECOMMENDED RESIDENCE
                          </span>
                          <h5 className="font-serif text-xs font-bold text-brand-charcoal">{prop.title}</h5>
                          <div className="flex items-center justify-between text-[10px] text-brand-charcoal/70">
                            <span>{prop.location}</span>
                            <span className="font-bold text-brand-green">{prop.price}</span>
                          </div>
                          <Link
                            href={`/properties/${prop.slug}`}
                            className="text-[10px] text-brand-green font-bold uppercase tracking-wider flex items-center gap-1 pt-1 hover:underline"
                            onClick={() => setIsOpen(false)}
                          >
                            <span>View Residence</span>
                            <ArrowUpRight className="w-3 h-3 text-brand-green" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-brand-charcoal/40 font-mono mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start">
                <div className="bg-white border border-brand-green/15 p-3 rounded-lg text-xs text-brand-charcoal/60 flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 bg-brand-green rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-brand-green rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 bg-brand-green rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-4 py-2 bg-white border-t border-brand-green/10 flex items-center gap-1.5 overflow-x-auto">
            {promptSuggestions.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSend(chip)}
                className="shrink-0 px-2.5 py-1 bg-brand-soft hover:bg-brand-green hover:text-white border border-brand-green/20 text-[10px] font-bold text-brand-green rounded-full transition-all cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="p-3 bg-white border-t border-brand-green/15 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about properties, pricing, locations..."
              className="flex-1 bg-brand-soft border border-brand-green/20 text-brand-charcoal placeholder-brand-charcoal/50 text-xs px-3.5 py-2.5 rounded-md focus:outline-none focus:border-brand-green"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-brand-green text-white rounded-md hover:bg-brand-dark transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
