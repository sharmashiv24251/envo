import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
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

// Sparkle component
const Sparkle = ({ style, delay = 0, duration = 2000 }: any) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: duration / 2,
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
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: duration / 3,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          })
        ),
      ]).start(() => {
        scaleAnim.setValue(0);
        opacityAnim.setValue(0);
        rotateAnim.setValue(0);
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
          transform: [{ scale: scaleAnim }, { rotate: spin }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Text style={styles.sparkleText}>✦</Text>
    </Animated.View>
  );
};

// Star component
const Star = ({ style, delay = 0, duration = 3000 }: any) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: duration / 2,
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

    animate();
  }, [delay, duration]);

  return (
    <Animated.View
      style={[
        styles.star,
        style,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Text style={styles.starText}>★</Text>
    </Animated.View>
  );
};

const Dashboard = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      <LinearGradient
        colors={["#4CB094", "#87D37C"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.mainCard,
          isTablet ? styles.mainCardTablet : styles.mainCardPhone,
        ]}
      >
        <View style={styles.mainContent}>
          <View style={styles.mainTextArea}>
            <Text
              style={[
                styles.primaryValue,
                isTablet && styles.primaryValueTablet,
              ]}
            >
              248 kg
            </Text>
            <Text
              style={[
                styles.primaryLabel,
                isTablet && styles.primaryLabelTablet,
              ]}
            >
              CO2e saved
            </Text>
            <Text
              style={[styles.primaryDesc, isTablet && styles.primaryDescTablet]}
            >
              That's like planting 11 trees
            </Text>
          </View>

          {/* Earth image */}
          <Image
            source={earthImage}
            style={[
              styles.earthIcon,
              isTablet ? styles.earthIconTablet : styles.earthIconPhone,
            ]}
            resizeMode="contain"
          />

          {/* Sparkles and stars around earth */}
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
        </View>
      </LinearGradient>

      <View style={[styles.statsGrid, isTablet && styles.statsGridTablet]}>
        <View
          style={[
            styles.statCard,
            styles.oceanCard,
            isTablet ? styles.statCardTablet : styles.statCardPhone,
            !isTablet && styles.statCardSpacing,
          ]}
        >
          <Image
            source={whaleImage}
            style={styles.whaleIcon}
            resizeMode="cover"
          />
          <View style={styles.statTextArea}>
            <Text
              style={[styles.statTitle, isTablet && styles.statTitleTablet]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              12 kg plastic saved
            </Text>
            <Text
              style={[styles.statDesc, isTablet && styles.statDescTablet]}
              numberOfLines={2}
            >
              That's 960 bottles kept{"\n"}out of oceans!
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statCard,
            styles.forestCard,
            isTablet ? styles.statCardTablet : styles.statCardPhone,
          ]}
        >
          <Image
            source={treeImage}
            style={styles.treeIcon}
            resizeMode="cover"
          />
          <View style={styles.statTextArea}>
            <Text
              style={[styles.statTitle, isTablet && styles.statTitleTablet]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              27 trees planted
            </Text>
            <Text
              style={[styles.statDesc, isTablet && styles.statDescTablet]}
              numberOfLines={2}
            >
              Helping absorb CO2{"\n"}and give shade
            </Text>
          </View>
        </View>
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
    borderRadius: 20,
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

  // Sparkle and star styles
  sparkle: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  sparkleText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  },
  starPosition: {
    zIndex: 15,
  },

  // Phone sparkle positions
  sparkle1Phone: {
    top: "10%",
    right: "5%",
  },
  sparkle2Phone: {
    top: "40%",
    right: "15%",
  },
  sparkle3Phone: {
    top: "70%",
    right: "8%",
  },

  // Tablet sparkle positions
  sparkle1Tablet: {
    top: "15%",
    right: "8%",
  },
  sparkle2Tablet: {
    top: "45%",
    right: "18%",
  },
  sparkle3Tablet: {
    top: "75%",
    right: "12%",
  },

  // Phone star positions
  star1Phone: {
    top: "25%",
    right: "2%",
  },
  star2Phone: {
    top: "55%",
    right: "25%",
  },
  star3Phone: {
    top: "15%",
    right: "20%",
  },

  // Tablet star positions
  star1Tablet: {
    top: "30%",
    right: "5%",
  },
  star2Tablet: {
    top: "60%",
    right: "28%",
  },
  star3Tablet: {
    top: "20%",
    right: "25%",
  },

  // Main card text styles
  primaryValue: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: 1,
    lineHeight: 48,
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

  // Stat cards
  statCard: {
    borderRadius: 20,
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

  // Stat card images
  whaleIcon: {
    width: "100%",
    height: 170,
    position: "absolute",
    top: -5,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  treeIcon: {
    width: "100%",
    height: 180,
    position: "absolute",
    top: -25,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  // Stat card text
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
  },
  statDescTablet: {
    fontSize: 18,
    lineHeight: 22,
  },
});
