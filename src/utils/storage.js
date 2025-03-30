import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKMARKS_KEY = '@job_bookmarks';

export const getBookmarkedJobs = async () => {
  try {
    const bookmarksJson = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return bookmarksJson ? JSON.parse(bookmarksJson) : [];
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    return [];
  }
};

export const toggleBookmark = async (job) => {
  try {
    const bookmarks = await getBookmarkedJobs();
    const isBookmarked = bookmarks.some((bookmark) => bookmark.id === job.id);
    
    let newBookmarks;
    if (isBookmarked) {
      newBookmarks = bookmarks.filter((bookmark) => bookmark.id !== job.id);
    } else {
      newBookmarks = [...bookmarks, job];
    }
    
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
    return !isBookmarked;
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return false;
  }
};

export const isJobBookmarked = async (jobId) => {
  try {
    const bookmarks = await getBookmarkedJobs();
    return bookmarks.some((bookmark) => bookmark.id === jobId);
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
}; 