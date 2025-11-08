import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
  const [chaiCount, setChaiCount] = useState(0);
  const [today, setToday] = useState("");
  const [greeting, setGreeting] = useState("");
  const [quote, setQuote] = useState("");
  const [mood, setMood] = useState("");
  const [dailyLimit, setDailyLimit] = useState(5); // default limit

  const chaiQuotes = [
    "Life happens, chai helps ☕",
    "You’re brew-tiful, never forget it 💛",
    "Chai: because adulting is hard 😅",
    "Stressed, blessed, and tea-obsessed 🍵",
    "A cup of tea makes everything better 🌿",
  ];

  // Get today's date
  const getToday = () => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  };

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  // Mood based on chai count
  const getMood = (count) => {
    if (count === 0) return "Sleepy 😴";
    if (count < 3) return "Warming up 🔥";
    if (count < 6) return "Buzzing with energy ⚡";
    return "You might be 70% chai now 😜";
  };

  useEffect(() => {
    const loadData = async () => {
      const storedDate = await AsyncStorage.getItem("chaiDate");
      const storedCount = await AsyncStorage.getItem("chaiCount");
      const storedLimit = await AsyncStorage.getItem("dailyLimit");

      const todayDate = getToday();
      setToday(todayDate);
      setGreeting(getGreeting());
      setQuote(chaiQuotes[Math.floor(Math.random() * chaiQuotes.length)]);

      if (storedLimit) setDailyLimit(parseInt(storedLimit));

      if (storedDate === todayDate && storedCount) {
        setChaiCount(parseInt(storedCount));
      } else {
        await AsyncStorage.setItem("chaiDate", todayDate);
        await AsyncStorage.setItem("chaiCount", "0");
        setChaiCount(0);
      }
    };
    loadData();
  }, []);

  const addChai = async () => {
    const newCount = chaiCount + 1;
    setChaiCount(newCount);
    setMood(getMood(newCount));

    await AsyncStorage.setItem("chaiCount", newCount.toString());
    await AsyncStorage.setItem("chaiDate", getToday());
  };

  const addCoffee = async () => {
    const newCount = chaiCount + 1;
    setChaiCount(newCount);
    setMood(getMood(newCount));

    await AsyncStorage.setItem("chaiCount", newCount.toString());
    await AsyncStorage.setItem("chaiDate", getToday());
  };

  useEffect(() => {
    setMood(getMood(chaiCount));
  }, [chaiCount]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.title}>Campus Chai Tracker ☕</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.iconText}>👤</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("About")}
          >
            <Text style={styles.iconText}>ℹ️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.date}>📅 {today}</Text>

      {/* Tracker Card */}
      <View style={styles.card}>
        <Text style={styles.counterTitle}>Today’s Count</Text>
        <Text style={styles.counter}>
          {chaiCount} / {dailyLimit}
        </Text>
        <Text style={styles.mood}>{mood}</Text>
      </View>

      {/* Add Buttons */}
      <View style={styles.addButtons}>
        <TouchableOpacity style={styles.addButton} onPress={addChai}>
          <Text style={styles.addButtonText}>+ Add Tea 🍵</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={addCoffee}>
          <Text style={styles.addButtonText}>+ Add Coffee ☕</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Nav */}
      <View style={styles.quickNav}>
        <Button title="📜 View History" onPress={() => navigation.navigate("History")} />
        <Button title="📊 View Stats" onPress={() => navigation.navigate("Stats")} />
      </View>

      {/* Quote */}
      <View style={styles.quoteContainer}>
        <Text style={styles.quote}>💬 {quote}</Text>
      </View>

      <Text style={styles.footer}>Resets automatically every morning 🌅</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    padding: 20,
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  headerButtons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 10,
  },
  iconText: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6F4E37",
  },
  greeting: {
    fontSize: 16,
    color: "#6F4E37",
  },
  date: {
    color: "#8B6B4A",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFEEDB",
    width: "90%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
  },
  counterTitle: {
    fontSize: 16,
    color: "#8B6B4A",
  },
  counter: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6F4E37",
  },
  mood: {
    fontSize: 16,
    marginTop: 5,
    color: "#A97142",
  },
  addButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
  },
  addButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#6F4E37",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  quickNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
  },
  quoteContainer: {
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 10,
    width: "90%",
  },
  quote: {
    textAlign: "center",
    color: "#6F4E37",
    fontStyle: "italic",
  },
  footer: {
    marginTop: 15,
    fontSize: 12,
    color: "#A97142",
  },
});
