import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* App Title */}
      <Text style={styles.title}>About</Text>

      {/* Content will be added in next commits */}

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

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6F4E37",
    marginTop: 40,
    marginBottom: 20,
  },
});
