import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [teaCount, setTeaCount] = useState(0);
  const [coffeeCount, setCoffeeCount] = useState(0);
  const [today, setToday] = useState("");
  const [greeting, setGreeting] = useState("");
  const [quote, setQuote] = useState("");
  const [mood, setMood] = useState("");

  // Dynamic limits
  const [teaLimit, setTeaLimit] = useState(5);
  const [coffeeLimit, setCoffeeLimit] = useState(3);

  const quotes = [
    "Life happens, chai helps ☕",
    "You’re brew-tiful, never forget it 💛",
    "Stressed, blessed, and tea-obsessed 🍵",
    "Chai: because adulting is hard 😅",
    "A cup of tea makes everything better 🌿",
  ];

  const getToday = () => new Date().toLocaleDateString("en-CA");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  const getMood = (total) => {
    if (total === 0) return "Sleepy 😴";
    if (total < 3) return "Warming up 🔥";
    if (total < 6) return "Buzzing with energy ⚡";
    return "You might be 70% chai now 😜";
  };

  // Load limits + today's data
  const loadData = async () => {
    const todayDate = getToday();
    setToday(todayDate);
    setGreeting(getGreeting());
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    // Load limits
    const savedTeaLimit = await AsyncStorage.getItem("dailyTeaLimit");
    const savedCoffeeLimit = await AsyncStorage.getItem("dailyCoffeeLimit");

    if (savedTeaLimit) setTeaLimit(parseInt(savedTeaLimit));
    if (savedCoffeeLimit) setCoffeeLimit(parseInt(savedCoffeeLimit));

    const storedDate = await AsyncStorage.getItem("chaiDate");

    if (!storedDate || storedDate !== todayDate) {
      await AsyncStorage.setItem("chaiDate", todayDate);
      setTeaCount(0);
      setCoffeeCount(0);
      return;
    }

    // Load today's counts
    const storedHistory = await AsyncStorage.getItem("historyLogs");
    const historyArray = storedHistory ? JSON.parse(storedHistory) : [];

    const todayTea = historyArray.filter(
      (item) => item.type === "tea" && item.date === todayDate
    ).length;

    const todayCoffee = historyArray.filter(
      (item) => item.type === "coffee" && item.date === todayDate
    ).length;

    setTeaCount(todayTea);
    setCoffeeCount(todayCoffee);
    setMood(getMood(todayTea + todayCoffee));
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const addToHistory = async (type) => {
    const now = new Date();
    const entry = {
      type,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: getToday(),
    };

    const storedHistory = await AsyncStorage.getItem("historyLogs");
    const historyArray = storedHistory ? JSON.parse(storedHistory) : [];

    historyArray.unshift(entry);
    await AsyncStorage.setItem("historyLogs", JSON.stringify(historyArray));
  };

  const addDrink = async (type) => {
    await addToHistory(type);
    loadData();
  };

  const resetCount = async (type) => {
    const todayDate = getToday();
    const storedHistory = await AsyncStorage.getItem("historyLogs");
    let historyArray = storedHistory ? JSON.parse(storedHistory) : [];

    historyArray = historyArray.filter(
      (item) => !(item.type === type && item.date === todayDate)
    );

    await AsyncStorage.setItem("historyLogs", JSON.stringify(historyArray));
    loadData();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.title}>Campus Chai Tracker ☕</Text>
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.iconText}>👤</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.navigate("About")}
          >
            <Text style={styles.iconText}>ℹ️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.date}>📅 {today}</Text>

      {/* Tea Card */}
      <View style={styles.card}>
        <Text style={styles.counterTitle}>🍵 Tea Tracker</Text>
        <Text style={styles.counter}>{teaCount} / {teaLimit}</Text>

        {teaCount > teaLimit && (
          <Text style={styles.warningBox}>
            ⚠️ You’ve crossed your chai limit! Drink some water 💧
          </Text>
        )}

        <View style={styles.cardButtons}>
          <TouchableOpacity style={styles.addButton} onPress={() => addDrink("tea")}>
            <Text style={styles.addButtonText}>+ Add Tea</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={() => resetCount("tea")}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Coffee Card */}
      <View style={styles.card}>
        <Text style={styles.counterTitle}>☕ Coffee Tracker</Text>
        <Text style={styles.counter}>{coffeeCount} / {coffeeLimit}</Text>

        {coffeeCount > coffeeLimit && (
          <Text style={styles.warningBox}>
            ⚡ Too much caffeine! Drink Some water 💧!
          </Text>
        )}

        <View style={styles.cardButtons}>
          <TouchableOpacity style={styles.addButton} onPress={() => addDrink("coffee")}>
            <Text style={styles.addButtonText}>+ Add Coffee</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={() => resetCount("coffee")}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.moodText}>{mood}</Text>

      <View style={styles.quickNav}>
        <TouchableOpacity onPress={() => navigation.navigate("History")}>
          <Text style={styles.link}>📜 View History</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Stats")}>
          <Text style={styles.link}>📊 View Stats</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quoteContainer}>
        <Text style={styles.quote}>💬 {quote}</Text>
      </View>

      <Text style={styles.footer}>Resets automatically every morning 🌅</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#FFF8F0", padding: 20, alignItems: "center", flexGrow: 1 },
  header: { width: "100%", flexDirection: "row", justifyContent: "space-between", marginTop: 40 },
  greeting: { fontSize: 16, color: "#6F4E37" },
  title: { fontSize: 20, fontWeight: "bold", color: "#6F4E37" },
  date: { color: "#8B6B4A", marginVertical: 10 },

  headerButtons: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerIcon: { padding: 8, borderRadius: 10 },
  iconText: { fontSize: 20, color: "#6F4E37" },

  card: { backgroundColor: "#FFEEDB", width: "90%", padding: 20, borderRadius: 15, marginVertical: 10 },
  counterTitle: { fontSize: 16, color: "#8B6B4A" },
  counter: { fontSize: 28, fontWeight: "bold", color: "#6F4E37", marginVertical: 10 },
  warningBox: { backgroundColor: "#FFD6C9", color: "#B22222", padding: 8, borderRadius: 6, textAlign: "center" },

  cardButtons: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 10 },
  addButton: { flex: 1, marginHorizontal: 5, backgroundColor: "#6F4E37", padding: 10, borderRadius: 8 },
  resetButton: { flex: 1, marginHorizontal: 5, backgroundColor: "#D3C0A6", padding: 10, borderRadius: 8 },
  addButtonText: { color: "#fff", fontSize: 15, fontWeight: "bold", textAlign: "center" },
  resetButtonText: { color: "#6F4E37", fontSize: 15, fontWeight: "bold", textAlign: "center" },

  moodText: { fontSize: 16, marginTop: 15, color: "#A97142", fontStyle: "italic" },
  quickNav: { flexDirection: "row", justifyContent: "space-between", width: "90%", marginVertical: 15 },
  link: { color: "#007AFF", fontSize: 16, fontWeight: "600" },

  quoteContainer: { backgroundColor: "#FFF3E0", padding: 12, borderRadius: 10, width: "90%" },
  quote: { textAlign: "center", color: "#6F4E37", fontStyle: "italic" },
  footer: { marginTop: 20, fontSize: 12, color: "#A97142" },
});
