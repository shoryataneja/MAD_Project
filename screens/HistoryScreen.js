import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

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

          // Reset counts globally
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
      <View style={styles.headerRow}><View style={styles.headerRow}>
  <Text style={styles.header}>📜 History</Text>

  {sectionedHistory.length > 0 && (
    <TouchableOpacity onPress={clearAllHistory}>
      <Text style={styles.clearButton}>🗑 Clear All</Text>
    </TouchableOpacity>
  )}
</View>

</View>


      {sectionedHistory.length === 0 ? (
        <Text style={styles.noData}>No records yet...</Text>
      ) : (
        <SectionList
          sections={sectionedHistory}
          keyExtractor={(item, index) => index.toString()}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>📅 {section.title}</Text>
          )}
          renderItem={({ item, index, section }) => {
            const sectionIndex = sectionedHistory.findIndex(s => s.title === section.title);
            return (
              <TouchableOpacity onLongPress={() => deleteEntry(sectionIndex, index)}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemType}>{item.type === "tea" ? "🍵 Tea" : "☕ Coffee"}</Text>
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
  header: { fontSize: 22, fontWeight: "bold", marginTop: 40, textAlign: "center", color: "#6F4E37" },
  sectionHeader: { backgroundColor: "#FFEEDB", padding: 8, borderRadius: 8, fontSize: 16, color: "#6F4E37", marginTop: 10 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, marginHorizontal: 6, borderBottomWidth: 0.4, borderColor: "#D7C1A0" },
  itemType: { fontSize: 16 },
  itemTime: { fontSize: 16, color: "#555" },
  noData: { marginTop: 30, textAlign: "center", fontSize: 16, color: "#A97142" },
  headerRow: {
  marginTop: 35,
  marginBottom: 10,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  paddingHorizontal: 5,
},

header: {
  fontSize: 22,
  fontWeight: "bold",
  color: "#6F4E37",
},

clearButton: {
  backgroundColor: "#D9534F",
  color: "#fff",
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
  fontWeight: "600",
  fontSize: 13,
},


});
