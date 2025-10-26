# Sarvam AI Chatbot

A modern, multilingual conversational AI chatbot powered by [sarvam.ai](https://sarvam.ai) with robust support for Indic languages.

## 🚀 Features

- **Multilingual Support**: Seamlessly converse in English and 9 Indic languages (Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi)
- **Context-Aware Conversations**: Maintains conversation history to provide coherent, contextual responses
- **Responsive UI**: Modern, accessible interface that works beautifully on desktop and mobile devices
- **Error Handling**: Graceful fallback mechanisms for API failures
- **Real-time Interaction**: Fast, asynchronous message processing with loading states
- **Type-Safe**: Built with TypeScript for enhanced developer experience and reliability

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Integration**: Axios
- **AI Provider**: sarvam.ai

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Sarvam.ai API key ([Get one here](https://sarvam.ai))

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sarvam-ai-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Sarvam.ai API credentials:
   ```env
   SARVAM_API_KEY=your_api_key_here
   SARVAM_API_URL=https://api.sarvam.ai/v1
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SARVAM_API_KEY` | Your Sarvam.ai API key | - | ✅ Yes |
| `SARVAM_API_URL` | Sarvam.ai API base URL | `https://api.sarvam.ai/v1` | No |
| `SARVAM_MODEL` | Model to use | `chat-saarthi` | No |
| `SARVAM_CHAT_ENDPOINT` | Chat completion endpoint | `/chat/completions` | No |
| `SARVAM_TIMEOUT_MS` | API request timeout (ms) | `20000` | No |
| `SARVAM_TEMPERATURE` | Response randomness (0-1) | - | No |
| `SARVAM_TOP_P` | Nucleus sampling parameter | - | No |
| `SARVAM_MAX_TOKENS` | Maximum tokens in response | - | No |
| `MAX_CONTEXT_MESSAGES` | Conversation history limit | `12` | No |
| `NEXT_PUBLIC_MAX_CONTEXT_MESSAGES` | Client-side history limit | `12` | No |
| `NEXT_PUBLIC_FALLBACK_RESPONSE` | Fallback error message | Hindi error message | No |
| `NEXT_PUBLIC_SYSTEM_PROMPT` | System instruction for AI | Default multilingual prompt | No |

### Supported Languages

The chatbot currently supports:

- English (en)
- Hindi (hi) - हिन्दी
- Bengali (bn) - বাংলা
- Tamil (ta) - தமிழ்
- Telugu (te) - తెలుగు
- Marathi (mr) - मराठी
- Gujarati (gu) - ગુજરાતી
- Kannada (kn) - ಕನ್ನಡ
- Malayalam (ml) - മലയാളം
- Punjabi (pa) - ਪੰਜਾਬੀ

## 📁 Project Structure

```
sarvam-ai-chatbot/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts    # Chat API endpoint
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main chatbot UI
│   │   └── globals.css         # Global styles
│   ├── lib/                    # Utility libraries
│   │   ├── sarvam.ts           # Sarvam.ai API integration
│   │   └── languages.ts        # Language configuration
│   └── types/                  # TypeScript type definitions
│       └── index.ts
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js configuration
├── package.json                # Project dependencies
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🎯 Usage

1. **Select Language**: Choose your preferred language from the dropdown menu
2. **Start Chatting**: Type your message in the text area
3. **Send Message**: Click "Send" or press Enter
4. **View Response**: The AI assistant will respond in your selected language
5. **Continue Conversation**: The chatbot maintains context for natural, flowing conversations
6. **Reset**: Click "Reset" to clear conversation history and start fresh

## 🔌 API Integration

The application includes a backend API endpoint at `/api/chat` that:

- Accepts POST requests with message, language, and conversation history
- Validates and sanitizes input data
- Communicates with Sarvam.ai API
- Returns AI-generated responses with proper error handling

### Example API Usage

```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Hello, how are you?',
    language: 'en',
    history: [],
  }),
})

const data = await response.json()
console.log(data.reply)
```

## 🛡️ Error Handling

The application includes comprehensive error handling:

- **API Errors**: Displays user-friendly messages when Sarvam.ai API is unavailable
- **Network Errors**: Handles timeout and connection failures gracefully
- **Input Validation**: Validates user input and conversation history
- **Fallback Responses**: Provides default responses when errors occur

## 🎨 Customization

### Styling

The application uses Tailwind CSS. Customize the theme in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color palette
      },
    },
  },
}
```

### System Prompt

Modify the AI's behavior by changing the system prompt in `.env.local`:

```env
NEXT_PUBLIC_SYSTEM_PROMPT="Your custom instructions for the AI assistant"
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

To test the chatbot:

1. Ensure your `.env.local` has a valid `SARVAM_API_KEY`
2. Run `npm run dev`
3. Navigate to `http://localhost:3000`
4. Try conversations in different languages
5. Test error scenarios by using an invalid API key

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Sarvam.ai](https://sarvam.ai) for providing the multilingual AI API
- [Next.js](https://nextjs.org) for the excellent React framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework

## 📞 Support

For issues or questions:

- Open an issue in the GitHub repository
- Contact the maintainers
- Refer to [Sarvam.ai documentation](https://docs.sarvam.ai)

## 🔒 Security

- Never commit `.env.local` or expose API keys
- Use environment variables for all sensitive data
- Implement rate limiting for production deployments
- Sanitize user inputs to prevent injection attacks

---

Built with ❤️ using Sarvam.ai
