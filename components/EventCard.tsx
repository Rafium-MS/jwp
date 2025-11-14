import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import dayjs from "dayjs";

import { tokens } from "@/theme/tokens";

type EventCardProps = {
  title: string;
  startsAt: number | Date;
  endsAt: number | Date;
  location?: string | null;
  kind?: string | null;
  style?: StyleProp<ViewStyle>;
};

export function EventCard({
  title,
  startsAt,
  endsAt,
  location,
  kind,
  style,
}: EventCardProps) {
  const startDate = dayjs(startsAt);
  const endDate = dayjs(endsAt);

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.time}>
        {startDate.format("DD/MM/YYYY HH:mm")} → {endDate.format("HH:mm")}
      </Text>
      {location ? <Text style={styles.meta}>📍 {location}</Text> : null}
      {kind ? <Text style={styles.meta}>Tipo: {kind}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.color.card,
    borderRadius: tokens.radius,
    borderWidth: 1,
    borderColor: tokens.color.border,
    padding: tokens.spacing,
    gap: tokens.spacing * 0.5,
  },
  title: {
    color: tokens.color.text,
    fontSize: 16,
    fontWeight: "600",
  },
  time: {
    color: tokens.color.text,
    opacity: 0.8,
  },
  meta: {
    color: tokens.color.text,
    opacity: 0.7,
  },
});
