import { useEffect, useMemo, useState } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { PrimaryButton } from "@/components/PrimaryButton";
import { TaskItem } from "@/components/TaskItem";
import { db } from "@/lib/db";
import { scheduleAlarm } from "@/lib/notifications";
import { tokens } from "@/theme/tokens";

type Task = {
  id: number;
  title: string;
  notes?: string;
  due_at?: number;
  alarm_at?: number;
  done: number;
};

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Planner() {
  const placeholderColor = "rgba(231,245,255,0.5)";
  const [title, setTitle] = useState("");
  const [when, setWhen] = useState<number | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [showIOSPicker, setShowIOSPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  function load() {
    const res = db.getAllSync<Task>(
      "SELECT * FROM tasks ORDER BY done ASC, due_at IS NULL ASC, due_at ASC, id DESC"
    );
    setTasks(res);
  }

  useEffect(load, []);

  const formattedWhen = useMemo(
    () => (when != null ? dayjs(when).format("DD/MM/YYYY HH:mm") : null),
    [when]
  );

  function applyWhen(date: Date | null) {
    if (!date) {
      setWhen(null);
      setScheduledDate(null);
      return;
    }
    const normalized = dayjs(date).second(0).millisecond(0);
    setWhen(normalized.valueOf());
    setScheduledDate(normalized.toDate());
  }

  function handleIOSChange(event: DateTimePickerEvent, date?: Date) {
    if (event.type === "dismissed") return;
    if (date) {
      applyWhen(date);
    }
  }

  function openAndroidPicker() {
    const currentDate = scheduledDate ?? new Date();
    DateTimePickerAndroid.open({
      mode: "date",
      value: currentDate,
      onChange: (dateEvent, selectedDate) => {
        if (dateEvent.type !== "set" || !selectedDate) return;
        const base = dayjs(selectedDate);
        DateTimePickerAndroid.open({
          mode: "time",
          value: scheduledDate ?? new Date(),
          is24Hour: true,
          onChange: (timeEvent, selectedTime) => {
            if (timeEvent.type !== "set" || !selectedTime) return;
            const time = dayjs(selectedTime);
            const combined = base
              .hour(time.hour())
              .minute(time.minute())
              .second(0)
              .millisecond(0);
            applyWhen(combined.toDate());
          },
        });
      },
    });
  }

  function addTask() {
    setError(null);
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Informe um título para a tarefa.");
      return;
    }
    if (when != null && !Number.isFinite(when)) {
      setError("Selecione uma data válida.");
      return;
    }
    const now = Date.now();
    db.runSync(
      "INSERT INTO tasks(title, created_at, due_at, alarm_at, done) VALUES(?,?,?,?,0)",
      [trimmedTitle, now, when ?? null, when ?? null]
    );
    if (when != null) scheduleAlarm(trimmedTitle, when, { kind: "task" });
    setTitle("");
    applyWhen(null);
    setShowIOSPicker(false);
    load();
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>Nova tarefa</Text>
      <View style={styles.formGroup}>
        <TextInput
          placeholder="Nova tarefa"
          placeholderTextColor={placeholderColor}
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <View style={styles.whenGroup}>
          <Pressable
            onPress={() => {
              if (Platform.OS === "ios") {
                setShowIOSPicker((prev) => !prev);
              } else {
                openAndroidPicker();
              }
            }}
            style={({ pressed }) => [
              styles.dateTrigger,
              pressed && styles.dateTriggerPressed,
            ]}
          >
            <Text style={styles.dateTriggerText}>
              {formattedWhen ?? "Selecionar data e hora"}
            </Text>
          </Pressable>
          {scheduledDate ? (
            <Pressable onPress={() => applyWhen(null)} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Limpar data</Text>
            </Pressable>
          ) : null}
          {Platform.OS === "ios" && showIOSPicker ? (
            <DateTimePicker
              mode="datetime"
              value={scheduledDate ?? new Date()}
              onChange={handleIOSChange}
              display="spinner"
              minuteInterval={1}
            />
          ) : null}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton title="Adicionar" onPress={addTask} />
      </View>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TaskItem title={item.title} dueAt={item.due_at} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
    padding: tokens.spacing * 1.5,
    gap: tokens.spacing,
  },
  heading: {
    color: tokens.color.text,
    fontSize: 20,
    fontWeight: "700",
  },
  formGroup: {
    gap: tokens.spacing,
  },
  input: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.card,
    borderRadius: tokens.radius,
    padding: tokens.spacing,
    color: tokens.color.text,
  },
  whenGroup: {
    gap: tokens.spacing * 0.75,
  },
  dateTrigger: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius,
    padding: tokens.spacing,
    backgroundColor: tokens.color.card,
  },
  dateTriggerPressed: {
    opacity: 0.85,
  },
  dateTriggerText: {
    color: tokens.color.text,
    opacity: 0.8,
  },
  clearButton: {
    alignSelf: "flex-start",
    paddingHorizontal: tokens.spacing,
    paddingVertical: tokens.spacing * 0.5,
    borderRadius: tokens.radius,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  clearButtonText: {
    color: tokens.color.accent,
    fontWeight: "600",
  },
  error: {
    color: "#ff6b6b",
  },
  listContent: {
    gap: tokens.spacing,
    paddingTop: tokens.spacing,
  },
});
