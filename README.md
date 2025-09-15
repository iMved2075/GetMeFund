# GetMeFund - Crowdfunding Platform

A modern crowdfunding platform built with Next.js, featuring user authentication, campaign creation, and donation management.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## Features

- 🔐 **User Authentication** - Secure login and registration system
- 📊 **Dashboard** - Personal campaign management interface
- 💰 **Campaign Creation** - Create and manage fundraising campaigns
- 🎯 **User Profiles** - Dynamic user profile pages
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🔒 **Session Management** - Secure session handling
- 🚀 **Modern UI** - Clean interface with Lucide React icons

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org) with App Router
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Icons:** [Lucide React](https://lucide.dev)
- **Authentication:** Session-based authentication
- **Development:** ESLint for code quality

## Project Structure

```
gofundme/
├── app/                    # App Router pages
│   ├── [username]/        # Dynamic user profile pages
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard pages
│   ├── login/           # Authentication pages
│   ├── layout.js        # Root layout
│   ├── page.js          # Home page
│   └── globals.css      # Global styles
├── components/          # Reusable components
│   ├── Footer.js       # Footer component
│   ├── Navbar.js       # Navigation component
│   └── SessionWrapper.js # Session management
├── public/             # Static assets
└── configuration files
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gofundme
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your environment variables in `.env.local`

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Style

This project uses:
- **ESLint** for code linting
- **Tailwind CSS** for styling
- **Next.js** best practices and conventions

### Key Components

- **[`SessionWrapper`](components/SessionWrapper.js)** - Handles session state management
- **[`Navbar`](components/Navbar.js)** - Main navigation component with authentication state
- **[`Footer`](components/Footer.js)** - Site footer

### Routing

- `/` - Home page
- `/login` - Authentication
- `/dashboard` - User dashboard (protected)
- `/[username]` - Dynamic user profiles
- `/api/*` - API endpoints

## Configuration

### Tailwind CSS

Styling is configured in [`tailwind.config.js`](tailwind.config.js) with custom theme extensions.

### Next.js

Next.js configuration is in [`next.config.mjs`](next.config.mjs) with optimizations for production.

### PostCSS

PostCSS plugins are configured in [`postcss.config.mjs`](postcss.config.mjs).


## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Add your environment variables here
NEXTAUTH_SECRET=your-secret-here
DATABASE_URL=your-database-url
# Add other required variables
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev) - Beautiful & consistent icon toolkit

## Support

If you encounter any issues or have questions:

1. Check the [Next.js GitHub repository](https://github.com/vercel/next.js)
2. Visit the [Next.js discussions](https://github.com/vercel/next.js/discussions)
3. Open an issue in this repository

---

Built with ❤️ using Next.js