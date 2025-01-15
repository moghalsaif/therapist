# Therapy Bestie

A modern therapist-matching app that helps you find the perfect therapist based on your needs and preferences.

## Features

- Clean, modern UI with a calming design
- Smart therapist matching using Groq AI
- Secure authentication with Supabase
- Comprehensive onboarding process
- Real-time updates and matching

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Supabase for auth and database
- Groq AI for therapist matching

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/therapy-bestie.git
cd therapy-bestie
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Copy `.env.local.example` to `.env.local`
- Fill in your Supabase and Groq API credentials

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/             # Next.js app router pages
├── components/      # Reusable UI components
├── lib/            # Library code, utilities
├── types/          # TypeScript type definitions
└── utils/          # Helper functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 