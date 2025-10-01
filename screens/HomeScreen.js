import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
  const [chaiCount, setChaiCount] = useState(0);

  // Load saved chai count on screen load
  useEffect(() => {
    const fetchCount = async () => {
      const savedCount = await AsyncStorage.getItem("chaiCount");
      if (savedCount !== null) {
        setChaiCount(parseInt(savedCount));
      }
    };
    fetchCount();
  }, []);

  // Add chai and save in AsyncStorage
  const addChai = async () => {
    const newCount = chaiCount + 1;
    setChaiCount(newCount);
    await AsyncStorage.setItem("chaiCount", newCount.toString());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>☕ Campus Chai Tracker</Text>
      <Text style={styles.counter}>Today’s Chai: {chaiCount}</Text>

      <Button title="➕ Add Chai" onPress={addChai} />
      <View style={{ marginTop: 10 }} />
      <Button title="📜 History" onPress={() => navigation.navigate("History")} />
      <View style={{ marginTop: 10 }} />
      <Button title="📊 Stats" onPress={() => navigation.navigate("Stats")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  counter: {
    fontSize: 18,
    marginBottom: 20,
  },
});
