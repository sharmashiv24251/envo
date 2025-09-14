import { usePostContext } from "@/app/(tabs)/post/_layout";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Constants
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const CAMERA_WIDTH = Math.min(screenWidth * 0.85, 500);
const CAMERA_HEIGHT = (CAMERA_WIDTH * 4) / 3;
const BORDER_RADIUS = 18;
const DOUBLE_TAP_DELAY = 300;
const PRIMARY_COLOR = "#22c55e";

// Common style objects
const commonShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 5,
};

const primaryShadow = {
  shadowColor: PRIMARY_COLOR,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 8,
};

const primaryButton = {
  backgroundColor: PRIMARY_COLOR,
  borderRadius: 28,
  ...primaryShadow,
};

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [lastTap, setLastTap] = useState(0);
  const cameraRef = useRef<CameraView>(null);

  // Get context functions
  const { setPhoto: setContextPhoto } = usePostContext();

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Image source={require("@/assets/ui/envo.png")} style={styles.logo} />
          <Text style={styles.message}>
            We need your permission to show the camera
          </Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photoData = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });

      if (photoData?.uri) {
        setContextPhoto(photoData.uri); // Save photo to context
        router.push("/post/form"); // Navigate directly to form
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take picture");
      console.error("Camera error:", error);
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap && now - lastTap < DOUBLE_TAP_DELAY) {
      setFacing((current) => (current === "back" ? "front" : "back"));
    } else {
      setLastTap(now);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraInterface}>
        <View style={styles.logoContainer}>
          <Image source={require("@/assets/ui/envo.png")} style={styles.logo} />
        </View>

        <Pressable onPress={handleDoubleTap}>
          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={facing}
              ratio="4:3"
            />
          </View>
        </Pressable>

        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "flex-start",
    paddingTop: screenHeight * 0.08,
    alignItems: "center",
  },
  cameraInterface: {
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 20,
    width: screenWidth * 0.9,
    ...commonShadow,
  },
  permissionContainer: {
    backgroundColor: "#ffffff",
    borderRadius: BORDER_RADIUS,
    borderWidth: 3,
    borderColor: PRIMARY_COLOR,
    padding: 32,
    alignItems: "center",
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    marginHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  logo: {
    height: 40,
    width: 100,
  },
  message: {
    textAlign: "center",
    paddingBottom: 24,
    fontSize: 16,
    color: "#475569",
    marginHorizontal: 20,
    lineHeight: 24,
    fontWeight: "500",
  },
  cameraContainer: {
    width: CAMERA_WIDTH,
    height: CAMERA_HEIGHT,
    borderRadius: BORDER_RADIUS,
    overflow: "hidden",
    backgroundColor: "#000000",
    marginBottom: 20,
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: PRIMARY_COLOR,
    borderWidth: 4,
    borderColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    ...primaryShadow,
  },
  captureButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffffff",
  },
  button: {
    ...primaryButton,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
