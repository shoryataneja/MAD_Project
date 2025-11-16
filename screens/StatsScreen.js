import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const TEA_LIMIT = 5;
const COFFEE_LIMIT = 3;

export default function StatsScreen() {
  const [todayStats, setTodayStats] = useState({ tea: 0, coffee: 0 });
  const [weekStats, setWeekStats] = useState({ tea: 0, coffee: 0 });
  const [weeklyAvg, setWeeklyAvg] = useState({ tea: "0.00", coffee: "0.00" });
  const [healthyStreak, setHealthyStreak] = useState({
    current: 0,
    longest: 0,
  });

  const getDateString = (date) => date.toLocaleDateString("en-CA");
  const getToday = () => getDateString(new Date());

  const getDateNDaysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return getDateString(d);
  };

  const loadStats = useCallback(async () => {
    const storedHistory = await AsyncStorage.getItem("historyLogs");
    const historyArray = storedHistory ? JSON.parse(storedHistory) : [];

    const todayDate = getToday();
    const dailyMap = {};

    historyArray.forEach((item) => {
      const { date, type } = item;
      if (!dailyMap[date]) dailyMap[date] = { tea: 0, coffee: 0 };

      if (type === "tea") dailyMap[date].tea += 1;
      if (type === "coffee") dailyMap[date].coffee += 1;
    });

    // Today's Stats
    const todayTea = dailyMap[todayDate]?.tea || 0;
    const todayCoffee = dailyMap[todayDate]?.coffee || 0;
    setTodayStats({ tea: todayTea, coffee: todayCoffee });

    // Last 7 Days Stats
    const last7 = [];
    for (let i = 0; i < 7; i++) last7.push(getDateNDaysAgo(i));

    let teaTotal = 0;
    let coffeeTotal = 0;

    last7.forEach((d) => {
      if (dailyMap[d]) {
        teaTotal += dailyMap[d].tea;
        coffeeTotal += dailyMap[d].coffee;
      }
    });

    setWeekStats({ tea: teaTotal, coffee: coffeeTotal });
    setWeeklyAvg({
      tea: (teaTotal / 7).toFixed(2),
      coffee: (coffeeTotal / 7).toFixed(2),
    });

    // Healthy Streak Only
    let longest = 0,
      current = 0;

    for (let i = 0; i < 365; i++) {
      const day = getDateNDaysAgo(i);
      const d = dailyMap[day];

      const logged = d && (d.tea > 0 || d.coffee > 0);
      const withinLimit = logged && d.tea <= TEA_LIMIT && d.coffee <= COFFEE_LIMIT;

      if (withinLimit) {
        current += 1;
      } else {
        longest = Math.max(longest, current);
        current = 0;
      }
    }

    longest = Math.max(longest, current);

    setHealthyStreak({ current, longest });
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📊 Stats</Text>

      {/* Today */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Today</Text>
        <Text style={styles.statText}>🍵 Tea: {todayStats.tea}</Text>
        <Text style={styles.statText}>☕ Coffee: {todayStats.coffee}</Text>
      </View>

      {/* Weekly */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📆 Last 7 Days</Text>
        <Text style={styles.statText}>🍵 Total Tea: {weekStats.tea}</Text>
        <Text style={styles.statText}>☕ Total Coffee: {weekStats.coffee}</Text>
      </View>

      {/* Weekly Avg */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📈 Weekly Averages</Text>
        <Text style={styles.statText}>🍵 Avg Tea/day: {weeklyAvg.tea}</Text>
        <Text style={styles.statText}>☕ Avg Coffee/day: {weeklyAvg.coffee}</Text>
      </View>

      {/* Healthy Streak */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌱 Healthy Streak</Text>
        <Text style={styles.statText}>Current: {healthyStreak.current} day(s)</Text>
        <Text style={styles.statText}>Longest: {healthyStreak.longest} day(s)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
  backgroundColor: "#FFF8F0",
  padding: 20,
  paddingTop: 60,   // ⬅️ add this line or increase value
  alignItems: "center",
  flexGrow: 1,
},
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
    color: "#6F4E37",
  },
  card: {
    backgroundColor: "#FFEEDB",
    width: "90%",
    padding: 18,
    borderRadius: 15,
    marginVertical: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#6F4E37",
    marginBottom: 8,
  },
  statText: {
    fontSize: 15,
    color: "#8B6B4A",
    marginVertical: 2,
  },
});