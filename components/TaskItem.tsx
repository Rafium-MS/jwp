import { ReactNode } from "react";
import {
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import dayjs from "dayjs";

import { tokens } from "@/theme/tokens";

type TaskItemProps = {
  title: string;
  dueAt?: number | null;
  onPress?: () => void;
  trailing?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function TaskItem({
  title,
  dueAt,
  onPress,
  trailing,
  style,
}: TaskItemProps) {
  const formattedDue = dueAt ? dayjs(dueAt).format("DD/MM/YYYY HH:mm") : null;

  function getStyle({ pressed }: PressableStateCallbackType) {
    return [
      styles.card,
      pressed && styles.cardPressed,
      style,
    ];
  }

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      onPress={onPress}
      disabled={!onPress}
      style={getStyle}
    >
      <Text style={styles.title}>{title}</Text>
      {formattedDue ? (
        <Text style={styles.subtitle}>Vence: {formattedDue}</Text>
      ) : null}
      {trailing}
    </Pressable>
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
  cardPressed: {
    opacity: 0.85,
  },
  title: {
    color: tokens.color.text,
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    color: tokens.color.text,
    opacity: 0.7,
  },
});
