import { useRewards } from "@/hooks/api";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PHOTO_URL = process.env.EXPO_PUBLIC_PHOTO_BASE_URL;

export default function RewardsScreen() {
  const {
    data: rewards,
    isLoading: loadingRewards,
    refetch: refetchRewards,
  } = useRewards();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchRewards();
    setRefreshing(false);
  };

  const renderContent = () => {
    if (loadingRewards && !rewards) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e293b" />
          <Text style={styles.loadingText}>Loading your rewards...</Text>
        </View>
      );
    }

    if (!rewards) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorSubtitle}>
            We couldn't load your rewards. Please try again.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetchRewards}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        {/* Coins Summary Cards */}
        <View style={styles.coinsGrid}>
          <View style={styles.coinCard}>
            <Text style={styles.coinLabel}>Available Coins</Text>
            <Text style={styles.coinAmount}>{rewards.availableCoins} 🪙</Text>
          </View>
          <View style={styles.coinCard}>
            <Text style={styles.coinLabel}>Lifetime Earned</Text>
            <Text style={styles.coinAmount}>
              {rewards.lifetimeEarnedCoins} 🏆
            </Text>
          </View>
        </View>

        {/* Available Rewards */}
        <View style={styles.rewardsSection}>
          {rewards.available.map((reward) => (
            <View key={reward.id} style={styles.rewardCard}>
              <Image
                source={{ uri: PHOTO_URL + reward.image }}
                style={styles.rewardImage}
              />
              <View style={styles.rewardContent}>
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardTitle}>{reward.title}</Text>
                  <Text style={styles.rewardDesc}>{reward.desc}</Text>
                  {reward.expires && (
                    <View style={styles.expiresContainer}>
                      <Text style={styles.expiresText}>
                        Expires: {new Date(reward.expires).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.rewardAction}>
                  <View style={styles.costContainer}>
                    <Text style={styles.costText}>
                      {reward.coinsNeeded} Coins
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.redeemButton,
                      rewards.availableCoins < reward.coinsNeeded &&
                        styles.redeemButtonDisabled,
                    ]}
                    disabled={rewards.availableCoins < reward.coinsNeeded}
                  >
                    <Text style={styles.redeemButtonText}>
                      {rewards.availableCoins >= reward.coinsNeeded
                        ? "Redeem"
                        : "Not Enough"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1e293b"]}
            tintColor="#1e293b"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Rewards</Text>
          <Text style={styles.headerSubtitle}>
            Redeem your eco-coins for exclusive rewards.
          </Text>
        </View>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingBottom: 100,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
  },
  coinsGrid: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  coinCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  coinLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
    marginBottom: 8,
  },
  coinAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
  },
  rewardsSection: {
    padding: 20,
  },
  rewardCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  rewardImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  rewardContent: {
    padding: 16,
  },
  rewardInfo: {
    marginBottom: 16,
  },
  rewardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  rewardDesc: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
    marginBottom: 12,
  },
  expiresContainer: {
    alignSelf: "flex-start",
  },
  expiresText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  rewardAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 16,
  },
  costContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
  },
  costText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  redeemButton: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  redeemButtonDisabled: {
    backgroundColor: "#e2e8f0",
  },
  redeemButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    minHeight: 500,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
    textAlign: "center",
  },
  errorSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
