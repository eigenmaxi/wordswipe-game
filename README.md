# WordSwipe - Word Puzzle Game

A fun and engaging word puzzle game built as a Farcaster Mini App using React and Vite.

## Features

- Mobile-friendly design with swipe controls
- Letter-swipe word formation gameplay
- Score tracking and levels
- Timer-based challenge mode
- Responsive design for all devices
- Built with Lexend Google Font

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd wordquest
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:3000

### Building for Production

To build the app for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

### Netlify (Recommended)

1. **Automatic Deployment**:

   - Push your code to GitHub/GitLab/Bitbucket
   - Connect your repository to Netlify
   - Set build command to `npm run build`
   - Set publish directory to `dist`

2. **Manual Deployment**:

   - Run `npm run build`
   - Upload the `dist` folder to Netlify

3. **CLI Deployment**:
   - Install Netlify CLI: `npm install -g netlify-cli`
   - Run `npm run deploy` or `netlify deploy --prod`

### Vercel

1. Connect your repository to Vercel
2. Set build command to `npm run build`
3. Set output directory to `dist`

## Farcaster Mini App Specifications

This app follows the Farcaster Mini App specifications:

- Includes proper `farcaster.json` manifest in `.well-known/` directory
- Uses appropriate meta tags in `index.html`
- Mobile-responsive design
- Follows the 3:2 aspect ratio for preview images
- Compatible with Farcaster clients

## Game Instructions

1. Click "Start Game" to begin
2. Swipe over adjacent letters to form words
3. Release to submit your word
4. Find as many valid words as possible before time runs out
5. Earn points based on word length
6. Advance to higher levels for more challenging letter sets

## Customization

You can customize the game by:

1. Adding more letter sets and valid words in `src/App.jsx`
2. Modifying the styling in the CSS files
3. Updating the manifest in `.well-known/farcaster.json`
4. Changing the theme colors in the CSS files

## License

MIT License
