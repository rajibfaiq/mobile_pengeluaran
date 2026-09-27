import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { getSemuaPengeluaran } from '../api';
import { formatRupiah, formatTanggal } from '../helpers';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing, getCategoryIcon } from '../theme';

export default function DaftarPengeluaranScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const muat = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      setError(null);
      const rows = await getSemuaPengeluaran();
      setData(rows);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { muat(); }, [muat]));

  const totalBulanIni = data.reduce((sum, item) => sum + Number(item.nominal || 0), 0);
  const bulanSekarang = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  function renderItem({ item }) {
    const iconName = getCategoryIcon(item.kategori);
    const hasKategori = !!item.kategori;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Detail', { id: item.id })}
      >
        {/* Top Row */}
        <View style={styles.cardRow}>
          <View style={styles.cardLeft}>
            <View style={[styles.iconCircle, !hasKategori && styles.iconCircleNone]}>
              <MaterialIcons
                name={iconName}
                size={20}
                color={hasKategori ? Colors.primary : Colors.secondary}
              />
            </View>
            <View style={styles.cardTextWrap}>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.judul}</Text>
              <Text style={styles.cardDate}>{formatTanggal(item.tanggal)}</Text>
            </View>
          </View>
          <Text style={styles.cardNominal}>- Rp {formatRupiah(item.nominal)}</Text>
        </View>
        {/* Bottom Row */}
        <View style={styles.cardBottom}>
          <View style={[styles.badge, !hasKategori && styles.badgeNone]}>
            <Text style={[styles.badgeText, !hasKategori && styles.badgeTextNone]}>
              {item.kategori || 'Tanpa kategori'}
            </Text>
          </View>
          <View style={styles.detailBtn}>
            <Text style={styles.detailBtnText}>Lihat detail</Text>
            <MaterialIcons name="chevron-right" size={16} color={Colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surfaceContainerLowest} />

      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="account-balance-wallet" size={24} color={Colors.primary} />
          <Text style={styles.headerTitle}>Catatan Pengeluaran</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn}>
          <MaterialIcons name="notifications" size={24} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <MaterialIcons name="cloud-off" size={48} color={Colors.outline} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => muat()}>
            <Text style={styles.retryBtnText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => muat(true)}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          ListHeaderComponent={
            <View>
              {/* Summary Card */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryTop}>
                  <Text style={styles.summaryLabel}>Total Pengeluaran Bulan Ini</Text>
                  <View style={styles.monthBadge}>
                    <Text style={styles.monthBadgeText}>{bulanSekarang}</Text>
                  </View>
                </View>
                <Text style={styles.summaryAmount}>Rp {formatRupiah(totalBulanIni)}</Text>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryBottom}>
                  <MaterialIcons name="trending-up" size={18} color={Colors.tertiaryContainer} />
                  <Text style={styles.summaryHint}>
                    <Text style={styles.summaryHintBold}>{data.length}</Text> transaksi tercatat
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.addBtn}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('Tambah')}
                >
                  <MaterialIcons name="add" size={20} color={Colors.onPrimary} />
                  <Text style={styles.addBtnText}>Tambah</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.reloadBtn}
                  activeOpacity={0.8}
                  onPress={() => muat(true)}
                >
                  <MaterialIcons name="refresh" size={20} color={Colors.secondary} />
                  <Text style={styles.reloadBtnText}>Muat ulang</Text>
                </TouchableOpacity>
              </View>

              {/* Section Title */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Daftar Pengeluaran</Text>
                <Text style={styles.sectionCount}>{data.length} Transaksi</Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <MaterialIcons name="receipt-long" size={48} color={Colors.outlineVariant} />
              <Text style={styles.emptyText}>Belum ada pengeluaran.</Text>
              <Text style={styles.emptySubtext}>Tekan "Tambah" untuk mencatat pengeluaran pertama.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: FontSizes.headlineSm,
    fontWeight: FontWeights.bold,
    color: Colors.onSurface,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Loading / Error
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: 12,
  },
  loadingText: {
    fontSize: FontSizes.bodyMd,
    color: Colors.secondary,
    marginTop: 8,
  },
  errorText: {
    fontSize: FontSizes.bodyMd,
    color: Colors.error,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: Colors.primaryContainer,
    borderRadius: BorderRadius.lg,
  },
  retryBtnText: {
    color: Colors.onPrimary,
    fontWeight: FontWeights.semibold,
    fontSize: FontSizes.labelLg,
  },
  // List
  listContent: {
    padding: Spacing.md,
    paddingBottom: 80,
    gap: 12,
  },
  // Summary Card
  summaryCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: FontSizes.labelMd,
    fontWeight: FontWeights.medium,
    color: Colors.secondary,
  },
  monthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondaryContainer,
  },
  monthBadgeText: {
    fontSize: FontSizes.labelSm,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
  summaryAmount: {
    fontSize: FontSizes.displayCurrency,
    fontWeight: FontWeights.bold,
    color: Colors.darkText,
    letterSpacing: -0.5,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.outlineVariant,
  },
  summaryBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryHint: {
    fontSize: FontSizes.bodySm,
    color: Colors.secondary,
  },
  summaryHintBold: {
    fontWeight: FontWeights.semibold,
    color: Colors.onSurface,
  },
  // Action Buttons
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: Spacing.md,
  },
  addBtn: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.primaryContainer,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  addBtnText: {
    color: Colors.onPrimary,
    fontSize: FontSizes.labelLg,
    fontWeight: FontWeights.semibold,
  },
  reloadBtn: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  reloadBtnText: {
    color: Colors.darkText,
    fontSize: FontSizes.labelLg,
    fontWeight: FontWeights.semibold,
  },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: FontSizes.headlineSm,
    fontWeight: FontWeights.semibold,
    color: Colors.darkText,
  },
  sectionCount: {
    fontSize: FontSizes.labelMd,
    fontWeight: FontWeights.medium,
    color: Colors.secondary,
  },
  // Expense Card
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleNone: {
    backgroundColor: Colors.surfaceContainer,
  },
  cardTextWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FontSizes.bodyLg,
    fontWeight: FontWeights.semibold,
    color: Colors.darkText,
    lineHeight: 22,
  },
  cardDate: {
    fontSize: FontSizes.bodySm,
    color: Colors.secondary,
    marginTop: 2,
  },
  cardNominal: {
    fontSize: FontSizes.headlineSm,
    fontWeight: FontWeights.semibold,
    color: Colors.tertiaryContainer,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.separator,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondaryContainer,
  },
  badgeNone: {
    backgroundColor: Colors.surfaceContainer,
  },
  badgeText: {
    fontSize: FontSizes.labelSm,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
    letterSpacing: 0.4,
  },
  badgeTextNone: {
    color: Colors.secondary,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailBtnText: {
    fontSize: FontSizes.labelMd,
    fontWeight: FontWeights.medium,
    color: Colors.primary,
  },
  // Empty
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: FontSizes.bodyLg,
    fontWeight: FontWeights.semibold,
    color: Colors.onSurfaceVariant,
  },
  emptySubtext: {
    fontSize: FontSizes.bodySm,
    color: Colors.secondary,
    textAlign: 'center',
  },
});
