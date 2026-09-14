const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const fingerprintScreen = $("#fingerprintScreen");
const introScreen = $("#introScreen");
const dashboard = $("#dashboard");
const introVideo = $("#introVideo");

const subjects = [
  ["∑","Matematika","Logika & hitung"],
  ["A","Bahasa Indonesia","Membaca & menulis"],
  ["EN","Bahasa Inggris","Language"],
  ["⚛","Fisika","Energi & gerak"],
  ["◌","Kimia","Materi & reaksi"],
  ["⌁","Biologi","Makhluk hidup"],
  ["◎","Informatika","Teknologi"],
  ["⚖","PPKn","Kewarganegaraan"],
  ["⌘","Sejarah","Masa lalu"],
  ["♫","Seni Budaya","Kreativitas"]
];

const lessons = {
  "Matematika":[
    ["Konsep inti","Pahami definisi dan hubungan antar-angka sebelum menghafal rumus."],
    ["Cara mengerjakan","Tulis diketahui → ditanya → rumus → substitusi → hitung → kesimpulan."],
    ["Latihan aktif","Kerjakan satu soal tanpa melihat jawaban, lalu cek langkahnya."]
  ],
  "Bahasa Indonesia":[
    ["Membaca efektif","Cari gagasan utama, informasi penting, dan hubungan antarparagraf."],
    ["Teks LHO","Bedakan pernyataan umum, deskripsi bagian, dan deskripsi manfaat."],
    ["Menulis","Buat kerangka dahulu, lalu kembangkan dengan kalimat efektif."]
  ],
  "Bahasa Inggris":[
    ["Vocabulary","Pelajari kata dalam konteks kalimat, bukan daftar kata terpisah."],
    ["Grammar","Kenali subject, verb, tense, lalu periksa agreement."],
    ["Practice","Baca pendek, dengarkan, tirukan, dan buat kalimat sendiri."]
  ],
  "Fisika":[["Konsep","Identifikasi besaran dan satuannya."],["Langkah","Tuliskan diketahui, ditanya, rumus, lalu substitusi."],["Cek","Periksa satuan dan kewajaran hasil."]],
  "Kimia":[["Konsep","Pahami partikel, unsur, senyawa, dan perubahan materi."],["Persamaan","Setarakan jumlah atom di kiri dan kanan."],["Latihan","Gunakan langkah sistematis dan cek kembali koefisien."]],
  "Biologi":[["Konsep","Mulai dari struktur lalu fungsi dan hubungan antarbagian."],["Istilah","Kelompokkan istilah berdasarkan sistem atau proses."],["Latihan","Jelaskan kembali dengan kata-kata sendiri."]],
  "Informatika":[["Input","Kenali data yang masuk ke sistem."],["Proses","Uraikan algoritma atau transformasi datanya."],["Output","Tentukan hasil yang keluar dan cara mengeceknya."]],
  "PPKn":[["Konsep","Pahami nilai, aturan, hak, kewajiban, dan penerapannya."],["Kasus","Hubungkan konsep dengan contoh kehidupan sehari-hari."],["Refleksi","Tulis penerapan yang realistis di sekolah."]],
  "Sejarah":[["Kronologi","Susun peristiwa berdasarkan urutan waktu."],["Sebab-akibat","Bedakan faktor pendorong, peristiwa, dan dampaknya."],["Sumber","Bandingkan informasi dan gunakan sumber yang tepercaya."]],
  "Seni Budaya":[["Unsur","Kenali unsur dan prinsip karya."],["Apresiasi","Jelaskan bentuk, fungsi, dan konteks karya."],["Praktik","Buat karya lalu evaluasi prosesnya."]]
};

function show(el){el.classList.remove("hidden")}
function hide(el){el.classList.add("hidden")}
function toast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(window.__toast); window.__toast=setTimeout(()=>t.classList.remove("show"),2200);
}

function renderSubjects(){
  $("#subjectRail").innerHTML = subjects.map(([icon,name,desc]) => `
    <button class="subject-card glass-panel" data-subject="${name}">
      <span class="subject-icon">${icon}</span>
      <strong>${name}</strong><small>${desc}</small>
    </button>`).join("");
  $$(".subject-card").forEach(btn=>btn.addEventListener("click",()=>openStudy(btn.dataset.subject)));
}

function renderStudy(subject="Matematika"){
  const data=lessons[subject] || lessons["Matematika"];
  $("#studyContent").innerHTML = data.map(([title,text],i)=>`
    <article class="lesson">
      <span class="eyebrow">STEP ${String(i+1).padStart(2,"0")}</span>
      <h3>${title}</h3><p>${text}</p>
    </article>`).join("");
}

