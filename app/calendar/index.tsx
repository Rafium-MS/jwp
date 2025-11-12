import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { db } from "@/lib/db";

type Event = { id:number; title:string; starts_at:number; ends_at:number; location?:string; kind?:string; };

export default function Calendar() {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState<number>(Date.now());
  const [end, setEnd] = useState<number>(Date.now()+60*60*1000);
  const [items, setItems] = useState<Event[]>([]);

  function load() {
    const res = db.getAllSync<Event>("SELECT * FROM events ORDER BY starts_at ASC");
    setItems(res);
  }
  useEffect(load, []);

  function add() {
    db.runSync("INSERT INTO events(title, starts_at, ends_at, created_at) VALUES(?,?,?,?)", [title, start, end, Date.now()]);
    setTitle(""); load();
  }

  return (
    <View style={{ padding:16 }}>
      <Text style={{ fontWeight:"700" }}>Novo evento</Text>
      <TextInput placeholder="Título (ex.: Reunião, Saída de Campo)" value={title} onChangeText={setTitle} style={{ borderWidth:1, padding:8, borderRadius:8, marginVertical:8 }} />
      <Button title="Salvar" onPress={add} />
      <FlatList
        data={items}
        keyExtractor={i=>String(i.id)}
        renderItem={({item})=>(
          <View style={{ padding:12, borderWidth:1, borderRadius:8, marginTop:8 }}>
            <Text style={{ fontWeight:"600" }}>{item.title}</Text>
            <Text>{new Date(item.starts_at).toLocaleString()} → {new Date(item.ends_at).toLocaleTimeString()}</Text>
          </View>
        )}
      />
    </View>
  );
}
