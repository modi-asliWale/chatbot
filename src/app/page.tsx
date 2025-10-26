"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Message } from '@/types'
import { SUPPORTED_LANGUAGES, getLanguageName } from '@/lib/languages'

const MAX_CONTEXT_MESSAGES = Number(process.env.NEXT_PUBLIC_MAX_CONTEXT_MESSAGES ?? '12')
const FALLBACK_RESPONSE =
  process.env.NEXT_PUBLIC_FALLBACK_RESPONSE ??
  'क्षम कीजिए, अभी मैं जवाब देने में असमर्थ हूँ। कृपया थोड़ी देर बाद पुनः प्रयास करें.'

const createMessage = (role: Message['role'], content: string, language: string): Message => ({
  id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  content,
  language,
  timestamp: new Date(),
})

const sanitizeHistory = (history: Message[]) =>
  history
    .filter(item => item && item.content && item.role)
    .slice(-MAX_CONTEXT_MESSAGES)

const mapHistoryForRequest = (history: Message[]) =>
  history.map(item => ({
    role: item.role,
    content: item.content,
    language: item.language,
  }))

export default function HomePage() {
  const [language, setLanguage] = useState<string>('en')
  const [inputValue, setInputValue] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const messageEndRef = useRef<HTMLDivElement | null>(null)

  const placeholderText = useMemo(() => {
    switch (language) {
      case 'hi':
        return 'अपना प्रश्न यहाँ लिखें…'
      case 'ta':
        return 'உங்கள் கேள்வியை இங்கே எழுதவும்…'
      case 'te':
        return 'మీ ప్రశ్నను ఇక్కడ నమోదు చేయండి…'
      case 'bn':
        return 'আপনার প্রশ্ন এখানে লিখুন…'
      default:
        return 'Ask anything…'
    }
  }, [language])

  const errorMessage = useMemo(() => {
    switch (language) {
      case 'hi':
        return 'सर्वम एआई तक पहुंचने में असमर्थ। कृपया थोड़ी देर में पुनः प्रयास करें।'
      case 'ta':
        return 'சர்வம் AI ஐ அணுக முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.'
      case 'te':
        return 'సర్వం AI ను చేరుకోలేకపోయాము. కాసేపటి తర్వాత మళ్లీ ప్రయత్నించండి.'
      case 'bn':
        return 'সর্বম এআই-এ পৌঁছাতে অক্ষম। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।'
      case 'mr':
        return 'सर्वम एआय पर्यंत पोहोचण्यास अक्षम. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.'
      case 'gu':
        return 'સર્વમ AI સુધી પહોંચવામાં અસમર્થ. કૃપા કરીને થોડીવારમાં ફરી પ્રયાસ કરો.'
      case 'kn':
        return 'ಸರ್ವಂ AI ಅನ್ನು ತಲುಪಲು ಸಾಧ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
      case 'ml':
        return 'സർവം AI-യിലേക്ക് എത്താൻ കഴിയുന്നില്ല. ദയവായി കുറച്ച് സമയത്തിനുശേഷം വീണ്ടും ശ്രമിക്കുക.'
      case 'pa':
        return 'ਸਰਵਮ ਏਆਈ ਤੱਕ ਪਹੁੰਚਣ ਵਿੱਚ ਅਸਮਰੱਥ। ਕਿਰਪਾ ਕਰਕੇ ਥੋੜ੍ਹੀ ਦੇਰ ਬਾਅਦ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।'
      default:
        return 'Unable to reach Sarvam AI. Please retry in a moment.'
    }
  }, [language])

  const handleSend = useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault()
      if (!inputValue.trim() || isLoading) {
        return
      }

      const trimmedContent = inputValue.trim()
      const userMessage = createMessage('user', trimmedContent, language)
      const historySnapshot = sanitizeHistory(messages)

      setMessages(prev => [...prev, userMessage])
      setInputValue('')
      setError('')
      setIsLoading(true)

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: trimmedContent,
            language,
            history: mapHistoryForRequest(historySnapshot),
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          const fallbackReply = typeof data?.fallback === 'string' && data.fallback.trim().length > 0 ? data.fallback : FALLBACK_RESPONSE
          const assistantMessage = createMessage('assistant', fallbackReply, language)
          setMessages(prev => [...prev, assistantMessage])
          setError(errorMessage)
          return
        }

        const assistantMessage = createMessage('assistant', data.reply, language)
        setMessages(prev => [...prev, assistantMessage])
      } catch (err: unknown) {
        console.error(err)
        const assistantMessage = createMessage('assistant', FALLBACK_RESPONSE, language)
        setMessages(prev => [...prev, assistantMessage])
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [inputValue, isLoading, language, messages, errorMessage],
  )

  const handleResetConversation = () => {
    setMessages([])
    setError('')
  }

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <main className="chat-container">
      <section className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">Sarvam Conversational AI</h1>
          <p className="text-slate-400 mt-2 max-w-2xl">
            Experience multilingual conversations powered by sarvam.ai. Ask in English or Indic languages and receive contextual, culturally aware responses.
          </p>
        </div>
        <div className="language-selector">
          <label htmlFor="language" className="text-sm text-slate-400">
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={event => setLanguage(event.target.value)}
            className="bg-slate-900/40 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name} · {lang.nativeName}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="message-list">
        {messages.length === 0 && (
          <div className="w-full h-full flex flex-col items-center justify-center text-center text-slate-400 gap-3">
            <span className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-300">
              Ready when you are
            </span>
            <p className="text-base md:text-lg max-w-lg leading-relaxed">
              Start the conversation in your preferred language. Sarvam AI keeps track of the context so you can have meaningful, ongoing discussions.
            </p>
          </div>
        )}

        {messages.map(message => (
          <article key={message.id} className={`message ${message.role}`}>
            <header className="message-meta">
              <span>{message.role === 'user' ? 'You' : 'Sarvam AI'}</span>
              <span className="text-slate-600">•</span>
              <span>{getLanguageName(message.language ?? language)}</span>
            </header>
            <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
          </article>
        ))}
        <div ref={messageEndRef} />
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-500/50 bg-rose-500/10 text-rose-200 px-5 py-4 text-sm">
          {error}
        </div>
      )}

      <section className="input-area">
        <form onSubmit={handleSend} className="flex flex-col md:flex-row gap-4 items-stretch">
          <div className="flex-1 bg-slate-950/40 border border-slate-800 rounded-2xl overflow-hidden">
            <textarea
              value={inputValue}
              onChange={event => setInputValue(event.target.value)}
              placeholder={placeholderText}
              className="w-full h-28 md:h-24 resize-none px-4 py-3 text-base md:text-lg"
              maxLength={1200}
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="rounded-2xl bg-primary-500 hover:bg-primary-400 disabled:bg-slate-700 disabled:cursor-not-allowed px-6 py-3 md:py-4 text-base text-white"
            >
              {isLoading ? 'Thinking…' : 'Send'}
            </button>
            <button
              type="button"
              onClick={handleResetConversation}
              className="rounded-2xl border border-slate-700 hover:border-slate-500 text-slate-200 px-6 py-3 md:py-4"
            >
              Reset
            </button>
          </div>
        </form>
        <p className="text-xs text-slate-500">
          Powered by sarvam.ai with contextual memory. We keep the last {MAX_CONTEXT_MESSAGES} messages to maintain conversational awareness.
        </p>
      </section>
    </main>
  )
}
