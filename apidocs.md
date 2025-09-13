# Environmental App - Mock Setup Documentation

## 🏗️ Generated Structure

```
├── constants/
│   └── db.ts                    # Mock database with types & data
├── hooks/
│   └── api/
│       ├── index.ts            # Export all hooks
│       ├── useDashboard.ts     # Global stats hook
│       ├── useFeedPreview.ts   # Latest 3 posts hook
│       ├── useRewards.ts       # User rewards hook
│       ├── useProfile.ts       # User profile hook
│       └── useUploadPost.ts    # Post upload mutation
├── assets/
│   └── images/
│       ├── profile/            # Profile pictures
│       ├── posts/              # Post images
│       ├── rewards/            # Reward/gift images
│       └── image-requirements.json
└── types/
    └── index.ts               # TypeScript definitions
```

## 📋 Available Hooks Documentation

---

### 1. 📊 useDashboard

**Description:** Fetches aggregated environmental statistics for all users in the system.

**Input:** None

**Output:**

```typescript
{
  data: {
    co2: number;        // Total CO2 saved in kg
    plastic: number;    // Total plastic recycled in kg
    trees: number;      // Total trees planted
  } | null;
  isLoading: boolean;   // Loading state
  isError: boolean;     // Error state
  error: Error | null;  // Error object if any
  refetch: () => void;  // Function to refetch data
}
```

**Example Usage:**

```typescript
import { useDashboard } from "./hooks/api";

function DashboardStats() {
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading) return <div>Loading stats...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>CO2 Saved</h3>
        <p>{data?.co2}kg</p>
      </div>
      <div className="stat-card">
        <h3>Plastic Recycled</h3>
        <p>{data?.plastic}kg</p>
      </div>
      <div className="stat-card">
        <h3>Trees Planted</h3>
        <p>{data?.trees}</p>
      </div>
    </div>
  );
}
```

---

### 2. 📱 useFeedPreview

**Description:** Fetches the latest 3 posts from the feed for preview display.

**Input:** None

**Output:**

```typescript
{
  data: Post[] | null;  // Array of latest 3 posts
  isLoading: boolean;   // Loading state
  isError: boolean;     // Error state
  error: Error | null;  // Error object if any
  refetch: () => void;  // Function to refetch data
}

// Post interface:
interface Post {
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
```

**Example Usage:**

