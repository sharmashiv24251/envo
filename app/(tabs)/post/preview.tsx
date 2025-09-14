import Button from "@/components/button";
import Post from "@/components/post";
import { useProfile, useUploadPost } from "@/hooks/api";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { usePostContext } from "./_layout";

const { width, height } = Dimensions.get("window");

export default function PostPreviewScreen() {
  const { photo, title, desc, badgeText, setPhoto, setTitle, setDesc } =
    usePostContext();

  const { data: profile } = useProfile();
  const {
    mutate: uploadPost,
    isLoading: uploadingPost,
    isError: uploadError,
    isSuccess: uploadSuccess,
  } = useUploadPost();

  // Confetti refs and state
  const confettiRef = useRef<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiOpacity = useRef(new Animated.Value(0)).current;
  const postScale = useRef(new Animated.Value(1)).current;

  if (!photo || !title || !desc) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>
          ❌ Incomplete post data. Please go back and fill all fields.
        </Text>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => router.back()}
        >
          <Text style={styles.goBackButtonText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const triggerConfetti = () => {
    setShowConfetti(true);

    // Animate confetti opacity in
    Animated.timing(confettiOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Add a subtle scale animation to the post
    Animated.sequence([
      Animated.timing(postScale, {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(postScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Hide confetti after animation
    setTimeout(() => {
      Animated.timing(confettiOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      }).start(() => {
        setShowConfetti(false);
      });
    }, 3000);
  };

  const handlePost = async () => {
    try {
      await uploadPost({
        uploaderPersonId: profile?.id || "user1",
        photo: photo,
        title: title.trim(),
        desc: desc.trim(),
        badgeText,
      });

      // Trigger confetti celebration
      triggerConfetti();

      // Show success alert with confetti
      setTimeout(() => {
        Alert.alert(
          "🎉 Success!",
          "Your post has been uploaded successfully! Keep sharing amazing content!",
          [
            {
              text: "Awesome!",
              onPress: () => {
                setPhoto(null);
                setTitle("");
                setDesc("");
                router.dismissAll();
                router.replace("/");
              },
            },
          ]
        );
      }, 1500);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
        <Animated.View
          style={[
            styles.postWrapper,
            {
              transform: [{ scale: postScale }],
            },
          ]}
        >
          <Post
            id="preview"
            uploaderPersonId={profile?.id || "user1"}
            uploaderPersonName={profile?.name || "User"}
            uploaderPersonProfilePhoto={profile?.profilePhoto}
            photo={photo}
            title={title}
            desc={desc}
            badgeText={badgeText}
            coinsEarned={10}
            uploadDate={new Date().toISOString()}
          />
        </Animated.View>

        <Button
          title="Post"
          loading={uploadingPost}
          onPress={handlePost}
          variant="primary"
          disabled={!title || !desc}
          style={styles.postButton}
        />

        {uploadError && (
          <Text style={styles.errorText}>
            ❌ Upload failed. Please try again.
          </Text>
        )}
      </ScrollView>

      {/* Confetti Animations */}
      {showConfetti && (
        <Animated.View
          style={[styles.confettiContainer, { opacity: confettiOpacity }]}
          pointerEvents="none"
        >
          {/* Multiple confetti cannons for full coverage */}
          <ConfettiCannon
            count={150}
            origin={{ x: width * 0.1, y: height * 0.3 }}
            explosionSpeed={350}
            fallSpeed={2500}
            fadeOut={true}
            colors={[
              "#FFD700",
              "#FF6B6B",
              "#4ECDC4",
              "#45B7D1",
              "#96CEB4",
              "#FECA57",
              "#FF9FF3",
              "#54A0FF",
            ]}
          />

          <ConfettiCannon
            count={120}
            origin={{ x: width * 0.9, y: height * 0.25 }}
            explosionSpeed={300}
            fallSpeed={2800}
            fadeOut={true}
            colors={[
              "#FFD93D",
              "#6BCF7F",
              "#4D96FF",
              "#9775FA",
              "#F06292",
              "#FFA726",
              "#26C6DA",
              "#66BB6A",
            ]}
          />

          <ConfettiCannon
            count={100}
            origin={{ x: width * 0.5, y: height * 0.15 }}
            explosionSpeed={400}
            fallSpeed={2200}
            fadeOut={true}
            colors={[
              "#FF5722",
              "#E91E63",
              "#9C27B0",
              "#673AB7",
              "#3F51B5",
              "#2196F3",
              "#00BCD4",
              "#009688",
            ]}
          />

          {/* Side confetti for extra sparkle */}
          <ConfettiCannon
            count={80}
            origin={{ x: width * 0.2, y: height * 0.4 }}
            explosionSpeed={250}
            fallSpeed={3000}
            fadeOut={true}
            colors={[
              "#FFEB3B",
              "#CDDC39",
              "#8BC34A",
              "#4CAF50",
              "#00E676",
              "#1DE9B6",
              "#18FFFF",
              "#40C4FF",
            ]}
          />

          <ConfettiCannon
            count={80}
            origin={{ x: width * 0.8, y: height * 0.45 }}
            explosionSpeed={280}
            fallSpeed={2600}
            fadeOut={true}
            colors={[
              "#FF4081",
              "#E040FB",
              "#7C4DFF",
              "#536DFE",
              "#448AFF",
              "#40C4FF",
              "#18FFFF",
              "#64FFDA",
            ]}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  postWrapper: {
    marginVertical: 10,
  },
  postButton: {
    marginBottom: 100,
    marginTop: 20,
  },
  confettiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  errorText: {
    color: "#ef4444",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 50,
    marginBottom: 30,
  },
  goBackButton: {
    backgroundColor: "#6b7280",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    alignSelf: "center",
  },
  goBackButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
