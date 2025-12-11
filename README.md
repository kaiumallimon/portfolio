# Portfolio Website

A modern, interactive portfolio website showcasing full-stack development skills with a focus on seamless user experiences across mobile and web platforms.

## ✨ Features

- **Custom Animated Cursor** - Physics-based cursor with spring animations and hover effects
- **Smooth Scrolling** - Buttery-smooth page transitions and scroll behavior
- **Route Splash Animations** - Engaging page transitions with Framer Motion
- **Interactive Bento Grid** - Dynamic achievement showcase with GSAP animations
- **3D Graphics** - Three.js and React Three Fiber integration for immersive experiences
- **Silk Canvas Effects** - Advanced WebGL effects using OGL
- **GitHub Calendar** - Live contribution activity visualization
- **Contact Form** - Integrated with Nodemailer for email communications
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark Mode UI** - Modern dark-themed interface with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **Animations:** 
  - Framer Motion
  - GSAP
- **3D Graphics:**
  - Three.js
  - React Three Fiber
  - OGL
- **UI Components:** 
  - Radix UI
  - Custom components with shadcn/ui
  - Lucide & Tabler Icons

### Backend & Services
- **Database:** Supabase
- **Email:** Nodemailer
- **Deployment:** Vercel (recommended)

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create a .env.local file in the root directory
# Add your Supabase and email credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
portfolio/
├── app/                      # Next.js App Router pages
│   ├── about-me/            # About page with bio and skills
│   ├── achievements/        # Achievements showcase
│   ├── api/                 # API routes
│   │   ├── contact/         # Contact form endpoint
│   │   └── projects/        # Projects data endpoints
│   ├── contact/             # Contact page
│   ├── projects/            # Projects gallery
│   └── page.tsx             # Home page
├── components/              
│   ├── custom/              # Custom components
│   │   ├── animated-cursor.tsx
│   │   ├── nav.tsx
│   │   ├── route-splash.tsx
│   │   ├── smooth-scroll.tsx
│   │   └── ...
│   ├── ui/                  # shadcn/ui components
│   ├── LogoLoop.tsx         # Animated logo carousel
│   ├── MagicBento.tsx       # Interactive bento grid
│   └── Silk.tsx             # WebGL canvas effects
├── lib/                     # Utilities and configurations
│   ├── supabase-client.ts
│   └── utils.ts
└── public/                  # Static assets
```

## 🎨 Key Components

### Animated Cursor
Custom cursor with physics-based animations and smart hover detection for interactive elements.

### Magic Bento Grid
Dynamic achievement display with:
- GSAP-powered animations
- Spotlight effects
- Particle systems
- Tilt interactions
- Border glow effects

### Route Splash
Smooth page transitions with customizable animations between route changes.

### Smooth Scroll
Native-like smooth scrolling implementation for enhanced UX.

## 📝 Customization

### Update Personal Information
Edit the home page content in [app/page.tsx](app/page.tsx):
```tsx
// Update name, title, and description
<h1>Your Name</h1>
<p>Your title</p>
```

### Add Projects
Add or modify projects through the API route in [app/api/projects/route.ts](app/api/projects/route.ts).

### Configure Email
Update email settings in [app/api/contact/route.ts](app/api/contact/route.ts) with your SMTP credentials.

## 🏗️ Building for Production

```bash
npm run build
npm start
```

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy

### Other Platforms
This Next.js application can be deployed on any platform that supports Node.js applications.

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio!

## 📄 License

This project is open source and available for personal and commercial use.

## 📧 Contact

For questions or collaborations, use the contact form on the website or reach out directly.

---

Built with ❤️ using Next.js, React, and modern web technologies.
