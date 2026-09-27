import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { tambahPengeluaran, getKategori } from '../api';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing } from '../theme';

const KATEGORI_ICONS = {
  'Makanan': 'restaurant',
  'Transport': 'directions-car',
  'Pendidikan': 'school',
};

export default function TambahPengeluaranScreen({ navigation }) {
  const [judul, setJudul] = useState('');
  const [nominal, setNominal] = useState('');
  const [kategoriList, setKategoriList] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState(null);
  const [saving, setSaving] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    loadKategori();
  }, []);

  async function loadKategori() {
    try {
      const rows = await getKategori();
      setKategoriList(rows);
      setApiConnected(true);
    } catch {
      setApiConnected(false);
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
      await tambahPengeluaran({
        judul: judul.trim(),
        nominal: nilaiNominal,
        id_kategori: selectedKategori,
      });
      Alert.alert('Berhasil', 'Pengeluaran berhasil ditambahkan.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Gagal', e.message);
    } finally {
      setSaving(false);
    }
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
        <Text style={styles.headerTitle}>Tambah Pengeluaran</Text>
        <TouchableOpacity style={styles.headerIconBtn}>
          <MaterialIcons name="info-outline" size={24} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Judul */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Judul Pengeluaran <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Makan Siang"
                placeholderTextColor={Colors.outline}
                value={judul}
                onChangeText={setJudul}
                maxLength={100}
              />
            </View>
            <Text style={styles.fieldHint}>Masukkan deskripsi singkat pengeluaran Anda.</Text>
          </View>

          {/* Nominal */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>
                Nominal (Rp) <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.apiBadge}>
                <Text style={styles.apiBadgeText}>REST API NUMBER</Text>
              </View>
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.inputPrefix}>Rp</Text>
              <TextInput
                style={[styles.input, styles.inputNominal]}
                placeholder="25000"
                placeholderTextColor={Colors.outline}
                value={nominal}
                onChangeText={(t) => setNominal(t.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                maxLength={15}
              />
            </View>
            <View style={styles.hintRow}>
              <MaterialIcons name="info-outline" size={14} color={Colors.outline} />
              <Text style={styles.fieldHint}>Hanya angka, contoh: 25000 tanpa titik/koma</Text>
            </View>
          </View>

          {/* Kategori */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Pilih Kategori</Text>
            <View style={styles.kategoriWrap}>
              <TouchableOpacity
                style={[
                  styles.kategoriChip,
                  selectedKategori === null && styles.kategoriChipActive,
                ]}
                onPress={() => setSelectedKategori(null)}
              >
                <MaterialIcons
                  name="label-off"
                  size={16}
                  color={selectedKategori === null ? Colors.primary : Colors.secondary}
                />
                <Text
                  style={[
                    styles.kategoriChipText,
                    selectedKategori === null && styles.kategoriChipTextActive,
                  ]}
                >
                  Tanpa kategori
                </Text>
              </TouchableOpacity>

              {kategoriList.map((kat) => {
                const isActive = selectedKategori === kat.id;
                const iconName = KATEGORI_ICONS[kat.nama] || 'label';
                return (
                  <TouchableOpacity
                    key={kat.id}
                    style={[styles.kategoriChip, isActive && styles.kategoriChipActive]}
                    onPress={() => setSelectedKategori(kat.id)}
                  >
                    <MaterialIcons
                      name={iconName}
                      size={16}
                      color={isActive ? Colors.primary : Colors.secondary}
                    />
                    <Text style={[styles.kategoriChipText, isActive && styles.kategoriChipTextActive]}>
                      {kat.nama}
                    </Text>
                    {isActive && (
                      <MaterialIcons name="check-circle" size={16} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <View style={styles.infoIconWrap}>
            <MaterialIcons name="access-time" size={20} color={Colors.primary} />
          </View>
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoTitle}>Tanggal otomatis dari server</Text>
            <Text style={styles.infoDesc}>
              Waktu pencatatan akan digenerate otomatis oleh backend API saat transaksi disimpan.
            </Text>
          </View>
        </View>

        {/* Buttons */}
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
              <Text style={styles.simpanBtnText}>Simpan</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelBtnText}>Batal</Text>
        </TouchableOpacity>

        {/* API Status */}
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, apiConnected ? styles.statusDotOk : styles.statusDotErr]} />
          <Text style={styles.statusLabel}>Status Sinkronisasi API</Text>
          <Text style={[styles.statusValue, apiConnected ? styles.statusValueOk : styles.statusValueErr]}>
            {apiConnected ? 'Terhubung' : 'Terputus'}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    padding: Spacing.md,
    paddingBottom: 40,
    gap: 16,
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
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  apiBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: Colors.secondaryContainer,
    borderRadius: BorderRadius.sm,
  },
  apiBadgeText: {
    fontSize: 9,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  kategoriWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  kategoriChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  kategoriChipActive: {
    backgroundColor: Colors.secondaryContainer,
    borderColor: Colors.primary,
  },
  kategoriChipText: {
    fontSize: FontSizes.labelMd,
    fontWeight: FontWeights.medium,
    color: Colors.secondary,
  },
  kategoriChipTextActive: {
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
  },
  // Info Box
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
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
  // Buttons
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
  // Status
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotOk: {
    backgroundColor: Colors.primary,
  },
  statusDotErr: {
    backgroundColor: Colors.error,
  },
  statusLabel: {
    fontSize: FontSizes.bodySm,
    color: Colors.secondary,
  },
  statusValue: {
    fontSize: FontSizes.bodySm,
    fontWeight: FontWeights.semibold,
  },
  statusValueOk: {
    color: Colors.primary,
  },
  statusValueErr: {
    color: Colors.error,
  },
});
