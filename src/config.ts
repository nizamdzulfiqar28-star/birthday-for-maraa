import { AppConfig } from './types';

// ==========================================
// 25. CONFIGURATION
// Edit this object to personalize your gift!
// ==========================================
export const CONFIG: AppConfig = {
  girlfriendName: "Marwah",
  birthdayDate: "26 September 2026",
  heroPhoto: "",
  photo1: "https://mp3tourl.com/images/1790331727997-1abae14f-e909-41b9-9e34-0709fca7293d.jpg",
  photo2: "https://mp3tourl.com/images/1790331819304-dea0ec24-573d-4fd5-a2c3-725ec3b2d0b0.jpg",
  photo3: "https://mp3tourl.com/images/1790331788723-e7ee10e7-ffa5-4fdb-b88f-373a281aef76.jpg",
  photo4: "https://mp3tourl.com/images/1790331848067-47161d64-d647-433e-ae80-ebbf316a0fd3.jpg",
  // Musik utama (background saat awal buka website dan kado)
  music: "https://mp3tourl.com/audio/1790243093094-e4f78a1b-7d20-41a5-a7f3-d9ade20687a3.mp3",
  // Musik khusus surat cinta (terputar otomatis saat membuka surat)
  suratMusic: "https://mp3tourl.com/audio/1790325311910-8bdd070c-5caa-4a33-b19a-288f2448660e.mp3",
};

// Elegant scrapbook illustrated placeholders (when custom photos are not yet uploaded)
export const ELEGANT_PLACEHOLDERS = {
  hero: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <defs>
        <linearGradient id="softBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FCECE9"/>
          <stop offset="50%" stop-color="#F7D8D5"/>
          <stop offset="100%" stop-color="#EABCBF"/>
        </linearGradient>
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#b76e79" flood-opacity="0.15"/>
        </filter>
      </defs>
      <rect width="500" height="500" fill="url(#softBg)"/>
      <circle cx="250" cy="250" r="210" fill="#FFF9F5" opacity="0.6"/>
      <g filter="url(#softShadow)">
        <!-- Beautiful floral branch -->
        <path d="M120,380 C180,310 230,280 380,240" stroke="#b76e79" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M160,335 C170,300 200,310 190,340 Z" fill="#E8BFC0"/>
        <path d="M240,285 C255,260 280,270 270,295 Z" fill="#E8BFC0"/>
        <path d="M310,255 C320,225 350,235 340,265 Z" fill="#E8BFC0"/>
        
        <!-- Elegant silhouette of beloved -->
        <circle cx="250" cy="180" r="55" fill="#B76E79" opacity="0.85"/>
        <path d="M170,360 C170,275 210,250 250,250 C290,250 330,275 330,360 Z" fill="#B76E79" opacity="0.85"/>
        
        <!-- Delicate hair bow / flower -->
        <circle cx="295" cy="155" r="14" fill="#FCECE9"/>
        <circle cx="295" cy="155" r="7" fill="#B76E79"/>
      </g>
      <text x="250" y="415" font-family="'Cormorant Garamond', Georgia, serif" font-size="28" font-style="italic" fill="#817777" text-anchor="middle">My Favorite Person</text>
      <text x="250" y="445" font-family="'Quicksand', sans-serif" font-size="14" letter-spacing="3" fill="#B76E79" text-anchor="middle">MARWAH ♡</text>
    </svg>
  `)}`,

  photo1: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="100%" height="100%">
      <rect width="400" height="480" fill="#FFFDFB"/>
      <rect x="25" y="25" width="350" height="350" fill="#F9EFEA"/>
      <circle cx="200" cy="170" r="55" fill="#E8BFC0"/>
      <path d="M130,320 C130,250 170,230 200,230 C230,230 270,250 270,320 Z" fill="#E8BFC0"/>
      <!-- Polaroid flower bouquet -->
      <path d="M170,240 Q200,210 230,240 Q200,270 170,240 Z" fill="#B76E79" opacity="0.8"/>
      <text x="200" y="420" font-family="'Great Vibes', cursive" font-size="36" fill="#817777" text-anchor="middle">my favorite person</text>
    </svg>
  `)}`,

  photo2: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 450" width="100%" height="100%">
      <rect width="450" height="450" fill="#FFF8F4"/>
      <path d="M225,85 C140,-20 20,95 225,370 C430,95 310,-20 225,85 Z" fill="#F6DFDB"/>
      <!-- Soft center heart artwork -->
      <circle cx="225" cy="180" r="48" fill="#B76E79" opacity="0.8"/>
      <path d="M165,300 C165,240 195,225 225,225 C255,225 285,240 285,300 Z" fill="#B76E79" opacity="0.8"/>
      <text x="225" y="380" font-family="'Great Vibes', cursive" font-size="34" fill="#B76E79" text-anchor="middle">pretty moments ♡</text>
    </svg>
  `)}`,

  photo3: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="100%" height="100%">
      <rect width="400" height="480" fill="#FFFDFB"/>
      <rect x="25" y="25" width="350" height="350" fill="#F7ECE8"/>
      <circle cx="200" cy="165" r="50" fill="#E8BFC0"/>
      <path d="M135,320 C135,245 170,225 200,225 C230,225 265,245 265,320 Z" fill="#E8BFC0"/>
      <!-- Soft sparkling stars -->
      <text x="110" y="100" font-size="28" fill="#E8BFC0">✦</text>
      <text x="280" y="120" font-size="22" fill="#E8BFC0">✨</text>
      <text x="200" y="420" font-family="'Great Vibes', cursive" font-size="38" fill="#817777" text-anchor="middle">you ♡</text>
    </svg>
  `)}`
};
