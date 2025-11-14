import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

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
  const tz = dayjs.tz.guess();
  const triggerDate = dayjs(whenMs).tz(tz).toDate();
  const trigger: Notifications.DateTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date: triggerDate,
  };

  return Notifications.scheduleNotificationAsync({
    content: { title, body: 'Lembrete', data },
    trigger,
  });
}
