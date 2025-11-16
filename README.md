# 🎯 RateMyCreator

<div align="center">

![RateMyCreator](https://img.shields.io/badge/RateMyCreator-AI%20Powered-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**AI-Powered Content Classification for Creator Partnerships**

Protect your brand with real-time content analysis • MPAA-style ratings • Video, Voice & Text

[Live Demo](https://gpt-oss-safeguard.vercel.app) • [Features](#-features) • [Getting Started](#-getting-started) • [API Docs](#-api-routes)

</div>

---

## 🌟 Overview

**RateMyCreator** is a comprehensive AI-powered content classification system designed to help brands evaluate and screen creators before partnership. Using advanced AI models and MPAA-style rating categories, it analyzes creator content across multiple formats to assess brand safety risks.

### 🎬 Why RateMyCreator?

- **💰 Stop Wasting Money** on bad influencer partnerships
- **🛡️ Protect Your Brand** reputation with automated screening
- **⚡ Real-Time Analysis** using GPT-OSS-Safeguard-20b and Hathora AI
- **📊 Comprehensive Ratings** across 5 content categories
- **🎥 Multi-Format Support** - Video, Voice, Text, and Audio files

---

## ✨ Features

### 🎥 Video Analysis
Record video with live webcam preview while AI analyzes audio content
- **Live video preview** with mirrored display
- **Audio-only extraction** for privacy
- **Real-time transcription** using Hathora Parakeet
- **AI thinking process** visualization (8 steps)

### 🎤 Voice Recording
Real-time audio recording with live frequency visualization
- **Browser MediaRecorder API** integration
- **Live audio waveform** (60 animated bars)
- **Instant transcription** and classification
- **7-step AI reasoning** display

### 💬 Text Classification
Analyze creator profiles, bios, and content descriptions
- **GPT-OSS-Safeguard-20b** model
- **Detailed risk assessment**
- **Keyword analysis**
- **Partnership recommendations**

### 📤 Batch Upload
Process multiple creators at once via CSV
- **Bulk classification**
- **CSV import/export**
- **Progress tracking**
- **Download results**

### 🔊 Audio File Upload
Upload and analyze pre-recorded audio files
- **Drag & drop interface**
- **Multiple format support** (MP3, WAV, M4A, etc.)
- **Waveform visualization**
- **Batch processing**

---

## 🎯 Rating System

RateMyCreator uses a 4-tier MPAA-style rating system:

| Rating | Risk Level | Description |
|--------|-----------|-------------|
| **G** | Low | General audience - family-friendly content |
| **PG** | Low | Parental guidance - mild themes |
| **PG-13** | Medium | Parents strongly cautioned - moderate content |
| **R** | High | Restricted - strong mature themes |

### 📊 Content Categories Analyzed

1. **Violence** (0-3 scale)
2. **Sexual Content** (0-3 scale)
3. **Language** (0-3 scale)
4. **Drugs** (0-3 scale)
5. **Self-Harm** (0-3 scale)

---

## 🚀 Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React

### AI & APIs
- **Text Classification**: OpenRouter (GPT-OSS-Safeguard-20b)
- **Audio Transcription**: Hathora Parakeet
- **Models**: 
  - `openai/gpt-oss-safeguard-20b` for content classification
  - `parakeet` for speech-to-text

### Deployment
- **Platform**: Vercel
- **Region**: IAD1 (Washington, D.C., USA)
- **CDN**: Global edge network

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenRouter API key ([Get one here](https://openrouter.ai/))
- Hathora API key ([Get one here](https://hathora.dev/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/katieskim/gpt-oss-safeguard.git
cd gpt-oss-safeguard
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# OpenRouter API (for content classification)
OPENAI_API_KEY=sk-or-v1-your-openrouter-api-key
OPENAI_BASE_URL=https://openrouter.ai/api/v1

# Hathora API (for audio transcription)
HATHORA_API_KEY=hathora_org_your-hathora-api-key
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
gpt-oss-safeguard/
├── app/
│   ├── api/
│   │   ├── classify/           # Text classification endpoint
│   │   ├── classify-audio/     # Audio transcription + classification
│   │   └── classify-batch/     # Batch processing endpoint
│   ├── video/                  # Video recording page
│   ├── voice/                  # Voice recording page
│   ├── chat/                   # Text classification page
│   ├── batch/                  # Batch upload page
│   ├── audio/                  # Audio upload page
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/
│   │   ├── ai-video-input.tsx  # Video recording component
│   │   ├── ai-voice-input.tsx  # Voice recording component
│   │   └── audio-upload-card.tsx # Audio file upload
│   ├── animated-hero.tsx       # Hero section with animations
│   ├── video-classifier.tsx    # Video classification UI
│   ├── voice-classifier.tsx    # Voice classification UI
│   └── unified-classifier.tsx  # Text/Audio classification UI
├── lib/
│   └── utils.ts                # Utility functions
└── public/                     # Static assets
```

---

## 🔌 API Routes

### POST `/api/classify`
Classify text-based creator content

**Request Body:**
```json
{
  "description": "Creator content description",
  "handle": "@username",
  "platform": "Instagram"
}
```

**Response:**
```json
{
  "rating": "PG-13",
  "riskLevel": "Medium",
  "reasons": ["Moderate language", "Suggestive content"],
  "scores": {
    "violence": 0,
    "sexual_content": 2,
    "language": 2,
    "drugs": 0,
    "self_harm": 0
  },
  "recommendation": "Review required before partnership",
  "model": "gpt-oss-safeguard-20b",
  "timestamp": "2025-11-16T00:00:00.000Z"
}
```

### POST `/api/classify-audio`
Transcribe and classify audio content

**Request:** `multipart/form-data` with `audio` file

**Response:**
```json
{
  "rating": "G",
  "riskLevel": "Low",
  "transcription": "The transcribed text...",
  "reasons": ["Family-friendly content"],
  "scores": { /* ... */ },
  "model": "hathora-parakeet + gpt-oss-safeguard-20b"
}
```

### POST `/api/classify-batch`
Batch process multiple creators

**Request Body:**
```json
{
  "influencers": [
    {
      "handle": "@creator1",
      "platform": "Instagram",
      "description": "Content description"
    }
  ]
}
```

**Response:** Array of classification results

---

## 🎨 Key Components

### Video Recording
```tsx
import { AIVideoInput } from "@/components/ui/ai-video-input";

<AIVideoInput
  onRecordingComplete={(audioBlob, duration) => {
    // Handle audio blob
  }}
  visualizerBars={60}
/>
```

### Voice Recording
```tsx
import { AIVoiceInput } from "@/components/ui/ai-voice-input";

<AIVoiceInput
  onRecordingComplete={(audioBlob, duration) => {
    // Handle audio blob
  }}
  visualizerBars={60}
/>
```

### Audio Upload
```tsx
import { AudioUploadCard } from "@/components/ui/audio-upload-card";

<AudioUploadCard
  onUpload={(file) => {
    // Handle file upload
  }}
/>
```

---

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Set Environment Variables**

In the Vercel dashboard, add:
- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `HATHORA_API_KEY`

### Deploy to Other Platforms

This is a standard Next.js app and can be deployed to:
- Netlify
- AWS Amplify
- Railway
- Render
- Any Node.js hosting

---

## 🎯 Use Cases

### Brand Safety Teams
- Screen potential influencer partnerships
- Automate content risk assessment
- Document classification decisions

### Marketing Agencies
- Batch process creator databases
- Filter by content rating
- Generate compliance reports

### Content Platforms
- Moderate user-generated content
- Flag high-risk creators
- Maintain brand safety standards

---

## 🔐 Security & Privacy

- **No Video Storage**: Video is displayed locally but never uploaded
- **Audio-Only Processing**: Only audio tracks are sent to APIs
- **Secure API Keys**: Environment variables, never in client code
- **Rate Limiting**: Prevent API abuse
- **HTTPS Only**: All communications encrypted

---

## 📈 Performance

- **Build Time**: ~20 seconds
- **Page Load**: <1 second (static pages)
- **API Response**: 2-5 seconds (classification)
- **Transcription**: 1-3 seconds per minute of audio
- **Bundle Size**: <1MB (optimized)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) for AI model access
- [Hathora](https://hathora.dev/) for speech-to-text API
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Vercel](https://vercel.com/) for hosting

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/katieskim/gpt-oss-safeguard/issues)
- **Documentation**: [GitHub Wiki](https://github.com/katieskim/gpt-oss-safeguard/wiki)

---

<div align="center">

Made with ❤️ for Brand Safety

**[⬆ Back to Top](#-ratemycreator)**

</div>
