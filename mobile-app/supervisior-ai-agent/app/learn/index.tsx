import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Link, Stack } from 'expo-router';

import { Pagination } from '@/components/ui/Pagination';
import { DebouncedSearchInput } from '@/components/ui/DebouncedSearchInput';
import { NoDataState } from '@/components/ui/NoDataState';
import { StatusTabs, type StatusFilter } from '@/components/ui/StatusTabs';
import { SkeletonList } from '@/components/ui/SkeletonList';
import { ThemedCard } from '@/components/themed-card';
import { ThemedText } from '@/components/themed-text';
import { useThemeColors } from '@/context/ThemeContext';

type LearnItem = {
  id: string;
  title: string;
  description: string;
  status: Exclude<StatusFilter, 'all'>;
  href: '/learn/courses' | '/learn/classes';
};

const LEARN_ITEMS: LearnItem[] = [
  {
    id: 'course-1',
    title: 'Courses',
    description: 'Track structured programs and progress.',
    status: 'completed',
    href: '/learn/courses',
  },
  {
    id: 'class-1',
    title: 'Classes',
    description: 'Join live and recorded classroom sessions.',
    status: 'pending',
    href: '/learn/classes',
  },
  {
    id: 'class-2',
    title: 'Advanced Classes',
    description: 'Deep dive sessions for expert-level learning.',
    status: 'failed',
    href: '/learn/classes',
  },
  {
    id: 'course-2',
    title: 'Project Courses',
    description: 'Practical labs and project-based lessons.',
    status: 'completed',
    href: '/learn/courses',
  },
  {
    id: 'class-3',
    title: 'Weekend Classes',
    description: 'Flexible weekend learning sessions.',
    status: 'pending',
    href: '/learn/classes',
  },
  {
    id: 'course-3',
    title: 'Starter Courses',
    description: 'Foundational modules for new learners.',
    status: 'failed',
    href: '/learn/courses',
  },
];

const PAGE_SIZE = 3;

export default function LearnScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = useMemo(() => {
    const normalized = search.toLowerCase();

    return LEARN_ITEMS.filter((item) => {
      const matchesStatus = status === 'all' ? true : item.status === status;
      const matchesSearch =
        normalized.length === 0
          ? true
          : item.title.toLowerCase().includes(normalized) ||
            item.description.toLowerCase().includes(normalized);

      return matchesStatus && matchesSearch;
    });
  }, [status, search]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, currentPage]);

  const onStatusChange = (value: StatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  const onSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Learn' }} />
      <View style={styles.container}>
        <View>
          <ThemedText type="title">Learn</ThemedText>
          <ThemedText type="default">
            Build your concepts with guided learning.
          </ThemedText>
        </View>

        <DebouncedSearchInput
          placeholder="Search courses or classes"
          onDebouncedChange={onSearchChange}
        />

        <StatusTabs value={status} onChange={onStatusChange} />

        {loading ? <SkeletonList count={3} /> : null}

        {!loading && paginatedItems.length === 0 ? (
          <NoDataState
            title="No data found"
            message="No data available for the selected filter or search keyword."
          />
        ) : null}

        {!loading && paginatedItems.map((item) => (
          <Link key={item.id} href={item.href} asChild>
            <Pressable>
              <ThemedCard variant="outlined" style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          item.status === 'completed'
                            ? colors.success
                            : item.status === 'failed'
                              ? colors.error
                              : colors.warning,
                      },
                    ]}>
                    <ThemedText style={styles.statusText}>{item.status.toUpperCase()}</ThemedText>
                  </View>
                </View>
                <ThemedText type="default">{item.description}</ThemedText>
              </ThemedCard>
            </Pressable>
          </Link>
        ))}

        {!loading ? <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        /> : null}
      </View>
    </>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      gap: 12,
      backgroundColor: colors.background,
    },
    itemCard: {
      gap: 8,
    },
    itemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    statusBadge: {
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    statusText: {
      color: colors.textOnPrimary,
      fontSize: 10,
      fontWeight: '700',
    },
  });
