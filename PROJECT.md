# Kişisel Portfolyo Web Sitesi — Proje Planı

> Referans tasarım: Görsellerdeki minimalist, açık gri arka planlı, kalın serif başlıklı, siyah pill-shaped butonlu stil (Squarespace tarzı).

## 1. Tasarım Referansı ve Tema

**Görsellerden çıkarılan tasarım dili:**
- Arka plan: açık gri (#E0E0E0 civarı), içerik kartları beyaz
- Başlıklar: kalın, serif, büyük punto (örn. "Ready to Start?", "Helping You Shine Online") — Anton, Archivo Black veya PT Serif Bold gibi bir font
- Gövde metni: sade sans-serif (Inter, Helvetica Neue)
- Butonlar: siyah, tam yuvarlak (pill-shape), beyaz büyük harf yazı (örn. "SUBMIT")
- Form alanları: gri dolgulu, ince kenarlıklı, köşeleri yumuşak yuvarlatılmış
- Bol boşluk (whitespace), iki sütunlu yerleşim (metin solda, görsel/form sağda)
- Üst navigasyon: sade, sadece birkaç link (About / Contact benzeri)

**Siteye uygulanacak 3 ana bölüm:**
1. **Giriş (Hero)** — kısa tanıtım yazısı
2. **İlgi Alanlarım** — kartlar/liste şeklinde ilgi alanları (AI/ML, ekonomi, finansal piyasalar vb.)
3. **İletişim** — görseldeki forma benzer bir contact form (Ad, Soyad, Email, Mesaj, Submit)

**Admin paneli:** Bu 3 bölümün içeriğini (başlık, paragraf, ilgi alanı kartları, iletişim bilgileri) giriş yapılan bir panelden düzenleyebilme.

---

## 2. Teknoloji Yığını (Stack)

| Katman | Teknoloji | Neden |
|---|---|---|
| Frontend | Next.js 14 (App Router) + React | SSR/SSG, tek proje içinde hem public site hem admin |
| Stil | Tailwind CSS | Görseldeki tasarımı hızlı ve tutarlı kodlamak için |
| Veritabanı | SQLite + Prisma ORM | Kurulumu basit, tek dosya, kolay taşınabilir; ileride Postgres'e geçilebilir |
| Kimlik Doğrulama | NextAuth.js (credentials provider) | Admin girişi için basit email/şifre auth |
| Form/Backend | Next.js API Routes / Server Actions | İletişim formu ve admin CRUD işlemleri için |
| Deploy | Vercel (frontend) + veritabanı için Vercel Postgres ya da Railway | Next.js ile doğal entegrasyon |

> Not: İstersen bunun yerine daha basit bir versiyonu (veritabanısız, JSON dosyasına yazan) da kurabiliriz — proje ilerledikçe karar verebiliriz.

---

## 3. Proje Klasör Yapısı (Hedef)

```
personal-site/
├── app/
│   ├── page.tsx                 # Ana sayfa (Giriş + İlgi Alanları + İletişim)
│   ├── layout.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── hero/page.tsx        # Giriş metnini düzenleme
│   │   ├── interests/page.tsx   # İlgi alanları CRUD
│   │   └── contact/page.tsx     # İletişim bilgisi + gelen mesajlar
│   └── api/
│       ├── contact/route.ts
│       └── auth/[...nextauth]/route.ts
├── components/
│   ├── Hero.tsx
│   ├── Interests.tsx
│   ├── ContactForm.tsx
│   └── admin/...
├── prisma/
│   └── schema.prisma
├── lib/
└── PROJECT.md   ← bu dosya
```

---

## 4. Checkpoint Listesi

> Kural: Her checkpoint bitince ilgili kutucuk işaretlenecek ve bir sonrakine geçilmeden önce kısa bir test/gözden geçirme yapılacak. Checkpoint'ler sırayla ilerler, atlanmaz.

### 📍 Checkpoint 0 — Planlama (Bu aşama)
- [x] Referans görsellerin analiz edilmesi
- [x] Tema ve renk paletinin belirlenmesi
- [x] Teknoloji yığınının seçilmesi
- [x] Bu proje dosyasının oluşturulması
- [ ] Kullanıcıdan onay: stack ve tasarım yönü uygun mu?

### 📍 Checkpoint 1 — Proje İskeleti
- [ ] Next.js + Tailwind projesi kurulumu
- [ ] Font ailelerinin eklenmesi (başlık için serif/bold, gövde için sans-serif)
- [ ] Renk paleti `tailwind.config` içinde tanımlanması
- [ ] Temel layout (header/nav + footer) oluşturulması
- [ ] Boş sayfa localde çalışır durumda görüntülenmesi

### 📍 Checkpoint 2 — Giriş (Hero) Bölümü
- [ ] Hero bileşeni: büyük başlık + kısa tanıtım paragrafı
- [ ] Görseldeki gibi görsel/boşluk dengesi
- [ ] Mobil responsive kontrolü
- [ ] İçerik geçici statik metinle test edilmesi

### 📍 Checkpoint 3 — İlgi Alanlarım Bölümü
- [ ] İlgi alanı kartı bileşeni tasarımı (başlık + kısa açıklama + ikon opsiyonel)
- [ ] Örnek veriyle (AI/ML, Finansal Piyasalar, Ekonomi vb.) grid/liste düzeni
- [ ] Responsive kart düzeni (mobilde alt alta, masaüstünde yan yana)

### 📍 Checkpoint 4 — İletişim Bölümü
- [ ] Görseldeki forma birebir yakın form: Ad, Soyad, Email, Mesaj, Submit butonu
- [ ] Form validasyonu (zorunlu alanlar)
- [ ] Form gönderiminin API route'a bağlanması
- [ ] Gönderilen mesajın veritabanına kaydedilmesi
- [ ] Başarılı gönderim sonrası kullanıcıya geri bildirim (toast/mesaj)

### 📍 Checkpoint 5 — Veritabanı ve Şema
- [ ] Prisma kurulumu
- [ ] Şema tanımları: `HeroContent`, `Interest`, `ContactMessage`, `AdminUser`
- [ ] Migration çalıştırma
- [ ] Seed script ile örnek veri oluşturma

### 📍 Checkpoint 6 — Admin Girişi (Auth)
- [ ] NextAuth kurulumu (credentials provider)
- [ ] `/admin/login` sayfası
- [ ] Şifre hash'leme (bcrypt)
- [ ] Giriş yapılmadan `/admin/*` sayfalarına erişimin engellenmesi (middleware)

### 📍 Checkpoint 7 — Admin Paneli: Giriş Bölümü Yönetimi
- [ ] `/admin/hero` sayfasında başlık ve tanıtım metni düzenleme formu
- [ ] Kaydet butonunun veritabanını güncellemesi
- [ ] Public sayfada değişikliğin anında yansıması

### 📍 Checkpoint 8 — Admin Paneli: İlgi Alanları Yönetimi
- [ ] Liste görünümü (mevcut ilgi alanları)
- [ ] Yeni ilgi alanı ekleme formu
- [ ] Düzenleme / silme işlevleri
- [ ] Sıralama (opsiyonel: drag&drop veya sıra numarası)

### 📍 Checkpoint 9 — Admin Paneli: İletişim Yönetimi
- [ ] Gelen mesajların listelendiği tablo
- [ ] Mesajı okundu/okunmadı işaretleme
- [ ] İletişim bilgilerinin (email, sosyal medya linkleri) düzenlenmesi

### 📍 Checkpoint 10 — Görsel Cila (Polish)
- [ ] Tüm bölümlerin görseldeki tema ile piksel bazında karşılaştırılması
- [ ] Geçiş animasyonları (hover, scroll fade-in) eklenmesi
- [ ] Tüm ekran boyutlarında (mobil/tablet/masaüstü) test

### 📍 Checkpoint 11 — Test ve Hata Ayıklama
- [ ] Form validasyon testleri
- [ ] Admin auth güvenlik testi (yetkisiz erişim denemesi)
- [ ] Cross-browser hızlı kontrol

### 📍 Checkpoint 12 — Deploy
- [ ] Vercel'e bağlama
- [ ] Ortam değişkenlerinin (DATABASE_URL, NEXTAUTH_SECRET) ayarlanması
- [ ] Canlı ortamda son kontrol
- [ ] Admin şifresinin production'da değiştirilmesi

---

## 5. İçerik Placeholder'ları (Doldurulacak)

- **Giriş başlığı:** _(örn. "Merhaba, ben Avni")_
- **Kısa tanıtım metni:** _(2-3 cümlelik bio)_
- **İlgi alanları:** Yapay Zeka / Makine Öğrenmesi, Finansal Piyasalar & Ekonomi, ... _(eklenecek)_
- **İletişim email:** _(eklenecek)_
- **Sosyal medya linkleri:** _(varsa eklenecek — GitHub, LinkedIn vb.)_

---

## 6. Notlar / Açık Kararlar

- Veritabanı seçimi kesinleşmedi — basit tutmak istersen JSON dosya tabanlı bir sürümle başlayıp sonra Prisma'ya geçebiliriz.
- Admin paneli tek kullanıcılı mı olacak (sadece sen) yoksa çoklu admin desteği gerekecek mi?
- Site tek dilli mi (Türkçe) yoksa TR/EN geçişli mi olacak?

---

**Sıradaki adım:** Checkpoint 0'daki son maddeyi onaylayıp Checkpoint 1'e (proje iskeleti kurulumu) geçmek. Onay verirsen kodlamaya başlıyorum.
