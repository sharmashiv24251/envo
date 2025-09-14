import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";
//@ts-ignore
import treeImage from "@/assets/ui/tree.png";

const AnimatedCounter = ({
  value,
  suffix = "",
  duration = 1000,
  style,
  isLoading = false,
}: any) => {
  const [displayValue, setDisplayValue] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      setDisplayValue(0);
      return;
    }

    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value }) => {
      setDisplayValue(Math.floor(value));
    });

    return () => animatedValue.removeListener(listener);
  }, [value, duration, isLoading]);

  return (
    <Text style={style}>
      {isLoading ? "00" : displayValue}
      {suffix}
    </Text>
  );
};

const TreeCard = ({
  isTablet,
  treesValue,
  isLoading,
}: {
  isTablet: boolean;
  treesValue: number;
  isLoading: boolean;
}) => {
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(450),
      Animated.parallel([
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.treeCard,
        isTablet ? styles.treeCard_tablet : styles.treeCard_phone,
        {
          transform: [{ translateY: translateYAnim }, { scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Image
        source={treeImage}
        style={styles.treeCard__image}
        resizeMode="cover"
      />
      <View style={styles.treeCard__textContainer}>
        <AnimatedCounter
          value={treesValue}
          suffix=" trees planted"
          style={[
            styles.treeCard__title,
            isTablet && styles.treeCard__title_tablet,
          ]}
          duration={1100}
          isLoading={isLoading}
        />
        <Text
          style={[
            styles.treeCard__description,
            isTablet && styles.treeCard__description_tablet,
          ]}
          numberOfLines={2}
        >
          Helping absorb CO2{"\n"}and give shade
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  treeCard: {
    borderRadius: 24,
    justifyContent: "flex-end",
    flex: 1,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#98c291",
  },
  treeCard_phone: {
    minWidth: 170,
    minHeight: 180,
  },
  treeCard_tablet: {
    minWidth: 260,
    minHeight: 190,
    flex: 0,
  },
  treeCard__image: {
    width: "100%",
    height: 180,
    position: "absolute",
    top: -25,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  treeCard__textContainer: {
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 16,
    zIndex: 20,
    minHeight: 85,
  },
  treeCard__title: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
    lineHeight: 18,
  },
  treeCard__title_tablet: {
    fontSize: 24,
    lineHeight: 28,
    marginBottom: 8,
  },
  treeCard__description: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "400",
    opacity: 0.88,
    lineHeight: 14,
  },
  treeCard__description_tablet: {
    fontSize: 18,
    lineHeight: 22,
  },
});

export default TreeCard;
