# Ekstensi Chrome Print Obat

## Ringkasan

**Print Obat** adalah ekstensi Chrome yang dirancang untuk mencetak label identitas pasien dan informasi obat ke stiker label. Fungsionalitas ini berdasarkan registrasi dalam sistem j-care.

(Deskripsi asli: Cetak label identitas pasien dan obat untuk diprint di stiker etiket identitas berdasarkan registrasi j-care)

## Konfigurasi

Ekstensi ini memerlukan konfigurasi manual untuk URL Target j-care dan Nama Puskesmas. Pengaturan ini dapat diakses melalui popup ekstensi atau dengan mengklik kanan ikon ekstensi dan memilih "Opsi" (Options).

*   **URL Target j-care**: URL dasar untuk sistem j-care tempat ekstensi akan aktif (contoh: `http://server-jcare-anda/j-care/`). Kolom ini wajib diisi.
*   **Nama Puskesmas**: Nama klinik/Puskesmas yang akan dicetak pada label (contoh: `PKM Jayengan`). Nama ini akan digunakan sebagai nama default pada label.

## Cara Kerja

Ekstensi secara otomatis aktif ketika Anda membuka halaman yang cocok dengan "URL Target j-care" yang telah dikonfigurasi. Ekstensi ini dirancang untuk bekerja pada path di bawah URL ini, biasanya melibatkan `/visits/`.

Setelah aktif pada halaman yang kompatibel, ekstensi akan menyempurnakan antarmuka dengan menambahkan ikon cetak (drug_16x16.png) di sebelah item yang relevan, seperti entri obat dalam tabel.

## Penggunaan

1.  Klik ikon ekstensi untuk membuka popup, atau klik kanan ikon dan pilih "Opsi" (Options). Konfigurasikan "URL Target j-care" dan "Nama Puskesmas" Anda. Simpan pengaturan. URL Target diperlukan agar ekstensi berfungsi.
2.  Buka sistem j-care, khususnya halaman di bawah "URL Target j-care" yang telah dikonfigurasi.
3.  Pastikan data pasien atau daftar obat terlihat di halaman j-care.
4.  Ekstensi akan secara otomatis menambahkan ikon cetak di sebelah item yang dapat dicetak.
5.  Klik ikon cetak di sebelah item yang ingin Anda buatkan labelnya.
6.  Ini akan memicu pembuatan label PDF, yang kemungkinan akan ditampilkan dalam iframe baru atau tab baru, siap untuk dicetak.

## Prasyarat

- Konfigurasi "URL Target j-care" di halaman opsi ekstensi. "Nama Puskesmas" juga sebaiknya diatur.
- Akses ke sistem j-care Anda pada "URL Target j-care" yang telah dikonfigurasi.
- Ekstensi ini utamanya dirancang untuk bekerja pada halaman di bawah "URL Target j-care" yang telah dikonfigurasi (biasanya path seperti `/visits/`). Fungsionalitas pada halaman lain tidak dijamin.

## Teknologi yang Digunakan

*   jQuery
*   Library untuk pembuatan barcode (`bardcode.min.js`) dan pembuatan PDF (`jsLabel2PDF.js`).

---
_README telah diperbarui untuk mencerminkan konfigurasi yang disederhanakan dan diterjemahkan ke Bahasa Indonesia._
