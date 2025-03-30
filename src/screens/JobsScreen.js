import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  Text, 
  RefreshControl,
  ActivityIndicator 
} from 'react-native';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchJobs } from '../services/api';
import { useTheme } from '../utils/ThemeContext';

// Utility function to generate a truly unique ID
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

const JobsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [processedIds] = useState(new Set());

  const processJobData = (jobData) => {
    return jobData.map(job => {
      const uniqueId = generateUniqueId();
      processedIds.add(uniqueId);
      return {
        ...job,
        uniqueId
      };
    });
  };

  const loadJobs = async (pageNumber = 1, shouldRefresh = false) => {
    if (loading || (!hasMore && !shouldRefresh)) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchJobs(pageNumber);
      
      if (data && data.length > 0) {
        const processedData = processJobData(data);

        if (shouldRefresh) {
          processedIds.clear();
          setJobs(processedData);
        } else {
          setJobs(prevJobs => {
            // Ensure no duplicates based on _id
            const newJobs = processedData.filter(
              newJob => !prevJobs.some(existingJob => existingJob.id === newJob.id)
            );
            return [...prevJobs, ...newJobs];
          });
        }
        setPage(pageNumber + 1);
        setHasMore(data.length >= 10); // Assuming page size is 10
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error in loadJobs:', err);
      setError('Failed to load jobs. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    setPage(1);
    loadJobs(1, true);
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  };

  if (error && jobs.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.notification }]}>{error}</Text>
        <Text style={[styles.retryText, { color: theme.primary }]} onPress={handleRefresh}>
          Tap to retry
        </Text>
      </View>
    );
  }

  if (loading && jobs.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={jobs}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => navigation.navigate('JobDetail', { job: item })}
          />
        )}
        keyExtractor={item => item.uniqueId}
        onEndReached={() => hasMore && loadJobs(page)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
              <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
                {error ? error : 'No jobs available'}
              </Text>
              {error && (
                <Text style={[styles.retryText, { color: theme.primary }]} onPress={handleRefresh}>
                  Tap to retry
                </Text>
              )}
            </View>
          )
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
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JobsScreen; 