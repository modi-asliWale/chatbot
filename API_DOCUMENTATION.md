# API Documentation

This document describes the API endpoints and integration with Sarvam.ai.

## Endpoints

### POST /api/chat

Send a message to the chatbot and receive an AI-generated response.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```typescript
{
  message: string;        // The user's message (required)
  language: string;       // Language code (e.g., 'en', 'hi', 'ta')
  history?: Array<{       // Conversation history (optional)
    role: 'user' | 'assistant';
    content: string;
    language?: string;
  }>;
}
```

**Example:**
```json
{
  "message": "What is artificial intelligence?",
  "language": "en",
  "history": [
    {
      "role": "user",
      "content": "Hello",
      "language": "en"
    },
    {
      "role": "assistant",
      "content": "Hello! How can I help you today?",
      "language": "en"
    }
  ]
}
```

#### Response

**Success Response (200 OK):**
```typescript
{
  reply: string;       // AI-generated response
  language: string;    // Language of the response
}
```

**Example:**
```json
{
  "reply": "Artificial intelligence is the simulation of human intelligence processes by machines, especially computer systems.",
  "language": "en"
}
```

**Error Response (4xx/5xx):**
```typescript
{
  error: string;       // Error message
  fallback?: string;   // Fallback response
}
```

**Example:**
```json
{
  "error": "API key is missing",
  "fallback": "I am unable to respond right now. Please try again later."
}
```

#### Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid API key |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 502 | Bad Gateway - Sarvam.ai API error |

## Sarvam.ai Integration

### Authentication

The application uses Bearer token authentication with the Sarvam.ai API.

**Header:**
```
Authorization: Bearer YOUR_API_KEY
```

### Chat Completions Endpoint

**Base URL:** `https://api.sarvam.ai/v1`

**Endpoint:** `/chat/completions`

**Method:** `POST`

**Request Body:**
```typescript
{
  model: string;              // Model identifier
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
    language?: string;
  }>;
  language?: string;          // Target language
  temperature?: number;       // Response randomness (0-1)
  top_p?: number;             // Nucleus sampling
  max_tokens?: number;        // Maximum response length
}
```

**Response:**
```typescript
{
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}
```

### Supported Models

- `chat-saarthi` - Default multilingual chat model

### Supported Languages

ISO 639-1 language codes:

| Code | Language | Native Name |
|------|----------|-------------|
| en | English | English |
| hi | Hindi | हिन्दी |
| bn | Bengali | বাংলা |
| ta | Tamil | தமிழ் |
| te | Telugu | తెలుగు |
| mr | Marathi | मराठी |
| gu | Gujarati | ગુજરાતી |
| kn | Kannada | ಕನ್ನಡ |
| ml | Malayalam | മലയാളം |
| pa | Punjabi | ਪੰਜਾਬੀ |

## Client-Side Integration

### Using the Chat API from React

```typescript
import { useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  language?: string
}

export function useChatbot(language: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (message: string) => {
    setIsLoading(true)
    
    const userMessage: Message = {
      role: 'user',
      content: message,
      language,
    }
    
    setMessages(prev => [...prev, userMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          language,
          history: messages,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply,
        language,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    sendMessage,
    isLoading,
  }
}
```

### Using the Chat API with JavaScript

```javascript
async function chatWithBot(message, language, history = []) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        language,
        history,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get response')
    }

    return data.reply
  } catch (error) {
    console.error('Chat error:', error)
    throw error
  }
}

// Usage
chatWithBot('Hello', 'en')
  .then(reply => console.log(reply))
  .catch(error => console.error(error))
```

### Using the Chat API with cURL

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the weather like?",
    "language": "en",
    "history": []
  }'
```

## Rate Limiting

To prevent abuse, consider implementing rate limiting:

```typescript
// Example rate limiting middleware
const rateLimit = new Map()

