import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.docbaran.donorman',
  appName: 'DonorMan',
  webDir: 'out',
  // Phone-first shell: same density on iPhone, iPad Split View, and foldable-open.
  // The web UI caps itself (~430px) and pins to the leading half on wide canvases.
  ios: {
    contentInset: 'automatic',
    // App shell manages its own overflow. Native WKWebView scrolling steals
    // range-slider drag gestures in TestFlight / Capacitor.
    scrollEnabled: false,
  },
};

export default config;
