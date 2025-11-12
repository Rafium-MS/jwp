import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export async function ensureNotificationPermission() {
  if (!Device.isDevice) return false;
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const res = await Notifications.requestPermissionsAsync();
    return res.status === 'granted';
  }
  return true;
}

export async function scheduleAlarm(title: string, whenMs: number, data?: any) {
  await ensureNotificationPermission();
  return Notifications.scheduleNotificationAsync({
    content: { title, body: 'Lembrete', data },
    trigger: { date: new Date(whenMs) } // dispara no horário exato
  });
}
