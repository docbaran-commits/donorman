import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.docbaran.donorman',
  appName: 'DonorMan',
  webDir: 'out',
  // Phone-first shell: same density on iPhone, iPad Split View, and foldable-open.
  // The web UI caps itself (~430px) and pins to the leading half on wide canvases.
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
  },
};

export default config;
