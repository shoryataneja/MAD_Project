import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem("historyLogs");
      setHistory(storedHistory ? JSON.parse(storedHistory) : []);
    } catch (error) {
      console.log("Error loading history:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.type}>
        {item.type === "tea" ? "🍵 Tea" : "☕ Coffee"}
      </Text>
      <Text style={styles.meta}>
        {item.time} • {item.date}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 History</Text>

      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 50 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No history yet...</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#FFF8F0",
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
    color: "#6F4E37",
    textAlign: "center",
  },
  item: {
    backgroundColor: "#FFEEDB",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  type: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6F4E37",
  },
  meta: {
    color: "#8B6B4A",
    marginTop: 4,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#6F4E37",
  },
});
