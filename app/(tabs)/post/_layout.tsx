import { Stack, useRouter } from "expo-router";
import React, { createContext, useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Context to share state between screens
interface PostContextType {
  photo: string | null;
  setPhoto: (photo: string | null) => void;
  title: string;
  setTitle: (title: string) => void;
  desc: string;
  setDesc: (desc: string) => void;
  badgeText: string;
  setBadgeText: (badge: string) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within PostProvider");
  }
  return context;
};

// Custom back button component
const CustomBackButton = ({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.backButton}>
    <Text style={styles.backButtonText}>{text}</Text>
  </TouchableOpacity>
);

export default function PostLayout() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [badgeText, setBadgeText] = useState("Recycling ♻️");
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <PostContext.Provider
        value={{
          photo,
          setPhoto,
          title,
          setTitle,
          desc,
          setDesc,
          badgeText,
          setBadgeText,
        }}
      >
        <Stack
          screenOptions={{
            headerShown: false, // Remove all headers
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen
            name="form"
            options={{
              headerShown: true,
              title: "ADD DETAILS",
              headerStyle: {
                backgroundColor: "#ffffff",
              },
              headerTitleStyle: {
                color: "#000000",
                fontSize: 18,
                fontWeight: "600",
              },
              headerTitleAlign: "center",
              headerLeft: () => (
                <CustomBackButton
                  text="← retake"
                  onPress={() => router.back()}
                />
              ),
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="preview"
            options={{
              headerShown: true,
              title: "SHARE",
              headerStyle: {
                backgroundColor: "#ffffff",
              },
              headerTitleStyle: {
                color: "#000000",
                fontSize: 18,
                fontWeight: "600",
              },
              headerTitleAlign: "center",
              headerLeft: () => (
                <CustomBackButton text="← Edit" onPress={() => router.back()} />
              ),
              headerShadowVisible: false,
            }}
          />
        </Stack>
      </PostContext.Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "500",
  },
});
