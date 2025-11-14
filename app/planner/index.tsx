import { useEffect, useState } from "react";
import { View, TextInput, Button, Text, FlatList } from "react-native";
import { db } from "@/lib/db";
import { scheduleAlarm } from "@/lib/notifications";

type Task = { id:number; title:string; notes?:string; due_at?:number; alarm_at?:number; done:number; };

export default function Planner() {
  const [title, setTitle] = useState("");
  const [when, setWhen] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  function load() {
    const res = db.getAllSync<Task>(
      "SELECT * FROM tasks ORDER BY done ASC, due_at IS NULL ASC, due_at ASC, id DESC"
    );
    setTasks(res);
  }

  useEffect(load, []);

  function addTask() {
    const now = Date.now();
    db.runSync(
      "INSERT INTO tasks(title, created_at, due_at, alarm_at, done) VALUES(?,?,?,?,0)",
      [title, now, when ?? null, when ?? null]
    );
    if (when) scheduleAlarm(title, when, { kind: "task" });
    setTitle(""); setWhen(null); load();
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <TextInput placeholder="Nova tarefa" value={title} onChangeText={setTitle} style={{ borderWidth:1, padding:8, borderRadius:8 }} />
      <TextInput placeholder="YYYY-MM-DD HH:mm" onChangeText={(t)=>setWhen(t? new Date(t).getTime() : null)} style={{ borderWidth:1, padding:8, borderRadius:8 }} />
      <Button title="Adicionar" onPress={addTask} />
      <FlatList
        data={tasks}
        keyExtractor={i=>String(i.id)}
        renderItem={({item})=>(
          <View style={{ padding:12, borderWidth:1, borderRadius:8, marginTop:8 }}>
            <Text style={{ fontWeight:"600" }}>{item.title}</Text>
            {item.due_at ? <Text>Vence: {new Date(item.due_at).toLocaleString()}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}
