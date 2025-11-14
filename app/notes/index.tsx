import { useCallback, useEffect, useState } from "react";
import { View, TextInput, FlatList, Text, StyleSheet } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { db } from "@/lib/db";
import { tokens } from "@/theme/tokens";

type Note = { id: number; title?: string; body?: string; updated_at: number };

export default function Notes() {
  const placeholderColor = "rgba(231,245,255,0.5)";
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [items, setItems] = useState<Note[]>([]);

  const fetchNotes = useCallback(
    () =>
      db.getAll<Note>(
        "SELECT id, title, body, updated_at FROM notes ORDER BY updated_at DESC"
      ),
    []
  );

  const load = useCallback(async () => {
    const r = await fetchNotes();
    setItems(r);
  }, [fetchNotes]);

  useEffect(() => {
    let active = true;

    void (async () => {
      const r = await fetchNotes();
      if (active) {
        setItems(r);
      }
    })();

    return () => {
      active = false;
    };
  }, [fetchNotes]);

  async function add() {
    const now = Date.now();
    await db.run(
      "INSERT INTO notes(title, body, created_at, updated_at) VALUES(?,?,?,?)",
      [title || null, body || null, now, now]
    );
    setTitle("");
    setBody("");
    await load();
  }

  return (
    <View style={styles.screen}>
      <View style={styles.formGroup}>
        <TextInput
          placeholder="Título"
          placeholderTextColor={placeholderColor}
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Escreva..."
          placeholderTextColor={placeholderColor}
          value={body}
          onChangeText={setBody}
          multiline
          style={[styles.input, styles.multiline]}
        />
        <PrimaryButton title="Salvar nota" onPress={add} />
      </View>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>{item.title || "(sem título)"}</Text>
            {item.body ? (
              <Text numberOfLines={2} style={styles.noteBody}>
                {item.body}
              </Text>
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
  multiline: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: tokens.spacing,
    paddingBottom: tokens.spacing * 2,
  },
  noteCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.card,
    borderRadius: tokens.radius,
    padding: tokens.spacing,
    gap: tokens.spacing * 0.5,
  },
  noteTitle: {
    color: tokens.color.text,
    fontWeight: "600",
  },
  noteBody: {
    color: tokens.color.text,
    opacity: 0.8,
  },
});
