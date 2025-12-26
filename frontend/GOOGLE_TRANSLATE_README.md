# Google Translate Integration

This project includes Google Translate functionality with support for English, Tamil, and Hindi languages. The translation widget is designed to blend seamlessly with the existing UI and is now **fully draggable** for user convenience.

## Components

### 1. GoogleTranslate (Draggable Floating Widget) ⭐ **NEW**
- **File**: `src/components/GoogleTranslate.tsx`
- **CSS**: `src/components/GoogleTranslate.css`
- **Usage**: Currently imported in `App.tsx` and appears on all pages
- **Position**: Draggable - users can move it anywhere on screen
- **Features**: 
  - **Draggable** - Click and drag to move around screen
  - **Position Memory** - Remembers position across page refreshes
  - **Viewport Bounds** - Stays within screen boundaries
  - **Drag Handle** - Visual indicator for dragging
  - **Smooth Animations** - Enhanced user experience
  - **Responsive Design** - Works on all screen sizes
  - **Dark Mode Support** - Adapts to system preferences

### 2. GoogleTranslateWithReset (Enhanced Draggable Widget) ⭐ **NEW**
- **File**: `src/components/GoogleTranslateWithReset.tsx`
- **CSS**: `src/components/GoogleTranslateWithReset.css`
- **Features**: All features from GoogleTranslate plus:
  - **Reset Button** - Hover to reveal reset button (↺)
  - **Default Position** - Returns to top-right corner
  - **Smooth Animations** - Fade-in reset button

### 3. GoogleTranslateHeader (Header Integration)
- **File**: `src/components/GoogleTranslateHeader.tsx`
- **CSS**: `src/components/GoogleTranslateHeader.css`
- **Usage**: Can be integrated into navigation bars or headers
- **Features**:
  - Inline design with label
  - Compact layout
  - Responsive design
  - Dark mode support

### 4. GoogleTranslateInline (Inline Content)
- **File**: `src/components/GoogleTranslateInline.tsx`
- **CSS**: `src/components/GoogleTranslateInline.css`
- **Usage**: Can be placed anywhere in content
- **Features**:
  - Flexible positioning (left, right, center)
  - Content area integration
  - Responsive design

## Current Implementation

The Google Translate widget is currently implemented as a **draggable floating component** that appears on all pages. It's imported in `App.tsx`:

```tsx
import GoogleTranslate from './components/GoogleTranslate';

function App() {
  return (
    <Router>
      <div className="App">
        <GoogleTranslate />
        {/* Routes */}
      </div>
    </Router>
  );
}
```

## 🎯 **Draggable Features**

### How to Use:
1. **Drag**: Click and hold the drag handle (⋮⋮) to move the widget
2. **Drop**: Release to place the widget in a new position
3. **Bounds**: Widget automatically stays within screen boundaries
4. **Memory**: Position is saved and restored on page refresh

### Visual Indicators:
- **Grab Cursor**: Shows when hovering over draggable area
- **Grabbing Cursor**: Shows while dragging
- **Drag Handle**: Vertical dots (⋮⋮) indicate draggable area
- **Enhanced Shadow**: Deeper shadow while dragging

## Supported Languages

- **English (en)** - Default language
- **Tamil (ta)** - தமிழ்
- **Hindi (hi)** - हिन्दी

## Customization Options

### 1. Switch to Enhanced Version
To use the version with reset button:

```tsx
import GoogleTranslateWithReset from './components/GoogleTranslateWithReset';

function App() {
  return (
    <Router>
      <div className="App">
        <GoogleTranslateWithReset />
        {/* Routes */}
      </div>
    </Router>
  );
}
```

### 2. Change Default Position
To change the default position, modify the component:

```tsx
const defaultPosition = { x: 50, y: 50 }; // Center of screen
```

### 3. Disable Position Memory
To disable localStorage position saving:

```tsx
// Remove or comment out these lines in the component:
// localStorage.setItem('googleTranslatePosition', JSON.stringify(position));
// const savedPosition = localStorage.getItem('googleTranslatePosition');
```

### 4. Add More Languages
To add more languages, modify the `includedLanguages` parameter:

```tsx
includedLanguages: 'en,ta,hi,te,kn,ml', // Add Telugu, Kannada, Malayalam
```

### 5. Custom Styling
The components use CSS custom properties and can be easily themed. Key classes:

- `.google-translate-container` - Main container
- `.drag-handle` - Draggable area
- `.reset-button` - Reset position button
- `.goog-te-gadget .goog-te-combo` - Dropdown styling

## Features

### 🎨 **Enhanced User Experience**
- **Smooth Dragging** - 60fps drag performance
- **Visual Feedback** - Cursor changes and shadows
- **Boundary Constraints** - Never goes off-screen
- **Touch Support** - Works on mobile devices
- **Keyboard Accessible** - Tab navigation support

### 📱 **Responsive Design**
- **Mobile Optimized** - Touch-friendly on small screens
- **Adaptive Layout** - Adjusts to screen size
- **Flexible Positioning** - Works in any viewport

### ♿ **Accessibility**
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Compatible** - ARIA labels and descriptions
- **High Contrast Support** - Works with accessibility tools
- **Focus Management** - Proper focus indicators

### ⚡ **Performance**
- **Lazy Loading** - Google Translate script loads on demand
- **Efficient Rendering** - Minimal re-renders during drag
- **Memory Management** - Proper cleanup on unmount
- **Optimized Events** - Throttled mouse event handling

## Browser Compatibility

- **Chrome/Edge** (Chromium-based) - Full support
- **Firefox** - Full support
- **Safari** - Full support
- **Mobile Browsers** - Touch support included

## Troubleshooting

### Widget Not Dragging
1. Check if drag handle is visible (⋮⋮)
2. Ensure mouse events are not blocked
3. Verify CSS is properly loaded
4. Check browser console for errors

### Position Not Saving
1. Check localStorage is enabled
2. Verify browser supports localStorage
3. Check for privacy mode restrictions

### Performance Issues
1. Reduce drag sensitivity in CSS
2. Check for conflicting event listeners
3. Verify hardware acceleration is enabled

## Future Enhancements

1. **Snap to Grid** - Align to invisible grid
2. **Snap to Edges** - Auto-align to screen edges
3. **Multiple Widgets** - Support for multiple instances
4. **Gesture Support** - Pinch to resize, double-tap to reset
5. **Animation Presets** - Predefined animation paths
6. **Collaborative Positioning** - Sync position across devices

## Notes

- **Position Persistence**: Uses localStorage to remember position
- **Boundary Safety**: Widget cannot be dragged off-screen
- **Touch Friendly**: Optimized for mobile devices
- **Performance**: Smooth 60fps dragging experience
- **Accessibility**: Full keyboard and screen reader support

## Future Enhancements

1. **Language Detection**: Auto-detect user's preferred language
2. **Persistent Settings**: Save language preference in localStorage
3. **Custom Translations**: Add custom translation keys for specific terms
4. **Analytics**: Track translation usage
5. **Offline Support**: Cache translations for offline use

## Notes

- The Google Translate widget requires an internet connection
- Translation quality may vary depending on content complexity
- Some dynamic content may require page refresh after translation
- The widget automatically handles RTL languages (like Arabic) if added 