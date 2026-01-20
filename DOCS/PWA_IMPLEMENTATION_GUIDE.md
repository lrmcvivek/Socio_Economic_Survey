# PWA Implementation Guide

## Overview
This document describes the Progressive Web App (PWA) functionality implemented in the Socio-Economic Survey System.

## Features Implemented

### 1. Core PWA Components
- **Web App Manifest**: Defines how the app appears when installed
- **Service Worker**: Enables offline functionality and caching
- **Install Prompt**: Guides users to install the app
- **Status Indicator**: Shows online/offline status and installation state

### 2. Files Created

#### Public Assets
- `/public/manifest.json` - Web app manifest configuration
- `/public/sw.js` - Service worker for offline support
- `/public/offline.html` - Offline fallback page
- `/public/icons/` - Directory for app icons (needs to be populated)
- `/public/screenshots/` - Directory for app screenshots (needs to be populated)

#### Application Components
- `/contexts/PWAContext.tsx` - Context provider for PWA functionality
- `/components/InstallPrompt.tsx` - Install app prompt component
- `/components/PWAStatusIndicator.tsx` - Online/offline status indicator
- `/scripts/create-pwa-assets.js` - Helper script for asset creation

### 3. Configuration Changes

#### Next.js Configuration
Updated `next.config.ts` to support PWA features and service worker registration.

#### Main Layout Updates
Modified `app/layout.tsx` to:
- Include PWA meta tags
- Add PWA provider wrapper
- Integrate install prompt and status indicator components

#### Global Styles
Added CSS animations in `app/globals.css` for smooth transitions.

## Required Assets

### Icons (Place in `/public/icons/`)
- `icon-192x192.png` - Standard PWA icon
- `icon-256x256.png` - Medium resolution icon
- `icon-384x384.png` - High resolution icon
- `icon-512x512.png` - Largest icon for installations
- `icon-180x180.png` - Apple touch icon
- `icon-32x32.png` - Favicon
- `icon-16x16.png` - Small favicon

### Screenshots (Place in `/public/screenshots/`)
- `desktop.png` - 1280x720 screenshot for wide screens
- `mobile.png` - 720x1280 screenshot for narrow screens

## How It Works

### Installation Process
1. User visits the site multiple times or stays for 30+ seconds
2. Install prompt automatically appears (can be dismissed)
3. User clicks "Install" to add app to home screen
4. App launches in standalone mode with native feel

### Offline Functionality
- Service worker caches essential assets on first visit
- When offline, cached content is served automatically
- API requests return appropriate offline responses
- Dedicated offline page provides user guidance

### Status Monitoring
- Real-time online/offline detection
- Visual indicators show connection status
- Different styling for installed vs browser mode

## Testing Instructions

### Desktop Testing
1. Open Chrome DevTools (F12)
2. Go to Application tab → Manifest
3. Verify manifest is properly loaded
4. Test install functionality using "Install" button

### Mobile Testing
1. Open site on mobile device
2. Look for install prompt after 30 seconds
3. Add to home screen
4. Test offline functionality by disabling network

### Offline Testing
1. Open DevTools Network tab
2. Set throttling to "Offline"
3. Navigate to different pages
4. Verify offline page is shown

## Deployment Considerations

### HTTPS Requirement
PWA features require HTTPS in production. Make sure your deployment uses SSL certificates.

### Cache Management
- Service worker version is tied to `CACHE_NAME` constant
- Update version number to force cache refresh
- Old caches are automatically cleaned up

### Performance Impact
- Initial load may be slightly slower due to asset caching
- Subsequent loads are significantly faster
- Offline functionality works immediately after first visit

## Customization Options

### Modify Install Timing
In `InstallPrompt.tsx`, change the timeout value:
```javascript
setTimeout(() => {
  // Current: 30000 (30 seconds)
  // Change to desired delay in milliseconds
}, 30000);
```

### Adjust Caching Strategy
In `sw.js`, modify `urlsToCache` array to include/exclude specific assets.

### Customize Status Display
Modify `PWAStatusIndicator.tsx` to change appearance or add additional states.

## Troubleshooting

### Common Issues
1. **Manifest not loading**: Check browser console for errors
2. **Install prompt not showing**: Verify all manifest icons exist
3. **Offline page not working**: Check service worker registration in DevTools
4. **Caching issues**: Clear browser cache and unregister service worker

### Debug Tools
- Chrome DevTools → Application → Service Workers
- Chrome DevTools → Application → Manifest
- Lighthouse PWA audit tool

## Future Enhancements

### Planned Features
- Push notifications for survey reminders
- Background sync for offline data submission
- Enhanced offline data storage
- Improved install experience with guided tours

### Performance Optimizations
- Image compression for icons and screenshots
- More granular caching strategies
- Preloading of frequently accessed pages
- Lazy loading of non-essential assets