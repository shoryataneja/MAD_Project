import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const savedEmail = await AsyncStorage.getItem("userEmail");
    const savedName = await AsyncStorage.getItem("userName");

    setEmail(savedEmail || "Not Provided");
    setName(savedName || "User");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {/* Avatar */}
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarInitial}>
          {name ? name.charAt(0).toUpperCase() : "U"}
        </Text>
      </View>

      {/* User Info */}
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>

      {/* Edit Profile */}
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.prefRow}>
          <Text style={styles.prefLabel}>Daily Tea Limit</Text>
          <Text style={styles.prefValue}>5 cups</Text>
        </View>

        <View style={styles.prefRow}>
          <Text style={styles.prefLabel}>Daily Coffee Limit</Text>
          <Text style={styles.prefValue}>3 cups</Text>
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>

        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingLabel}>Theme</Text>
          <Text style={styles.settingValue}>Default</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Text style={styles.settingValue}>Coming Soon</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF8F0",
    padding: 20,
    alignItems: "center",
    flexGrow: 1
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6F4E37",
    marginTop: 40,
    marginBottom: 15,
  },

  avatarCircle: {
    width: 85,
    height: 85,
    borderRadius: 45,
    backgroundColor: "#E5D3C5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  avatarInitial: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#6F4E37",
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6F4E37",
    marginTop: 5,
  },

  email: {
    fontSize: 15,
    color: "#8B6B4A",
    marginBottom: 20,
  },

  editButton: {
    backgroundColor: "#6F4E37",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 25,
  },

  editText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  section: {
    backgroundColor: "#FFEEDB",
    width: "100%",
    padding: 18,
    borderRadius: 15,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#6F4E37",
    marginBottom: 10,
  },

  prefRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },

  prefLabel: {
    fontSize: 15,
    color: "#6F4E37",
  },

  prefValue: {
    fontSize: 15,
    color: "#8B6B4A",
  },

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },

  settingLabel: {
    fontSize: 15,
    color: "#6F4E37",
  },

  settingValue: {
    fontSize: 15,
    color: "#8B6B4A",
  },
});
