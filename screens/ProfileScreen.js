import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [teaLimit, setTeaLimit] = useState(5);
  const [coffeeLimit, setCoffeeLimit] = useState(3);
  const [editingField, setEditingField] = useState(null);
  const [newLimit, setNewLimit] = useState("");

  useEffect(() => {
    loadUserData();
    loadPreferences();
  }, []);

  const loadUserData = async () => {
    const savedEmail = await AsyncStorage.getItem("userEmail");
    const savedName = await AsyncStorage.getItem("userName");

    setEmail(savedEmail || "Not Provided");
    setName(savedName || "User");
  };

  const loadPreferences = async () => {
    const savedTeaLimit = await AsyncStorage.getItem("dailyTeaLimit");
    const savedCoffeeLimit = await AsyncStorage.getItem("dailyCoffeeLimit");

    if (savedTeaLimit) setTeaLimit(parseInt(savedTeaLimit));
    if (savedCoffeeLimit) setCoffeeLimit(parseInt(savedCoffeeLimit));
  };

  const increaseLimit = async () => {
    if (editingField === "tea") {
      const newLimit = teaLimit + 1;
      setTeaLimit(newLimit);
      await AsyncStorage.setItem("dailyTeaLimit", String(newLimit));
    } else {
      const newLimit = coffeeLimit + 1;
      setCoffeeLimit(newLimit);
      await AsyncStorage.setItem("dailyCoffeeLimit", String(newLimit));
    }
    setEditingField(null);
  };

  const resetAllData = async () => {
  Alert.alert(
    "Reset Everything?",
    "This will clear all history, counts, and limits. You cannot undo this.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.multiRemove([
            "historyLogs",
            "chaiDate",
            "dailyTeaLimit",
            "dailyCoffeeLimit",
            "teaCount",
            "coffeeCount"
          ]);

          setTeaLimit(5);
          setCoffeeLimit(3);

          Alert.alert("Reset Successful", "All app data cleared.");
        }
      }
    ]
  );
};


const logoutUser = async () => {
  await AsyncStorage.removeItem("isLoggedIn");

  // navigate back to Auth screen
  navigation.replace("Auth");
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.avatarCircle}>
        <Text style={styles.avatarInitial}>
          {name ? name.charAt(0).toUpperCase() : "U"}
        </Text>
      </View>

      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.prefRow}>
          <Text style={styles.prefLabel}>Daily Tea Limit</Text>
          <TouchableOpacity onPress={() => setEditingField("tea")} style={styles.changeBtn}>
            <Text style={styles.changeBtnText}>Change</Text>
          </TouchableOpacity>
          <Text style={styles.prefValue}>{teaLimit} cups</Text>
        </View>

        <View style={styles.prefRow}>
          <Text style={styles.prefLabel}>Daily Coffee Limit</Text>
          <TouchableOpacity onPress={() => setEditingField("coffee")} style={styles.changeBtn}>
            <Text style={styles.changeBtnText}>Change</Text>
          </TouchableOpacity>
          <Text style={styles.prefValue}>{coffeeLimit} cups</Text>
        </View>
      </View>

{editingField && (
  <View style={styles.modalBox}>
    <Text style={styles.modalTitle}>
      Change {editingField === "tea" ? "Tea" : "Coffee"} Limit
    </Text>

    {/* Numeric Input */}
    <View style={styles.inputBox}>
      <Text style={styles.inputLabel}>Enter new limit:</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="e.g. 5"
        onChangeText={(val) => setNewLimit(val)}
      />
    </View>

    {/* Save Button */}
    <TouchableOpacity
      style={styles.modalBtn}
      onPress={async () => {
        const num = Number(newLimit);

        if (isNaN(num) || num < 0) {
          alert("Please enter a valid number");
          return;
        }

        if (editingField === "tea") {
          setTeaLimit(num);
          await AsyncStorage.setItem("dailyTeaLimit", String(num));
        } else {
          setCoffeeLimit(num);
          await AsyncStorage.setItem("dailyCoffeeLimit", String(num));
        }

        setEditingField(null);
      }}
    >
      <Text style={styles.modalBtnText}>Save</Text>
    </TouchableOpacity>

    {/* Cancel */}
    <TouchableOpacity
      style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
      onPress={() => setEditingField(null)}
    >
      <Text style={styles.modalBtnText}>Cancel</Text>
    </TouchableOpacity>
  </View>
)}

{/* RESET ALL DATA */}
<TouchableOpacity
  style={styles.resetAllButton}
  onPress={() => resetAllData()}
>
  <Text style={styles.resetAllText}>Reset All Data</Text>
</TouchableOpacity>

{/* LOGOUT BUTTON */}
<TouchableOpacity
  style={styles.logoutButton}
  onPress={() => logoutUser()}
>
  <Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#FFF8F0", padding: 20, alignItems: "center", flexGrow: 1 },
  title: { fontSize: 22, fontWeight: "bold", color: "#6F4E37", marginTop: 40, marginBottom: 15 },

  avatarCircle: {
    width: 85,
    height: 85,
    borderRadius: 45,
    backgroundColor: "#E5D3C5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarInitial: { fontSize: 34, fontWeight: "bold", color: "#6F4E37" },
  name: { fontSize: 20, fontWeight: "600", color: "#6F4E37", marginTop: 5 },
  email: { fontSize: 15, color: "#8B6B4A", marginBottom: 20 },

  section: {
    backgroundColor: "#FFEEDB",
    width: "100%",
    padding: 18,
    borderRadius: 15,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 17, fontWeight: "600", color: "#6F4E37", marginBottom: 10 },

  prefRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    alignItems: "center",
  },
  prefLabel: { fontSize: 15, color: "#6F4E37" },
  prefValue: { fontSize: 15, color: "#8B6B4A" },

  changeBtn: {
    padding: 6,
    backgroundColor: "#D3C0A6",
    borderRadius: 8,
  },
  changeBtnText: { color: "#6F4E37", fontWeight: "600" },

  modalBox: {
    backgroundColor: "#FFEEDB",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    marginTop: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6F4E37",
    marginBottom: 15,
    textAlign: "center",
  },
  modalBtn: {
    backgroundColor: "#6F4E37",
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 6,
  },
  modalBtnText: { color: "white", fontSize: 16, fontWeight: "600", textAlign: "center" },
  inputBox: {
  width: "100%",
  marginVertical: 10,
},

inputLabel: {
  fontSize: 15,
  color: "#6F4E37",
  marginBottom: 5,
},

input: {
  backgroundColor: "white",
  borderRadius: 10,
  padding: 10,
  fontSize: 16,
  borderWidth: 1,
  borderColor: "#d1c0a3",
},
resetAllButton: {
  width: "90%",
  backgroundColor: "#D9534F",
  padding: 12,
  borderRadius: 10,
  marginTop: 10,
  alignItems: "center"
},
resetAllText: {
  color: "white",
  fontSize: 16,
  fontWeight: "600"
},
logoutButton: {
  width: "90%",
  backgroundColor: "#6F4E37",
  padding: 12,
  borderRadius: 10,
  marginTop: 15,
  marginBottom: 30,
  alignItems: "center"
},
logoutText: {
  color: "white",
  fontSize: 16,
  fontWeight: "600"
}


});
