import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Icon } from "react-native-paper";

export default function AboutScreen({ navigation }) {   // <-- FIXED
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Home Button */}
    <TouchableOpacity
  style={styles.homeBtn}
  onPress={() => navigation.navigate("Main", { screen: "Home" })}
>
  <Icon source="home-outline" size={28} color="#6F4E37" />
</TouchableOpacity>


      
      {/* App Logo */}
      <View style={styles.logoCircle}>
        <Icon source="coffee" size={40} color="#6F4E37" />
      </View>

      {/* App Name */}
      <Text style={styles.title}>Campus Chai Tracker</Text>
      <Text style={styles.tagline}>Track your daily chai & coffee habits ☕📊</Text>

      {/* Version */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Icon source="information-outline" size={20} color="#6F4E37" />  App Version
        </Text>
        <Text style={styles.cardText}>1.0.0</Text>
      </View>

      {/* Description */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Icon source="text-box-outline" size={20} color="#6F4E37" />  About
        </Text>
        <Text style={styles.cardText}>
          Campus Chai Tracker is designed to help students track their daily tea
          and coffee intake, maintain healthy limits, and understand their
          weekly consumption insights in a clean and simple way.
        </Text>
      </View>

      {/* Developer Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Icon source="account-circle-outline" size={20} color="#6F4E37" />  
          Developer
        </Text>

        <Text style={styles.cardText}>Shorya Taneja</Text>
        <Text style={styles.cardText}>React Native Developer</Text>
      </View>

      {/* Features */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Icon source="star-outline" size={20} color="#6F4E37" />  Features
        </Text>

        <Text style={styles.cardText}>• Track tea & coffee daily</Text>
        <Text style={styles.cardText}>• View weekly stats</Text>
        <Text style={styles.cardText}>• Healthy streak insights</Text>
        <Text style={styles.cardText}>• Delete history & entries</Text>
        <Text style={styles.cardText}>• Set daily drink limits</Text>
        <Text style={styles.cardText}>• Profile customization</Text>
      </View>


      {/* Support */}
      <View style={[styles.card, { marginBottom: 40 }]}>
        <Text style={styles.cardTitle}>
          <Icon source="email-outline" size={20} color="#6F4E37" />  
          Support
        </Text>
        <Text style={styles.cardText}>campuschai.support@gmail.com</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({


    homeBtn: {
    position: "absolute",
    top: 75,
    right: 25,
    zIndex: 10,
  },

  container: {
    backgroundColor: "#FFF8F0",
    padding: 20,
    alignItems: "center",
  },

  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "#FFEEDB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 15,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6F4E37",
    marginBottom: 5,
  },

  tagline: {
    fontSize: 14,
    color: "#8B6B4A",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFEEDB",
    width: "100%",
    padding: 18,
    borderRadius: 15,
    marginVertical: 10,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#6F4E37",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 15,
    color: "#8B6B4A",
    marginVertical: 2,
    lineHeight: 20,
  },
});