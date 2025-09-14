import Button from "@/components/button";
import Post from "@/components/post";
import { useProfile, useUploadPost } from "@/hooks/api";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePostContext } from "./_layout";

const { width } = Dimensions.get("window");

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

  const handlePost = async () => {
    try {
      await uploadPost({
        uploaderPersonId: profile?.id || "user1",
        photo: photo,
        title: title.trim(),
        desc: desc.trim(),
        badgeText,
      });

      // Reset form on success
      Alert.alert("Success!", "Your post has been uploaded successfully!", [
        {
          text: "OK",
          onPress: () => {
            setPhoto(null);
            setTitle("");
            setDesc("");
            router.dismissAll();
            router.replace("/");
          },
        },
      ]);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
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

      <Button
        title="Post"
        loading={uploadingPost}
        onPress={handlePost}
        variant="primary"
        disabled={!title || !desc}
        style={{
          marginBottom: 100,
        }}
      />

      {uploadError && (
        <Text style={styles.errorText}>
          ❌ Upload failed. Please try again.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
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
