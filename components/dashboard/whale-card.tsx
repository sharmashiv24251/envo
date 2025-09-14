import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";
//@ts-ignore
import whaleImage from "@/assets/ui/whale.png";

const AnimatedCounter = ({
  value,
  suffix = "",
  duration = 1000,
  style,
}: any) => {
  const [displayValue, setDisplayValue] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  }, [value, duration]);

  return (
    <Text style={style} numberOfLines={1} ellipsizeMode="tail">
      {String(displayValue).padStart(2, "0")}
      {suffix}
    </Text>
  );
};

const WhaleCard = ({ isTablet }: { isTablet: boolean }) => {
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
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
        styles.whaleCard,
        isTablet ? styles.whaleCard_tablet : styles.whaleCard_phone,
        !isTablet && styles.whaleCard_marginRight,
        {
          transform: [{ translateY: translateYAnim }, { scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Image
        source={whaleImage}
        style={styles.whaleCard__image}
        resizeMode="cover"
      />
      <View style={styles.whaleCard__textContainer}>
        <AnimatedCounter
          value={12}
          suffix=" kg plastic saved"
          style={[
            styles.whaleCard__title,
            isTablet && styles.whaleCard__title_tablet,
            !isTablet && styles.whaleCard__title_small,
          ]}
          duration={1000}
        />
        <Text
          style={[
            styles.whaleCard__description,
            isTablet && styles.whaleCard__description_tablet,
          ]}
          numberOfLines={2}
        >
          That's 960 bottles kept out of oceans!
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  whaleCard: {
    borderRadius: 24,
    justifyContent: "flex-end",
    flex: 1,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#4d84dd",
  },
  whaleCard_phone: {
    minWidth: 170,
    minHeight: 180,
  },
  whaleCard_tablet: {
    minWidth: 260,
    minHeight: 190,
    flex: 0,
  },
  whaleCard_marginRight: {
    marginRight: 12,
  },
  whaleCard__image: {
    width: "100%",
    height: 170,
    position: "absolute",
    top: -5,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  whaleCard__textContainer: {
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 16,
    zIndex: 20,
    minHeight: 85,
    overflow: "hidden",
  },
  whaleCard__title: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
    lineHeight: 18,
    overflow: "hidden",
  },
  whaleCard__title_small: {
    fontSize: 12,
    lineHeight: 16,
    overflow: "hidden",
  },
  whaleCard__title_tablet: {
    fontSize: 24,
    lineHeight: 28,
    marginBottom: 8,
    overflow: "hidden",
  },
  whaleCard__description: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "400",
    opacity: 0.88,
    lineHeight: 14,
  },
  whaleCard__description_tablet: {
    fontSize: 18,
    lineHeight: 22,
  },
});

export default WhaleCard;
