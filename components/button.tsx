import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  loadingColor?: string;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  textStyle,
  loadingColor = "#ffffff",
}: ButtonProps) {
  const getButtonStyle = (): StyleProp<ViewStyle> => {
    const baseStyle: StyleProp<ViewStyle>[] = [styles.button];

    if (variant === "primary") {
      baseStyle.push(styles.primaryButton);
    } else {
      baseStyle.push(styles.secondaryButton);
    }

    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    const baseStyle: StyleProp<TextStyle>[] = [styles.buttonText];

    if (variant === "primary") {
      baseStyle.push(styles.primaryButtonText);
    } else {
      baseStyle.push(styles.secondaryButtonText);
    }

    if (textStyle) {
      baseStyle.push(textStyle);
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={loadingColor} size="small" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    minHeight: 50,
  },
  primaryButton: {
    backgroundColor: "#22c55e",
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: "#6b7280",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
    opacity: 0.7,
    shadowOpacity: 0.1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  primaryButtonText: {
    color: "#ffffff",
  },
  secondaryButtonText: {
    color: "#ffffff",
  },
});
