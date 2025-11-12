import { View, TextInput, Button, Text, FlatList } from "react-native";
import Stopwatch from "@/components/Stopwatch";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";

type Session = { id:number; duration_sec:number; notes?:string; created_at:number };

export default function Timer() {
  const [notes, setNotes] = useState("");
  const [list, setList] = useState<Session[]>([]);

  function load() {
    const r = db.getAllSync<Session>("SELECT id, duration_sec, notes, created_at FROM sessions ORDER BY id DESC");
    setList(r);
  }
  useEffect(load, []);

  function save(durSec:number) {
    db.runSync("INSERT INTO sessions(started_at, ended_at, duration_sec, notes) VALUES(?,?,?,?)",
      [Date.now()-durSec*1000, Date.now(), durSec, notes || null]);
    setNotes(""); load();
  }

  return (
    <View style={{ padding:16 }}>
      <Stopwatch onSave={save} />
      <TextInput placeholder="Anotações da sessão (colocações, RVs...)" value={notes} onChangeText={setNotes} style={{ borderWidth:1, padding:8, borderRadius:8, marginTop:12 }} />
      <FlatList
        style={{ marginTop:12 }}
        data={list}
        keyExtractor={i=>String(i.id)}
        renderItem={({item})=>(
          <View style={{ padding:10, borderWidth:1, borderRadius:8, marginBottom:8 }}>
            <Text>{Math.round(item.duration_sec/60)} min — {new Date(item.created_at).toLocaleString()}</Text>
            {item.notes ? <Text>{item.notes}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}
