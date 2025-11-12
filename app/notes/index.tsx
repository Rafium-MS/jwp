import { useEffect, useState } from "react";
import { View, TextInput, Button, FlatList, Text } from "react-native";
import { db } from "@/lib/db";

type Note = { id:number; title?:string; body?:string; updated_at:number };

export default function Notes() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [items, setItems] = useState<Note[]>([]);

  function load() {
    const r = db.getAllSync<Note>("SELECT id, title, body, updated_at FROM notes ORDER BY updated_at DESC");
    setItems(r);
  }
  useEffect(load, []);

  function add() {
    const now = Date.now();
    db.runSync("INSERT INTO notes(title, body, created_at, updated_at) VALUES(?,?,?,?)", [title||null, body||null, now, now]);
    setTitle(""); setBody(""); load();
  }

  return (
    <View style={{ padding:16 }}>
      <TextInput placeholder="Título" value={title} onChangeText={setTitle} style={{ borderWidth:1, padding:8, borderRadius:8, marginBottom:8 }} />
      <TextInput placeholder="Escreva..." value={body} onChangeText={setBody} multiline style={{ borderWidth:1, padding:8, borderRadius:8, minHeight:120 }} />
      <Button title="Salvar nota" onPress={add} />
      <FlatList
        style={{ marginTop:12 }}
        data={items}
        keyExtractor={i=>String(i.id)}
        renderItem={({item})=>(
          <View style={{ padding:10, borderWidth:1, borderRadius:8, marginBottom:8 }}>
            <Text style={{ fontWeight:"600" }}>{item.title || "(sem título)"}</Text>
            {item.body ? <Text numberOfLines={2}>{item.body}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}
