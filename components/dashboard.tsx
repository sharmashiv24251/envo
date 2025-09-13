import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

//@ts-ignore
import earthImage from "@/assets/ui/earth.png";
//@ts-ignore
import treeImage from "@/assets/ui/tree.png";
//@ts-ignore
import whaleImage from "@/assets/ui/whale.png";

// Enhanced Sparkle with more sophisticated animations
const Sparkle = ({ style, delay = 0, duration = 2000 }: any) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.parallel([
        // Main sparkle animation
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: duration / 2,
              easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: duration / 3,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 0,
              duration: duration / 2,
              easing: Easing.bezier(0.55, 0.06, 0.68, 0.19),
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: duration / 3,
              useNativeDriver: true,
            }),
          ]),
        ]),
        // Continuous rotation
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: duration * 1.5,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ),
        // Floating animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(translateYAnim, {
              toValue: -8,
              duration: 2000 + delay / 2,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
              toValue: 8,
              duration: 2000 + delay / 2,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start(() => {
        scaleAnim.setValue(0);
        opacityAnim.setValue(0);
        animate();
      });
    };

    animate();
  }, [delay, duration]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.sparkle,
        style,
        {
          transform: [
            { scale: scaleAnim },
            { rotate: spin },
            { translateY: translateYAnim },
          ],
          opacity: opacityAnim,
        },
      ]}
    >
      <Text style={styles.sparkleText}>✦</Text>
      <Animated.View style={[styles.sparkleGlow, { opacity: opacityAnim }]} />
    </Animated.View>
  );
};

