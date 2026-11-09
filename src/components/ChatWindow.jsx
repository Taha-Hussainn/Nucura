import { useState, useEffect, useRef } from 'react'
import { Send, X, MessageCircle } from 'lucide-react'
import { getMessages, sendMessage } from '../api/chat'
import { supabase } from '../supabase/client'

const ChatWindow = ({ chat, currentUser, onClose }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  // Stop the page behind from scrolling while the chat is full-screen on phones
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 639px)').matches
    if (!isMobile) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    getMessages(chat.id).then(result => { if (result.success) setMessages(result.data) })

    const channel = supabase
      .channel(`chat:${chat.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chat.id}`
      }, (payload) => {
        setMessages(prev => prev.some(m => m.id === payload.new.id) ? prev : [...prev, payload.new])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [chat.id])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim()) return
    setSending(true)
    await sendMessage(chat.id, currentUser.id, currentUser.name, currentUser.userType, newMessage.trim())
    setNewMessage('')
    setSending(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const otherPersonName = currentUser.userType === 'patient' ? chat.doctor_name : chat.patient_name

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white sm:inset-auto sm:bottom-4 sm:right-4 sm:w-[380px] sm:h-[520px] sm:rounded-2xl sm:shadow-2xl sm:border sm:border-slate-200">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-700 to-teal-700 sm:rounded-t-2xl flex-shrink-0">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">{otherPersonName}</h3>
            <p className="text-blue-100 text-xs">Secure chat</p>
          </div>
        </div>
        <button onClick={onClose} aria-label="Close chat" className="text-white hover:bg-white/20 p-2.5 rounded-lg transition flex-shrink-0">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 mt-10">
            <MessageCircle className="h-10 w-10 mx-auto mb-2 text-slate-200" />
            <p className="text-sm">No messages yet. Say hello!</p>
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_id === currentUser.id
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                isMe ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white text-slate-800 border border-slate-100 shadow-sm rounded-bl-sm'
              }`}>
                {!isMe && <p className="text-xs font-semibold text-teal-600 mb-1">{msg.sender_name}</p>}
                <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-slate-100 bg-white sm:rounded-b-2xl flex-shrink-0 pb-safe">
        <div className="flex items-center space-x-2">
          <input type="text" placeholder="Type a message..."
            className="flex-1 min-w-0 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyDown} />
          <button onClick={handleSend} disabled={sending || !newMessage.trim()} aria-label="Send message"
            className="w-11 h-11 flex-shrink-0 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50 active:scale-95">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow