# AniStream - Anime Discovery Platform

AniStream is a modern web application for discovering, browsing, and learning about anime. Built with React, TypeScript, Vite, and Tailwind CSS, it leverages the [Jikan API](https://jikan.moe/) to provide up-to-date anime data.

## Features

- Browse top, seasonal, upcoming, and movie anime
- Advanced filtering by status, type, genre, year, and score
- Anime detail pages with characters, staff, and external links
- Responsive, modern UI with dark/light theme support
- Fast search with smart deduplication and trending suggestions

## Requirements

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (v9 or newer recommended)

## Getting Started

1. **Clone the repository:**
   ```
   git clone https://github.com/Cheathek/anime-steam-modern.git
   cd anime-steam-modern
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the development server:**
   ```
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173).

4. **Build for production:**
   ```
   npm run build
   ```

5. **Preview the production build:**
   ```
   npm run preview
   ```

## Project Structure

```
src/
  components/      # Reusable UI components
  contexts/        # React context providers (e.g., Theme)
  pages/           # Route pages (Home, Category, Detail)
  services/        # API service (Jikan API)
  index.css        # Tailwind CSS entry
  main.tsx         # App entry point
  App.tsx          # Main App component
```

<!-- ```diff
+ This is green text
- This is red text
# This is a comment
``` -->


## Customization

- **API:** Uses [Jikan API v4](https://docs.api.jikan.moe/).
- **Styling:** Tailwind CSS with custom theme in [tailwind.config.js](tailwind.config.js).
- **Environment:** No API keys required.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint

## License

This project is for educational purposes. Please check the [Jikan API Terms of Service](https://jikan.moe/) before deploying publicly.

---

**Made with ❤️ using React, TypeScript, and Tailwind CSS.**