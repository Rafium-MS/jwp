import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function ensureAndroidChannels() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("alarms", {
    name: "Alarms",
    importance: Notifications.AndroidImportance.HIGH,
    bypassDnd: true,
    vibrationPattern: [250, 250, 250, 250],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    sound: undefined // defina se quiser um som custom mais tarde
  });
}
