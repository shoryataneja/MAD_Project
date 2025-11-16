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

  const TEA_LIMIT = 5;
  const COFFEE_LIMIT = 3;

  const quotes = [
    "Life happens, chai helps ☕",
    "You’re brew-tiful, never forget it 💛",
    "Stressed, blessed, and tea-obsessed 🍵",
    "Chai: because adulting is hard 😅",
    "A cup of tea makes everything better 🌿",
  ];

  const getToday = () => new Date().toISOString().split("T")[0];

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

  // Load initial UI data
  useEffect(() => {
    setToday(getToday());
    setGreeting(getGreeting());
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // Sync count with history when coming back to HomeScreen
  useFocusEffect(
    useCallback(() => {
      const syncCounts = async () => {
        const storedHistory = await AsyncStorage.getItem("historyLogs");
        const historyArray = storedHistory ? JSON.parse(storedHistory) : [];

        const tea = historyArray.filter(item => item.type === "tea").length;
        const coffee = historyArray.filter(item => item.type === "coffee").length;

        setTeaCount(tea);
        setCoffeeCount(coffee);
      };
      syncCounts();
    }, [])
  );

  // Add log entry
  const addToHistory = async (type) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateString = now.toISOString().split("T")[0];

    const newEntry = { type, time: timeString, date: dateString };

    const storedHistory = await AsyncStorage.getItem("historyLogs");
    let historyArray = storedHistory ? JSON.parse(storedHistory) : [];

    historyArray.unshift(newEntry);

    await AsyncStorage.setItem("historyLogs", JSON.stringify(historyArray));
  };

  // Handle click
  const addDrink = async (type) => {
    await addToHistory(type);
    
    // Re-sync counts
    const storedHistory = await AsyncStorage.getItem("historyLogs");
    const historyArray = storedHistory ? JSON.parse(storedHistory) : [];
    const tea = historyArray.filter(i => i.type === "tea").length;
    const coffee = historyArray.filter(i => i.type === "coffee").length;

    setTeaCount(tea);
    setCoffeeCount(coffee);
    setMood(getMood(tea + coffee));
  };

  // RESET only clears that drink’s logs
  const resetCount = async (type) => {
    const storedHistory = await AsyncStorage.getItem("historyLogs");
    let historyArray = storedHistory ? JSON.parse(storedHistory) : [];

    historyArray = historyArray.filter(item => item.type !== type);

    await AsyncStorage.setItem("historyLogs", JSON.stringify(historyArray));

    if (type === "tea") setTeaCount(0);
    else setCoffeeCount(0);

    setMood(getMood((type === "tea" ? coffeeCount : teaCount)));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.title}>Campus Chai Tracker ☕</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Text style={styles.iconText}>👤</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("About")}>
            <Text style={styles.iconText}>ℹ️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.date}>📅 {today}</Text>

      {/* Tea Card */}
      <View style={styles.card}>
        <Text style={styles.counterTitle}>🍵 Tea Tracker</Text>
        <Text style={styles.counter}>{teaCount} / {TEA_LIMIT}</Text>

        {teaCount > TEA_LIMIT && (
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
        <Text style={styles.counter}>{coffeeCount} / {COFFEE_LIMIT}</Text>

        {coffeeCount > COFFEE_LIMIT && (
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
  iconText: { fontSize: 24, marginLeft: 12 },
  date: { color: "#8B6B4A", marginVertical: 10 },
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
  headerButtons: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12, // keeps even spacing
},
headerIcon: {
  backgroundColor: "#FFEEDB",
  padding: 6,
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
  elevation: 2,
},

iconText: {
  fontSize: 20,
  color: "#6F4E37",
},

});
