import { Tabs } from "expo-router";

export default function Home() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="planner" options={{ title: "Planner" }} />
      <Tabs.Screen name="calendar" options={{ title: "Calendário" }} />
      <Tabs.Screen name="timer" options={{ title: "Cronômetro" }} />
      <Tabs.Screen name="notes" options={{ title: "Notas" }} />
    </Tabs>
  );
}
