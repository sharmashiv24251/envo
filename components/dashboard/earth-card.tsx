import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
//@ts-ignore
import earthImage from "@/assets/ui/earth.png";

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
      {isLoading ? "000" : displayValue}
      {suffix}
    </Text>
  );
};

const Decorations = ({ isTablet }: { isTablet: boolean }) => {
  const Sparkle = ({ style, delay = 0 }: any) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const animate = () => {
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => animate());

        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]).start();
      };
      animate();
    }, []);

    return (
      <Animated.View
        style={[
          styles.earthCard__sparkle,
          style,
          { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
        ]}
      >
        <Text style={styles.earthCard__sparkleText}>✦</Text>
      </Animated.View>
    );
  };

  return (
    <>
      <Sparkle
        style={
          isTablet
            ? styles.earthCard__sparkle1_tablet
            : styles.earthCard__sparkle1_phone
        }
        delay={0}
      />
      <Sparkle
        style={
          isTablet
            ? styles.earthCard__sparkle2_tablet
            : styles.earthCard__sparkle2_phone
        }
        delay={800}
      />
      <Sparkle
        style={
          isTablet
            ? styles.earthCard__sparkle3_tablet
            : styles.earthCard__sparkle3_phone
        }
        delay={1600}
      />
    </>
  );
};

const EarthCard = ({
  isTablet,
  co2Value,
  isLoading,
}: {
  isTablet: boolean;
  co2Value: number;
  isLoading: boolean;
}) => {
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const earthPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(earthPulse, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(earthPulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const treesPlanted = Math.floor(co2Value / 22.5); // Approximate calculation

  return (
    <Animated.View
      style={[
        styles.earthCard,
        isTablet ? styles.earthCard_tablet : styles.earthCard_phone,
        { transform: [{ scale: cardScale }], opacity: cardOpacity },
      ]}
    >
      <LinearGradient
        colors={["#4CB094", "#87D37C", "#96E6A7"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.earthCard__gradient}
      >
        <Decorations isTablet={isTablet} />

        <View style={styles.earthCard__content}>
          <View style={styles.earthCard__textSection}>
            <AnimatedCounter
              value={co2Value}
              suffix=" kg"
              style={[
                styles.earthCard__value,
                isTablet && styles.earthCard__value_tablet,
              ]}
              duration={1250}
              isLoading={isLoading}
            />
            <Text
              style={[
                styles.earthCard__label,
                isTablet && styles.earthCard__label_tablet,
              ]}
            >
              CO2e saved
            </Text>
            <Text
              style={[
                styles.earthCard__description,
                isTablet && styles.earthCard__description_tablet,
              ]}
            >
              That's like planting {"\n"}
              {isLoading ? "00" : treesPlanted} trees
            </Text>
          </View>

          <Animated.Image
            source={earthImage}
            style={[
              styles.earthCard__image,
              isTablet
                ? styles.earthCard__image_tablet
                : styles.earthCard__image_phone,
              { transform: [{ scale: earthPulse }] },
            ]}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  earthCard: {
    borderRadius: 24,
    overflow: "hidden",
  },
  earthCard_phone: {
    width: "98%",
    minHeight: 200,
    marginBottom: 12,
  },
  earthCard_tablet: {
    width: 520,
    minHeight: 400,
    marginRight: 18,
  },
  earthCard__gradient: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    position: "relative",
  },
  earthCard__content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  earthCard__textSection: {
    flex: 1,
    zIndex: 20,
  },
  earthCard__value: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: 1,
    lineHeight: 48,
  },
  earthCard__value_tablet: {
    fontSize: 76,
    lineHeight: 82,
  },
  earthCard__label: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 8,
  },
  earthCard__label_tablet: {
    fontSize: 38,
    lineHeight: 42,
  },
  earthCard__description: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
    opacity: 0.92,
  },
  earthCard__description_tablet: {
    fontSize: 32,
    lineHeight: 30,
  },
  earthCard__image: {
    position: "absolute",
    zIndex: 10,
    opacity: 0.9,
  },
  earthCard__image_phone: {
    width: 280,
    height: 280,
    right: "-30%",
    top: "-15%",
  },
  earthCard__image_tablet: {
    width: 480,
    height: 480,
    right: "-45%",
    top: "-3%",
  },
  earthCard__sparkle: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 15,
  },
  earthCard__sparkleText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  earthCard__sparkle1_phone: { top: "10%", right: "5%" },
  earthCard__sparkle2_phone: { top: "40%", right: "15%" },
  earthCard__sparkle3_phone: { top: "70%", right: "8%" },
  earthCard__sparkle1_tablet: { top: "15%", right: "8%" },
  earthCard__sparkle2_tablet: { top: "45%", right: "18%" },
  earthCard__sparkle3_tablet: { top: "75%", right: "12%" },
});

export default EarthCard;
