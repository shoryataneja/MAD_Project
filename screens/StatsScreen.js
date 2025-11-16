import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StatsScreen() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    calculateDailyStreak();
  }, []);

  // 🍵 Calculate Daily Streak
  const calculateDailyStreak = async () => {
    const storedHistory = await AsyncStorage.getItem("historyLogs");
    const historyArray = storedHistory ? JSON.parse(storedHistory) : [];

    // Extract unique dates where tea or coffee was consumed
    const uniqueDays = Array.from(new Set(historyArray.map(item => item.date)));

    // Sort latest → oldest
    uniqueDays.sort((a, b) => new Date(b) - new Date(a));

    let streakCount = 1;
    for (let i = 0; i < uniqueDays.length - 1; i++) {
      const current = new Date(uniqueDays[i]);
      const next = new Date(uniqueDays[i + 1]);

      const diffDays = Math.floor((current - next) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) streakCount++;
      else break;
    }

    setStreak(uniqueDays.length ? streakCount : 0);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>📊 Chai Stats Overview</Text>

      {/* ==================== (COMPONENT 1) - Daily Streak ==================== */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🔥 Daily Chai Streak</Text>
        <Text style={styles.streakText}>{streak} days</Text>
      </View>



      {/* ====================  (COMING NEXT)  ==================== */}
      {/* (COMPONENT 2) - Last 7 Days Summary */}
      {/* (COMPONENT 3) - Weekly Insights */}
      {/* (COMPONENT 4) - Healthy Consumption Meter */}
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF8F0",
    padding: 20,
    paddingTop: 80,  // starts lower from top
    alignItems: "center",
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6F4E37",
    marginBottom: 15,
  },
  card: {
    width: "90%",
    backgroundColor: "#FFEEDB",
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6F4E37",
    marginBottom: 6,
  },
  streakText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6F4E37",
  },
});
