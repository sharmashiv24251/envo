import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const Nav = () => {
  return (
    <View style={styles.container}>
      {/* Left Side: Avatar and Greeting */}
      <View style={styles.leftContainer}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?u=shivansh" }} // A random avatar service
          style={styles.avatar}
        />
        <View>
          <Text style={styles.greetingText}>Hi,</Text>
          <Text style={styles.nameText}>Shivansh</Text>
        </View>
      </View>

      {/* Right Side: Icons */}
      <View style={styles.rightContainer}>
        <Ionicons
          name="settings-outline"
          size={26}
          color="#333"
          style={styles.icon}
        />
        <Ionicons name="notifications-outline" size={26} color="#333" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16, // Adds space on the sides
    paddingVertical: 10,
    width: "100%",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // Half of width/height to make it a perfect circle
    marginRight: 12,
    backgroundColor: "#e0e0e0", // A fallback background color
  },
  greetingText: {
    fontSize: 16,
    color: "#666",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 16, // Space between the two icons
  },
});

export default Nav;
