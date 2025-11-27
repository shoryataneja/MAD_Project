import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthScreen = ({ navigation }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  

  const handleAuth = async() => {
    setMessage("");

    if (isSignup) {
      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("userPassword", password);
      setMessage("Signup successful! You can now login.");
      setIsSignup(false);
    } else {
      const storedEmail = await AsyncStorage.getItem("userEmail");
      const storedPassword = await AsyncStorage.getItem("userPassword");

      if (email === storedEmail && password === storedPassword) {
        navigation.replace("Main");
      } else {
        setMessage("Invalid credentials ❌");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: "https://img.icons8.com/emoji/96/coffee.png" }} style={styles.logo} />
      <Text style={styles.title}>Campus Chai Tracker</Text>

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {message !== "" && <Text style={[styles.message, isSignup ? styles.success : styles.error]}>{message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>{isSignup ? "Sign Up" : "Login"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
        <Text style={styles.switchText}>
          {isSignup ? "Already have an account? Login" : "Don’t have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF8F0", padding: 20 },
  logo: { width: 80, height: 80, marginBottom: 15 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#6F4E37" },
  input: { width: "100%", borderWidth: 1, borderColor: "#6F4E37", borderRadius: 10, padding: 12, marginVertical: 8, backgroundColor: "#fff" },
  button: { backgroundColor: "#6F4E37", padding: 15, borderRadius: 10, width: "100%", alignItems: "center", marginTop: 15 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  switchText: { marginTop: 15, color: "#6F4E37" },
  message: { marginTop: 10, fontSize: 14, textAlign: "center" },
  success: { color: "green" },
  error: { color: "#FF6347" },
});
