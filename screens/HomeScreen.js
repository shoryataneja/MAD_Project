import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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


  useEffect(() => {
    const loadData = async () => {
      const storedDate = await AsyncStorage.getItem("chaiDate");
      const storedTea = await AsyncStorage.getItem("teaCount");
      const storedCoffee = await AsyncStorage.getItem("coffeeCount");

      const todayDate = getToday();
      setToday(todayDate);
      setGreeting(getGreeting());
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

      if (storedDate === todayDate) {
        if (storedTea) setTeaCount(parseInt(storedTea));
        if (storedCoffee) setCoffeeCount(parseInt(storedCoffee));
      } else {
        await AsyncStorage.multiSet([
          ["chaiDate", todayDate],
          ["teaCount", "0"],
          ["coffeeCount", "0"],
        ]);
        setTeaCount(0);
        setCoffeeCount(0);
      }
    };
    loadData();
  }, []);

  const saveCounts = async (tea, coffee) => {
    await AsyncStorage.multiSet([
      ["teaCount", tea.toString()],
      ["coffeeCount", coffee.toString()],
      ["chaiDate", getToday()],
    ]);
  };

const addDrink = (type) => {
  let newTea = teaCount;
  let newCoffee = coffeeCount;

  if (type === "tea") {
    newTea += 1;
  } else {
    newCoffee += 1;
  }

  setTeaCount(newTea);
  setCoffeeCount(newCoffee);
  setMood(getMood(newTea + newCoffee));
  saveCounts(newTea, newCoffee);
};


  const resetCount = async (type) => {
    if (type === "tea") {
      setTeaCount(0);
      await AsyncStorage.setItem("teaCount", "0");
      showToast("🍵 Tea counter reset!");
    } else {
      setCoffeeCount(0);
      await AsyncStorage.setItem("coffeeCount", "0");
      showToast("☕ Coffee counter reset!");
    }
  };

  useEffect(() => {
    setMood(getMood(teaCount + coffeeCount));
  }, [teaCount, coffeeCount]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Toast Message */}

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

      {/* Tea Card */}
      <View style={styles.card}>
        <Text style={styles.counterTitle}>🍵 Tea Tracker</Text>
        <Text style={styles.counter}>
          {teaCount} / {TEA_LIMIT}
        </Text>

        {teaCount > TEA_LIMIT && (
          <Text style={styles.warningBox}>
            ⚠️ You’ve crossed your chai limit! Drink some water 💧
          </Text>
        )}

        <View style={styles.cardButtons}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addDrink("tea")}
          >
            <Text style={styles.addButtonText}>+ Add Tea</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => resetCount("tea")}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Coffee Card */}
      <View style={styles.card}>
        <Text style={styles.counterTitle}>☕ Coffee Tracker</Text>
        <Text style={styles.counter}>
          {coffeeCount} / {COFFEE_LIMIT}
        </Text>

        {coffeeCount > COFFEE_LIMIT && (
          <Text style={styles.warningBox}>
            ⚡ Too much caffeine! Drink Some water 💧!
          </Text>
        )}

        <View style={styles.cardButtons}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addDrink("coffee")}
          >
            <Text style={styles.addButtonText}>+ Add Coffee</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => resetCount("coffee")}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mood */}
      <Text style={styles.moodText}>{mood}</Text>

      {/* Quick Nav */}
      <View style={styles.quickNav}>
        <TouchableOpacity onPress={() => navigation.navigate("History")}>
          <Text style={styles.link}>📜 View History</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Stats")}>
          <Text style={styles.link}>📊 View Stats</Text>
        </TouchableOpacity>
      </View>

      {/* Quote */}
      <View style={styles.quoteContainer}>
        <Text style={styles.quote}>💬 {quote}</Text>
      </View>

      <Text style={styles.footer}>
        Resets automatically every morning 🌅
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF8F0",
    padding: 20,
    alignItems: "center",
    flexGrow: 1,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
  },
  greeting: { fontSize: 16, color: "#6F4E37" },
  title: { fontSize: 20, fontWeight: "bold", color: "#6F4E37" },
  headerButtons: { flexDirection: "row" },
  iconButton: { marginLeft: 10 },
  iconText: { fontSize: 24 },
  date: { color: "#8B6B4A", marginVertical: 10 },

  card: {
    backgroundColor: "#FFEEDB",
    width: "90%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  counterTitle: {
    fontSize: 16,
    color: "#8B6B4A",
    marginBottom: 5,
  },
  counter: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6F4E37",
    marginBottom: 10,
  },
  warningBox: {
    backgroundColor: "#FFD6C9",
    color: "#B22222",
    fontWeight: "600",
    padding: 8,
    borderRadius: 6,
    width: "100%",
    textAlign: "center",
    marginBottom: 8,
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  addButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#6F4E37",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  resetButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#D3C0A6",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  resetButtonText: {
    color: "#6F4E37",
    fontSize: 15,
    fontWeight: "bold",
  },
  toast: {
    position: "absolute",
    top: 20,
    backgroundColor: "#6F4E37",
    padding: 10,
    borderRadius: 8,
    zIndex: 100,
  },
  toastText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  moodText: {
    fontSize: 16,
    marginTop: 15,
    color: "#A97142",
    fontStyle: "italic",
  },
  quickNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginVertical: 15,
  },
  link: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
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
    marginTop: 20,
    fontSize: 12,
    color: "#A97142",
  },
});
