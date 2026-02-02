# ALBASEET Website

A premium sports equipment e-commerce website built with React, Vite, and Tailwind CSS.

## Features

- **Modern Design**: Nike/Adidas-inspired UI with smooth animations
- **Bilingual Support**: Full Arabic and English support with RTL layout
- **Admin Panel**: Complete product management with bulk upload support
- **WhatsApp Integration**: Easy ordering via WhatsApp
- **Mobile-First**: Responsive design for all devices

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Framer Motion (animations)
- Zustand (state management)
- React Router DOM
- React Dropzone (file uploads)
- PapaParse & XLSX (CSV/Excel parsing)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Admin Panel

Access the admin panel at `/admin`

**Default Credentials:**
- Email: `admin@albaseet.com`
- Password: `Albaseet@2024`

## Categories

- Padel
- Football
- Swimming
- Tennis

Each category has subcategories:
- Shoes
- Rackets/Balls
- Apparel
- Accessories
- Training Equipment

## Contact Information

- **Location**: Inside Be Pro Fun Hub, In front of Al-Rehab Gate 1, First Settlement
- **Email**: Albaseettennisutilities@gmail.com
- **WhatsApp**: +20 109 696 3964

## File Structure

```
albaseet-website/
├── public/
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── admin/
│   │   ├── layout/
│   │   └── ui/
│   ├── context/
│   ├── data/
│   ├── pages/
│   │   └── admin/
│   ├── store/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Bulk Product Upload

1. Go to Admin Panel > Bulk Upload
2. Download the Excel template
3. Fill in product data following the format:
   - `articleNumber`: Unique product code
   - `nameEn` / `nameAr`: Product names
   - `category`: padel, football, swimming, tennis
   - `subcategory`: shoes, rackets, balls, etc.
   - `price`: Price in EGP
   - `sizes`: Format: `S:10,M:15,L:8` (size:stock)
4. Upload the file and import

## License

© 2024 ALBASEET. All rights reserved.
