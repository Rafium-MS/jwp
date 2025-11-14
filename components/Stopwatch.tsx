import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { tokens } from "@/theme/tokens";

type StopwatchProps = {
  onSave: (durationSec: number) => void;
};

export default function Stopwatch({ onSave }: StopwatchProps) {
  const [running, setRunning] = useState(false);
  const [start, setStart] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running || start === null) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setElapsed(Date.now() - start);
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - start);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, start]);

  function startTimer() {
    setElapsed(0);
    setStart(Date.now());
    setRunning(true);
  }

  function stopTimer() {
    if (!running || start === null) return;
    const durationMs = Date.now() - start;
    const durSec = Math.round(durationMs / 1000);
    setElapsed(durationMs);
    setRunning(false);
    setStart(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    onSave(durSec);
  }

  const seconds = Math.floor(elapsed / 1000);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{mm}:{ss}</Text>
      <Pressable
        onPress={running ? stopTimer : startTimer}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>{running ? "Parar" : "Iniciar"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: tokens.spacing,
  },
  time: {
    fontSize: 48,
    fontWeight: "700",
    color: tokens.color.text,
  },
  button: {
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.spacing * 2,
    paddingVertical: tokens.spacing,
    borderRadius: tokens.radius,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    color: tokens.color.bg,
    fontWeight: "600",
  },
});
