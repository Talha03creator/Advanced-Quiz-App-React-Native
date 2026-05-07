import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import GoldButton from '../components/GoldButton';

const ResultScreen = ({ route, navigation }) => {
  const { score, total, topic, history } = route.params;
  const percentage = Math.round((score / total) * 100);

  const renderReviewItem = ({ item, index }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.qIndex}>Q{index + 1}</Text>
        <View style={[styles.badge, item.isCorrect ? styles.correctBadge : styles.incorrectBadge]}>
          <Text style={styles.badgeText}>{item.isCorrect ? 'Correct' : 'Incorrect'}</Text>
        </View>
      </View>
      <Text style={styles.qText}>{item.question}</Text>
      <View style={styles.ansRow}>
        <Text style={styles.ansLabel}>Your Answer:</Text>
        <Text style={[styles.ansValue, item.isCorrect ? styles.correctText : styles.incorrectText]}> {item.selected}</Text>
      </View>
      {!item.isCorrect && (
        <View style={styles.ansRow}>
          <Text style={styles.ansLabel}>Correct:</Text>
          <Text style={[styles.ansValue, styles.correctText]}> {item.correct}</Text>
        </View>
      )}
      <Text style={styles.explanation}>{item.explanation}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scoreBoard}>
        <Text style={styles.topicLabel}>{topic} COMPLETED</Text>
        <View style={styles.scoreCircle}>
          <Text style={styles.percentText}>{percentage}%</Text>
          <Text style={styles.scoreText}>{score}/{total}</Text>
        </View>
        <Text style={styles.statusMsg}>{percentage >= 80 ? 'EXPERT PERFORMANCE' : 'GOOD EFFORT'}</Text>
      </View>

      <View style={styles.reviewHeaderSection}>
        <Text style={styles.reviewTitle}>Performance Review</Text>
      </View>

      <FlatList
        data={history}
        renderItem={renderReviewItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <GoldButton 
          title="Return to Mastery" 
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })} 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scoreBoard: { alignItems: 'center', padding: 40, backgroundColor: COLORS.surface, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  topicLabel: { color: COLORS.primary, fontSize: 14, fontWeight: '900', letterSpacing: 4, marginBottom: 20 },
  scoreCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 6, borderColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(212, 175, 55, 0.05)' },
  percentText: { color: COLORS.white, fontSize: 36, fontWeight: '900' },
  scoreText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' },
  statusMsg: { color: COLORS.white, marginTop: 20, fontSize: 18, fontWeight: '700', letterSpacing: 1 },
  reviewHeaderSection: { padding: 24, paddingTop: 30 },
  reviewTitle: { color: COLORS.white, fontSize: 22, fontWeight: '800' },
  listContainer: { padding: 24, paddingTop: 0 },
  reviewCard: { backgroundColor: COLORS.surface, padding: 20, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: '#222' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  qIndex: { color: COLORS.primary, fontWeight: '900' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  correctBadge: { backgroundColor: 'rgba(46, 204, 113, 0.2)' },
  incorrectBadge: { backgroundColor: 'rgba(231, 76, 60, 0.2)' },
  badgeText: { fontSize: 11, fontWeight: '700', color: COLORS.white },
  qText: { color: COLORS.white, fontSize: 16, fontWeight: '600', marginBottom: 12 },
  ansRow: { flexDirection: 'row', marginBottom: 4 },
  ansLabel: { color: COLORS.textSecondary, fontSize: 14 },
  ansValue: { fontSize: 14, fontWeight: '700' },
  correctText: { color: COLORS.correct },
  incorrectText: { color: COLORS.incorrect },
  explanation: { color: COLORS.textSecondary, fontSize: 13, fontStyle: 'italic', marginTop: 10, lineHeight: 18 },
  footer: { padding: 24, backgroundColor: COLORS.background },
});

export default ResultScreen;
