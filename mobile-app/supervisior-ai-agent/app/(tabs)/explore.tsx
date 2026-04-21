import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DebouncedSearchInput } from '@/components/ui/DebouncedSearchInput';
import { NoDataState } from '@/components/ui/NoDataState';
import { Pagination } from '@/components/ui/Pagination';
import { SkeletonList } from '@/components/ui/SkeletonList';
import { StatusTabs, type StatusFilter } from '@/components/ui/StatusTabs';
import { useThemeColors } from '@/context/ThemeContext';
import { ApiError } from '@/services/api';
import { getSubmissions, type Submission } from '@/services/submissions';

const PAGE_SIZE = 5;

export default function TabTwoScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await getSubmissions(1, 100);
      setItems(response.data || []);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('No data found');
      } else {
        setError('No data found');
      }
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();

    return items.filter((item) => {
      const normalizedStatus = normalizeStatus(item.status);
      const matchesStatus = statusFilter === 'all' ? true : normalizedStatus === statusFilter;
      const matchesSearch =
        keyword.length === 0
          ? true
          : item.originalName.toLowerCase().includes(keyword) ||
            item.university.toLowerCase().includes(keyword);

      return matchesStatus && matchesSearch;
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const onSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const onStatusChange = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <FlatList
      style={styles.wrap}
      contentContainerStyle={styles.content}
      data={!loading && !error ? pagedItems : []}
      keyExtractor={(item) => item.id}
      refreshing={refreshing}
      onRefresh={() => load(true)}
      ListHeaderComponent={
        <View>
          <Text style={styles.h1}>Projects</Text>
          <DebouncedSearchInput
            placeholder="Search by file or university"
            onDebouncedChange={onSearchChange}
          />
          <StatusTabs value={statusFilter} onChange={onStatusChange} />
          {loading ? <SkeletonList count={6} /> : null}
          {!loading && error ? (
            <NoDataState title="No data found" message="No data available right now." />
          ) : null}
          {!loading && !error && pagedItems.length === 0 ? (
            <NoDataState
              title="No data found"
              message="No data available for the selected filter or search keyword."
            />
          ) : null}
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity activeOpacity={0.8}>
          <Item
            colors={colors}
            name={item.originalName}
            org={item.university}
            status={item.status}
            progress={item.progress ?? 0}
          />
        </TouchableOpacity>
      )}
      ListFooterComponent={
        !loading && !error ? (
          <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        ) : null
      }
    />
  );
}

function normalizeStatus(status: Submission['status']): StatusFilter {
  if (status === 'COMPLETED') return 'completed';
  if (status === 'FAILED') return 'failed';
  if (status === 'PROCESSING' || status === 'UPLOADED') return 'pending';
  return 'all';
}

function Item({
  colors,
  name,
  org,
  status,
  progress,
}: {
  name: string;
  org: string;
  status: Submission['status'];
  progress: number;
  colors: ReturnType<typeof useThemeColors>;
}) {
  const styles = createStyles(colors);
  const statusColor =
    status === 'COMPLETED'
      ? colors.success
      : status === 'FAILED'
        ? colors.error
        : colors.warning;
  const progressWidth = Math.max(0, Math.min(100, progress || 0));

  return (
    <View style={styles.item}>
      <View style={styles.row}>
        <Text style={styles.name}>{name}</Text>
        <Text style={[styles.badge, { color: statusColor }]}>{status}</Text>
      </View>
      <Text style={styles.org}>{org}</Text>
      <View style={styles.progressBg}>
        <View
          style={[
            styles.progress,
            {
              width: `${progressWidth}%` as `${number}%`,
              backgroundColor: statusColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  h1: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 12 },
  item: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontWeight: '700', color: colors.text },
  org: { color: colors.textSecondary, marginTop: 2, marginBottom: 10 },
  badge: { fontSize: 11, fontWeight: '800' },
  progressBg: { height: 8, backgroundColor: colors.overlay, borderRadius: 999, overflow: 'hidden' },
  progress: { height: 8, borderRadius: 999 },
});
