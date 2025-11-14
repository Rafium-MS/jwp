import { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { EventCard } from "@/components/EventCard";
import { db } from "@/lib/db";
import { tokens } from "@/theme/tokens";

type Event = {
  id: number;
  title: string;
  starts_at: number;
  ends_at: number;
  location?: string;
  kind?: string;
};

export default function Calendar() {
  const placeholderColor = "rgba(231,245,255,0.5)";
  const [title, setTitle] = useState("");
  const [start, setStart] = useState<number>(Date.now());
  const [end, setEnd] = useState<number>(Date.now() + 60 * 60 * 1000);
  const [items, setItems] = useState<Event[]>([]);

  function load() {
    const res = db.getAllSync<Event>("SELECT * FROM events ORDER BY starts_at ASC");
    setItems(res);
  }
  useEffect(load, []);

  function add() {
    db.runSync(
      "INSERT INTO events(title, starts_at, ends_at, created_at) VALUES(?,?,?,?)",
      [title, start, end, Date.now()]
    );
    setTitle("");
    load();
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>Novo evento</Text>
      <View style={styles.formGroup}>
        <TextInput
          placeholder="Título (ex.: Reunião, Saída de Campo)"
          placeholderTextColor={placeholderColor}
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <PrimaryButton title="Salvar" onPress={add} />
      </View>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <EventCard
            title={item.title}
            startsAt={item.starts_at}
            endsAt={item.ends_at}
            location={item.location}
            kind={item.kind}
          />
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
  listContent: {
    gap: tokens.spacing,
    paddingTop: tokens.spacing,
  },
});