function openStudy(subject="Matematika"){
  renderStudy(subject);
  show($("#studyPanel"));
}

function startIntro(){
  hide(fingerprintScreen); show(introScreen);
  try { introVideo.currentTime=0; introVideo.play(); } catch(e){}
}
function enterDashboard(){
  hide(introScreen); show(dashboard);
  window.speechSynthesis?.cancel();
  if("speechSynthesis" in window){
    const u=new SpeechSynthesisUtterance("Hello everyone, welcome to LearnX");
    u.lang="en-US"; u.rate=.78; u.pitch=1.05; u.volume=.9;
    const speak=()=>window.speechSynthesis.speak(u);
    setTimeout(speak,500);
  }
}

$("#fingerprintBtn").addEventListener("click",()=>{
  localStorage.setItem("learnxUnlocked","1");
  $("#fingerprintBtn").classList.add("scanning");
  setTimeout(startIntro,650);
});
$("#skipIntro").addEventListener("click",enterDashboard);

$$(".module-card").forEach(card=>card.addEventListener("click",()=>{
  if(card.dataset.module==="study") openStudy();
  else { show($("#quranPanel")); loadSurahs(); }
}));
$$(".close-sheet").forEach(btn=>btn.addEventListener("click",()=>hide(btn.closest(".sheet"))));

$("#musicButton").addEventListener("click",()=>{show($("#spotifyPanel")); show($("#dynamicIsland"));});
$("#islandPlay").addEventListener("click",()=>{
  toast("Spotify dibuka dari pemutar resmi.");
  const url=$("#spotifyUrl").value.trim();
  if(url) window.open(url,"_blank","noopener");
});
$("#spotifyOpen").addEventListener("click",()=>{
  const url=$("#spotifyUrl").value.trim();
  if(!/^https?:\/\/open\.spotify\.com\//i.test(url)){toast("Masukkan URL Spotify yang valid.");return;}
  localStorage.setItem("learnxSpotify",url);
  hide($("#spotifyPanel")); show($("#dynamicIsland")); toast("Spotify tersimpan.");
});

async function loadSurahs(){
  const list=$("#surahList");
  list.innerHTML="<p>Memuat daftar surah…</p>";
  try{
    const r=await fetch("https://api.alquran.cloud/v1/surah");
    const j=await r.json();
    list.innerHTML=j.data.map(s=>`
      <button class="surah" data-surah="${s.number}">
        <strong>${s.number}. ${s.englishName}</strong>
        <small>${s.name} · ${s.numberOfAyahs} ayat</small>
      </button>`).join("");
    $$(".surah").forEach(b=>b.addEventListener("click",()=>loadSurah(b.dataset.surah)));
  }catch(e){
    list.innerHTML="<p>Tidak ada koneksi ke sumber Qur'an. Coba lagi saat online.</p>";
  }
}
async function loadSurah(n){
  const viewer=$("#ayahViewer"); show(viewer);
  viewer.innerHTML="<p>Memuat ayat…</p>";
  try{
    const r=await fetch(`https://api.alquran.cloud/v1/surah/${n}/editions/quran-uthmani,id.indonesian`);
    const j=await r.json();
    const ar=j.data[0].ayahs, id=j.data[1].ayahs;
    viewer.innerHTML=ar.map((a,i)=>`
      <article>
        <div class="ayah">${a.text} ۝</div>
        <div class="translation">${id[i]?.text||""}</div>
      </article>`).join("");
    viewer.scrollIntoView({behavior:"smooth",block:"start"});
  }catch(e){viewer.innerHTML="<p>Ayat belum dapat dimuat. Periksa koneksi.</p>";}
}

renderSubjects();
const savedSpotify=localStorage.getItem("learnxSpotify");
if(savedSpotify) $("#spotifyUrl").value=savedSpotify;

// A smooth touch/drag feel for horizontal subjects.
let rail=$("#subjectRail"), down=false, startX=0, scroll=0;
rail.addEventListener("pointerdown",e=>{down=true;startX=e.clientX;scroll=rail.scrollLeft;rail.setPointerCapture(e.pointerId)});
rail.addEventListener("pointermove",e=>{if(!down)return;rail.scrollLeft=scroll-(e.clientX-startX)});
rail.addEventListener("pointerup",()=>down=false);
rail.addEventListener("pointercancel",()=>down=false);

// The visual fingerprint gate is intentionally one-tap for broad browser compatibility.
// Real device biometrics require WebAuthn/HTTPS and OS/browser support.
