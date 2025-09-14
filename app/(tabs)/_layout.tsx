import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Dimensions, StyleSheet, View } from "react-native";
import { HapticTab } from "../../components/HapticTab";

const screenWidth = Dimensions.get("window").width;

function CameraTabIcon() {
  return (
    <View style={styles.cameraIconContainer}>
      <Ionicons name="camera" size={28} color="#ffffff" />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#22c55e",
        tabBarInactiveTintColor: "#6b7280",
        tabBarShowLabel: false,
        tabBarBackground: () => <View style={styles.tabBarBackground} />,
        tabBarButton: (props) => <HapticTab {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: "Camera",
          tabBarIcon: () => <CameraTabIcon />,
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: "Rewards",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "gift" : "gift-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 30,
    height: 70,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    paddingTop: screenWidth > 600 ? 21 : 14,
    width: 340,
    marginLeft: (screenWidth - 340) / 2,
  },
  tabBarBackground: {
    height: 70,
    borderRadius: 29,
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
    elevation: 20,
    borderWidth: 2,
    borderColor: "rgba(34, 197, 94, 0.15)",
  },
  cameraIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
});
