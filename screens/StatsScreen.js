import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StatsScreen() {
  const [todayTea, setTodayTea] = useState(0);
  const [todayCoffee, setTodayCoffee] = useState(0);

  const [weekTea, setWeekTea] = useState(0);
  const [weekCoffee, setWeekCoffee] = useState(0);

  const [streak, setStreak] = useState(0);

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

      // Today
      if (item.date === today) {
        item.type === "tea" ? tTea++ : tCoffee++;
      }

      // Last 7 days
      if (itemDate >= sevenDaysAgo) {
        item.type === "tea" ? wTea++ : wCoffee++;
      }
    });

    setTodayTea(tTea);
    setTodayCoffee(tCoffee);

    setWeekTea(wTea);
    setWeekCoffee(wCoffee);

    calculateStreak(logs);
  };

  // ------------------ STREAK LOGIC ------------------
  const calculateStreak = (logs) => {
    if (!logs || logs.length === 0) {
      setStreak(0);
      return;
    }

    const drinksByDate = {};

    logs.forEach(item => {
      if (!drinksByDate[item.date]) drinksByDate[item.date] = 0;
      drinksByDate[item.date]++;
    });

    let streakCount = 0;
    let checkDate = new Date();

    while (true) {
      const dateStr = checkDate.toLocaleDateString("en-CA");
      const drinks = drinksByDate[dateStr] || 0;

      if (drinks === 0 || drinks > 3) break;

      streakCount++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    setStreak(streakCount);
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

      {/* COMPONENT 3 — STREAKS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔥 Healthy Streak</Text>
        <Text style={styles.text}>🚀 Current streak: <Text style={{fontWeight:"bold"}}>{streak} day(s)</Text></Text>
        <Text style={styles.subNote}>* Count increases only if ≤ 3 drinks/day</Text>
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
  subNote: {
    fontSize: 12,
    marginTop: 8,
    color: "#A97142",
    fontStyle: "italic",
  },
});
