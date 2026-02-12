# 🚀 Sanatçı Web Sitesi + Yönetim Paneli - Hızlı Kurulum Rehberi

Profesör modunda incelememi tamamladım. Bu proje, **Next.js (App Router)** ve **Firebase** kullanan modern, tek repolu bir uygulamadır. 

Aşağıdaki adımları sırasıyla uygula. "Derin düşünme" sonucu hazırlanan en kestirme yoldur.

---

## 1. Hazırlık: Node.js ve Paketler
Terminali aç (VS Code içinde `Ctrl + ş` veya `Ctrl + ~`) ve şu komutu çalıştırarak eksik paket kalmadığından emin ol:

```bash
npm install
```

---

## 2. Kritik Dosya: `.env.local`
Bu dosya projenin kalbidir. Eğer bu dosya yoksa, kök dizinde `.env.local` adında bir dosya oluştur.

Aşağıdaki şablonu kopyala ve `.env.local` dosyana yapıştır. **"..."** yazan yerleri Firebase konsolundan aldığın gerçek değerlerle doldurman şart.

```env
# --- ZİYARETÇİ TARAFI (Client SDK) ---
# Firebase Konsolu > Project Settings > General > Your Apps (Web) kısmından al:
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=proje-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=proje-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=proje-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123...
NEXT_PUBLIC_FIREBASE_APP_ID=1:123...

# --- YÖNETİCİ TARAFI (Admin SDK) ---
# Firebase Konsolu > Project Settings > Service Accounts > Generate new private key
# İndirdiğin JSON dosyasını aç ve içindeki değerleri buraya yapıştır:
FIREBASE_PROJECT_ID=proje-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@proje-id.iam.gserviceaccount.com

# ÖNEMLİ: Tırnak işaretlerini silme!
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggEjAgEAAoIBAQD..."

# --- YÖNETİCİ YETKİSİ ---
# Firebase Authentication > Users kısmından kendi oluşturduğun kullanıcının UID'sini buraya yapıştır.
# Birden fazla yönetici varsa virgülle ayır: "uid1,uid2"
ADMIN_UIDS="7x8s9d..."
```

> **İpucu:** `FIREBASE_PRIVATE_KEY` içindeki `\n` karakterleri olduğu gibi kalsın, benim yazdığım kod onları otomatik düzeltecek.

---

## 3. Firebase Ayarları (Konsoldan Yapılacaklar)
Kodun çalışması için bu düğmelere basmalısın:

1.  **Authentication:** "Email/Password" yöntemini **Enable** yap.
2.  **Firestore Database:** Veritabanı oluştur. Konum olarak `eur3` (Europe West) seçebilirsin. Kuralları "Test Mode" olarak başlat.
3.  **Storage:** "Get Started" diyerek depolama alanını aç. Yine "Test Mode" seç.

---

## 4. Yönetici Hesabı Oluşturma
Sitede "Kayıt Ol" butonu yok (güvenlik gereği). Yöneticiyi elinle ekleyeceksin:

1.  Firebase Konsolu > **Authentication** > **Users** sekmesine git.
2.  **Add User** butonuna bas.
3.  Email: `admin@site.com` (veya kendi mailin).
4.  Şifre: Güçlü bir şifre belirle.
5.  Oluşan kullanıcının **UID** değerini kopyala ve `.env.local` dosyasındaki `ADMIN_UIDS` kısmına yapıştır.

---

## 5. Çalıştır!
Artık hazırsın.

```bash
npm run dev
```

Tarayıcıda:
- **Ziyaretçi Sayfası:** `http://localhost:3000`
- **Yönetici Girişi:** `http://localhost:3000/admin/login`

---

## ⚠️ Sık Karşılaşılan Sorunlar ve Çözümleri

*   **Hata:** `FirebaseError: Firebase: Error (auth/invalid-api-key).`
    *   **Çözüm:** `.env.local` dosyasındaki `NEXT_PUBLIC_FIREBASE_API_KEY` yanlış veya boş. Dosyayı kaydettikten sonra terminali kapatıp `npm run dev` ile yeniden başlat.

*   **Hata:** Yönetici paneline girince "Loading..." ekranında kalıyor veya atıyor.
    *   **Çözüm:** `ADMIN_UIDS` ayarını kontrol et. Giriş yaptığın emailin UID'si ile oradaki UID birebir aynı olmalı.

*   **Hata:** Resim yüklenmiyor.
    *   **Çözüm:** Firebase Storage'ın aktif olduğundan ve kuralların (Rules) yazmaya izin verdiğinden emin ol.

Profesör modunda başarılar dilerim! 👨‍💻
