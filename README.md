# Portfolio Video Slideshow

A professional portfolio video slideshow application built with React, TypeScript, and Remotion. Create stunning video presentations from images with customizable transitions, captions, music, and export options.

## Features

- **Image Upload**: Drag-and-drop interface for easy image uploads
- **Slide Management**: Reorder slides, adjust durations (1-10 seconds)
- **Transitions**: 6 transition types with customizable duration (0.5-2 seconds)
  - Fade
  - Slide
  - Zoom
  - Flip
  - Blur
  - Scale
- **Captions**: Add text overlays to each slide
- **Music**: Upload background audio for your slideshow
- **Templates**: 3 pre-built design templates (Minimal, Bold, Elegant)
- **Aspect Ratios**: Support for 16:9, 9:16, and 1:1 formats
- **Export**: Multiple resolution options (720p, 1080p, 4K) in MP4 format
- **Live Preview**: Real-time preview of your slideshow composition

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Remotion** - Video rendering engine
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Vitest** - Unit testing

## Prerequisites

- **Node.js** 18+
- **npm** 9+ or **yarn**

## Installation

1. Clone or navigate to the project directory:

```bash
cd /Users/chucknorris/Sites/SlideShow
```

2. Install dependencies:

```bash
npm install
```

## Running Locally

### Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

The terminal will show:

```
  VITE v5.x.x  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### Running Tests

Run the comprehensive test suite:

```bash
npm run test
```

To run tests in watch mode (re-run on file changes):

```bash
npm run test -- --watch
```

To run a specific test file:

```bash
npm run test -- src/utils/transitions.test.ts --run
```

**Current Test Coverage:**

- 87 tests passing
- 1 test skipped (browser API limitation)
- Covers: frame calculations, export settings, file validation, state management

### Building for Production

Create an optimized production build:

```bash
npm run build
```

Output will be in the `dist/` directory, ready for deployment.

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── UploadZone.tsx  # Image upload interface
│   ├── Timeline.tsx    # Slide timeline and controls
│   ├── ExportControls.tsx # Export settings and button
│   └── ...
├── composition/         # Remotion video composition
│   └── SlideShow.tsx    # Main video composition
├── stores/              # State management (Zustand)
│   └── projectStore.ts  # App state and actions
├── utils/               # Utility functions
│   ├── transitions.ts   # Transition calculations
│   ├── videoExporter.ts # Export settings and validation
│   ├── imageOptimizer.ts # Image file handling
│   └── ...
├── types/               # TypeScript type definitions
│   └── index.ts
└── App.tsx             # Main app component
```

## How to Use

1. **Upload Images**: Drag images into the upload area or click to select files
2. **Organize Slides**: Drag to reorder slides in the timeline
3. **Configure Slides**:
   - Adjust slide duration (1-10 seconds)
   - Adjust transition duration (0.5-2 seconds)
   - Add captions and select transition type
4. **Add Audio**: Upload an MP3 or WAV file as background music
5. **Preview**: Click "Preview Slideshow" to see the composition
6. **Select Template**: Choose from Minimal, Bold, or Elegant designs
7. **Set Aspect Ratio**: Choose 16:9, 9:16, or 1:1 format
8. **Export**: Select resolution and click "Export Slideshow" to generate video

## Available Scripts

| Command           | Purpose                                |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start development server               |
| `npm run build`   | Create production build                |
| `npm run preview` | Preview production build locally       |
| `npm run test`    | Run test suite in watch mode           |
| `npm run lint`    | Check code for errors and style issues |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

## Troubleshooting

**Port 5173 already in use?**

```bash
# Kill the process using the port (macOS/Linux)
lsof -ti:5173 | xargs kill -9

# Or specify a different port
npm run dev -- --port 3000
```

**Dependencies not installing?**

```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Tests failing?**

```bash
# Make sure you're using the correct Node version
node --version  # Should be 18+

# Clear test cache and rerun
npm run test -- --clearCache
```

## Next Steps

- Implement real video export functionality
- Add keyboard shortcuts (Space to play/pause, Arrow keys to navigate)
- Expand component test coverage
- Optimize bundle size and performance

## License

MIT
