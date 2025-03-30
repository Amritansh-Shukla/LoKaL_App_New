import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  Dimensions,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isJobBookmarked, toggleBookmark } from '../utils/storage';
import { useTheme } from '../utils/ThemeContext';

const { width } = Dimensions.get('window');

const DetailItem = ({ icon, title, content, onPress, style, textStyle }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.detailItem, style]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={24} color={theme.primary} />
      </View>
      <View style={styles.detailContent}>
        <Text style={[styles.detailTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[
          styles.detailText, 
          onPress && styles.clickableText, 
          textStyle,
          { color: theme.secondaryText }
        ]}>
          {content}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const Section = ({ title, children, style }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.section, style]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      {children}
    </View>
  );
};

const Tag = ({ text, bgColor, textColor }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.tag, { backgroundColor: bgColor || theme.card }]}>
      <Text style={[styles.tagText, { color: textColor || theme.primary }]}>{text}</Text>
    </View>
  );
};

const JobDetailScreen = ({ route }) => {
  const { theme } = useTheme();
  const { job } = route.params;
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

  const handlePhonePress = () => {
    if (job.phone) {
      Linking.openURL(`tel:${job.phone}`);
    }
  };

  const handleWhatsAppPress = () => {
    if (job.companyDetails?.whatsappLink) {
      Linking.openURL(job.companyDetails.whatsappLink);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} bounces={false}>
      {job.media?.images?.length > 0 && (
        <Image
          source={{ uri: job.media.images[0].url }}
          style={styles.headerImage}
          resizeMode="cover"
        />
      )}

      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.text }]}>{job.title}</Text>
          <TouchableOpacity 
            style={styles.bookmarkButton} 
            onPress={handleBookmarkPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name={bookmarked ? 'bookmark' : 'bookmark-outline'} 
              size={28} 
              color={theme.primary} 
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.company, { color: theme.secondaryText }]}>{job.company}</Text>
        {job.additionalInfo?.isPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={[styles.premiumText, { color: theme.text }]}>Premium Job</Text>
          </View>
        )}

        {job.additionalInfo?.tags?.length > 0 && (
          <View style={styles.tagsContainer}>
            {job.additionalInfo.tags.map((tag, index) => (
              <Tag 
                key={index}
                text={tag.value}
                bgColor={tag.bgColor}
                textColor={tag.textColor}
              />
            ))}
          </View>
        )}
      </View>

      <View style={[styles.content, { backgroundColor: theme.background }]}>
        <Section title="Key Details">
          <DetailItem
            icon="location"
            title="Location"
            content={job.location}
          />
          <DetailItem
            icon="cash"
            title="Salary"
            content={job.salary}
          />
          <DetailItem
            icon="briefcase"
            title="Job Type"
            content={job.jobType}
          />
          <DetailItem
            icon="time"
            title="Experience"
            content={job.experience}
          />
          <DetailItem
            icon="school"
            title="Qualification"
            content={job.requirements}
          />
          <DetailItem
            icon="people"
            title="Openings"
            content={`${job.openings} positions`}
          />
          {job.fees && (
            <DetailItem
              icon="card"
              title="Fees"
              content={job.fees}
            />
          )}
        </Section>

        <Section title="Contact Information">
          {job.phone && (
            <DetailItem
              icon="call"
              title="Phone"
              content={job.companyDetails?.buttonText || `Call: ${job.phone}`}
              onPress={handlePhonePress}
              style={styles.callButton}
            />
          )}
          {job.companyDetails?.whatsappLink && (
            <DetailItem
              icon="logo-whatsapp"
              title="WhatsApp"
              content="Chat on WhatsApp"
              onPress={handleWhatsAppPress}
              style={styles.whatsappButton}
              textStyle={styles.whatsappText}
            />
          )}
          {job.companyDetails?.callStartTime && (
            <DetailItem
              icon="time"
              title="Preferred Call Time"
              content={`${job.companyDetails.callStartTime} - ${job.companyDetails.callEndTime}`}
            />
          )}
        </Section>

        {job.description && (
          <Section title="Job Description">
            <Text style={[styles.descriptionText, { color: theme.text }]}>{job.description}</Text>
          </Section>
        )}

        {Object.keys(job.additionalInfo?.contentV3 || {}).length > 0 && (
          <Section title="Additional Information">
            {Object.entries(job.additionalInfo.contentV3).map(([key, info], index) => (
              <DetailItem
                key={index}
                icon="information-circle"
                title={info.name}
                content={info.value}
              />
            ))}
          </Section>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={20} color={theme.secondaryText} />
            <Text style={[styles.statText, { color: theme.secondaryText }]}>{job.additionalInfo?.views || 0} views</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="share-outline" size={20} color={theme.secondaryText} />
            <Text style={[styles.statText, { color: theme.secondaryText }]}>
              {(job.additionalInfo?.shares || 0) + (job.additionalInfo?.fbShares || 0)} shares
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="document-text-outline" size={20} color={theme.secondaryText} />
            <Text style={[styles.statText, { color: theme.secondaryText }]}>{job.additionalInfo?.applications || 0} applications</Text>
          </View>
        </View>

        <View style={styles.dateInfo}>
          <Text style={[styles.dateText, { color: theme.secondaryText }]}>Posted: {new Date(job.createdOn).toLocaleDateString()}</Text>
          <Text style={[styles.dateText, { color: theme.secondaryText }]}>
            Expires: {new Date(job.expiresOn).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: width,
    height: width * 0.6,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  company: {
    fontSize: 16,
    marginBottom: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailIcon: {
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
  },
  clickableText: {
    textDecorationLine: 'underline',
  },
  callButton: {
    backgroundColor: '#F0F8FF',
    padding: 12,
    borderRadius: 8,
  },
  whatsappButton: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
  },
  whatsappText: {
    color: '#25D366',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    marginLeft: 4,
  },
  dateInfo: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  dateText: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default JobDetailScreen; 