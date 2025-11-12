import { ExpoConfig } from "expo/config";

const ACCENT = "#00ff9d";
const BG = "#0b0f12";

export default ({ config }: { config: ExpoConfig }) => ({
  ...config,
  name: "JW Planner",
  slug: "jw-planner",
  scheme: "jwplanner",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: BG
  },
  assetBundlePatterns: ["**/*"],
  updates: {
    url: "https://u.expo.dev/00000000-0000-0000-0000-000000000000",
    fallbackToCacheTimeout: 0
  },
  runtimeVersion: { policy: "nativeVersion" },
  plugins: [
    "expo-router",
    [
      "expo-notifications",
      {
        icon: "./assets/notification-icon.png",
        color: ACCENT,
        sounds: []
      }
    ]
  ],
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.rafium.jwplanner",
    buildNumber: "1.0.0",
    infoPlist: {
      NSUserTrackingUsageDescription:
        "Usado apenas para melhorar a experiência do app (sem rastreamento de terceiros).",
      UIBackgroundModes: []
    }
  },
  android: {
    package: "com.rafium.jwplanner",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: BG
    },
    permissions: [
      "VIBRATE",
      "WAKE_LOCK",
      "RECEIVE_BOOT_COMPLETED",
      // mantenha apenas se realmente precisar de alarme exato:
      "SCHEDULE_EXACT_ALARM"
    ],
    notification: {
      icon: "./assets/notification-icon.png",
      color: ACCENT,
      channel: "alarms"
    }
  },
  extra: {
    eas: { projectId: "00000000-0000-0000-0000-000000000000" }
  }
});
