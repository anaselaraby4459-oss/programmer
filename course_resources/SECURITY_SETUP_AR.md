# إعداد الأمان بعد الإصلاح

تم إغلاق إنشاء حساب الإدارة المباشر من `admin.html`.

## طريقة إنشاء أول مدير
1. افتح Firebase Authentication وأنشئ المستخدم يدويًا.
2. انسخ UID.
3. في Realtime Database أضف واحدًا من التالي:
   - `super_admins/UID = true`
   - أو `tenants/teacher_UID/admins/UID = true`
   - و `user_tenants/UID/teacher_UID = owner`
4. افتح: `admin.html?tenant=teacher_UID`

## مهم
لا ترفع نسخة قديمة فيها زر إنشاء إدارة مباشر. لو كانت عند المستخدمين في الكاش، اعمل تغيير Service Worker أو اطلب منهم Ctrl+F5.
