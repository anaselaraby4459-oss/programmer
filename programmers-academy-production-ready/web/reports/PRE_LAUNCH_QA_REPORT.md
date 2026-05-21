# تقرير Pre-Launch QA — Programmers Academy

## 1. المشاكل التي تم اكتشافها
- الملفات الرئيسية كانت God Files: `admin.html` حوالي 435KB و`student.html` حوالي 311KB وبداخلها CSS/JS مدمج.
- الاعتماد السابق على HTML يحتوي على سكربتات كبيرة مدمجة، ما يصعب الصيانة ويمنع browser caching فعال للأصول.
- قواعد Firebase كانت تحتوي على صلاحية قراءة واسعة على `tenants/$tenantId` تسمح لأي طالب مصادق داخل tenant بقراءة مسارات أكثر من اللازم.
- بعض المسارات كانت مفتوحة لأي مستخدم مصادق مثل `qr_attendance_sessions`, `mega_records`, `growth_*`, `leaderboard_weekly`, و`growth_referrals`.
- مسارات الطالب/ولي الأمر كانت تقرأ collections كاملة ثم تعمل filter في المتصفح، وهذا غير مناسب أمنياً قبل الإطلاق.
- الـ PWA كان يستخدم cache بسيط بدون runtime strategy واضحة أو offline fallback جيد.
- الهوية كانت مختلطة بين Titan/تيتان وبعض placeholders للأيقونات.

## 2. ما تم إصلاحه
- استخراج CSS إلى `assets/css/` واستخراج JavaScript إلى `assets/js/` مع إنشاء مجلدات `components/`, `services/`, و`utils/` لهيكلة التطوير القادمة.
- إضافة طبقة مشتركة: `platform.js`, `utils.js`, `error-handling.js`, `security.js`, `analytics.js`, `offline.js`, و`ux-polish.js`.
- إضافة شعار وأيقونات إنتاجية داخل `assets/img/` وتحديث `manifest.webmanifest` و favicon.
- تحويل العلامة البصرية إلى **Programmers Academy** مع الحفاظ على tenant الافتراضي القديم `titan` لتجنب كسر البيانات الحالية.
- تحسين رسائل الخطأ عند فشل Firebase، انقطاع الإنترنت، فشل الصلاحيات، والحالات غير المتوقعة.
- إضافة onboarding خفيف للطالب والإدارة لتوضيح أول خطوة بعد الدخول.
- تعديل قراءات `grades`, `invoices`, `submissions`, و`support` لتكون query-safe حسب `studentKey` بدلاً من فتح كل بيانات الطلاب للعميل.

## 3. الثغرات الأمنية
- **CRITICAL:** تم إغلاق القراءة الشاملة على `tenants/$tenantId` لأنها كانت تتجاوز القيود الفرعية.
- **CRITICAL:** تم تقييد `$other` ليكون admin-only بدلاً من إتاحة أي مسار غير معرف للطلاب.
- **CRITICAL:** تم تقييد الكتابة على `qr_attendance_sessions`, `system_health`, و`audit_logs`، وتقييد `mega_records` بحيث لا يكتب الطالب إلا سجلاته الخاصة.
- تم إضافة route guard إضافي للوحة الإدارة يمنع direct URL bypass حتى لو تم تعديل localStorage.
- تم تقليل الاعتماد على localStorage في الصلاحيات؛ localStorage لا يحدد الدور، بل قواعد Firebase وقراءة admin/student من قاعدة البيانات.
- تم فصل مسارات ولي الأمر/الطالب بحيث لا يقرأ ولي الأمر إلا بيانات الطالب المصادق الحالي أو queries مفلترة بـ UID.

## 4. تحسينات الأداء
- تقليل حجم HTML الأولي بشكل كبير عبر نقل CSS/JS إلى ملفات قابلة للتخزين المؤقت.
- مشاركة ملفات CSS/JS المشتركة بين الصفحات بدلاً من تكرارها داخل كل HTML.
- إضافة lazy loading للصور و iframes الموجودة.
- تحديث Service Worker إلى network-first للصفحات و stale-while-revalidate للأصول.
- إضافة CSS mobile/tap-target/overflow safeguards لتحسين Android والشاشات الصغيرة.
- إبقاء التغييرات production-safe بدون إدخال bundler جديد قبل الإطلاق.

## 5. الملفات التي تم تعديلها/إضافتها
- `index.html`, `admin.html`, `student.html`, `parent.html`
- `manifest.webmanifest`, `service-worker.js`, `firebase-rules.json`
- `assets/css/*`, `assets/js/*`, `assets/img/*`
- `components/`, `services/`, `utils/`
- `reports/PRE_LAUNCH_QA_REPORT.md`

## 6. اختبارات QA المنفذة
- Static JS syntax check لكل ملفات `assets/js/*.js` باستخدام `node --check`.
- JSON validation لـ `firebase-rules.json` و`manifest.webmanifest`.
- فحص وجود الملفات المرتبطة محلياً من `src/href` داخل HTML.
- فحص إزالة inline `<style>` وinline `<script>` من صفحات HTML الرئيسية.
- ملاحظة: اختبار browser كامل يحتاج اتصالاً بملفات CDN/Firebase أو بيئة staging متصلة لتأكيد login flows فعلياً.

## 7. اقتراحات V2 بعد الإطلاق
- تحويل inline `onclick` تدريجياً إلى event listeners بالكامل.
- تقسيم `admin.js` و`student.js` إلى modules أدق حسب domain: auth/content/billing/classes/reports.
- إضافة Cloud Functions لإصدار custom claims للأدوار بدلاً من قراءة roles من RTDB فقط.
- إضافة اختبار E2E آلي لسيناريوهات: طالب، ولي أمر، مدير، وانقطاع الاتصال.
- إضافة bundle/minification pipeline مثل Vite أو esbuild مع source maps.
- إنشاء شاشة Admin Analytics مخصصة تعتمد على `analytics_events` و`analytics_sessions`.
