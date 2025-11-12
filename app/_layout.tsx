import { useEffect } from "react";
import { initDb } from "@/lib/db";
import * as Notifications from "expo-notifications";
import { ensureAndroidChannels } from "@/lib/channels";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  }),
});

export default function Layout() {
  useEffect(() => {
    initDb();
    ensureAndroidChannels();
  }, []);
  // ...
}
