import { StyleSheet, View } from 'react-native';

import { Stack } from 'expo-router';

import { ThemedText } from '@/components/themed-text';

export default function ClassesScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Classes' }} />
      <ThemedText type="title">Classes</ThemedText>
      <ThemedText type="default">Join live and recorded classroom sessions.</ThemedText>
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
