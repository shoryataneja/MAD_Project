import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Icon } from "react-native-paper";

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* App Logo */}
      <View style={styles.logoCircle}>
        <Icon source="coffee" size={40} color="#6F4E37" />
      </View>

      {/* App Name */}
      <Text style={styles.title}>Campus Chai Tracker</Text>
      <Text style={styles.tagline}>Track your daily chai & coffee habits ☕📊</Text>

      {/* --- App Version Card --- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>App Version</Text>
        <Text style={styles.cardText}>Campus Chai Tracker v1.0.0</Text>
      </View>

            {/* --- App Description Card --- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>What This App Does</Text>
        <Text style={styles.cardText}>
          Campus Chai Tracker helps you keep track of your daily tea and coffee
          intake effortlessly. It maintains your history, shows weekly insights,
          and motivates you to maintain healthy habits.
        </Text>
      </View>

      {/* --- Developer Info Card --- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Developer</Text>
        <Text style={styles.cardText}>
          This app was designed & developed as a personal project to showcase
          React Native skills, state management, navigation handling, and clean
          UI implementation.
        </Text>

        <Text style={[styles.cardText, { marginTop: 6, fontWeight: "600" }]}>
          Developer: Shorya Taneja
        </Text>
        <Text style={styles.cardText}>Version: 1.0.0</Text>
      </View>

      {/* --- Contact / Support Card --- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact & Support</Text>

        <Text style={styles.cardText}>
          Have feedback or found an issue? I'd love to hear from you!
        </Text>

        <Text style={[styles.cardText, { marginTop: 6 }]}>
          📧 Email: shorya.taneja@example.com
        </Text>

        <Text style={styles.cardText}>
          🌐 GitHub: github.com/shoryataneja
        </Text>

        <Text style={styles.cardText}>
          💬 Feel free to reach out for improvements or collaborations.
        </Text>
      </View>


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

  card: {
    backgroundColor: "#FFEEDB",
    width: "100%",
    padding: 18,
    borderRadius: 15,
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#6F4E37",
    marginTop: 8 ,
  },

  cardText: {
    fontSize: 15,
    color: "#8B6B4A",
    lineHeight: 20,
  },
});
