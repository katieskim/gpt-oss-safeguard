# Contributing to RateMyCreator

First off, thank you for considering contributing to RateMyCreator! 🎉

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inspiring community for all.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

- Fill in the required template
- Follow the TypeScript style guidelines
- Include thoughtful comments in your code
- End all files with a newline
- Update documentation as needed

## Development Setup

1. **Fork and clone the repo**
```bash
git clone https://github.com/YOUR_USERNAME/gpt-oss-safeguard.git
cd gpt-oss-safeguard
```

2. **Install dependencies**
```bash
npm install
```

3. **Create a `.env.local` file**
```env
OPENAI_API_KEY=your-openrouter-api-key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
HATHORA_API_KEY=your-hathora-api-key
```

4. **Run the development server**
```bash
npm run dev
```

5. **Create a new branch**
```bash
git checkout -b feature/your-feature-name
```

## Pull Request Process

1. **Update documentation** - Ensure README.md and other docs are updated
2. **Test your changes** - Run `npm run build` to ensure no errors
3. **Update the changelog** - Add your changes to CHANGELOG.md if applicable
4. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug in component"
   git commit -m "docs: update API documentation"
   ```
5. **Push to your fork**
6. **Open a Pull Request** with a clear title and description

### Commit Message Convention

We follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type when possible
- Use meaningful variable and function names

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Follow naming conventions:
  - Components: PascalCase (`MyComponent.tsx`)
  - Utilities: camelCase (`myUtil.ts`)
  - Constants: UPPER_SNAKE_CASE

### Code Formatting

We use Prettier and ESLint:

```bash
npm run lint
```

### File Structure

```
components/
├── ui/              # Reusable UI components
├── feature/         # Feature-specific components
└── layout/          # Layout components

app/
├── api/             # API routes
├── (pages)/         # Page routes
└── layout.tsx       # Root layout

lib/
└── utils/           # Utility functions
```

## Areas for Contribution

### High Priority

- [ ] Add more AI models support
- [ ] Improve error handling
- [ ] Add unit tests
- [ ] Optimize performance
- [ ] Mobile responsive improvements

### Medium Priority

- [ ] Add dark mode toggle
- [ ] Internationalization (i18n)
- [ ] Export results to PDF
- [ ] Historical analysis tracking
- [ ] User authentication

### Low Priority

- [ ] Custom rating thresholds
- [ ] Webhooks for batch processing
- [ ] Email notifications
- [ ] Analytics dashboard

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

## Recognition

Contributors will be recognized in our README and release notes!

---

Thank you for contributing to RateMyCreator! 🚀

