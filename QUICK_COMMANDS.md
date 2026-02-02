# ALBASEET Website - Quick Commands

## 🌐 Website Development

### Start Development Server
```bash
cd albaseet-website
npm run dev
```
Website will be at: http://localhost:5173/

### Build for Production
```bash
cd albaseet-website
npm run build
```

### Preview Production Build
```bash
cd albaseet-website
npm run preview
```

---

## 📱 Admin Android App

### Build Debug APK
```bash
cd albaseet-website
./build_admin_android.sh
```
Output: `albaseet-admin.apk`

### Build Release APK
```bash
cd albaseet-website
./build_admin_android_release.sh
```
Output: `albaseet-admin-release.apk`

### Quick Sync (after code changes)
```bash
cd albaseet-website
./sync_android.sh
```

### Open in Android Studio
```bash
cd albaseet-website
npx cap open android
```

### Install APK on Device
```bash
adb install albaseet-admin.apk
```

---

## 🔑 Admin Panel Access

- **URL**: http://localhost:5173/admin
- **Email**: admin@albaseet.com
- **Password**: Albaseet@2024

---

## 📊 Features

### Website
- Modern Nike/Adidas inspired design
- Bilingual (Arabic/English)
- WhatsApp ordering integration
- Product catalog with categories

### Admin Panel
- Dashboard with visitor analytics
- Product management
- Bulk upload (CSV/Excel)
- Drag & drop image upload
- Stock management
- Language switcher

### Android Admin App
- Full admin panel access
- Native Android experience
- Offline-capable (once loaded)
- Push notification ready

---

## 📁 File Structure

```
albaseet-website/
├── src/                    # React source code
├── dist/                   # Production build
├── android/                # Android app
├── public/                 # Static assets
├── build_admin_android.sh  # Debug build script
├── build_admin_android_release.sh  # Release build script
└── sync_android.sh         # Quick sync script
```

---

## 🚀 Deployment

### Deploy Website
1. Build: `npm run build`
2. Upload `dist/` folder to your hosting

### Deploy Android App
1. Build: `./build_admin_android_release.sh`
2. Sign the APK
3. Upload to Play Store or distribute directly
