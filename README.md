# TideScout

TideScout is an advanced tide tracking and activity recommendation application built with React, TypeScript, and Vite. It provides real-time tide information, professional analytics, and smart recommendations for outdoor activities based on your current location.

## Features

- 🌊 **Live Tide Data**: Fetches real-time tide data for your current location using the WorldTides API.
- 📈 **Professional Tide Analytics**: Visualizes 7-day tide trends with interactive charts and key insights.
- 🏄 **Smart Activity Recommendations**: Suggests the best times for activities like fishing, surfing, and beachcombing.
- 📍 **Location Awareness**: Uses browser geolocation to personalize tide data.
- ⚡ **Modern UI**: Responsive, mobile-friendly interface styled with Tailwind CSS.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/tidescout.git
   cd tidescout
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:5173
   ```

## Project Structure

- `src/`
  - `components/` – UI components (charts, info panels, recommendations, etc.)
  - `hooks/` – Custom React hooks for location and tide data fetching
  - `utils/` – Utility functions for time formatting and recommendations
  - `types/` – TypeScript type definitions

## Configuration

- The app uses the [WorldTides API](https://www.worldtides.info/). The API key is set in [`src/hooks/useTideData.ts`](src/hooks/useTideData.ts).
- Tailwind CSS is configured in [`tailwind.config.js`](tailwind.config.js).

## Scripts

- `npm run dev` – Start the development server
- `npm run build` – Build for production
- `npm run preview` – Preview the production build
- `npm run lint` – Run ESLint

## License

MIT

---

**Built with ❤️ for ocean lovers. Powered by
