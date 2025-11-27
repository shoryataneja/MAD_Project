import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { BarChart } from "react-native-chart-kit";
import { Icon } from "react-native-paper";

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
      if (type === "tea") dailyMap[date].tea++;
      if (type === "coffee") dailyMap[date].coffee++;
    });

    setTodayStats({
      tea: dailyMap[todayDate]?.tea || 0,
      coffee: dailyMap[todayDate]?.coffee || 0,
    });

    let teaTotal = 0,
      coffeeTotal = 0;
    const last7 = [...Array(7)].map((_, i) => getDateNDaysAgo(i));

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

    // streak
    let longest = 0,
      current = 0;

    for (let i = 0; i < 365; i++) {
      const d = dailyMap[getDateNDaysAgo(i)];
      const logged = d && (d.tea > 0 || d.coffee > 0);
      const within = logged && d.tea <= TEA_LIMIT && d.coffee <= COFFEE_LIMIT;

      if (within) current++;
      else {
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

  const statsData = [
    {
      id: "1",
      title: (
        <Text style={styles.titleRow}>
          <Icon source="calendar-today" size={18} color="#6F4E37" /> Today
        </Text>
      ),
      lines: [`Tea: ${todayStats.tea}`, `Coffee: ${todayStats.coffee}`],
    },
    {
      id: "2",
      title: (
        <Text style={styles.titleRow}>
          <Icon source="calendar-week" size={18} color="#6F4E37" /> Last 7 Days
        </Text>
      ),
      lines: [
        `Total Tea: ${weekStats.tea}`,
        `Total Coffee: ${weekStats.coffee}`,
      ],
    },
    {
      id: "3",
      title: (
        <Text style={styles.titleRow}>
          <Icon source="chart-line" size={18} color="#6F4E37" /> Weekly Averages
        </Text>
      ),
      lines: [
        `Avg Tea/day: ${weeklyAvg.tea}`,
        `Avg Coffee/day: ${weeklyAvg.coffee}`,
      ],
    },
    {
      id: "4",
      title: (
        <Text style={styles.titleRow}>
          <Icon source="leaf" size={18} color="#6F4E37" /> Healthy Streak
        </Text>
      ),
      lines: [
        `Current: ${healthyStreak.current} day(s)`,
        `Longest: ${healthyStreak.longest} day(s)`,
      ],
    },
  ];

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      {item.lines.map((line, i) => (
        <Text key={i} style={styles.statText}>
          {line}
        </Text>
      ))}
    </View>
  );

  return (
    <FlatList
      data={statsData}
      keyExtractor={(item) => item.id}
      renderItem={renderCard}
      ListHeaderComponent={
        <>
          <Text style={styles.header}>
            <Icon source="chart-box-outline" size={24} color="#6F4E37" /> Stats
          </Text>
        </>
      }
      ListFooterComponent={
        <>
          {weekStats.tea + weekStats.coffee > 0 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>
                <Icon source="chart-bar" size={20} color="#6F4E37" /> Weekly
                Consumption Chart
              </Text>

              <BarChart
                data={{
                  labels: ["Tea", "Coffee"],
                  datasets: [{ data: [weekStats.tea, weekStats.coffee] }],
                }}
                width={300}
                height={200}
                fromZero
                showValuesOnTopOfBars
                withInnerLines={false}
                chartConfig={{
                  backgroundColor: "#FFEEDB",
                  backgroundGradientFrom: "#FFEEDB",
                  backgroundGradientTo: "#FFEEDB",
                  decimalPlaces: 0,
                  color: () => "#6F4E37",
                  labelColor: () => "#6F4E37",
                  barPercentage: 0.6,
                }}
                style={styles.chartStyle}
              />
            </View>
          )}
        </>
      }
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF8F0",
    padding: 20,
    paddingTop: 60,
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
  titleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
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
    marginBottom: 6,
  },
  statText: { fontSize: 15, color: "#8B6B4A", marginVertical: 2 },
  chartContainer: {
    marginTop: 10,
    backgroundColor: "#FFEEDB",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: "center",
    width: "92%",
  },
  chartTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#6F4E37",
    marginBottom: 10,
  },
  chartStyle: { borderRadius: 15 },
});
