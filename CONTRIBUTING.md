# Contributing to Sarvam AI Chatbot

Thank you for your interest in contributing to the Sarvam AI Chatbot project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to:
- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/sarvam-ai-chatbot.git
   cd sarvam-ai-chatbot
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/sarvam-ai-chatbot.git
   ```

## Development Setup

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git
- A code editor (VS Code recommended)
- Sarvam.ai API key for testing

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Add your Sarvam.ai API key to `.env.local`:
   ```env
   SARVAM_API_KEY=your_api_key_here
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Making Changes

### Creating a Branch

Always create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### Before You Code

1. **Check existing issues** to see if your idea is already being discussed
2. **Create an issue** if one doesn't exist to discuss your proposed changes
3. **Wait for approval** from maintainers before starting major work
4. **Keep changes focused** - one feature or fix per pull request

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid using `any` type unless absolutely necessary
- Use meaningful variable and function names

### Code Style

We use ESLint and Prettier for code formatting. The configuration is already set up.

**Key conventions:**
- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multi-line objects/arrays
- No semicolons at end of statements (ESLint will handle this)
- Use arrow functions for callbacks
- Prefer `const` over `let`, avoid `var`

### React/Next.js

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use `useCallback` and `useMemo` appropriately
- Prefer server components where possible

### Example Code Style

```typescript
// ✅ Good
interface UserMessage {
  id: string
  content: string
  timestamp: Date
}

export const MessageList = ({ messages }: { messages: UserMessage[] }) => {
  const sortedMessages = useMemo(
    () => messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
    [messages],
  )

  return (
    <div className="message-list">
      {sortedMessages.map(message => (
        <Message key={message.id} content={message.content} />
      ))}
    </div>
  )
}

// ❌ Bad
export const MessageList = (props: any) => {
  var msgs = props.messages
  return (
    <div className="message-list">
      {msgs.map((message: any) => {
        return <Message key={message.id} content={message.content} />
      })}
    </div>
  )
}
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

### Examples

```bash
feat(chat): add support for voice messages
fix(api): handle timeout errors gracefully
docs(readme): update installation instructions
refactor(hooks): extract message handling logic
test(chat): add tests for message validation
chore(deps): upgrade dependencies
```

### Commit Best Practices

- Write clear, concise commit messages
- Use present tense ("add feature" not "added feature")
- Keep the subject line under 72 characters
- Add a body if more explanation is needed
- Reference issues and pull requests when applicable

## Pull Request Process

### Before Submitting

1. **Update your branch** with latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test your changes** thoroughly:
   ```bash
   npm run dev
   npm run build
   npm run lint
   ```

3. **Update documentation** if you've made changes to:
   - API endpoints
   - Configuration options
   - User-facing features

4. **Add tests** if applicable

### Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Go to the original repository on GitHub

3. Click "New Pull Request"

4. Select your branch

5. Fill out the PR template:
   - **Title**: Clear, descriptive title following commit conventions
   - **Description**: Explain what changes you've made and why
   - **Related Issues**: Link any related issues
   - **Screenshots**: Add screenshots for UI changes
   - **Testing**: Describe how you tested your changes

### PR Template Example

```markdown
## Description
Brief description of your changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Changes Made
- Added feature X
- Fixed bug Y
- Updated documentation Z

## Testing
- [ ] Tested locally in development mode
- [ ] Tested production build
- [ ] Tested on mobile devices
- [ ] Tested in multiple languages

## Screenshots
(if applicable)

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
```

### Review Process

- Maintainers will review your PR
- Address any feedback or requested changes
- Once approved, your PR will be merged

## Testing

### Manual Testing

Test your changes in different scenarios:

1. **Language Testing**:
   - Test all supported languages
   - Verify translations are correct
   - Check for proper text rendering

2. **Conversation Testing**:
   - Test multi-turn conversations
   - Verify context is maintained
   - Check history management

3. **Error Testing**:
   - Test with invalid API key
   - Test with network issues
   - Verify error messages display correctly

4. **Responsive Testing**:
   - Test on desktop (various screen sizes)
   - Test on tablet
   - Test on mobile (iOS and Android)

5. **Browser Testing**:
   - Chrome
   - Firefox
   - Safari
   - Edge

### Automated Testing

We encourage adding automated tests:

```typescript
// Example test
import { render, screen } from '@testing-library/react'
import { MessageList } from '@/components/MessageList'

describe('MessageList', () => {
  it('renders messages correctly', () => {
    const messages = [
      { id: '1', content: 'Hello', role: 'user', timestamp: new Date() },
      { id: '2', content: 'Hi there!', role: 'assistant', timestamp: new Date() },
    ]

    render(<MessageList messages={messages} />)

    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Hi there!')).toBeInTheDocument()
  })
})
```

## Documentation

### Code Documentation

- Add JSDoc comments for functions and components
- Document complex logic
- Add comments for non-obvious code

### README Updates

Update README.md if your changes affect:
- Installation process
- Configuration
- Usage instructions
- Available features

### API Documentation

Update API_DOCUMENTATION.md if you:
- Add new endpoints
- Modify existing endpoints
- Change request/response formats

## Areas for Contribution

We welcome contributions in these areas:

### Features

- Additional language support
- Voice input/output
- Message formatting (markdown, code blocks)
- Export conversation history
- Theme customization
- Accessibility improvements

### Bug Fixes

- Fix reported issues
- Improve error handling
- Optimize performance

### Documentation

- Improve existing documentation
- Add tutorials and guides
- Translate documentation to other languages
- Add code examples

### Testing

- Add unit tests
- Add integration tests
- Add end-to-end tests
- Improve test coverage

### UI/UX

- Improve design and user experience
- Add animations and transitions
- Improve mobile experience
- Enhance accessibility

## Questions?

If you have questions:
- Check existing [documentation](README.md)
- Search [existing issues](https://github.com/owner/repo/issues)
- Ask in [discussions](https://github.com/owner/repo/discussions)
- Create a new issue with the `question` label

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to Sarvam AI Chatbot! 🎉
