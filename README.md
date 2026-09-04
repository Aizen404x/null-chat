# Null Chat

تطبيق دردشة آمن مبني على **Next.js** مع تشفير طرف-لطرف (E2EE) للرسائل، ومصادقة بالبريد/كلمة المرور، ورسائل فورية عبر **Ably**، وإشعارات Web Push.

> اسم الحزمة في `package.json`: `aegis-chat`

## المميزات

- تشفير الرسائل باستخدام ECDH + AES-GCM (المفتاح الخاص يُخزَّن مشفراً بكلمة مرور المستخدم)
- محادثات مباشرة ومجموعات
- رسائل فورية (Realtime) عبر Ably
- إشعارات Push للمتصفح (PWA)
- تسجيل حسابات جديدة بـ **رمز دعوة** (Invite Code)
- واجهة حديثة (Tailwind CSS + shadcn/ui) مع دعم الوضع الفاتح/الداكن

## المتطلبات

| الأداة | الإصدار المقترح |
|--------|-----------------|
| [Node.js](https://nodejs.org/) | 20 أو أحدث |
| [pnpm](https://pnpm.io/) | 9 أو أحدث |
| PostgreSQL | قاعدة بيانات (يُفضّل [Neon](https://neon.tech)) |
| [Ably](https://ably.com) | حساب + مفتاح API |
| VAPID keys | لإشعارات Web Push |

## التثبيت المحلي

### 1. استنساخ المشروع

```bash
git clone https://github.com/YOUR_USERNAME/aegis-chat.git
cd aegis-chat
```

### 2. تثبيت المكتبات

```bash
pnpm install
```

> يمكنك استخدام `npm install` أو `yarn`، لكن المشروع يستخدم `pnpm-lock.yaml` ويُفضَّل pnpm.

### 3. إعداد متغيرات البيئة

```bash
cp .env.example .env.local
```

عدّل `.env.local` واملأ القيم التالية:

| المتغير | الوصف |
|---------|--------|
| `DATABASE_URL` | رابط اتصال PostgreSQL |
| `BETTER_AUTH_SECRET` | سر عشوائي للمصادقة — `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | عنوان التطبيق — `http://localhost:3000` محلياً |
| `NEXT_PUBLIC_ABLY_KEY` | مفتاح Ably API |
| `VAPID_EMAIL` | بريدك بصيغة `mailto:you@example.com` |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | المفتاح العام VAPID |
| `VAPID_PRIVATE_KEY` | المفتاح الخاص VAPID |

**توليد مفاتيح VAPID:**

```bash
npx web-push generate-vapid-keys
```

### 4. إنشاء جداول قاعدة البيانات

```bash
pnpm db:push
```

> يُنشئ الجداول مباشرة من مخطط Drizzle. لإنشاء ملفات migration: `pnpm db:generate`

### 5. إضافة رموز دعوة (Invite Codes)

التسجيل يتطلب رمز دعوة صالحاً في جدول `invite_codes`. أضف رمزاً يدوياً:

```sql
INSERT INTO invite_codes (id, code, is_used, created_at, updated_at)
VALUES ('inv_001', 'WELCOME2026', false, NOW(), NOW());
```

> يمكنك فتح Drizzle Studio لإدارة البيانات: `pnpm db:studio`

### 6. تشغيل التطبيق

```bash
pnpm dev
```

افتح [http://localhost:3000](http://localhost:3000) — سيُوجَّهك إلى صفحة تسجيل الدخول.

## أوامر CLI

| الأمر | الوصف |
|-------|--------|
| `pnpm dev` | تشغيل خادم التطوير |
| `pnpm build` | بناء نسخة الإنتاج |
| `pnpm start` | تشغيل نسخة الإنتاج (بعد `build`) |
| `pnpm lint` | فحص الكود بـ ESLint |
| `pnpm db:push` | مزامنة مخطط قاعدة البيانات |
| `pnpm db:generate` | إنشاء ملفات migration |
| `pnpm db:studio` | فتح Drizzle Studio |

## الإنتاج (Production)

```bash
pnpm build
pnpm start
```

عند النشر، غيّر `BETTER_AUTH_URL` إلى عنوان موقعك الفعلي (مثل `https://chat.example.com`).

## هيكل المشروع

```
├── app/              # صفحات Next.js (App Router) و API routes
├── components/       # مكوّنات React وواجهة المستخدم
├── db/               # مخطط Drizzle ORM واتصال قاعدة البيانات
├── lib/              # المصادقة، التشفير، Web Push
├── realtime/         # عميل Ably والقنوات
├── store/            # حالة Zustand
└── public/           # ملفات ثابتة، Service Worker، PWA manifest
```

## التقنيات المستخدمة

- **Next.js 16** · **React 19** · **TypeScript**
- **Better Auth** — المصادقة
- **Drizzle ORM** + **Neon PostgreSQL** — قاعدة البيانات
- **Ably** — الرسائل الفورية
- **Web Push (VAPID)** — الإشعارات
- **Tailwind CSS 4** · **shadcn/ui** · **Zustand**

## ملاحظات مهمة

- **لا ترفع** ملف `.env.local` إلى GitHub — الملفات `.env*` مُستثناة في `.gitignore`.
- **المفتاح الخاص** للتشفير يُنشأ في المتصفح ولا يُخزَّن كنص عادي على الخادم.
- **Ably** مطلوب للرسائل الفورية؛ بدونه لن تعمل الدردشة بشكل صحيح.
- **إشعارات Push** اختيارية للتطوير، لكن المتغيرات VAPID مطلوبة إذا أردت تفعيلها.

## الترخيص

مشروع خاص (`private: true`). أضف ملف ترخيص إذا أردت جعله مفتوح المصدر.
