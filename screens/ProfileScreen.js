import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "react-native-paper";
import { Alert } from "react-native";



export default function ProfileScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [teaLimit, setTeaLimit] = useState(5);
  const [coffeeLimit, setCoffeeLimit] = useState(3);

  const [editingField, setEditingField] = useState(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const savedEmail = await AsyncStorage.getItem("userEmail");
    const savedName = await AsyncStorage.getItem("userName");
    const savedTeaLimit = await AsyncStorage.getItem("dailyTeaLimit");
    const savedCoffeeLimit = await AsyncStorage.getItem("dailyCoffeeLimit");

    setEmail(savedEmail || "Not Provided");
    setName(savedName || "User");
    setTeaLimit(savedTeaLimit ? Number(savedTeaLimit) : 5);
    setCoffeeLimit(savedCoffeeLimit ? Number(savedCoffeeLimit) : 3);
  };

  const saveField = async () => {
    if (editingField === "name") {
      setName(inputValue);
      await AsyncStorage.setItem("userName", inputValue);
    } else if (editingField === "email") {
      setEmail(inputValue);
      await AsyncStorage.setItem("userEmail", inputValue);
    } else if (editingField === "tea") {
      setTeaLimit(Number(inputValue));
      await AsyncStorage.setItem("dailyTeaLimit", inputValue);
    } else if (editingField === "coffee") {
      setCoffeeLimit(Number(inputValue));
      await AsyncStorage.setItem("dailyCoffeeLimit", inputValue);
    }

    setEditingField(null);
    setInputValue("");
  };

  const resetAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      "userName",
      "userEmail",
      "dailyTeaLimit",
      "dailyCoffeeLimit",
      "chaiDate",
      "historyLogs",
    ]);

    alert("All data reset! You will be logged out.");

    navigation.replace("Auth"); // go back to login
  } catch (error) {
    console.log("Reset error:", error);
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HOME NAV BUTTON */}
    <TouchableOpacity
  style={styles.homeBtn}
  onPress={() => navigation.navigate("Main", { screen: "Home" })}
>
  <Icon source="home-outline" size={28} color="#6F4E37" />
</TouchableOpacity>


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

      {/* --- PERSONAL INFO SECTION --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Info</Text>

        {/* Edit Name */}
        <View style={styles.prefRow}>
          <Text style={styles.prefLabel}>Name</Text>
          <TouchableOpacity
            style={styles.changeBtn}
            onPress={() => {
              setEditingField("name");
              setInputValue(name);
            }}
          >
            <Text style={styles.changeBtnText}>Edit</Text>
          </TouchableOpacity>
          <Text style={styles.prefValue}>{name}</Text>
        </View>

        {/* Edit Email */}
        <View style={styles.prefRow}>
          <Text style={styles.prefLabel}>Email</Text>
          <TouchableOpacity
            style={styles.changeBtn}
            onPress={() => {
              setEditingField("email");
              setInputValue(email);
            }}
          >
            <Text style={styles.changeBtnText}>Edit</Text>
          </TouchableOpacity>
          <Text style={styles.prefValue}>{email}</Text>
        </View>
      </View>

      {/* --- PREFERENCES --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.prefRow}>
          <Text style={styles.prefLabel}>Daily Tea Limit</Text>
          <TouchableOpacity
            style={styles.changeBtn}
            onPress={() => {
              setEditingField("tea");
              setInputValue(String(teaLimit));
            }}
          >
            <Text style={styles.changeBtnText}>Change</Text>
          </TouchableOpacity>
          <Text style={styles.prefValue}>{teaLimit} cups</Text>
        </View>

        <View style={styles.prefRow}>
          <Text style={styles.prefLabel}>Daily Coffee Limit</Text>
          <TouchableOpacity
            style={styles.changeBtn}
            onPress={() => {
              setEditingField("coffee");
              setInputValue(String(coffeeLimit));
            }}
          >
            <Text style={styles.changeBtnText}>Change</Text>
          </TouchableOpacity>
          <Text style={styles.prefValue}>{coffeeLimit} cups</Text>
        </View>
      </View>

      {/* --- RESET + LOGOUT --- */}

      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetBtn} onPress={resetAllData}>
  <Text style={styles.resetText}>Delete Account</Text>
</TouchableOpacity>

      {/* --- EDITING MODAL --- */}
      {editingField && (
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>
            Edit {editingField === "name"
              ? "Name"
              : editingField === "email"
              ? "Email"
              : editingField === "tea"
              ? "Tea Limit"
              : "Coffee Limit"}
          </Text>

          <TextInput
            style={styles.modalInput}
            value={inputValue}
            onChangeText={setInputValue}
            keyboardType={editingField === "name" || editingField === "email" ? "default" : "numeric"}
            placeholder="Enter new value"
          />

          <TouchableOpacity style={styles.modalBtn} onPress={saveField}>
            <Text style={styles.modalBtnText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setEditingField(null)}
            style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
          >
            <Text style={styles.modalBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
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

  homeBtn: {
    position: "absolute",
    top: 50,
    right: 25,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6F4E37",
    marginTop: 40,
    marginBottom: 15,
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
  avatarInitial: { fontSize: 36, fontWeight: "bold", color: "#6F4E37" },

  name: { fontSize: 20, fontWeight: "600", color: "#6F4E37", marginTop: 5 },
  email: { fontSize: 15, color: "#8B6B4A", marginBottom: 20 },

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
    marginVertical: 8,
    alignItems: "center",
  },

  prefLabel: { fontSize: 15, color: "#6F4E37" },
  prefValue: { fontSize: 15, color: "#8B6B4A", width: 70, textAlign: "right" },

  changeBtn: {
    backgroundColor: "#D8C9B6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  changeBtnText: { color: "#6F4E37", fontWeight: "600" },

  resetBtn: {
    backgroundColor: "#D6534A",
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  resetText: { color: "white", fontSize: 17, fontWeight: "600" },

  logoutBtn: {
    backgroundColor: "#6F4E37",
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  logoutText: { color: "white", fontSize: 17, fontWeight: "600" },

  modalBox: {
    backgroundColor: "#FFEEDB",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    marginTop: 20,
    alignItems: "center",
  },

  modalTitle: { fontSize: 18, fontWeight: "600", color: "#6F4E37", marginBottom: 15 },

  modalInput: {
    width: "90%",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    fontSize: 16,
  },

  modalBtn: {
    backgroundColor: "#6F4E37",
    paddingVertical: 10,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginVertical: 5,
  },

  modalBtnText: { color: "white", fontSize: 16, fontWeight: "600" },
});