export function checkRateLimit(ip: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now()
  const record = rateLimit.get(ip) || { count: 0, resetTime: now + windowMs }
  
  if (now > record.resetTime) {
    record.count = 1
    record.resetTime = now + windowMs
  } else {
    record.count++
  }
  
  rateLimit.set(ip, record)
  return record.count <= limit
}
```

## Error Handling

### Client-Side Error Handling

```typescript
try {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language, history }),
  })

  const data = await response.json()

  if (!response.ok) {
    // Handle specific error codes
    switch (response.status) {
      case 400:
        console.error('Invalid request:', data.error)
        break
      case 401:
        console.error('Authentication failed:', data.error)
        break
      case 429:
        console.error('Rate limit exceeded:', data.error)
        break
      case 500:
      case 502:
        console.error('Server error:', data.error)
        // Use fallback response
        if (data.fallback) {
          return data.fallback
        }
        break
      default:
        console.error('Unexpected error:', data.error)
    }
    throw new Error(data.error)
  }

  return data.reply
} catch (error) {
  console.error('Network error:', error)
  throw error
}
```

### Server-Side Error Handling

The API automatically handles errors from Sarvam.ai and returns appropriate responses:

- **API Key Missing**: Returns 500 with error message
- **Sarvam.ai API Error**: Returns the status code from Sarvam.ai with error details
- **Network Errors**: Returns 502 with generic error message
- **Invalid Input**: Returns 400 with validation error

## Best Practices

### 1. Conversation History Management

Limit the conversation history to the most recent messages to:
- Reduce API costs
- Improve response times
- Stay within token limits

```typescript
const MAX_HISTORY_LENGTH = 12

function sanitizeHistory(history: Message[]): Message[] {
  return history
    .filter(msg => msg.content && msg.role)
    .slice(-MAX_HISTORY_LENGTH)
}
```

### 2. Input Validation

Always validate user input before sending to the API:

```typescript
function validateMessage(message: string): boolean {
  if (!message || typeof message !== 'string') {
    return false
  }
  
  const trimmed = message.trim()
  return trimmed.length > 0 && trimmed.length <= 5000
}
```

### 3. Language Detection

Auto-detect user's preferred language:

```typescript
function detectLanguage(text: string): string {
  // Simple heuristic - check for non-ASCII characters
  const hasIndicScript = /[\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F]/.test(text)
  
  if (hasIndicScript) {
    // Detect specific Indic language
    if (/[\u0900-\u097F]/.test(text)) return 'hi'
    if (/[\u0980-\u09FF]/.test(text)) return 'bn'
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'
    // ... add more language detection
  }
  
  return 'en'
}
```

### 4. Caching

Cache common responses to reduce API calls:

```typescript
const cache = new Map<string, { reply: string; timestamp: number }>()
const CACHE_TTL = 3600000 // 1 hour

function getCachedResponse(key: string): string | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.reply
  }
  return null
}

function setCachedResponse(key: string, reply: string) {
  cache.set(key, { reply, timestamp: Date.now() })
}
```

### 5. Timeout Handling

Set appropriate timeouts for API requests:

```typescript
const TIMEOUT_MS = 20000

async function fetchWithTimeout(url: string, options: RequestInit) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeout)
  }
}
```

## Monitoring and Analytics

### Tracking API Usage

```typescript
interface ApiMetrics {
  requests: number
  errors: number
  averageResponseTime: number
  languages: Record<string, number>
}

const metrics: ApiMetrics = {
  requests: 0,
  errors: 0,
  averageResponseTime: 0,
  languages: {},
}

function trackRequest(language: string, responseTime: number, success: boolean) {
  metrics.requests++
  if (!success) metrics.errors++
  metrics.averageResponseTime = 
    (metrics.averageResponseTime * (metrics.requests - 1) + responseTime) / metrics.requests
  metrics.languages[language] = (metrics.languages[language] || 0) + 1
}
```

## Security Considerations

1. **API Key Protection**: Never expose API keys in client-side code
2. **Input Sanitization**: Sanitize all user inputs to prevent injection attacks
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **CORS Configuration**: Restrict CORS to trusted domains only
5. **HTTPS Only**: Always use HTTPS in production
6. **Content Security Policy**: Implement CSP headers
7. **Request Validation**: Validate all incoming requests
8. **Error Messages**: Don't expose sensitive information in error messages

## Support

For API-related issues:
- Check [Sarvam.ai Documentation](https://docs.sarvam.ai)
- Review application logs
- Contact Sarvam.ai support
- Open an issue in the GitHub repository

---

**Last Updated:** 2024
**API Version:** v1
