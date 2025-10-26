import axios from 'axios'

interface SarvamMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  language?: string
}

interface SarvamPayload {
  model: string
  messages: SarvamMessage[]
  language?: string
  temperature?: number
  top_p?: number
  max_tokens?: number
}

interface SarvamChoice {
  message?: {
    content?: string
  }
  text?: string
}

interface SarvamAPIResponse {
  choices?: SarvamChoice[]
  output?: string
  response?: string
  message?: string
  data?: {
    output?: string
  }
}

export interface SarvamChatOptions {
  messages: SarvamMessage[]
  language?: string
}

export class SarvamApiError extends Error {
  statusCode: number
  constructor(message: string, statusCode = 500) {
    super(message)
    this.name = 'SarvamApiError'
    this.statusCode = statusCode
  }
}

const DEFAULT_MODEL = process.env.SARVAM_MODEL ?? 'chat-saarthi'
const BASE_URL = process.env.SARVAM_API_URL ?? 'https://api.sarvam.ai/v1'
const CHAT_ENDPOINT = process.env.SARVAM_CHAT_ENDPOINT ?? '/chat/completions'
const API_TIMEOUT_MS = Number(process.env.SARVAM_TIMEOUT_MS ?? 20000)

const toPayload = (options: SarvamChatOptions): SarvamPayload => {
  const payload: SarvamPayload = {
    model: DEFAULT_MODEL,
    messages: options.messages,
  }

  if (options.language) {
    payload.language = options.language
  }

  const temperature = process.env.SARVAM_TEMPERATURE
  if (temperature) {
    payload.temperature = Number(temperature)
  }

  const topP = process.env.SARVAM_TOP_P
  if (topP) {
    payload.top_p = Number(topP)
  }

  const maxTokens = process.env.SARVAM_MAX_TOKENS
  if (maxTokens) {
    payload.max_tokens = Number(maxTokens)
  }

  return payload
}

const extractContent = (response: SarvamAPIResponse): string | null => {
  if (response.choices?.length) {
    const choice = response.choices[0]
    if (choice.message?.content) {
      return choice.message.content.trim()
    }
    if (choice.text) {
      return choice.text.trim()
    }
  }

  if (response.output) {
    return response.output.trim()
  }

  if (response.response) {
    return response.response.trim()
  }

  if (response.data?.output) {
    return response.data.output.trim()
  }

  if (response.message) {
    return response.message.trim()
  }

  return null
}

export const chatWithSarvam = async (options: SarvamChatOptions): Promise<string> => {
  const apiKey = process.env.SARVAM_API_KEY

  if (!apiKey) {
    throw new SarvamApiError('Sarvam API key is missing. Please configure SARVAM_API_KEY in your environment.')
  }

  const payload = toPayload(options)

  try {
    const { data } = await axios.post<SarvamAPIResponse>(
      `${BASE_URL}${CHAT_ENDPOINT}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: API_TIMEOUT_MS,
      },
    )

    const reply = extractContent(data)

    if (!reply) {
      throw new SarvamApiError('Sarvam API returned an empty response.')
    }

    return reply
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502
      const detail = error.response?.data
      const message =
        detail?.error ||
        detail?.message ||
        error.response?.statusText ||
        'Unable to fetch response from Sarvam API.'
      throw new SarvamApiError(message, status)
    }

    if (error instanceof SarvamApiError) {
      throw error
    }

    throw new SarvamApiError('Unexpected error while communicating with Sarvam API.')
  }
}
