import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert, Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { getPengeluaranById } from '../api';
import { formatRupiah, formatTanggalPanjang } from '../helpers';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing, getCategoryIcon } from '../theme';

export default function DetailPengeluaranScreen({ route, navigation }) {
  const { id } = route.params;
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDetail = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPengeluaranById(id);
      setDetail(data);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadDetail();
    }, [loadDetail])
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={[styles.container, styles.center]}>
        <MaterialIcons name="error-outline" size={48} color={Colors.outline} />
        <Text style={styles.errorText}>Data tidak ditemukan</Text>
      </View>
    );
  }

  const iconName = getCategoryIcon(detail.kategori);
  const hasKategori = !!detail.kategori;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Pengeluaran</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Main Detail Card */}
        <View style={styles.detailCard}>
          {/* Type Badge */}
          <View style={styles.typeBadgeRow}>
            <View style={styles.typeBadge}>
              <View style={styles.typeBadgeDot} />
              <Text style={styles.typeBadgeText}>PENGELUARAN PRIBADI</Text>
            </View>
          </View>

          {/* Icon + Title */}
          <View style={styles.titleRow}>
            <Text style={styles.detailTitle}>{detail.judul}</Text>
            <View style={[styles.iconCircleLg, !hasKategori && styles.iconCircleLgNone]}>
              <MaterialIcons
                name={iconName}
                size={24}
                color={hasKategori ? Colors.primary : Colors.secondary}
              />
            </View>
          </View>

          {/* Nominal */}
          <View style={styles.nominalRow}>
            <Text style={styles.nominalText}>Rp {formatRupiah(detail.nominal)}</Text>
            <Text style={styles.nominalMethod}>(Debit Kas)</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Tanggal */}
          <View style={styles.infoGroup}>
            <Text style={styles.infoLabel}>Tanggal Transaksi</Text>
            <View style={styles.infoValueRow}>
              <MaterialIcons name="event" size={16} color={Colors.secondary} />
              <Text style={styles.infoValue}>{formatTanggalPanjang(detail.tanggal)}</Text>
            </View>
          </View>

          {/* Kategori */}
          <View style={styles.infoGroup}>
            <Text style={styles.infoLabel}>Kategori & Kode</Text>
            <View style={styles.kategoriBadge}>
              <MaterialIcons name="sell" size={14} color={Colors.onPrimary} />
              <Text style={styles.kategoriBadgeText}>
                {detail.kategori
                  ? `CAT-${String(detail.id_kategori).padStart(3, '0')} • ${detail.kategori}`
                  : 'Tanpa kategori'
                }
              </Text>
            </View>
          </View>

          {/* ID Transaksi */}
          <View style={styles.infoGroup}>
            <Text style={styles.infoLabel}>ID Transaksi (REST API)</Text>
            <View style={styles.idRow}>
              <View style={styles.idWrap}>
                <Text style={styles.idText}>#EXP-{detail.id}</Text>
              </View>
              <TouchableOpacity style={styles.copyBtn}>
                <MaterialIcons name="content-copy" size={16} color={Colors.outline} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Catatan */}
          <View style={styles.infoGroup}>
            <Text style={styles.infoLabel}>Catatan</Text>
            <View style={styles.catatanWrap}>
              <MaterialIcons name="format-quote" size={16} color={Colors.outline} />
              <Text style={styles.catatanText}>Belum ada catatan</Text>
            </View>
          </View>
        </View>

        {/* Sync Status */}
        <View style={styles.syncBox}>
          <MaterialIcons name="sync" size={20} color={Colors.primary} />
          <View style={styles.syncTextWrap}>
            <Text style={styles.syncTitle}>Tervalidasi Sinkronisasi</Text>
            <Text style={styles.syncDesc}>Status: Sukses di Server Cloud</Text>
          </View>
          <MaterialIcons name="check-circle" size={20} color={Colors.primary} />
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.editBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Ubah', { id: detail.id })}
        >
          <MaterialIcons name="edit" size={20} color={Colors.onPrimary} />
          <Text style={styles.editBtnText}>Ubah</Text>
        </TouchableOpacity>

        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.deleteBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('KonfirmasiHapus', {
              id: detail.id,
              judul: detail.judul,
              nominal: detail.nominal,
              tanggal: detail.tanggal,
              kategori: detail.kategori,
            })}
          >
            <MaterialIcons name="delete" size={18} color={Colors.onError} />
            <Text style={styles.deleteBtnText}>Hapus</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backBtnBottom}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="close" size={18} color={Colors.onSurface} />
            <Text style={styles.backBtnBottomText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: FontSizes.bodyMd,
    color: Colors.error,
    marginTop: 8,
  },
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.headlineSm,
    fontWeight: FontWeights.bold,
    color: Colors.onSurface,
  },
  scroll: {
    padding: Spacing.md,
    paddingBottom: 40,
    gap: 16,
  },
  // Detail Card
  detailCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  typeBadgeRow: {
    flexDirection: 'row',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: Colors.secondaryContainer,
    borderRadius: BorderRadius.full,
  },
  typeBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  typeBadgeText: {
    fontSize: FontSizes.labelSm,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailTitle: {
    flex: 1,
    fontSize: FontSizes.headlineLg,
    fontWeight: FontWeights.bold,
    color: Colors.darkText,
    letterSpacing: -0.3,
  },
  iconCircleLg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  iconCircleLgNone: {
    backgroundColor: Colors.surfaceContainer,
  },
  nominalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  nominalText: {
    fontSize: FontSizes.headlineLg,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },
  nominalMethod: {
    fontSize: FontSizes.bodySm,
    color: Colors.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.outlineVariant,
  },
  infoGroup: {
    gap: 6,
  },
  infoLabel: {
    fontSize: FontSizes.labelMd,
    fontWeight: FontWeights.medium,
    color: Colors.secondary,
  },
  infoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoValue: {
    fontSize: FontSizes.bodyMd,
    fontWeight: FontWeights.medium,
    color: Colors.onSurface,
  },
  kategoriBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryContainer,
  },
  kategoriBadgeText: {
    fontSize: FontSizes.labelMd,
    fontWeight: FontWeights.semibold,
    color: Colors.onPrimary,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  idWrap: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  idText: {
    fontSize: FontSizes.bodyMd,
    fontWeight: FontWeights.semibold,
    color: Colors.onSurface,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copyBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  catatanWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  catatanText: {
    flex: 1,
    fontSize: FontSizes.bodyMd,
    color: Colors.outline,
    fontStyle: 'italic',
  },
  // Sync
  syncBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  syncTextWrap: {
    flex: 1,
  },
  syncTitle: {
    fontSize: FontSizes.labelLg,
    fontWeight: FontWeights.semibold,
    color: Colors.onSurface,
  },
  syncDesc: {
    fontSize: FontSizes.bodySm,
    color: Colors.secondary,
  },
  // Actions
  editBtn: {
    height: 52,
    backgroundColor: Colors.primaryContainer,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editBtnText: {
    color: Colors.onPrimary,
    fontSize: FontSizes.labelLg,
    fontWeight: FontWeights.bold,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteBtn: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  deleteBtnText: {
    color: Colors.onError,
    fontSize: FontSizes.labelLg,
    fontWeight: FontWeights.semibold,
  },
  backBtnBottom: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  backBtnBottomText: {
    fontSize: FontSizes.labelLg,
    fontWeight: FontWeights.semibold,
    color: Colors.onSurface,
  },
});
