import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Modal, ActivityIndicator, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { hapusPengeluaran } from '../api';
import { formatRupiah, formatTanggal } from '../helpers';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing, getCategoryIcon } from '../theme';

export default function KonfirmasiHapusScreen({ route, navigation }) {
  const { id, judul, nominal, tanggal, kategori } = route.params;
  const [deleting, setDeleting] = useState(false);
  const iconName = getCategoryIcon(kategori);

  async function handleHapus() {
    try {
      setDeleting(true);
      await hapusPengeluaran(id);
      Alert.alert('Berhasil', 'Pengeluaran berhasil dihapus.', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to list
            navigation.popToTop();
          },
        },
      ]);
    } catch (e) {
      Alert.alert('Gagal', e.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <View style={styles.overlay}>
      {/* Blurred background */}
      <View style={styles.backdrop} />

      {/* Modal Card */}
      <View style={styles.modalCard}>
        {/* Icon */}
        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="delete-outline" size={32} color={Colors.error} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Hapus pengeluaran ini?</Text>

        {/* Description */}
        <Text style={styles.description}>
          Tindakan ini akan menghapus data "<Text style={styles.descBold}>{judul}</Text>" secara permanen dari server database dan tidak dapat dikembalikan.
        </Text>

        {/* Item Preview Card */}
        <View style={styles.previewCard}>
          <View style={styles.previewLeft}>
            <MaterialIcons name={iconName} size={20} color={Colors.primary} />
            <Text style={styles.previewDate}>{formatTanggal(tanggal)}</Text>
          </View>
          <Text style={styles.previewNominal}>- Rp {formatRupiah(nominal)}</Text>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.hapusBtn, deleting && styles.hapusBtnDisabled]}
          activeOpacity={0.8}
          onPress={handleHapus}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator color={Colors.onError} />
          ) : (
            <>
              <MaterialIcons name="delete" size={18} color={Colors.onError} />
              <Text style={styles.hapusBtnText}>Hapus</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.batalBtn}
          onPress={() => navigation.goBack()}
          disabled={deleting}
        >
          <Text style={styles.batalBtnText}>Batal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: '85%',
    maxWidth: 340,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl + 4,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  iconWrap: {
    marginTop: -8,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSizes.headlineMd,
    fontWeight: FontWeights.bold,
    color: Colors.darkText,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSizes.bodyMd,
    color: Colors.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  descBold: {
    fontWeight: FontWeights.bold,
    color: Colors.onSurface,
  },
  previewCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  previewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewDate: {
    fontSize: FontSizes.bodyMd,
    color: Colors.onSurface,
    fontWeight: FontWeights.medium,
  },
  previewNominal: {
    fontSize: FontSizes.bodyMd,
    fontWeight: FontWeights.bold,
    color: Colors.error,
  },
  hapusBtn: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  hapusBtnDisabled: {
    opacity: 0.6,
  },
  hapusBtnText: {
    color: Colors.onError,
    fontSize: FontSizes.labelLg,
    fontWeight: FontWeights.bold,
  },
  batalBtn: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  batalBtnText: {
    fontSize: FontSizes.bodyMd,
    fontWeight: FontWeights.medium,
    color: Colors.onSurface,
  },
});
