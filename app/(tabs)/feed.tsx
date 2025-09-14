import Post from "@/components/post";
import { Post as PostType } from "@/constants/db";
import { useFeedPreview } from "@/hooks/api";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FeedScreen() {
  const {
    data: feedPosts,
    isLoading: loadingFeed,
    refetch: refetchFeed,
  } = useFeedPreview();

  const renderHeader = useCallback(
    () => (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
        <Text style={styles.headerSubtitle}>
          See what your friends are doing...
        </Text>
      </View>
    ),
    []
  );

  const renderPost = useCallback(
    ({ item }: { item: PostType }) => (
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

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateEmoji}>🤔</Text>
        <Text style={styles.emptyStateTitle}>It's quiet in here</Text>
        <Text style={styles.emptyStateSubtitle}>
          Posts from your friends will show up here.
        </Text>
      </View>
    ),
    []
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#1e293b" />
      <Text style={styles.loadingText}>Loading feed...</Text>
    </View>
  );

  const renderFooter = useCallback(() => {
    if (!loadingFeed) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#1e293b" />
      </View>
    );
  }, [loadingFeed]);

  const keyExtractor = useCallback((item: PostType) => item.id, []);

  const handleRefresh = useCallback(() => {
    refetchFeed();
  }, [refetchFeed]);

  if (loadingFeed && !feedPosts) {
    return (
      <SafeAreaView style={styles.container}>
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <FlatList
        data={feedPosts || []}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={loadingFeed}
            onRefresh={handleRefresh}
            colors={["#1e293b"]}
            tintColor="#1e293b"
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "600",
    color: "#0f172a",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 100, // For bottom navigation
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    minHeight: 500, // Ensure it takes up space
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
