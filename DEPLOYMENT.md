# Deployment Guide - دليل النشر

## 🚀 خيارات النشر المختلفة

### 1. النشر على خادم VPS/Dedicated

#### متطلبات النظام:
- Ubuntu 18.04+ أو CentOS 7+
- Node.js 14+
- npm 6+
- 1GB RAM على الأقل
- 5GB مساحة تخزين

#### خطوات النشر:
```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# تحميل المشروع
git clone https://github.com/du53344/duuu.git
cd duuu

# تثبيت التبعيات
cd du-payment-backend && npm install
cd ../du-payment-site && npm install && npm run build

# تشغيل الخادم الخلفي
cd ../du-payment-backend
npm install -g pm2
pm2 start server.js --name "du-payment-backend"
pm2 startup
pm2 save

# نسخ ملفات الواجهة الأمامية
sudo cp -r ../du-payment-site/dist/* /var/www/html/
```

### 2. النشر على cPanel/Shared Hosting

#### الخطوات:
1. **رفع الملفات**:
   - ارفع `du-payment-backend/` إلى مجلد خارج public_html
   - ارفع محتويات `du-payment-site/dist/` إلى public_html

2. **تكوين Node.js في cPanel**:
   - انتقل إلى "Setup Node.js App"
   - أنشئ تطبيق جديد
   - حدد المسار: `/home/username/du-payment-backend`
   - ملف البداية: `server.js`
   - المنفذ: سيتم تعيينه تلقائياً

3. **تحديث إعدادات API**:
   - عدل ملفات الواجهة الأمامية لتشير إلى عنوان الخادم الخلفي الجديد

### 3. النشر على خدمات السحابة

#### Heroku:
```bash
# إنشاء تطبيقين منفصلين
heroku create du-payment-backend
heroku create du-payment-frontend

# نشر الخادم الخلفي
cd du-payment-backend
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a du-payment-backend
git push heroku master

# نشر الواجهة الأمامية
cd ../du-payment-site
npm run build
# رفع محتويات dist إلى خدمة استضافة ثابتة
```

#### DigitalOcean App Platform:
1. ربط المستودع من GitHub
2. تكوين خدمتين منفصلتين (backend و frontend)
3. تحديد متغيرات البيئة

### 4. النشر مع Docker

#### Dockerfile للخادم الخلفي:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

#### Dockerfile للواجهة الأمامية:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose:
```yaml
version: '3.8'
services:
  backend:
    build: ./du-payment-backend
    ports:
      - "3000:3000"
    volumes:
      - ./du-payment-backend/du_payment_data.db:/app/du_payment_data.db
  
  frontend:
    build: ./du-payment-site
    ports:
      - "80:80"
    depends_on:
      - backend
```

## 🔧 التكوين للإنتاج

### متغيرات البيئة (.env):
```bash
# الخادم الخلفي
NODE_ENV=production
PORT=3000
DB_PATH=./du_payment_data.db
CORS_ORIGIN=https://your-domain.com
API_BASE_URL=https://your-backend-domain.com

# الأمان
SESSION_SECRET=your-super-secret-key-here
JWT_SECRET=another-secret-key
```

### إعدادات Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # الواجهة الأمامية
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }
    
    # الخادم الخلفي
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### إعدادات Apache (.htaccess):
```apache
RewriteEngine On
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## 🔒 الأمان في الإنتاج

### إعدادات الخادم:
```javascript
// في server.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100 // حد أقصى 100 طلب لكل IP
}));
```

### قاعدة البيانات:
- استخدم كلمات مرور قوية
- قم بعمل نسخ احتياطية منتظمة
- راقب الوصول إلى قاعدة البيانات

### HTTPS:
```bash
# تثبيت Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 📊 المراقبة والصيانة

### مراقبة الأداء:
```bash
# مراقبة PM2
pm2 monit

# عرض السجلات
pm2 logs du-payment-backend

# إعادة تشغيل
pm2 restart du-payment-backend
```

### النسخ الاحتياطية:
```bash
# نسخ احتياطي لقاعدة البيانات
cp du_payment_data.db backup_$(date +%Y%m%d_%H%M%S).db

# نسخ احتياطي تلقائي (cron job)
0 2 * * * cp /path/to/du_payment_data.db /backup/du_payment_$(date +\%Y\%m\%d).db
```

## 🚀 تحسين الأداء

### تحسين الواجهة الأمامية:
- تفعيل ضغط Gzip
- استخدام CDN للأصول الثابتة
- تحسين الصور

### تحسين الخادم الخلفي:
- استخدام Redis للتخزين المؤقت
- تحسين استعلامات قاعدة البيانات
- تفعيل ضغط HTTP

## 📞 استكشاف الأخطاء

### مشاكل شائعة:
1. **خطأ في الاتصال بقاعدة البيانات**: تحقق من صلاحيات الملفات
2. **خطأ CORS**: تحديث إعدادات CORS في الخادم الخلفي
3. **مشاكل في التحميل**: تحقق من مسارات الملفات

### السجلات:
```bash
# سجلات النظام
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# سجلات التطبيق
pm2 logs du-payment-backend --lines 100
```