```typescript
import { useFeedPreview } from "./hooks/api";

function FeedPreview() {
  const { data: posts, isLoading, isError } = useFeedPreview();

  if (isLoading) return <div>Loading posts...</div>;
  if (isError) return <div>Failed to load posts</div>;

  return (
    <div className="feed-preview">
      <h2>Latest Activities</h2>
      {posts?.map((post) => (
        <div key={post.id} className="post-card">
          <img
            src={post.uploaderPersonProfilePhoto}
            alt={post.uploaderPersonName}
          />
          <div className="post-content">
            <h3>{post.title}</h3>
            <p>{post.desc}</p>
            <span className="badge">{post.badgeText}</span>
            <span className="coins">{post.coinsEarned} coins</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

### 3. 🎁 useRewards

**Description:** Fetches user rewards information including available, redeemed, and expired rewards.

**Input:** None

**Output:**

```typescript
{
  data: {
    lifetimeEarnedCoins: number;
    availableCoins: number;
    redeemedCoins: number;
    available: RewardItem[];  // Available rewards to redeem
    expired: RewardItem[];    // Expired rewards
    redeemed: RewardItem[];   // Already redeemed rewards
  } | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

// RewardItem interface:
interface RewardItem {
  image: string;
  title: string;
  desc: string;
  expires?: string;
  coinsNeeded?: number;
}
```

**Example Usage:**

```typescript
import { useRewards } from "./hooks/api";

function RewardsSection() {
  const { data: rewards, isLoading, isError } = useRewards();

  if (isLoading) return <div>Loading rewards...</div>;
  if (isError) return <div>Failed to load rewards</div>;

  return (
    <div className="rewards-section">
      <div className="coins-summary">
        <h2>Your Coins</h2>
        <p>Available: {rewards?.availableCoins}</p>
        <p>Lifetime Earned: {rewards?.lifetimeEarnedCoins}</p>
      </div>

      <div className="available-rewards">
        <h3>Available Rewards</h3>
        {rewards?.available.map((reward) => (
          <div key={reward.title} className="reward-card">
            <img src={reward.image} alt={reward.title} />
            <h4>{reward.title}</h4>
            <p>{reward.desc}</p>
            <span className="cost">{reward.coinsNeeded} coins</span>
            <button>Redeem</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 4. 👤 useProfile

**Description:** Fetches a user profile by ID or returns the default user if no ID is provided.

**Input:**

```typescript
id?: string  // Optional user ID (defaults to first user)
```

**Output:**

```typescript
{
  data: {
    id: string;
    name: string;
    email: string;
    profilePhoto: string;
    co2: number;           // User's CO2 savings
    plastic: number;       // User's plastic recycling
    trees: number;         // User's trees planted
    timeline: Post[];      // User's post history
  } | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}
```

**Example Usage:**

```typescript
import { useProfile } from "./hooks/api";

function ProfilePage({ userId }: { userId?: string }) {
  const { data: profile, isLoading, isError } = useProfile(userId);

  if (isLoading) return <div>Loading profile...</div>;
  if (isError) return <div>Failed to load profile</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={profile.profilePhoto} alt={profile.name} />
        <h1>{profile.name}</h1>
        <p>{profile.email}</p>
      </div>

      <div className="environmental-stats">
        <div className="stat">CO2 Saved: {profile.co2}kg</div>
        <div className="stat">Plastic Recycled: {profile.plastic}kg</div>
        <div className="stat">Trees Planted: {profile.trees}</div>
      </div>

      <div className="user-timeline">
        <h2>Recent Posts</h2>
        {profile.timeline.map((post) => (
          <div key={post.id} className="timeline-post">
            <h3>{post.title}</h3>
            <p>{post.desc}</p>
            <span className="badge">{post.badgeText}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 5. 📤 useUploadPost

**Description:** Mutation hook for uploading new environmental posts and updating user stats.

**Input:**

```typescript
{
  uploaderPersonId: string; // ID of user uploading
  photo: File | string; // Image file or filename
  title: string; // Post title
  desc: string; // Post description
  badgeText: string; // Activity badge (e.g., "Recycling ♻️")
}
```

**Output:**

```typescript
{
  mutate: (data: PostUploadData) => Promise<void>;  // Upload function
  isLoading: boolean;    // Upload in progress
  isError: boolean;      // Upload failed
  error: Error | null;   // Error details
  isSuccess: boolean;    // Upload succeeded
  reset: () => void;     // Reset mutation state
}
```

**Example Usage:**

```typescript
import { useUploadPost } from "./hooks/api";
import { useState } from "react";

function CreatePostForm() {
  const {
    mutate: uploadPost,
    isLoading,
    isError,
    isSuccess,
    reset,
  } = useUploadPost();
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    badgeText: "Recycling ♻️",
    photo: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.photo) return;

    try {
      await uploadPost({
        uploaderPersonId: "user1", // Get from auth context
        photo: formData.photo,
        title: formData.title,
        desc: formData.desc,
        badgeText: formData.badgeText,
      });

      // Reset form on success
      setFormData({
        title: "",
        desc: "",
        badgeText: "Recycling ♻️",
        photo: null,
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  if (isSuccess) {
    return (
      <div className="success-message">
        <h3>Post uploaded successfully! 🎉</h3>
        <button onClick={reset}>Create Another Post</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <input
        type="text"
        placeholder="Post title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <textarea
        placeholder="Describe your environmental action..."
        value={formData.desc}
        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
        required
      />

      <select
        value={formData.badgeText}
        onChange={(e) =>
          setFormData({ ...formData, badgeText: e.target.value })
        }
      >
        <option value="Recycling ♻️">Recycling ♻️</option>
        <option value="Public transport 🚌">Public transport 🚌</option>
        <option value="Planting tree 🌳">Planting tree 🌳</option>
        <option value="Solar energy ☀️">Solar energy ☀️</option>
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setFormData({ ...formData, photo: e.target.files?.[0] || null })
        }
        required
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Uploading..." : "Upload Post"}
      </button>

      {isError && <p className="error">Upload failed. Please try again.</p>}
    </form>
  );
}
```

## 🎯 Key Features

- ✅ **TanStack Query-like Interface** - Familiar API patterns
- ✅ **Full TypeScript Support** - Complete type safety
- ✅ **Automatic Error Handling** - Built-in error states
- ✅ **Loading States** - UI feedback during operations
- ✅ **File Upload Ready** - Image handling capabilities
- ✅ **Stats Auto-Update** - Environmental tracking with rewards
- ✅ **Mock Data Persistence** - Realistic data behavior

## 🚀 Next Steps

1. **Generate Images**: Use prompts in `assets/images/image-requirements.json`
2. **Import Hooks**: Import from `./hooks/api` in your components
3. **Build Components**: Use the examples above as starting points
4. **Customize**: Adapt the mock data to your needs

## 📁 Usage Summary

```typescript
import {
  useDashboard, // Global environmental stats
  useFeedPreview, // Latest 3 posts preview
  useRewards, // User rewards system
  useProfile, // User profile data
  useUploadPost, // Post upload with auto stats update
} from "./hooks/api";
```

Each hook follows the same pattern: **data**, **isLoading**, **isError**, **error**, and **refetch** for queries, plus **mutate**, **isSuccess**, and **reset** for mutations.
