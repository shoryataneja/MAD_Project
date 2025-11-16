import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SectionList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HistoryScreen() {
  const [sectionedHistory, setSectionedHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const storedHistory = await AsyncStorage.getItem("historyLogs");
    const historyArray = storedHistory ? JSON.parse(storedHistory) : [];

    // Group by date
    const grouped = historyArray.reduce((acc, item) => {
      if (!acc[item.date]) acc[item.date] = [];
      acc[item.date].push(item);
      return acc;
    }, {});

    // Convert into SectionList data format
    const sectionData = Object.keys(grouped).map((date) => ({
      title: date,
      data: grouped[date],
    }));

    setSectionedHistory(sectionData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📜 History</Text>

      {sectionedHistory.length === 0 ? (
        <Text style={styles.noData}>No records yet...</Text>
      ) : (
        <SectionList
          sections={sectionedHistory}
          keyExtractor={(item, index) => index.toString()}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>📅 {section.title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemType}>
                {item.type === "tea" ? "🍵 Tea" : "☕ Coffee"}
              </Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    padding: 15,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
    textAlign: "center",
    color: "#6F4E37",
  },
  sectionHeader: {
    backgroundColor: "#FFEEDB",
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#6F4E37",
    marginTop: 10,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    marginHorizontal: 6,
    borderBottomWidth: 0.4,
    borderColor: "#D7C1A0",
  },
  itemType: {
    fontSize: 16,
  },
  itemTime: {
    fontSize: 16,
    color: "#555",
  },
  noData: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 16,
    color: "#A97142",
  },
});
