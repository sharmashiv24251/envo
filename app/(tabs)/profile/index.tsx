import Dashboard from "@/components/dashboard";
import Post from "@/components/post";
import { useProfile } from "@/hooks/api";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { profileId } = useLocalSearchParams<{ profileId?: string }>();
  const userId = profileId || "user1";

  const {
    data: profile,
    isLoading: loadingProfile,
    isError,
    error,
    refetch: refetchProfile,
  } = useProfile(userId);

  // Function to get user's initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderProfileHeader = useCallback(() => {
    if (!profile) return null;

    return (
      <View style={styles.profileHeader}>
        {/* Profile Photo/Avatar */}
        <View style={styles.avatarSection}>
          {profile.profilePhoto ? (
            <Image
              source={{
                uri: `${process.env.EXPO_PUBLIC_PHOTO_BASE_URL}${profile.profilePhoto}`,
              }}
              style={styles.profilePhoto}
            />
          ) : (
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={styles.avatarContainer}
            >
              <Text style={styles.avatarText}>{getInitials(profile.name)}</Text>
            </LinearGradient>
          )}
        </View>

        {/* User Info */}
        <View style={styles.userInfoSection}>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
        </View>

        {/* Action Button */}
        {/* <Button
          title="Settings"
          onPress={() => router.push("/profile/settings")}
          style={{ marginHorizontal: 20 }}
        /> */}

        <Dashboard />
        <Text style={styles.aiNote}>
          *This will be shown only one other users profile
        </Text>
      </View>
    );
  }, [profile]);

  const renderTimelineHeader = useCallback(
    () => (
      <View style={styles.timelineHeader}>
        <Text style={styles.timelineTitle}>Timeline</Text>
        <Text style={styles.timelineSubtitle}>
          {profile?.timeline?.length || 0} posts
        </Text>
      </View>
    ),
    [profile?.timeline?.length]
  );

  const renderPost = useCallback(
    ({ item }: { item: any }) => (
      <Post
        id={item.id}
        uploaderPersonId={item.uploaderPersonId}
        uploaderPersonName={item.uploaderPersonName}
        uploaderPersonProfilePhoto={`${process.env.EXPO_PUBLIC_PHOTO_BASE_URL}${item.uploaderPersonProfilePhoto}`}
        photo={`${process.env.EXPO_PUBLIC_PHOTO_BASE_URL}${item.photo}`}
        title={item.title}
        desc={item.desc}
        badgeText={item.badgeText}
        coinsEarned={item.coinsEarned}
        uploadDate={item.uploadDate}
      />
    ),
    []
  );

  const renderEmptyTimeline = useCallback(
    () => (
      <View style={styles.emptyTimelineContainer}>
        <Text style={styles.emptyTimelineEmoji}>📸</Text>
        <Text style={styles.emptyTimelineTitle}>No posts yet</Text>
        <Text style={styles.emptyTimelineSubtitle}>
          {userId === "user1"
            ? "Start sharing your environmental actions!"
            : "This user hasn't posted anything yet."}
        </Text>
      </View>
    ),
    [userId]
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6366f1" />
      <Text style={styles.loadingText}>Loading profile...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorEmoji}>😕</Text>
      <Text style={styles.errorTitle}>Profile not found</Text>
      <Text style={styles.errorSubtitle}>
        {error?.message || "This profile doesn't exist or couldn't be loaded."}
      </Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => refetchProfile()}
      >
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const keyExtractor = useCallback((item: any) => item.id, []);

  const handleRefresh = useCallback(() => {
    refetchProfile();
  }, [refetchProfile]);

  // Show loading state
  if (loadingProfile && !profile) {
    return (
      <SafeAreaView style={styles.container}>
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

  // Show error state
  if (isError || !profile) {
    return (
      <SafeAreaView style={styles.container}>{renderErrorState()}</SafeAreaView>
    );
  }

  const ListHeaderComponent = () => (
    <>
      {renderProfileHeader()}
      {/* Show Dashboard only if NOT user1 */}
      {userId !== "user1" && <Dashboard />}
      {renderTimelineHeader()}
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <FlatList
        data={profile.timeline || []}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={renderEmptyTimeline}
        refreshControl={
          <RefreshControl
            refreshing={loadingProfile}
            onRefresh={handleRefresh}
            colors={["#6366f1"]}
            tintColor="#6366f1"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={3}
        updateCellsBatchingPeriod={100}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  listContainer: {
    paddingBottom: 100, // For bottom navigation
  },

  // Profile Header Styles
  profileHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#ffffff",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#f8fafc",
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 1,
  },
  userInfoSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  profileEmail: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },

  // Timeline Header Styles
  timelineHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#ffffff",
  },
  timelineTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.3,
  },
  timelineSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
    fontWeight: "500",
  },

  // Empty Timeline Styles
  emptyTimelineContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
    minHeight: 300,
  },
  emptyTimelineEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyTimelineTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  emptyTimelineSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
  },

  // Loading State Styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },

  // Error State Styles
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    backgroundColor: "#ffffff",
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  errorSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    fontWeight: "500",
  },
  retryButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  aiNote: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 8,
    fontWeight: "500",
    marginHorizontal: 20,
  },
});