// Enhanced Star with breathing effect
const Star = ({ style, delay = 0, duration = 3000 }: any) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: duration / 2,
            easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.9,
            duration: duration / 3,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0,
            duration: duration / 2,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: duration / 3,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        scaleAnim.setValue(0);
        opacityAnim.setValue(0);
        animate();
      });
    };

    // Breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    animate();
  }, [delay, duration]);

  const breatheScale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <Animated.View
      style={[
        styles.star,
        style,
        {
          transform: [{ scale: Animated.multiply(scaleAnim, breatheScale) }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Text style={styles.starText}>★</Text>
      <Animated.View style={[styles.starGlow, { opacity: opacityAnim }]} />
    </Animated.View>
  );
};

// Counter animation component
const AnimatedCounter = ({
  value,
  style,
  suffix = "",
  duration = 1000,
}: {
  value: number;
  style: any;
  suffix?: string;
  duration?: number;
}) => {
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

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [value, duration]);

  return (
    <Text style={style}>
      {displayValue}
      {suffix}
    </Text>
  );
};

// Floating particle component
const FloatingParticle = ({ style, delay = 0 }: any) => {
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateYAnim, {
            toValue: -100,
            duration: 8000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacityAnim, {
              toValue: 0.6,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.3,
              duration: 6000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0,
              duration: 6000,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start(() => {
        translateYAnim.setValue(50);
        opacityAnim.setValue(0);
        scaleAnim.setValue(0);
        animate();
      });
    };

    animate();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.particle,
        style,
        {
          transform: [{ translateY: translateYAnim }, { scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.particleDot} />
    </Animated.View>
  );
};

// Animated Card component
const AnimatedStatCard = ({
  children,
  style,
  delay = 0,
}: {
  children: React.ReactNode;
  style: any;
  delay?: number;
}) => {
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
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
          easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ translateY: translateYAnim }, { scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const Dashboard = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  // Main card entrance animation
  const mainCardScale = useRef(new Animated.Value(0.9)).current;
  const mainCardOpacity = useRef(new Animated.Value(0)).current;
  const earthPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Main card entrance - 2x faster
    Animated.parallel([
      Animated.timing(mainCardScale, {
        toValue: 1,
        duration: 500,
        easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
        useNativeDriver: true,
      }),
      Animated.timing(mainCardOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Earth pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(earthPulse, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(earthPulse, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      <Animated.View
        style={[
          styles.mainCard,
          isTablet ? styles.mainCardTablet : styles.mainCardPhone,
          {
            transform: [{ scale: mainCardScale }],
            opacity: mainCardOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={["#4CB094", "#87D37C", "#96E6A7"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientFill}
        >
          {/* Floating particles */}
          <FloatingParticle
            style={[styles.particlePosition, { left: "10%", top: "20%" }]}
            delay={0}
          />
          <FloatingParticle
            style={[styles.particlePosition, { left: "20%", top: "60%" }]}
            delay={2000}
          />
          <FloatingParticle
            style={[styles.particlePosition, { left: "80%", top: "30%" }]}
            delay={4000}
          />
          <FloatingParticle
            style={[styles.particlePosition, { left: "70%", top: "70%" }]}
            delay={6000}
          />

          <View style={styles.mainContent}>
            <View style={styles.mainTextArea}>
              <AnimatedCounter
                value={248}
                suffix=" kg"
                style={[
                  styles.primaryValue,
                  isTablet && styles.primaryValueTablet,
                ]}
                duration={1250}
              />
              <Animated.Text
                style={[
                  styles.primaryLabel,
                  isTablet && styles.primaryLabelTablet,
                ]}
              >
                CO2e saved
              </Animated.Text>
              <Animated.Text
                style={[
                  styles.primaryDesc,
                  isTablet && styles.primaryDescTablet,
                ]}
              >
                That's like planting 11 trees
              </Animated.Text>
            </View>

            {/* Enhanced Earth with pulse only */}
            <Animated.Image
              source={earthImage}
              style={[
                styles.earthIcon,
                isTablet ? styles.earthIconTablet : styles.earthIconPhone,
                {
                  transform: [{ scale: earthPulse }],
                },
              ]}
              resizeMode="contain"
            />

            {/* Enhanced sparkles and stars */}
            <Sparkle
              style={[
                styles.sparklePosition,
                isTablet ? styles.sparkle1Tablet : styles.sparkle1Phone,
              ]}
              delay={0}
              duration={2500}
            />
            <Sparkle
              style={[
                styles.sparklePosition,
                isTablet ? styles.sparkle2Tablet : styles.sparkle2Phone,
              ]}
              delay={800}
              duration={2000}
            />
            <Sparkle
              style={[
                styles.sparklePosition,
                isTablet ? styles.sparkle3Tablet : styles.sparkle3Phone,
              ]}
              delay={1600}
              duration={3000}
            />
            <Sparkle
              style={[
                styles.sparklePosition,
                isTablet ? styles.sparkle4Tablet : styles.sparkle4Phone,
              ]}
              delay={400}
              duration={2800}
            />

            <Star
              style={[
                styles.starPosition,
                isTablet ? styles.star1Tablet : styles.star1Phone,
              ]}
              delay={400}
              duration={3500}
            />
            <Star
              style={[
                styles.starPosition,
                isTablet ? styles.star2Tablet : styles.star2Phone,
              ]}
              delay={1200}
              duration={2800}
            />
            <Star
              style={[
                styles.starPosition,
                isTablet ? styles.star3Tablet : styles.star3Phone,
              ]}
              delay={2000}
              duration={3200}
            />
            <Star
              style={[
                styles.starPosition,
                isTablet ? styles.star4Tablet : styles.star4Phone,
              ]}
              delay={600}
              duration={3800}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      <View style={[styles.statsGrid, isTablet && styles.statsGridTablet]}>
        <AnimatedStatCard
          style={[
            styles.statCard,
            styles.oceanCard,
            isTablet ? styles.statCardTablet : styles.statCardPhone,
            !isTablet && styles.statCardSpacing,
          ]}
          delay={300}
        >
          <Image
            source={whaleImage}
            style={styles.whaleIcon}
            resizeMode="cover"
          />
          <View style={styles.statTextArea}>
            <AnimatedCounter
              value={12}
              suffix=" kg plastic saved"
              style={[
                styles.statTitle,
                isTablet && styles.statTitleTablet,
                // Apply smaller font size for plastic saved text on phones only
                !isTablet && styles.statTitlePlasticPhone,
              ]}
              duration={1000}
            />
            <Text
              style={[styles.statDesc, isTablet && styles.statDescTablet]}
              numberOfLines={2}
            >
              That's 960 bottles kept{"\n"}out of oceans!
            </Text>
          </View>
        </AnimatedStatCard>

        <AnimatedStatCard
          style={[
            styles.statCard,
            styles.forestCard,
            isTablet ? styles.statCardTablet : styles.statCardPhone,
          ]}
          delay={450}
        >
          <Image
            source={treeImage}
            style={styles.treeIcon}
            resizeMode="cover"
          />
          <View style={styles.statTextArea}>
            <AnimatedCounter
              value={27}
              suffix=" trees planted"
              style={[styles.statTitle, isTablet && styles.statTitleTablet]}
              duration={1100}
            />
            <Text
              style={[styles.statDesc, isTablet && styles.statDescTablet]}
              numberOfLines={2}
            >
              Helping absorb CO2{"\n"}and give shade
            </Text>
          </View>
        </AnimatedStatCard>
      </View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    padding: 8,
  },
  containerTablet: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },

  // Main CO2 Card
  mainCard: {
    borderRadius: 24,
    overflow: "hidden",
  },
  gradientFill: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  mainCardPhone: {
    width: "98%",
    minHeight: 200,
    marginBottom: 12,
  },
  mainCardTablet: {
    width: 520,
    minHeight: 400,
    marginRight: 18,
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  mainTextArea: {
    flex: 1,
    zIndex: 20,
  },
  earthIcon: {
    position: "absolute",
    zIndex: 10,
    opacity: 0.9,
  },
  earthIconPhone: {
    width: 280,
    height: 280,
    right: "-30%",
    top: "-15%",
  },
  earthIconTablet: {
    width: 480,
    height: 480,
    right: "-45%",
    top: "-3%",
  },

  // Enhanced sparkle and star styles
  sparkle: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  sparkleText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  sparkleGlow: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    zIndex: -1,
  },
  sparklePosition: {
    zIndex: 15,
  },

  star: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  starText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  starGlow: {
    position: "absolute",
    width: 18,
    height: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 9,
    zIndex: -1,
  },
  starPosition: {
    zIndex: 15,
  },

  // Floating particles
  particle: {
    position: "absolute",
  },
  particlePosition: {
    zIndex: 5,
  },
  particleDot: {
    width: 3,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 1.5,
  },

  // Enhanced positions for more sparkles and stars
  sparkle1Phone: { top: "10%", right: "5%" },
  sparkle2Phone: { top: "40%", right: "15%" },
  sparkle3Phone: { top: "70%", right: "8%" },
  sparkle4Phone: { top: "25%", right: "25%" },

  sparkle1Tablet: { top: "15%", right: "8%" },
  sparkle2Tablet: { top: "45%", right: "18%" },
  sparkle3Tablet: { top: "75%", right: "12%" },
  sparkle4Tablet: { top: "30%", right: "30%" },

  star1Phone: { top: "25%", right: "2%" },
  star2Phone: { top: "55%", right: "25%" },
  star3Phone: { top: "15%", right: "20%" },
  star4Phone: { top: "65%", right: "5%" },

  star1Tablet: { top: "30%", right: "5%" },
  star2Tablet: { top: "60%", right: "28%" },
  star3Tablet: { top: "20%", right: "25%" },
  star4Tablet: { top: "70%", right: "8%" },

  // Enhanced text styles with better typography
  primaryValue: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: 1,
    lineHeight: 48,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  primaryValueTablet: {
    fontSize: 76,
    lineHeight: 82,
  },
  primaryLabel: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 8,
    lineHeight: 24,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  primaryLabelTablet: {
    fontSize: 38,
    lineHeight: 42,
    marginTop: 8,
    marginBottom: 12,
  },
  primaryDesc: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "400",
    opacity: 0.92,
    lineHeight: 16,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  primaryDescTablet: {
    fontSize: 26,
    lineHeight: 30,
  },

  // Stats grid
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "98%",
  },
  statsGridTablet: {
    flexDirection: "column",
    height: 400,
    justifyContent: "space-between",
    width: 260,
  },

  // Enhanced stat cards
  statCard: {
    borderRadius: 24,
    padding: 0,
    justifyContent: "flex-end",
    flex: 1,
    overflow: "hidden",
    position: "relative",
  },
  statCardPhone: {
    minWidth: 170,
    minHeight: 180,
  },
  statCardTablet: {
    minWidth: 260,
    minHeight: 190,
    flex: 0,
  },
  statCardSpacing: {
    marginRight: 12,
  },
  oceanCard: {
    backgroundColor: "#4d84dd",
  },
  forestCard: {
    backgroundColor: "#98c291",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    zIndex: 10,
  },

  // Stat card images
  whaleIcon: {
    width: "100%",
    height: 170,
    position: "absolute",
    top: -5,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  treeIcon: {
    width: "100%",
    height: 180,
    position: "absolute",
    top: -25,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  // Enhanced stat card text
  statTextArea: {
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 16,
    zIndex: 20,
    minHeight: 85,
  },
  statTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
    lineHeight: 18,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  // NEW: Smaller font size for plastic saved text on phones only
  statTitlePlasticPhone: {
    fontSize: 13,
    lineHeight: 16,
  },
  statTitleTablet: {
    fontSize: 24,
    lineHeight: 28,
    marginBottom: 8,
  },
  statDesc: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "400",
    opacity: 0.88,
    lineHeight: 14,
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statDescTablet: {
    fontSize: 18,
    lineHeight: 22,
  },
});
