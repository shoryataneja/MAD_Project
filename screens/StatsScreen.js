import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const TEA_LIMIT = 5;
const COFFEE_LIMIT = 3;

export default function StatsScreen() {
  const [todayStats, setTodayStats] = useState({ tea: 0, coffee: 0 });
  const [weekStats, setWeekStats] = useState({ tea: 0, coffee: 0 });
  const [weeklyAvg, setWeeklyAvg] = useState({ tea: "0.00", coffee: "0.00" });
  const [healthyStreak, setHealthyStreak] = useState({ current: 0, longest: 0 });

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

    const todayTea = dailyMap[todayDate]?.tea || 0;
    const todayCoffee = dailyMap[todayDate]?.coffee || 0;
    setTodayStats({ tea: todayTea, coffee: todayCoffee });

    // 7-Day total
    let teaTotal = 0, coffeeTotal = 0;
    const last7days = [...Array(7)].map((_, i) => getDateNDaysAgo(i));

    last7days.forEach((d) => {
      if (dailyMap[d]) {
        teaTotal += dailyMap[d].tea;
        coffeeTotal += dailyMap[d].coffee;
      }
    });

    setWeekStats({ tea: teaTotal, coffee: coffeeTotal });
    setWeeklyAvg({ tea: (teaTotal / 7).toFixed(2), coffee: (coffeeTotal / 7).toFixed(2) });

    // Healthy Streak
    let longest = 0, current = 0;
    for (let i = 0; i < 365; i++) {
      const d = dailyMap[getDateNDaysAgo(i)];
      const logged = d && (d.tea > 0 || d.coffee > 0);
      const ok = logged && d.tea <= TEA_LIMIT && d.coffee <= COFFEE_LIMIT;
      if (ok) current++;
      else { longest = Math.max(longest, current); current = 0; }
    }
    longest = Math.max(longest, current);
    setHealthyStreak({ current, longest });
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  // Prepare FlatList data
  const statsData = [
    {
      id: "1",
      title: "📅 Today",
      lines: [`🍵 Tea: ${todayStats.tea}`, `☕ Coffee: ${todayStats.coffee}`],
    },
    {
      id: "2",
      title: "📆 Last 7 Days",
      lines: [`🍵 Total Tea: ${weekStats.tea}`, `☕ Total Coffee: ${weekStats.coffee}`],
    },
    {
      id: "3",
      title: "📈 Weekly Averages",
      lines: [`🍵 Avg Tea/day: ${weeklyAvg.tea}`, `☕ Avg Coffee/day: ${weeklyAvg.coffee}`],
    },
    {
      id: "4",
      title: "🌱 Healthy Streak",
      lines: [
        `Current: ${healthyStreak.current} day(s)`,
        `Longest: ${healthyStreak.longest} day(s)`
      ],
    },
  ];

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      {item.lines.map((line, index) => (
        <Text key={index} style={styles.statText}>{line}</Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📊 Stats</Text>

      <FlatList
        data={statsData}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
    height: 100,
    width: 250,
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