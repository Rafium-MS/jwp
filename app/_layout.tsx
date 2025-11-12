import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDb } from "@/lib/db";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false }),
});

export default function Layout() {
  useEffect(() => { initDb(); }, []);
  return <Stack screenOptions={{ headerShown: false }} />;
}
