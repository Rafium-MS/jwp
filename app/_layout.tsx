import { useEffect } from "react";
import { Slot } from "expo-router";
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
    void ensureAndroidChannels();
  }, []);

  return <Slot />;
}
