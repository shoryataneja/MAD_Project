import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Icon } from "react-native-paper";

export default function HistoryScreen() {
  const [sectionedHistory, setSectionedHistory] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    const storedHistory = await AsyncStorage.getItem("historyLogs");
    const historyArray = storedHistory ? JSON.parse(storedHistory) : [];

    const grouped = historyArray.reduce((acc, item) => {
      if (!acc[item.date]) acc[item.date] = [];
      acc[item.date].push(item);
      return acc;
    }, {});

    const sectionData = Object.keys(grouped).map(date => ({
      title: date,
      data: grouped[date]
    }));

    setSectionedHistory(sectionData);
  };

  const deleteEntry = (sectionIndex, itemIndex) => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            let updatedSections = [...sectionedHistory];
            updatedSections[sectionIndex].data.splice(itemIndex, 1);

            updatedSections = updatedSections.filter(sec => sec.data.length > 0);
            setSectionedHistory(updatedSections);

            const flatData = updatedSections.flatMap(sec => sec.data);
            await AsyncStorage.setItem("historyLogs", JSON.stringify(flatData));
          }
        }
      ]
    );
  };

  const clearAllHistory = async () => {
    Alert.alert(
      "Clear All History",
      "Are you sure you want to delete ALL records?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("historyLogs");
            setSectionedHistory([]);

            await AsyncStorage.multiSet([
              ["teaCount", "0"],
              ["coffeeCount", "0"],
            ]);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Icon source="script-text-outline" size={23} color="#6F4E37" />
          <Text style={styles.header}>History</Text>
        </View>

        {sectionedHistory.length > 0 && (
          <TouchableOpacity onPress={clearAllHistory}>
            <View style={styles.clearButton}>
              <Icon source="trash-can-outline" size={18} color="#fff" />
              <Text style={styles.clearButtonText}>Clear All</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* NO DATA */}
      {sectionedHistory.length === 0 ? (
        <Text style={styles.noData}>No records yet...</Text>
      ) : (
        <SectionList
          sections={sectionedHistory}
          keyExtractor={(item, index) => index.toString()}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Icon source="calendar" size={18} color="#6F4E37" />
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item, index, section }) => {
            const sectionIndex = sectionedHistory.findIndex(s => s.title === section.title);

            return (
              <TouchableOpacity onLongPress={() => deleteEntry(sectionIndex, index)}>
                <View style={styles.itemRow}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Icon
                      source={item.type === "tea" ? "tea" : "coffee-outline"}
                      size={20}
                      color="#6F4E37"
                    />
                    <Text style={styles.itemType}>
                      {item.type === "tea" ? "Tea" : "Coffee"}
                    </Text>
                  </View>

                  <Text style={styles.itemTime}>{item.time}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0", padding: 15 },

  headerRow: {
    marginTop: 40,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  header: { fontSize: 22, fontWeight: "bold", color: "#6F4E37" },

  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9534F",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  clearButtonText: { color: "#fff", fontSize: 13, fontWeight: "600", marginLeft: 5 },

  sectionHeader: {
    backgroundColor: "#FFEEDB",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },

  sectionHeaderText: {
    fontSize: 16,
    color: "#6F4E37",
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginHorizontal: 6,
    borderBottomWidth: 0.4,
    borderColor: "#D7C1A0",
  },

  itemType: { fontSize: 16, color: "#6F4E37" },
  itemTime: { fontSize: 16, color: "#555" },

  noData: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 16,
    color: "#A97142",
  },
});
