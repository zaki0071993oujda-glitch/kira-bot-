<div align="center">

# 🍁 𝑰𝑺𝑨𝑮𝑰 𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻 🍁
### ⟨ بــوت واتــســاب الــمــهــرجــان ⟩

<img src="https://i.postimg.cc/0jZSLQVg/9fe6315eaa424b8bf3815e9af3b0fe0a.jpg" alt="ISAGI TENGEN BOT" width="550"/>

[![Version](https://img.shields.io/badge/Version-3.0.0-black?style=for-the-badge&logo=whatsapp&logoColor=🍁)](https://whatsapp.com/channel/0029VbD2LYO3mFY2L9H5lB3u)
[![Node](https://img.shields.io/badge/Node.js-%3E%3D18-black?style=for-the-badge&logo=node.js&logoColor=🍁)]()
[![Channel](https://img.shields.io/badge/قناة_البوت-ISAGI_TENGEN-black?style=for-the-badge&logo=whatsapp&logoColor=🍁)](https://whatsapp.com/channel/0029VbD2LYO3mFY2L9H5lB3u)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-تواصل_معنا-black?style=for-the-badge&logo=whatsapp&logoColor=🍁)](https://wa.me/212687411464)

> **🍁 بوت واتساب متكامل، مبني على بنية إطار العمل [EsewSub](https://github.com/moreand458-eng/esewsub)**

[التثبيت](#-التثبيت-والتشغيل) • [المميزات](#-المميزات) • [الأوامر](#-نظرة-عامة-على-الأوامر) • [إدارة الروابط](#-نظام-إدارة-الروابط) • [المطور](#-المطور-والحقوق)

</div>

---

## ⚡ المميزات

- ⚙️ **هيكل برمجي سلس:** بوت مصمم ليكون بسيطاً، قوياً، ومستقراً.
- 🔘 **قائمة أزرار تفاعلية:** واجهة قائمة رئيسية ديناميكية عبر `menu_builder.js`، مع تراجع تلقائي لنص عادي لو فشلت الأزرار.
- 🛠️ **زر "تنصيب" مدمج:** اضغط زر واحد من القائمة الرئيسية عشان تبدأ تنصيب البوت على جهازك (نفس أمر `.تنصيب`).
- 🧩 **دمج كامل لمجموعة أوامر جديدة** (أكثر من 65 أمر) من حزمة `plugins-vonr`، بعد إعادة كتابتها بالكامل لتتوافق 100% مع نظام ISAGI TENGEN:
  - 🤖 **ذكاء اصطناعي:** توليد صور، تحويل شخصيات لأنمي/كرتون/فيجر/3D، شات بوتات AI متعددة.
  - 🖼️ **مؤثرات (canvas):** ميمز، شهادات ساخرة، بطاقات مطلوب/مطرود، رندر معادلات رياضية (LaTeX)، بطاقات فيسبوك/قصص وهمية للمزح.
  - 🎌 **أنمي:** متابعة تلقائية لحلقات الأنمي الجديدة.
  - 📸 **محتوى عشوائي:** صور/فيديوهات تيك توك وغيرها.
  - 🎊 **تسلية:** حقيقة أو تحدي، تأملات يومية، وأوامر تفاعلية بسيطة.
- 📚 **مكتبات مدمجة إضافية** من `lib-bode`: تحويل ورفع الملصقات، رفع صور/ملفات، تكامل Google Drive، MongoDB، نظام مستويات (levelling)، وغيرها كأدوات جاهزة للاستخدام.
- 🔗 **نظام إدارة روابط مركزي:** عرض كل روابط البوت وتعديلها بأمر واحد من غير لمس الكود.
- 🚀 **سرعة استجابة عالية** ومرونة كاملة في التعديل.
- 🍁 **المهرجان مستمر** ⚽🔥

---

## 💻 التثبيت والتشغيل

> **البيئة المستهدفة:** `Termux (Android)` أو أي سيرفر Linux فيه Node.js 18+

```bash
termux-setup-storage
pkg update -y && pkg upgrade -y
pkg install git nodejs -y

# فك ضغط مجلد المشروع ثم داخل مجلد isagi:
cd isagi
npm install
npm start
</div>
