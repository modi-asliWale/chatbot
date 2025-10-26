import { NextResponse } from 'next/server'
import { chatWithSarvam, SarvamApiError } from '@/lib/sarvam'
import type { Message } from '@/types'

const MAX_CONTEXT_MESSAGES = Number(process.env.MAX_CONTEXT_MESSAGES ?? 12)
const FALLBACK_RESPONSE =
  process.env.CHATBOT_FALLBACK_RESPONSE ??
  'I am unable to respond right now. Please try again in a moment.'

const SYSTEM_PROMPT =
  process.env.SARVAM_SYSTEM_PROMPT ??
  'You are Sarvam AI, a multilingual assistant for India. Respond with empathy, clarity, and cultural respect. Always answer in the language the user prefers.'

const allowedRoles = new Set(['user', 'assistant', 'system'])

const sanitizeHistory = (history: Message[]): Message[] => {
  if (!Array.isArray(history)) {
    return []
  }

  return history
    .filter(item => allowedRoles.has(item.role) && typeof item.content === 'string' && item.content.trim().length > 0)
    .map(item => ({
      ...item,
      content: item.content.trim(),
      language: item.language ?? 'en',
    }))
    .slice(-MAX_CONTEXT_MESSAGES)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const message: string | undefined = body?.message
    const language: string = body?.language || 'en'
    const history: Message[] = sanitizeHistory(body?.history || [])

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message text is required.' }, { status: 400 })
    }

    const normalizedMessage = message.trim()

    const messages = [
      {
        role: 'system' as const,
        content: SYSTEM_PROMPT,
        language,
      },
      ...history.map(item => ({
        role: item.role,
        content: item.content,
        language: item.language ?? language,
      })),
      {
        role: 'user' as const,
        content: normalizedMessage,
        language,
      },
    ]

    const sarvamReply = await chatWithSarvam({
      messages,
      language,
    })

    return NextResponse.json({
      reply: sarvamReply,
      language,
    })
  } catch (error: unknown) {
    if (error instanceof SarvamApiError) {
      return NextResponse.json(
        {
          error: error.message,
          fallback: FALLBACK_RESPONSE,
        },
        { status: error.statusCode },
      )
    }

    console.error('[sarvam-chatbot] Unexpected error', error)
    return NextResponse.json(
      {
        error: 'Unexpected error while processing the request.',
        fallback: FALLBACK_RESPONSE,
      },
      { status: 500 },
    )
  }
}
