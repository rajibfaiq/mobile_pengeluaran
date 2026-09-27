import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getPengeluaranById, ubahPengeluaran } from '../api';
import { formatTanggalPanjang } from '../helpers';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing } from '../theme';

export default function UbahPengeluaranScreen({ route, navigation }) {
  const { id } = route.params;
  const [judul, setJudul] = useState('');
  const [nominal, setNominal] = useState('');
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDetail();
  }, []);

  async function loadDetail() {
    try {
      setLoading(true);
      const data = await getPengeluaranById(id);
      setDetail(data);
      setJudul(data.judul || '');
      setNominal(String(data.nominal || ''));
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSimpan() {
    if (!judul.trim()) {
      Alert.alert('Validasi', 'Judul pengeluaran wajib diisi.');
      return;
    }
    const nilaiNominal = parseInt(nominal, 10);
    if (!nilaiNominal || nilaiNominal <= 0) {
      Alert.alert('Validasi', 'Nominal harus berupa angka lebih dari 0.');
      return;
    }

    try {
      setSaving(true);
      await ubahPengeluaran(id, { judul: judul.trim(), nominal: nilaiNominal });
      Alert.alert('Berhasil', 'Pengeluaran berhasil diubah.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Gagal', e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ubah Pengeluaran</Text>
        <View style={styles.idBadge}>
          <Text style={styles.idBadgeText}>ID: #EXP-{id}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* REST API Info */}
        <View style={styles.infoBox}>
          <MaterialIcons name="info-outline" size={20} color={Colors.primary} />
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoTitle}>REST API Validasi</Text>
            <Text style={styles.infoDesc}>
              Hanya judul dan nominal mentah yang diizinkan untuk diedit pada entitas transaksi ini.
            </Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Judul */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>
                Judul Pengeluaran <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.fieldHintRight}>Dapat diedit</Text>
            </View>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={judul}
                onChangeText={setJudul}
                maxLength={100}
              />
              <MaterialIcons name="edit" size={18} color={Colors.primary} />
            </View>
          </View>

          {/* Nominal */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>
                Nominal (Rp) <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.fieldHintRight}>Raw format per API</Text>
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.inputPrefix}>Rp</Text>
              <TextInput
                style={[styles.input, styles.inputNominal]}
                value={nominal}
                onChangeText={(t) => setNominal(t.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                maxLength={15}
              />
            </View>
            <Text style={styles.fieldHint}>
              Nilai numerik mentah tanpa separator titik/koma sesuai spesifikasi server.
            </Text>
          </View>

          {/* Read-only fields */}
          <View style={styles.fieldGroup}>
            <Text style={styles.sectionLabel}>PARAMETER TERKUNCI (SISTEM)</Text>

            {/* Kategori */}
            <Text style={styles.lockedLabel}>Kategori</Text>
            <View style={styles.lockedWrap}>
              <Text style={styles.lockedValue}>
                {detail?.kategori
                  ? `${detail.kategori} (CAT-${String(detail.id_kategori).padStart(3, '0')}) – Terkunci oleh sistem`
                  : 'Tanpa kategori – Terkunci'
                }
              </Text>
              <MaterialIcons name="lock" size={16} color={Colors.outline} />
            </View>
            <View style={styles.lockedHintRow}>
              <MaterialIcons name="info-outline" size={14} color={Colors.outline} />
              <Text style={styles.fieldHint}>Kategori tidak dapat diubah setelah dibuat</Text>
            </View>

            {/* Tanggal */}
            <Text style={[styles.lockedLabel, { marginTop: 16 }]}>Tanggal Transaksi</Text>
            <View style={styles.lockedWrap}>
              <Text style={styles.lockedValue}>
                {formatTanggalPanjang(detail?.tanggal)} (Otomatis Server)
              </Text>
              <MaterialIcons name="lock" size={16} color={Colors.outline} />
            </View>

            {/* Catatan */}
            <Text style={[styles.lockedLabel, { marginTop: 16 }]}>Catatan</Text>
            <View style={styles.lockedWrap}>
              <Text style={styles.lockedValueItalic}>Belum ada catatan</Text>
              <MaterialIcons name="lock" size={16} color={Colors.outline} />
            </View>
          </View>
        </View>

        {/* Version Info */}
        <View style={styles.versionRow}>
          <View style={styles.versionLeft}>
            <MaterialIcons name="info-outline" size={16} color={Colors.outline} />
            <Text style={styles.versionText}>Versi Entitas v1.4</Text>
          </View>
          <Text style={styles.versionSync}>Sync Status: Aktif</Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.simpanBtn, saving && styles.simpanBtnDisabled]}
          activeOpacity={0.8}
          onPress={handleSimpan}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={Colors.onPrimary} />
          ) : (
            <>
              <MaterialIcons name="save" size={20} color={Colors.onPrimary} />
              <Text style={styles.simpanBtnText}>Simpan Perubahan</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtnText}>Batal</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  idBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: Colors.secondaryContainer,
    borderRadius: BorderRadius.sm,
  },
  idBadgeText: {
    fontSize: 10,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
    letterSpacing: 0.3,
  },
  scroll: {
    padding: Spacing.md,
    paddingBottom: 40,
    gap: 16,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  infoTextWrap: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    fontSize: FontSizes.labelLg,
    fontWeight: FontWeights.semibold,
    color: Colors.onSurface,
  },
  infoDesc: {
    fontSize: FontSizes.bodySm,
    color: Colors.secondary,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    gap: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: FontSizes.labelLg,
    fontWeight: FontWeights.semibold,
    color: Colors.onSurface,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldHintRight: {
    fontSize: FontSizes.bodySm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  required: {
    color: Colors.error,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.bodyLg,
    color: Colors.onSurface,
    paddingVertical: 0,
  },
  inputPrefix: {
    fontSize: FontSizes.bodyLg,
    fontWeight: FontWeights.semibold,
    color: Colors.secondary,
    marginRight: 8,
  },
  inputNominal: {
    fontWeight: FontWeights.semibold,
  },
  fieldHint: {
    fontSize: FontSizes.bodySm,
    color: Colors.outline,
  },
  sectionLabel: {
    fontSize: FontSizes.labelSm,
    fontWeight: FontWeights.bold,
    color: Colors.secondary,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  lockedLabel: {
    fontSize: FontSizes.labelMd,
    fontWeight: FontWeights.medium,
    color: Colors.secondary,
  },
  lockedWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    paddingHorizontal: Spacing.md,
    height: 48,
    marginTop: 4,
  },
  lockedValue: {
    flex: 1,
    fontSize: FontSizes.bodyMd,
    color: Colors.outline,
  },
  lockedValueItalic: {
    flex: 1,
    fontSize: FontSizes.bodyMd,
    color: Colors.outline,
    fontStyle: 'italic',
  },
  lockedHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  versionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  versionText: {
    fontSize: FontSizes.bodySm,
    color: Colors.outline,
  },
  versionSync: {
    fontSize: FontSizes.bodySm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  simpanBtn: {
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
  simpanBtnDisabled: {
    opacity: 0.6,
  },
  simpanBtnText: {
    color: Colors.onPrimary,
    fontSize: FontSizes.labelLg,
    fontWeight: FontWeights.bold,
  },
  cancelBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: FontSizes.bodyMd,
    fontWeight: FontWeights.medium,
    color: Colors.onSurface,
  },
});
