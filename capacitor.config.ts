import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.mamma.pregnancy",
  appName: "맘마",
  webDir: "out",
  server: {
    // 개발 시 로컬 서버 사용 (주석 해제)
    // url: "http://localhost:3000",
    // cleartext: true,
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#FFF9F5",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
      splashImmersive: true,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#FFF9F5",
    },
    Keyboard: {
      resize: "body",
      style: "LIGHT",
    },
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    scheme: "맘마",
  },
  android: {
    backgroundColor: "#FFF9F5",
  },
};

export default config;
