============================================================
STRUKTUR FOLDER ASSET & CARA MEMASUKKAN FOTO DAN MUSIK
============================================================

1. STRUKTUR FOLDER:
public/
  └── assets/
        ├── hero.jpg        (Foto pacar untuk frame hati di halaman pembuka)
        ├── photo1.jpg      (Foto polaroid kiri di bagian Memories of You)
        ├── photo2.jpg      (Foto frame hati tengah)
        ├── photo3.jpg      (Foto polaroid kanan di bagian Memories of You)
        └── music.mp3       (Lagu romantis berformat MP3)

2. JIKA FOTO BELUM TERSEDIA:
Website sudah dilengkapi dengan ilustrasi scrapbook beresolusi tinggi dan indah
secara otomatis sehingga tampilan tetap anggun, cantik, dan tidak rusak!

3. MUSIK & SOUND:
Website memiliki pemutar musik ganda cerdas:
- Jika file "assets/music.mp3" dimasukkan, audio tersebut akan diputar otomatis.
- Jika file belum ada, sistem audio sintetis lembut (Web Audio API romantic music box arpeggio)
  akan memutar melodi romantis secara otomatis sehingga website tetap hidup dan bersuara!

4. KONFIGURASI (src/config.ts):
Kamu bisa mengubah nama pasangan dan tanggal ulang tahun dengan sangat mudah:

export const CONFIG = {
  girlfriendName: "Marwah",           // Ganti dengan nama pacarmu
  birthdayDate: "26 September 2026",  // Tanggal ulang tahun
  heroPhoto: "assets/hero.jpg",
  photo1: "assets/photo1.jpg",
  photo2: "assets/photo2.jpg",
  photo3: "assets/photo3.jpg",
  music: "assets/music.mp3"
};
