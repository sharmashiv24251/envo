import {
  useDashboard,
  useFeedPreview,
  useProfile,
  useRewards,
  useUploadPost,
} from "@/hooks/api";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PHOTO_URL = process.env.EXPO_PUBLIC_PHOTO_BASE_URL;
const { width } = Dimensions.get("window");

export default function HomeScreen() {
  // Hook states
  const {
    data: dashboardData,
    isLoading: loadingDashboard,
    refetch: refetchDashboard,
  } = useDashboard();
  const {
    data: feedPosts,
    isLoading: loadingFeed,
    refetch: refetchFeed,
  } = useFeedPreview();
  const {
    data: rewards,
    isLoading: loadingRewards,
    refetch: refetchRewards,
  } = useRewards();
  const {
    data: profile,
    isLoading: loadingProfile,
    refetch: refetchProfile,
  } = useProfile();
  const {
    mutate: uploadPost,
    isLoading: uploadingPost,
    isError: uploadError,
    isSuccess: uploadSuccess,
    reset: resetUpload,
  } = useUploadPost();

  // Form states
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [badgeText, setBadgeText] = useState("Recycling ♻️");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Badge options
  const badgeOptions = [
    "Recycling ♻️",
    "Public transport 🚌",
    "Planting tree 🌳",
    "Solar energy ☀️",
    "Water conservation 💧",
    "Composting 🌱",
    "Bike riding 🚴‍♂️",
    "Energy saving 💡",
  ];

  // Request camera permissions and open camera
  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera access is required to take photos"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open camera");
      console.error("Camera error:", error);
    }
  };

  // Handle post upload
  const handleUpload = async () => {
    if (!photoUri) {
      Alert.alert("Error", "Please take a photo first");
      return;
    }
    if (!title.trim() || !desc.trim()) {
      Alert.alert("Error", "Title and description are required");
      return;
    }

    try {
      await uploadPost({
        uploaderPersonId: profile?.id || "user1",
        photo: photoUri,
        title: title.trim(),
        desc: desc.trim(),
        badgeText,
      });

      // Reset form on success
      setTitle("");
      setDesc("");
      setPhotoUri(null);
      setBadgeText("Recycling ♻️");
      setShowUploadForm(false);

      // Refresh data
      refetchFeed();
      refetchDashboard();
      refetchProfile();
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchDashboard(),
      refetchFeed(),
      refetchRewards(),
      refetchProfile(),
    ]);
    setRefreshing(false);
  };

  // Reset upload success state
  React.useEffect(() => {
    if (uploadSuccess) {
      setTimeout(() => resetUpload(), 3000);
    }
  }, [uploadSuccess, resetUpload]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌱 Environmental Tracker</Text>
      </View>

      {/* Dashboard Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Global Impact</Text>
        {loadingDashboard ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : dashboardData ? (
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: "#E3F2FD" }]}>
              <Text style={styles.statNumber}>{dashboardData.co2}</Text>
              <Text style={styles.statLabel}>CO2 Saved (kg)</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#F3E5F5" }]}>
              <Text style={styles.statNumber}>{dashboardData.plastic}</Text>
              <Text style={styles.statLabel}>Plastic Recycled (kg)</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#E8F5E8" }]}>
              <Text style={styles.statNumber}>{dashboardData.trees}</Text>
              <Text style={styles.statLabel}>Trees Planted</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.errorText}>Failed to load dashboard stats</Text>
        )}
      </View>

      {/* User Profile */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Your Profile</Text>
        {loadingProfile ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : profile ? (
          <View style={styles.profileCard}>
            <Image
              source={{ uri: PHOTO_URL + profile.profilePhoto }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileEmail}>{profile.email}</Text>
              <View style={styles.profileStats}>
                <Text style={styles.profileStat}>🌍 CO2: {profile.co2}kg</Text>
                <Text style={styles.profileStat}>
                  ♻️ Plastic: {profile.plastic}kg
                </Text>
                <Text style={styles.profileStat}>
                  🌳 Trees: {profile.trees}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.errorText}>Failed to load profile</Text>
        )}
      </View>

      {/* Recent Posts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Recent Posts</Text>
        {loadingFeed ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : feedPosts && feedPosts.length > 0 ? (
          feedPosts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <Image
                  source={{ uri: post.uploaderPersonProfilePhoto }}
                  style={styles.postAvatar}
                />
                <View style={styles.postUserInfo}>
                  <Text style={styles.postUserName}>
                    {post.uploaderPersonName}
                  </Text>
                  <Text style={styles.postDate}>
                    {new Date(post.uploadDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.coinsEarned}>
                  <Text style={styles.coinsText}>{post.coinsEarned} 🪙</Text>
                </View>
              </View>
              <Image
                source={{ uri: PHOTO_URL + post.photo }}
                style={styles.postImage}
              />
              <View style={styles.postContent}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postDesc}>{post.desc}</Text>
                <View style={styles.badgeContainer}>
                  <Text style={styles.badge}>{post.badgeText}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No posts available</Text>
        )}
      </View>

      {/* Rewards Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎁 Rewards</Text>
        {loadingRewards ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : rewards ? (
          <View>
            <View style={styles.coinsHeader}>
              <Text style={styles.coinsHeaderText}>
                💰 Available: {rewards.availableCoins} coins
              </Text>
              <Text style={styles.coinsHeaderText}>
                🏆 Lifetime: {rewards.lifetimeEarnedCoins} coins
              </Text>
            </View>

            <Text style={styles.subSectionTitle}>Available Rewards</Text>
            {rewards.available.map((reward, index) => (
              <View key={index} style={styles.rewardCard}>
                <Image
                  source={{
                    uri: PHOTO_URL + reward.image,
                  }}
                  style={styles.rewardImage}
                />
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardTitle}>{reward.title}</Text>
                  <Text style={styles.rewardDesc}>{reward.desc}</Text>
                  <View style={styles.rewardFooter}>
                    <Text style={styles.rewardCost}>
                      {reward.coinsNeeded} 🪙
                    </Text>
                    {reward.expires && (
                      <Text style={styles.rewardExpires}>
                        Expires: {new Date(reward.expires).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.errorText}>Failed to load rewards</Text>
        )}
      </View>

      {/* Upload Post Section */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => setShowUploadForm(!showUploadForm)}
        >
          <Text style={styles.uploadButtonText}>
            {showUploadForm ? "❌ Cancel Post" : "📸 Create New Post"}
          </Text>
        </TouchableOpacity>

        {showUploadForm && (
          <View style={styles.uploadForm}>
            <Text style={styles.formTitle}>
              Share Your Environmental Action
            </Text>

            <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
              <Text style={styles.cameraButtonText}>📸 Open Camera</Text>
            </TouchableOpacity>

            {photoUri && (
              <Image source={{ uri: photoUri }} style={styles.previewImage} />
            )}

            <TextInput
              style={styles.input}
              placeholder="Post title"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your environmental action..."
              value={desc}
              onChangeText={setDesc}
              multiline
              numberOfLines={4}
              maxLength={500}
            />

            <View style={styles.badgeSelector}>
              <Text style={styles.badgeSelectorTitle}>
                Select Activity Type:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {badgeOptions.map((badge) => (
                  <TouchableOpacity
                    key={badge}
                    style={[
                      styles.badgeOption,
                      badgeText === badge && styles.selectedBadge,
                    ]}
                    onPress={() => setBadgeText(badge)}
                  >
                    <Text
                      style={[
                        styles.badgeOptionText,
                        badgeText === badge && styles.selectedBadgeText,
                      ]}
                    >
                      {badge}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                uploadingPost && styles.disabledButton,
              ]}
              onPress={handleUpload}
              disabled={uploadingPost}
            >
              <Text style={styles.submitButtonText}>
                {uploadingPost ? "⏳ Uploading..." : "🚀 Share Post"}
              </Text>
            </TouchableOpacity>

            {uploadError && (
              <Text style={styles.errorText}>
                ❌ Upload failed. Please try again.
              </Text>
            )}

            {uploadSuccess && (
              <Text style={styles.successText}>
                ✅ Post uploaded successfully!
              </Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingBottom: 100,
  },
  header: {
    backgroundColor: "#4CAF50",
    padding: 20,
    paddingTop: 50,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  section: {
    margin: 16,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 12,
    color: "#555",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    padding: 16,
    margin: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  profileStats: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  profileStat: {
    fontSize: 12,
    color: "#4CAF50",
    marginRight: 12,
    marginTop: 4,
  },
  postCard: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    overflow: "hidden",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  postDate: {
    fontSize: 12,
    color: "#666",
  },
  coinsEarned: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  coinsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#F57C00",
  },
  postImage: {
    width: "100%",
    height: 200,
  },
  postContent: {
    padding: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  postDesc: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  badgeContainer: {
    marginTop: 8,
  },
  badge: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  coinsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
  },
  coinsHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F57C00",
  },
  rewardCard: {
    flexDirection: "row",
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
  },
  rewardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  rewardDesc: {
    fontSize: 12,
    color: "#666",
    marginVertical: 4,
  },
  rewardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rewardCost: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4CAF50",
  },
  rewardExpires: {
    fontSize: 10,
    color: "#999",
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  uploadForm: {
    marginTop: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  cameraButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  cameraButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  badgeSelector: {
    marginBottom: 16,
  },
  badgeSelectorTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  badgeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "white",
  },
  selectedBadge: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  badgeOptionText: {
    fontSize: 12,
    color: "#666",
  },
  selectedBadgeText: {
    color: "white",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#F44336",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  successText: {
    color: "#4CAF50",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
});
