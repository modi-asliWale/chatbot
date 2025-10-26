# Quick Start Guide

Get the Sarvam AI Chatbot up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Sarvam.ai API key ([Sign up here](https://sarvam.ai))

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sarvam-ai-chatbot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Sarvam.ai API key:

```env
SARVAM_API_KEY=your_api_key_here
SARVAM_API_URL=https://api.sarvam.ai/v1
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## First Steps

### Try Your First Conversation

1. **Select a language** from the dropdown (default is English)
2. **Type a message** in the text area
3. **Click "Send"** or press Enter
4. **Wait for the response** from Sarvam AI

### Example Conversations

**English:**
```
You: What is artificial intelligence?
AI: Artificial intelligence is the simulation of human intelligence...
```

**Hindi (हिन्दी):**
```
You: कृत्रिम बुद्धिमत्ता क्या है?
AI: कृत्रिम बुद्धिमत्ता मशीनों द्वारा मानव बुद्धि का अनुकरण है...
```

**Tamil (தமிழ்):**
```
You: செயற்கை நுண்ணறிவு என்றால் என்ன?
AI: செயற்கை நுண்ணறிவு என்பது இயந்திரங்களால் மனித நுண்ணறிவை பின்பற்றுவதாகும்...
```

## Features Overview

### Multi-Language Support

The chatbot supports 10 languages:
- English
- Hindi (हिन्दी)
- Bengali (বাংলা)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Marathi (मराठी)
- Gujarati (ગુજરાતી)
- Kannada (ಕನ್ನಡ)
- Malayalam (മലയാളം)
- Punjabi (ਪੰਜਾਬੀ)

### Context-Aware Conversations

The chatbot remembers the last 12 messages in your conversation, allowing for natural, flowing discussions.

**Example:**
```
You: Tell me about the Taj Mahal
AI: The Taj Mahal is an iconic marble mausoleum in Agra, India...

You: When was it built?
AI: It was built between 1631 and 1653...

You: Who commissioned it?
AI: It was commissioned by Mughal Emperor Shah Jahan...
```

### Reset Conversation

Click the **Reset** button to clear conversation history and start fresh.

## Customization

### Change System Prompt

Edit `.env.local` to customize the AI's behavior:

```env
NEXT_PUBLIC_SYSTEM_PROMPT="You are a helpful assistant specialized in Indian culture and history."
```

### Adjust Conversation History

Change how many messages are kept in context:

```env
NEXT_PUBLIC_MAX_CONTEXT_MESSAGES=20
MAX_CONTEXT_MESSAGES=20
```

### Customize Fallback Message

Set a custom error message:

```env
NEXT_PUBLIC_FALLBACK_RESPONSE="Sorry, I'm having trouble connecting. Please try again."
```

## Common Issues

### Issue: "API key is missing"

**Solution:** Make sure you've created `.env.local` and added your API key:
```env
SARVAM_API_KEY=your_actual_api_key_here
```

### Issue: Build fails with module not found

**Solution:** Delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 is already in use

**Solution:** Use a different port:
```bash
PORT=3001 npm run dev
```

### Issue: Blank page or white screen

**Solution:** Check the browser console for errors and ensure all dependencies are installed:
```bash
npm install
npm run dev
```

## Production Build

To create a production-optimized build:

```bash
npm run build
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Next Steps

- **Customize the UI**: Edit `src/app/globals.css` and `tailwind.config.ts`
- **Add features**: Check `CONTRIBUTING.md` for development guidelines
- **Deploy**: See `DEPLOYMENT.md` for deployment instructions
- **API Integration**: Read `API_DOCUMENTATION.md` to integrate with your apps

## Testing the Application

### Test Different Languages

1. Change the language selector
2. Type a message in that language
3. Verify the response is in the same language

### Test Conversation Context

1. Ask a question: "What is machine learning?"
2. Follow up: "How is it different from deep learning?"
3. Verify the AI understands you're still talking about ML

### Test Error Handling

1. Stop your internet connection
2. Send a message
3. Verify you see a user-friendly error message

## Getting Help

- **Documentation**: Check `README.md` for comprehensive information
- **API Reference**: See `API_DOCUMENTATION.md`
- **Contributing**: Read `CONTRIBUTING.md` to contribute
- **Issues**: Open an issue on GitHub

## Resources

- [Sarvam.ai Documentation](https://docs.sarvam.ai)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## What's Next?

Now that you have the chatbot running, you can:

1. **Customize the design** - Edit colors, fonts, and layouts
2. **Add new features** - Voice input, export conversations, etc.
3. **Integrate with your app** - Use the API endpoints in your projects
4. **Deploy to production** - Share your chatbot with the world

---

**Happy chatting! 🚀**

Need help? Check the [README.md](README.md) or open an issue on GitHub.
