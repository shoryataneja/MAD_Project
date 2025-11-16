import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StatsScreen() {
  const [todayTea, setTodayTea] = useState(0);
  const [todayCoffee, setTodayCoffee] = useState(0);

  const [weekTea, setWeekTea] = useState(0);
  const [weekCoffee, setWeekCoffee] = useState(0);

  const getToday = () => new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const history = await AsyncStorage.getItem("historyLogs");
    const logs = history ? JSON.parse(history) : [];

    const today = getToday();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    let tTea = 0, tCoffee = 0, wTea = 0, wCoffee = 0;

    logs.forEach(item => {
      const itemDate = new Date(item.date);

      if (item.date === today) {
        item.type === "tea" ? tTea++ : tCoffee++;
      }

      if (itemDate >= sevenDaysAgo) {
        item.type === "tea" ? wTea++ : wCoffee++;
      }
    });

    setTodayTea(tTea);
    setTodayCoffee(tCoffee);
    setWeekTea(wTea);
    setWeekCoffee(wCoffee);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.headerTitle}>📊 Stats</Text>

      {/* COMPONENT 1 — TODAY */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Today</Text>
        <Text style={styles.text}>🍵 Tea: {todayTea}</Text>
        <Text style={styles.text}>☕ Coffee: {todayCoffee}</Text>
      </View>

      {/* COMPONENT 2 — LAST 7 DAYS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Last 7 Days</Text>
        <Text style={styles.text}>🍵 Tea: {weekTea}</Text>
        <Text style={styles.text}>☕ Coffee: {weekCoffee}</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFF8F0",
    flexGrow: 1,
    paddingTop: 70,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#6F4E37",
    textAlign: "center",
    marginBottom: 22,
  },
  card: {
    backgroundColor: "#FFEEDB",
    padding: 18,
    borderRadius: 15,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6F4E37",
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    color: "#6F4E37",
    marginVertical: 2,
  },
});
