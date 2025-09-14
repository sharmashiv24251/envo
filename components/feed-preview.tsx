import { Post as PostType } from "@/constants/db";
import { useFeedPreview } from "@/hooks/api";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = screenWidth * 0.95;
const CARD_SPACING = 10;

export default function FeedPreview() {
  const { data: feedPosts } = useFeedPreview();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Auto-scroll functionality
  useEffect(() => {
    if (!feedPosts || feedPosts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % feedPosts.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, [feedPosts]);

  // Animate new items
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  const renderCarouselItem = useCallback(
    ({ item, index }: { item: PostType; index: number }) => {
      const isActive = index === currentIndex;

      return (
        <Animated.View
          style={[
            styles.carouselItem,
            {
              opacity: isActive ? fadeAnim : 0.7,
              transform: [{ scale: isActive ? scaleAnim : 0.95 }],
            },
          ]}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: `${process.env.EXPO_PUBLIC_PHOTO_BASE_URL}${item.photo}`,
              }}
              style={styles.carouselImage}
              resizeMode="cover"
            />

            {/* Bottom overlay with gradient */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={styles.overlayGradient}
            >
              <View style={styles.overlayContent}>
                <View style={styles.uploaderInfo}>
                  <Text style={styles.uploaderName} numberOfLines={1}>
                    {item.uploaderPersonName}
                  </Text>
                  <Text style={styles.uploaderDesc} numberOfLines={2}>
                    {item.desc}
                  </Text>
                </View>

                <LinearGradient
                  colors={["#10b981", "#06d6a0"]}
                  style={styles.overlayBadge}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.overlayBadgeText}>{item.badgeText}</Text>
                </LinearGradient>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>
      );
    },
    [currentIndex, fadeAnim, scaleAnim]
  );

  const onScrollEnd = useCallback((event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (CARD_WIDTH + CARD_SPACING));
    setCurrentIndex(index);
  }, []);

  if (!feedPosts || feedPosts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>See What Your Friends Are Doing</Text>
        <View style={styles.indicatorContainer}>
          {feedPosts.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={feedPosts}
        renderItem={renderCarouselItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContainer}
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(data, index) => ({
          length: CARD_WIDTH + CARD_SPACING,
          offset: (CARD_WIDTH + CARD_SPACING) * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1f2937",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#d1d5db",
  },
  activeIndicator: {
    backgroundColor: "#10b981",
    width: 20,
  },
  carouselContainer: {
    paddingHorizontal: (screenWidth - CARD_WIDTH) / 2,
  },
  carouselItem: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_SPACING / 2,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  carouselImage: {
    width: "100%",
    aspectRatio: 4 / 3,
  },
  overlayGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    justifyContent: "flex-end",
  },
  overlayContent: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  uploaderInfo: {
    flex: 1,
    marginRight: 12,
  },
  uploaderName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  uploaderDesc: {
    fontSize: 14,
    color: "#e5e7eb",
    lineHeight: 18,
    fontWeight: "500",
  },
  overlayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  overlayBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
