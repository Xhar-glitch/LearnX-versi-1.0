# LearnX — Smart Study OS

Prototype web app sesuai konsep yang diminta:
- layar pembuka sidik jari visual, tanpa outline biru default browser
- intro fullscreen menggunakan `assets/intro.mp4`, loop, tombol Skip
- dashboard dengan langit/awan bergerak, kartu glass transparan, animasi sentuhan
- GIF karakter dari file yang diberikan
- suara sambutan "Hello everyone, welcome to LearnX" dengan tempo pelan
- pilihan mata pelajaran horizontal
- modul Belajar dan Al-Qur'an
- daftar surah + ayat Arab/terjemahan dari AlQuran Cloud ketika online
- dynamic island musik
- input URL Spotify resmi

## Menjalankan
Paling mudah dari folder ini:

```bash
python -m http.server 8080
```

Lalu buka:
`http://127.0.0.1:8080`

## Catatan penting
1. "Sidik jari" di prototype ini adalah layar unlock visual satu-tap. Biometrik sungguhan di browser membutuhkan WebAuthn, HTTPS, perangkat/browser yang mendukung, dan pendaftaran credential.
2. Spotify tidak bisa dipaksa autoplay hanya dengan HTML biasa. Pemutaran mengikuti kebijakan Spotify, login, dan izin pengguna. Prototype menyediakan URL Spotify yang bisa disimpan dan dibuka.
3. Data Al-Qur'an dimuat online dari API AlQuran Cloud. Untuk versi offline/produksi, gunakan dataset Qur'an yang lisensinya sesuai dan sumber teks/audio yang tepercaya.
4. Gunakan video intro hanya jika Anda memiliki hak/izin untuk memakainya.
