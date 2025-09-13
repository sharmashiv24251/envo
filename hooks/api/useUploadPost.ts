import { useState } from 'react';
import { 
  addPost, 
  updateUserStats, 
  generatePostId, 
  saveImageToAssets,
  users,
  Post,
  DashboardStats
} from '../../constants/db';

interface PostUploadData {
  uploaderPersonId: string;
  photo: File | string;
  title: string;
  desc: string;
  badgeText: string;
}

interface MutationResult<T> {
  mutate: T;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
  reset: () => void;
}

export function useUploadPost(): MutationResult<(data: PostUploadData) => Promise<void>> {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (postData: PostUploadData) => {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);
    setError(null);

    try {
      // Simulate upload time
      await new Promise(resolve => setTimeout(resolve, 800));

      // Find uploader
      const uploader = users.find(u => u.id === postData.uploaderPersonId);
      if (!uploader) {
        throw new Error('User not found');
      }

      // Handle image save if it's a File object
      let photoFilename = postData.photo as string;
      if (postData.photo instanceof File) {
        const timestamp = Date.now();
        const fileExtension = postData.photo.name.split('.').pop() || 'png';
        photoFilename = `post_${timestamp}.${fileExtension}`;
        
        // In real implementation, save actual file data
        // const buffer = await postData.photo.arrayBuffer();
        // photoFilename = await saveImageToAssets(Buffer.from(buffer), photoFilename, 'posts');
      }

      // Calculate rewards based on activity type
      let coinsEarned = 10;
      let statIncrement: DashboardStats = { co2: 5, plastic: 2, trees: 1 };
      
      if (postData.badgeText.includes('tree') || postData.badgeText.includes('🌳')) {
        coinsEarned = 50;
        statIncrement = { co2: 20, plastic: 5, trees: 5 };
      } else if (postData.badgeText.includes('recycl') || postData.badgeText.includes('♻️')) {
        coinsEarned = 25;
        statIncrement = { co2: 8, plastic: 15, trees: 2 };
      } else if (postData.badgeText.includes('transport') || postData.badgeText.includes('🚌')) {
        coinsEarned = 15;
        statIncrement = { co2: 12, plastic: 3, trees: 1 };
      } else if (postData.badgeText.includes('solar') || postData.badgeText.includes('☀️')) {
        coinsEarned = 30;
        statIncrement = { co2: 15, plastic: 3, trees: 2 };
      }

      // Create new post
      const newPost: Post = {
        id: generatePostId(),
        uploaderPersonId: postData.uploaderPersonId,
        uploaderPersonName: uploader.name,
        uploaderPersonProfilePhoto: uploader.profilePhoto,
        photo: `posts/${photoFilename}`,
        title: postData.title,
        desc: postData.desc,
        badgeText: postData.badgeText,
        coinsEarned,
        uploadDate: new Date().toISOString(),
      };

      // Add post and update user stats
      addPost(newPost);
      updateUserStats(postData.uploaderPersonId, statIncrement);
      
      setIsSuccess(true);
    } catch (err) {
      setError(err as Error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setIsError(false);
    setIsSuccess(false);
    setError(null);
  };

  return { mutate, isLoading, isError, error, isSuccess, reset };
}
