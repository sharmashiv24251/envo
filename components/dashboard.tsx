import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
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
          <Image
            source={earthImage}
            style={[
              styles.earthIcon,
              isTablet ? styles.earthIconTablet : styles.earthIconPhone,
            ]}
            resizeMode="contain"
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
