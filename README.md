# QuickLink - URL Shortener (Next.js)

A modern, fast, and user-friendly URL shortener application built with Next.js 14+, React, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Fast URL Shortening**: Create short, memorable links in seconds
- 🎨 **Modern UI**: Built with Shadcn UI and Tailwind CSS
- 📱 **Responsive Design**: Works perfectly on all devices
- ⚡ **Performance Optimized**: Built with Next.js 14+ App Router

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **UI Library**: React 18+ with TypeScript
- **Styling**: Tailwind CSS + Shadcn UI + Radix UI
- **Code Quality**: ESLint + TypeScript strict mode

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0 or yarn >= 1.22.0

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Project Structure

```
link-swift-nextjs/
├── public/                    # Static assets
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── not-found.tsx     # 404 page
│   ├── components/           # Reusable components
│   │   ├── ui/              # Shadcn UI components
│   │   ├── providers/       # Provider components
│   │   ├── header.tsx       # Header component
│   │   ├── hero.tsx         # Hero component
│   │   └── shortener-form.tsx # URL shortener form
│   ├── lib/                 # Utility libraries
│   │   └── utils.ts         # Utility functions
│   └── hooks/               # Custom React hooks
├── .eslintrc.json           # ESLint configuration
├── .gitignore               # Git ignore file
├── components.json          # Shadcn UI configuration
├── next.config.js           # Next.js configuration
├── package.json             # Package dependencies
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=your-api-url
```


## Acknowledgments

- Built with [Next.js](https://nextjs.org/)

