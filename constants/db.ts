import { Directory, File, Paths } from "expo-file-system";

export interface Post {
  id: string;
  uploaderPersonId: string;
  uploaderPersonName: string;
  uploaderPersonProfilePhoto: string;
  photo: string;
  title: string;
  desc: string;
  badgeText: string;
  coinsEarned: number;
  uploadDate: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePhoto: string;
  co2: number;
  plastic: number;
  trees: number;
  timeline: Post[];
}

export interface RewardItem {
  image: string;
  title: string;
  desc: string;
  expires?: string;
  coinsNeeded?: number;
}

export interface Rewards {
  lifetimeEarnedCoins: number;
  availableCoins: number;
  redeemedCoins: number;
  available: RewardItem[];
  expired: RewardItem[];
  redeemed: RewardItem[];
}

export interface DashboardStats {
  co2: number;
  plastic: number;
  trees: number;
}

// Mock data storage
export let posts: Post[] = [
  {
    id: "post1",
    uploaderPersonId: "user1",
    uploaderPersonName: "John Doe",
    uploaderPersonProfilePhoto: "profile1.png",
    photo: "post1.png",
    title: "Using Public Transport Today",
    desc: "I took the bus instead of my car to reduce my carbon footprint. Small actions make a big difference!",
    badgeText: "Public transport 🚌",
    coinsEarned: 15,
    uploadDate: "2025-09-13T08:30:00Z",
  },
  {
    id: "post2",
    uploaderPersonId: "user2",
    uploaderPersonName: "Jane Smith",
    uploaderPersonProfilePhoto: "profile2.png",
    photo: "post2.png",
    title: "Recycling Plastic Waste",
    desc: "Sorted and recycled all plastic waste from this week. Every bottle counts!",
    badgeText: "Recycling ♻️",
    coinsEarned: 20,
    uploadDate: "2025-09-12T10:00:00Z",
  },
  {
    id: "post3",
    uploaderPersonId: "user1",
    uploaderPersonName: "John Doe",
    uploaderPersonProfilePhoto: "profile1.png",
    photo: "post3.png",
    title: "Community Tree Planting",
    desc: "Planted 5 saplings in our neighborhood park. Building a greener future together!",
    badgeText: "Planting tree 🌳",
    coinsEarned: 50,
    uploadDate: "2025-09-11T14:15:00Z",
  },
  {
    id: "post4",
    uploaderPersonId: "user2",
    uploaderPersonName: "Jane Smith",
    uploaderPersonProfilePhoto: "profile2.png",
    photo: "post4.png",
    title: "Solar Energy Usage",
    desc: "Using solar panels to power my home office. Clean energy for a cleaner planet!",
    badgeText: "Solar energy ☀️",
    coinsEarned: 30,
    uploadDate: "2025-09-10T09:45:00Z",
  },
];

export let users: UserProfile[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    profilePhoto: "profile1.png",
    co2: 150,
    plastic: 30,
    trees: 20,
    timeline: posts.filter((post) => post.uploaderPersonId === "user1"),
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    profilePhoto: "profile2.png",
    co2: 80,
    plastic: 50,
    trees: 10,
    timeline: posts.filter((post) => post.uploaderPersonId === "user2"),
  },
];

export const rewards: Rewards = {
  lifetimeEarnedCoins: 485,
  availableCoins: 120,
  redeemedCoins: 365,
  available: [
    {
      image: "gift1.png",
      title: "Eco Water Bottle",
      desc: "Premium stainless steel, BPA-free reusable water bottle",
      expires: "2025-12-31",
      coinsNeeded: 100,
    },
    {
      image: "gift2.png",
      title: "Portable Solar Charger",
      desc: "High-efficiency solar panel charger for mobile devices",
      expires: "2025-11-30",
      coinsNeeded: 150,
    },
    {
      image: "gift5.png",
      title: "Bamboo Cutlery Set",
      desc: "Sustainable bamboo utensils with carrying case",
      expires: "2025-10-31",
      coinsNeeded: 80,
    },
  ],
  expired: [
    {
      image: "gift3.png",
      title: "Tree Seed Starter Kit",
      desc: "Complete kit with seeds, pots, and growing guide",
    },
  ],
  redeemed: [
    {
      image: "gift4.png",
      title: "Organic Cotton Tote",
      desc: "Stylish reusable shopping bag made from organic cotton",
    },
  ],
};

// File operations

export const saveImageToAssets = async (
  imageData: string, // Base64 string (with header) or file URI
  filename: string,
  folder: "profile" | "posts" | "rewards" = "posts"
): Promise<string> => {
  try {
    // Create the full path: documentDirectory/assets/images/folder/filename
    const assetsDir = new Directory(Paths.document, "assets", "images", folder);
    const file = new File(assetsDir, filename);

    // Ensure the directory exists (create parents if needed)
    await assetsDir.create({ intermediates: true });

    if (/^data:image\/(jpg|jpeg|png|gif);base64,/.test(imageData)) {
      // For Base64 data (with header), strip the header and write as binary
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
      await file.create();
      await file.write(base64Data, { encoding: "base64" });
    } else {
      // For URIs, copy the file
      await File.copyAsync({ from: imageData, to: file.uri });
    }

    // Return the relative path, e.g., "assets/images/photo123.png"
    return `assets/images/${folder}/${filename}`;
  } catch (error) {
    throw new Error(`Failed to save image: ${error}`);
  }
};

// CRUD operations
export const addPost = (post: Post): void => {
  posts.unshift(post);
  const user = users.find((u) => u.id === post.uploaderPersonId);
  if (user) {
    user.timeline.unshift(post);
  }
};

export const updateUserStats = (
  userId: string,
  stats: Partial<DashboardStats>
): void => {
  const user = users.find((u) => u.id === userId);
  if (user) {
    if (stats.co2) user.co2 += stats.co2;
    if (stats.plastic) user.plastic += stats.plastic;
    if (stats.trees) user.trees += stats.trees;
  }
};

export const generatePostId = (): string => {
  return `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
