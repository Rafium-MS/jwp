import { useEffect, useMemo, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  FlatList,
  Platform,
  Pressable,
} from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { db } from "@/lib/db";
import { scheduleAlarm } from "@/lib/notifications";

type Task = { id:number; title:string; notes?:string; due_at?:number; alarm_at?:number; done:number; };

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Planner() {
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
    <View style={{ padding: 16, gap: 12 }}>
      <TextInput
        placeholder="Nova tarefa"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 8, borderRadius: 8 }}
      />
      <View style={{ gap: 8 }}>
        <Pressable
          onPress={() => {
            if (Platform.OS === "ios") {
              setShowIOSPicker((prev) => !prev);
            } else {
              openAndroidPicker();
            }
          }}
          style={{
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            backgroundColor: "#fff",
          }}
        >
          <Text style={{ color: formattedWhen ? "#000" : "#666" }}>
            {formattedWhen ?? "Selecionar data e hora"}
          </Text>
        </Pressable>
        {scheduledDate && (
          <Button title="Limpar data" onPress={() => applyWhen(null)} />
        )}
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
      {error ? <Text style={{ color: "#c00" }}>{error}</Text> : null}
      <Button title="Adicionar" onPress={addTask} />
      <FlatList
        data={tasks}
        keyExtractor={i=>String(i.id)}
        renderItem={({item})=>(
          <View style={{ padding:12, borderWidth:1, borderRadius:8, marginTop:8 }}>
            <Text style={{ fontWeight:"600" }}>{item.title}</Text>
            {item.due_at ? (
              <Text>Vence: {dayjs(item.due_at).format("DD/MM/YYYY HH:mm")}</Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}
