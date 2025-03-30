import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getBookmarkedJobs } from '../utils/storage';
import { useTheme } from '../utils/ThemeContext';

const BookmarksScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBookmarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const bookmarkedJobs = await getBookmarkedJobs();
      // Ensure each job has a unique identifier
      const processedJobs = bookmarkedJobs.map(job => ({
        ...job,
        id: job.id || job._id || job.uniqueId || Math.random().toString(36).substr(2, 9)
      }));
      setBookmarks(processedJobs);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setError('Failed to load bookmarks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
    
    // Refresh bookmarks when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadBookmarks();
    });

    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={bookmarks}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => navigation.navigate('JobDetail', { job: item })}
          />
        )}
        keyExtractor={(item) => item.id || item._id || item.uniqueId || Math.random().toString(36).substr(2, 9)}
        ListEmptyComponent={
          <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
            <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
              {error || 'No bookmarked jobs yet.\nBookmark jobs to see them here!'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default BookmarksScreen; 