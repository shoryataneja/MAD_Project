import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);

  // Load profile info on mount
  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    const storedEmail = await AsyncStorage.getItem("userEmail");
    const storedName = await AsyncStorage.getItem("userName");
    if (storedEmail) setEmail(storedEmail);
    if (storedName) setName(storedName);
  };

  const saveName = async () => {
    await AsyncStorage.setItem("userName", name);
    setEditing(false);
  };

  // Logout → remove login details
  const logout = async () => {
    await AsyncStorage.multiRemove(["userEmail", "userPassword"]);
    navigation.replace("Auth"); // go back to login screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👤 Profile</Text>

      {/* Card Container */}
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email}</Text>

        <Text style={styles.label}>Name</Text>

        {editing ? (
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(t) => setName(t)}
            placeholder="Enter your name"
          />
        ) : (
          <Text style={styles.value}>{name || "Not set"}</Text>
        )}

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => (editing ? saveName() : setEditing(true))}
        >
          <Text style={styles.editButtonText}>
            {editing ? "Save" : "Edit Name"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

// ------------------ STYLES ------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6F4E37",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFEEDB",
    padding: 20,
    borderRadius: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  label: {
    fontSize: 14,
    color: "#8B6B4A",
    marginTop: 10,
  },

  value: {
    fontSize: 16,
    color: "#6F4E37",
    marginBottom: 5,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    borderColor: "#D7C1A0",
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 10,
  },

  editButton: {
    backgroundColor: "#6F4E37",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  editButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },

  logoutButton: {
    backgroundColor: "#D9534F",
    padding: 14,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
    width: "100%",
  },

  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
