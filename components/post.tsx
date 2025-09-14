// import React from "react";
// import { Image, StyleSheet, Text, View } from "react-native";

// // No need for Dimensions if width is "100%"
// // const { width } = Dimensions.get("window");

// interface PostProps {
//   id: string;
//   uploaderPersonId: string;
//   uploaderPersonName: string;
//   uploaderPersonProfilePhoto?: string;
//   photo: string;
//   title: string;
//   desc: string;
//   badgeText: string;
//   coinsEarned: number;
//   uploadDate: string;
// }

// export default function Post({
//   uploaderPersonName,
//   uploaderPersonProfilePhoto,
//   photo,
//   title,
//   desc,
//   badgeText,
//   coinsEarned,
//   uploadDate,
// }: PostProps) {
//   // Function to get user's initials for avatar
//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   // Function to format date
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInHours = Math.floor(
//       (now.getTime() - date.getTime()) / (1000 * 60 * 60)
//     );

//     if (diffInHours < 1) {
//       return "Just now";
//     } else if (diffInHours < 24) {
//       return `${diffInHours}h ago`;
//     } else {
//       const diffInDays = Math.floor(diffInHours / 24);
//       return `${diffInDays}d ago`;
//     }
//   };

//   return (
//     // This is now the single card container
//     <View style={styles.cardContainer}>
//       {/* Post Image is now the first child of the card */}
//       <Image
//         source={{ uri: photo }}
//         style={styles.postImage}
//         resizeMode="cover"
//       />

//       {/* A new container for all the text content to apply padding */}
//       <View style={styles.contentContainer}>
//         {/* User Info Header */}
//         <View style={styles.userHeader}>
//           {uploaderPersonProfilePhoto ? (
//             <Image
//               source={{ uri: uploaderPersonProfilePhoto }}
//               style={styles.profilePhoto}
//             />
//           ) : (
//             <View style={styles.avatarContainer}>
//               <Text style={styles.avatarText}>
//                 {getInitials(uploaderPersonName)}
//               </Text>
//             </View>
//           )}
//           <View style={styles.userInfo}>
//             <Text style={styles.userName}>{uploaderPersonName}</Text>
//             <Text style={styles.postDate}>{formatDate(uploadDate)}</Text>
//           </View>
//         </View>

//         {/* Post Content */}
//         <Text style={styles.postTitle}>{title}</Text>
//         <Text style={styles.postDesc}>{desc}</Text>

//         {/* Badge and Coins */}
//         <View style={styles.bottomSection}>
//           <View style={styles.badge}>
//             <Text style={styles.badgeText}>{badgeText}</Text>
//           </View>
//           <View style={styles.coinsContainer}>
//             <Text style={styles.coinsText}>+{coinsEarned} 🪙</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   // The main card container
//   cardContainer: {
//     backgroundColor: "#ffffff",
//     borderRadius: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//     margin: 15, // Use margin for spacing between cards
//   },
//   postImage: {
//     width: "100%",
//     aspectRatio: 4 / 3,
//     // Round top corners to match card, bottom corners are sharp
//     borderRadius: 15,
//   },
//   // New container for all content below the image
//   contentContainer: {
//     padding: 15,
//   },
//   userHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   profilePhoto: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   avatarContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#6b7280",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   avatarText: {
//     color: "#ffffff",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   userInfo: {
//     flex: 1,
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//   },
//   postDate: {
//     fontSize: 12,
//     color: "#666",
//     marginTop: 2,
//   },
//   postTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#333",
//     marginBottom: 8,
//   },
//   postDesc: {
//     fontSize: 14,
//     color: "#666",
//     lineHeight: 20,
//     marginBottom: 15,
//   },
//   bottomSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   badge: {
//     backgroundColor: "#22c55e",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 15,
//   },
//   badgeText: {
//     color: "#ffffff",
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   coinsContainer: {
//     backgroundColor: "#fbbf24",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   coinsText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#ffffff",
//   },
// });
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface PostProps {
  id: string;
  uploaderPersonId: string;
  uploaderPersonName: string;
  uploaderPersonProfilePhoto?: string;
  photo: string;
  title: string;
  desc: string;
  badgeText: string;
  coinsEarned: number;
  uploadDate: string;
}

export default function Post({
  uploaderPersonName,
  uploaderPersonProfilePhoto,
  photo,
  title,
  desc,
  badgeText,
  coinsEarned,
  uploadDate,
}: PostProps) {
  // Function to get user's initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    // This is now the single card container
    <View style={styles.cardContainer}>
      {/* Post Image is now the first child of the card */}
      <Image
        source={{ uri: photo }}
        style={styles.postImage}
        resizeMode="cover"
      />

      {/* A new container for all the text content to apply padding */}
      <View style={styles.contentContainer}>
        {/* User Info Header */}
        <View style={styles.userHeader}>
          {uploaderPersonProfilePhoto ? (
            <Image
              source={{ uri: uploaderPersonProfilePhoto }}
              style={styles.profilePhoto}
            />
          ) : (
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={styles.avatarContainer}
            >
              <Text style={styles.avatarText}>
                {getInitials(uploaderPersonName)}
              </Text>
            </LinearGradient>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{uploaderPersonName}</Text>
            <View style={styles.timeContainer}>
              <View style={styles.timeDot} />
              <Text style={styles.postDate}>{formatDate(uploadDate)}</Text>
            </View>
          </View>
        </View>

        {/* Post Content */}
        <Text style={styles.postTitle}>{title}</Text>
        <Text style={styles.postDesc}>{desc}</Text>

        {/* Badge and Coins */}
        <View style={styles.bottomSection}>
          <LinearGradient
            colors={["#10b981", "#06d6a0"]}
            style={styles.badge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.badgeContent}>
              <Text style={styles.badgeEmoji}>🎯</Text>
              <Text style={styles.badgeText}>{badgeText}</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={["#fbbf24", "#f59e0b"]}
            style={styles.coinsContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.coinsContent}>
              <Text style={styles.coinIcon}>💰</Text>
              <Text style={styles.coinsText}>+{coinsEarned}</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // The main card container - KEPT SAME
  cardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    margin: 15, // Use margin for spacing between cards
  },
  // KEPT SAME
  postImage: {
    width: "100%",
    aspectRatio: 4 / 3,
    // Round top corners to match card, bottom corners are sharp
    borderRadius: 15,
  },
  // KEPT SAME - New container for all content below the image
  contentContainer: {
    padding: 15,
  },
  // KEPT SAME
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  // KEPT SAME
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  // ENHANCED - Avatar with gradient
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  // ENHANCED - Avatar text
  avatarText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  // KEPT SAME
  userInfo: {
    flex: 1,
  },
  // ENHANCED - User name styling
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    letterSpacing: -0.2,
  },
  // ENHANCED - Time container with dot
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  // NEW - Time dot
  timeDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#10b981",
    marginRight: 4,
  },
  // ENHANCED - Post date styling
  postDate: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  // KEPT SAME
  postTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  // KEPT SAME
  postDesc: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  // KEPT SAME
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  // ENHANCED - Badge with gradient
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  // NEW - Badge content container
  badgeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  // NEW - Badge emoji
  badgeEmoji: {
    fontSize: 10,
    marginRight: 4,
  },
  // ENHANCED - Badge text
  badgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  // ENHANCED - Coins container with gradient
  coinsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: "#fbbf24",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  // NEW - Coins content container
  coinsContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  // NEW - Coin icon
  coinIcon: {
    fontSize: 10,
    marginRight: 3,
  },
  // ENHANCED - Coins text
  coinsText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.2,
  },
});
