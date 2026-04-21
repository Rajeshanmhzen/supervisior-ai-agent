import { StyleSheet, View } from 'react-native';

import { Stack } from 'expo-router';

import { ThemedText } from '@/components/themed-text';

export default function CoursesScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Courses' }} />
      <ThemedText type="title">Courses</ThemedText>
      <ThemedText type="default">Track structured programs and progress.</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 8,
  },
});
