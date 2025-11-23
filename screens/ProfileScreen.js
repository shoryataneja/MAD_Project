import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
    <View style={styles.container}>
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

      {/* Edit Profile Placeholder */}
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    alignItems: "center",
    paddingTop: 60,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6F4E37",
    marginBottom: 20,
  },

  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E5D3C5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  avatarInitial: {
    fontSize: 36,
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
    marginTop: 10,
  },

  editText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
