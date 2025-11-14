import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

import Stopwatch from "@/components/Stopwatch";
import { db } from "@/lib/db";
import { tokens } from "@/theme/tokens";

type Session = {
  id: number;
  duration_sec: number;
  notes?: string;
  created_at: number;
};

export default function Timer() {
  const placeholderColor = "rgba(231,245,255,0.5)";
  const [notes, setNotes] = useState("");
  const [list, setList] = useState<Session[]>([]);

  function load() {
    const r = db.getAllSync<Session>(
      "SELECT id, duration_sec, notes, created_at FROM sessions ORDER BY id DESC"
    );
    setList(r);
  }
  useEffect(load, []);

  function save(durSec: number) {
    db.runSync(
      "INSERT INTO sessions(started_at, ended_at, duration_sec, notes) VALUES(?,?,?,?)",
      [Date.now() - durSec * 1000, Date.now(), durSec, notes || null]
    );
    setNotes("");
    load();
  }

  return (
    <View style={styles.screen}>
      <Stopwatch onSave={save} />
      <TextInput
        placeholder="Anotações da sessão (colocações, RVs...)"
        placeholderTextColor={placeholderColor}
        value={notes}
        onChangeText={setNotes}
        style={styles.input}
      />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={list}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.sessionCard}>
            <Text style={styles.sessionMeta}>
              {Math.round(item.duration_sec / 60)} min —
              {" "}
              {new Date(item.created_at).toLocaleString()}
            </Text>
            {item.notes ? (
              <Text style={styles.sessionNotes}>{item.notes}</Text>
            ) : null}
          </View>
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
  input: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.card,
    borderRadius: tokens.radius,
    padding: tokens.spacing,
    color: tokens.color.text,
    marginTop: tokens.spacing,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: tokens.spacing,
    paddingVertical: tokens.spacing,
  },
  sessionCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.card,
    borderRadius: tokens.radius,
    padding: tokens.spacing,
    gap: tokens.spacing * 0.5,
  },
  sessionMeta: {
    color: tokens.color.text,
    fontWeight: "600",
  },
  sessionNotes: {
    color: tokens.color.text,
    opacity: 0.8,
  },
});
