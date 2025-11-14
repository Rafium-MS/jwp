import { useEffect, useRef, useState } from "react";
import { View, Text, Button } from "react-native";

export default function Stopwatch({ onSave }: { onSave:(durationSec:number)=>void }) {
  const [running, setRunning] = useState(false);
  const [start, setStart] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running || start === null) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setElapsed(Date.now() - start);
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - start);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, start]);

  function startTimer() {
    setElapsed(0);
    setStart(Date.now());
    setRunning(true);
  }

  function stopTimer() {
    if (!running || start === null) return;
    const durationMs = Date.now() - start;
    const durSec = Math.round(durationMs / 1000);
    setElapsed(durationMs);
    setRunning(false);
    setStart(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    onSave(durSec);
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
