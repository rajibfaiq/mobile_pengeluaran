// Format angka menjadi format Rupiah: 28000 => "28.000"
export function formatRupiah(angka) {
  if (angka == null) return '0';
  return Number(angka)
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Format tanggal ISO ke tampilan Indonesia
// "2023-10-24T12:30:00" => "24 Okt 2023, 12:30"
export function formatTanggal(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  const bulan = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ];
  const tgl = d.getDate();
  const bln = bulan[d.getMonth()];
  const thn = d.getFullYear();
  const jam = String(d.getHours()).padStart(2, '0');
  const mnt = String(d.getMinutes()).padStart(2, '0');
  return `${tgl} ${bln} ${thn}, ${jam}:${mnt}`;
}

// Format tanggal panjang
// "2023-10-24T12:30:00" => "24 Oktober 2023, 12:30 WIB"
export function formatTanggalPanjang(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const tgl = d.getDate();
  const bln = bulan[d.getMonth()];
  const thn = d.getFullYear();
  const jam = String(d.getHours()).padStart(2, '0');
  const mnt = String(d.getMinutes()).padStart(2, '0');
  return `${tgl} ${bln} ${thn}, ${jam}:${mnt} WIB`;
}
