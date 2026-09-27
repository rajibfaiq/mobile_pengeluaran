const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.251.172.86:3000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.pesan || `HTTP ${res.status}`);
    }

    // 204 No Content (for DELETE)
    if (res.status === 204) return null;
    return res.json();
  } catch (err) {
    if (err.message === 'Network request failed') {
      throw new Error('Tidak dapat terhubung ke server. Pastikan API berjalan.');
    }
    throw err;
  }
}

// ====== PENGELUARAN ======

export function getSemuaPengeluaran() {
  return request('/pengeluaran');
}

export function getPengeluaranById(id) {
  return request(`/pengeluaran/${id}`);
}

export function tambahPengeluaran({ judul, nominal, id_kategori }) {
  return request('/pengeluaran', {
    method: 'POST',
    body: JSON.stringify({ judul, nominal: Number(nominal), id_kategori }),
  });
}

export function ubahPengeluaran(id, { judul, nominal }) {
  return request(`/pengeluaran/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ judul, nominal: Number(nominal) }),
  });
}

export function hapusPengeluaran(id) {
  return request(`/pengeluaran/${id}`, { method: 'DELETE' });
}

// ====== KATEGORI ======

export function getKategori() {
  return request('/kategori');
}
