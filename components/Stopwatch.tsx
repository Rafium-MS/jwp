import { useEffect, useRef, useState } from "react";
import { View, Text, Button } from "react-native";

export default function Stopwatch({ onSave }: { onSave:(durationSec:number)=>void }) {
  const [running, setRunning] = useState(false);
  const [start, setStart] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const raf = useRef<number | null>(null);

  function tick() {
    if (running && start) setElapsed(Date.now() - start);
    raf.current = requestAnimationFrame(tick);
  }
  useEffect(()=>{ raf.current = requestAnimationFrame(tick); return ()=>raf.current && cancelAnimationFrame(raf.current); }, [running, start]);

  function startTimer() { setStart(Date.now()); setRunning(true); }
  function stopTimer() {
    if (!running || !start) return;
    const durSec = Math.round((Date.now() - start)/1000);
    setRunning(false); setStart(null); setElapsed(0); onSave(durSec);
  }

  const s = Math.floor(elapsed/1000);
  const mm = String(Math.floor(s/60)).padStart(2,'0');
  const ss = String(s%60).padStart(2,'0');

  return (
    <View style={{ alignItems:"center", gap:8 }}>
      <Text style={{ fontSize:48, fontWeight:"700" }}>{mm}:{ss}</Text>
      {!running ? <Button title="Iniciar" onPress={startTimer}/> : <Button title="Parar" onPress={stopTimer}/>}
    </View>
  );
}
