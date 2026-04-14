import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.futoppi.mystictarot',
  appName: 'hocsi Tarot',
  webDir: 'out',
  server: {
    iosScheme: "capacitor",
    hostname: "localhost",
    allowNavigation: ["*"]
  },
  plugins: {
    CapacitorHttp: {
      enabled: false
    }
  }
};

export default config;
