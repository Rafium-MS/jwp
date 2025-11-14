import { Pressable, PressableStateCallbackType, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";

import { tokens } from "@/theme/tokens";

type PrimaryButtonProps = {
  title: string;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({ title, onPress, disabled, style }: PrimaryButtonProps) {
  function getStyle({ pressed }: PressableStateCallbackType) {
    return [
      styles.button,
      pressed && !disabled && styles.buttonPressed,
      disabled && styles.buttonDisabled,
      style,
    ];
  }

  return (
    <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled} style={getStyle}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: tokens.color.accent,
    paddingVertical: tokens.spacing,
    paddingHorizontal: tokens.spacing * 1.5,
    borderRadius: tokens.radius,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    color: tokens.color.bg,
    fontWeight: "700",
  },
});
