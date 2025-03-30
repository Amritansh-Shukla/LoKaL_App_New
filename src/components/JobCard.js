import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isJobBookmarked, toggleBookmark } from '../utils/storage';
import { useTheme } from '../utils/ThemeContext';

const { width } = Dimensions.get('window');

const JobCard = ({ job, onPress }) => {
  const { theme } = useTheme();
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    checkBookmarkStatus();
  }, []);

  const checkBookmarkStatus = async () => {
    const status = await isJobBookmarked(job.id);
    setBookmarked(status);
  };

  const handleBookmarkPress = async () => {
    const newStatus = await toggleBookmark(job);
    setBookmarked(newStatus);
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.card }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>{job.title}</Text>
          <TouchableOpacity 
            style={styles.bookmarkButton} 
            onPress={handleBookmarkPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name={bookmarked ? 'bookmark' : 'bookmark-outline'} 
              size={24} 
              color={theme.primary} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color={theme.secondaryText} />
              <Text style={[styles.detailText, { color: theme.secondaryText }]} numberOfLines={1}>
                {job.location}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={16} color={theme.secondaryText} />
              <Text style={[styles.detailText, { color: theme.secondaryText }]} numberOfLines={1}>
                {job.salary}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="call-outline" size={16} color={theme.secondaryText} />
              <Text style={[styles.detailText, { color: theme.secondaryText }]} numberOfLines={1}>
                {job.phone}
              </Text>
            </View>
            {job.company && (
              <View style={styles.detailItem}>
                <Ionicons name="business-outline" size={16} color={theme.secondaryText} />
                <Text style={[styles.detailText, { color: theme.secondaryText }]} numberOfLines={1}>
                  {job.company}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: width - 32, // Full width minus margins
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 6,
    flex: 1,
  },
  bookmarkButton: {
    padding: 4,
  },
});

export default JobCard; 