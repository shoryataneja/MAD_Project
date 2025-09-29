import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HOME SCREEN ☕</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF8F0" },
  title: { fontSize: 22, fontWeight: "bold", color: "#6F4E37", textAlign: "center", paddingHorizontal: 20 },
});
