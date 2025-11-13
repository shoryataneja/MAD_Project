import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function HistoryScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Header */}
      <Text style={styles.title}>📜 History</Text>
      <Text style={styles.subTitle}>Your daily chai & coffee log</Text>

      {/* Placeholder - empty state */}
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>No entries yet...</Text>
        <Text style={styles.emptySubText}>
          Start adding Chai or Coffee to see history here ☕🍵
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF8F0",
    padding: 20,
    alignItems: "center",
  },
title: {
  fontSize: 26,
  fontWeight: "bold",
  color: "#6F4E37",
  marginTop: 80,   
},

  subTitle: {
    fontSize: 14,
    color: "#8B6B4A",
    marginBottom: 20,
  },
  emptyBox: {
    backgroundColor: "#FFEEDB",
    width: "90%",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 40,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  emptyText: {
    fontSize: 18,
    color: "#6F4E37",
    fontWeight: "bold",
  },
  emptySubText: {
    fontSize: 14,
    color: "#8B6B4A",
    marginTop: 5,
    textAlign: "center",
  },
});
