// 🍁 ملف: تفعيل.js - نظام التفعيل والإيقاف المتكامل
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const EMOJI = '🍁';
const MAIN_IMAGE = 'https://i.postimg.cc/0jZSLQVg/9fe6315eaa424b8bf3815e9af3b0fe0a.jpg';

const handler = async (m, { conn, args, bot }) => {
    const chatId = m.chat;
    const subCmd = args[0]?.toLowerCase()?.trim();

    // التحقق من الصلاحيات
    const isOwner = bot.config?.owners?.some(o =>
        m.sender === o.jid || m.sender === o.lid
    );

    if (!isOwner && !m.isAdmin) {
        return m.reply(`${EMOJI} *هذا الأمر للمشرفين فقط*`);
    }

    // القائمة الرئيسية
    if (!subCmd) {
        const menuText = `
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
    *⚙️ نِظَامُ التَّفْعِيلِ وَالإِيْقَافِ*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}

🎉 *الــتـــرْحِــيــب*
├─ ❀ .تفعيل تشغيل_الترحيب
└─ ❀ .تفعيل ايقاف_الترحيب

👋 *الـــوداع*
├─ ❀ .تفعيل تشغيل_الوداع
└─ ❀ .تفعيل ايقاف_الوداع

🔗 *مُضَادُ الرَّوَابِطِ وَجِهَاتِ الاتِّصَالِ*
├─ ❀ .تفعيل تشغيل_مضاد_الروابط
└─ ❀ .تفعيل ايقاف_مضاد_الروابط
├─ ❀ .تفعيل_خاص *للمطورين فقط* 🔒
└─ ❀ .تفعيل_عام *للمشرفين والمطورين* 🌐

🎬 *مُضَادُ الفِيدِيُو*
├─ ❀ .تفعيل تشغيل_مضاد_الفيديو
└─ ❀ .تفعيل ايقاف_مضاد_الفيديو

🎭 *مُضَادُ المُلْصَقَاتِ*
├─ ❀ .تفعيل تشغيل_مضاد_الملصقات
└─ ❀ .تفعيل ايقاف_مضاد_الملصقات

🖼️ *مُضَادُ الصُّوَرِ*
├─ ❀ .تفعيل تشغيل_مضاد_الصور
└─ ❀ .تفعيل ايقاف_مضاد_الصور

🔊 *مُضَادُ الصَّوْتِ*
├─ ❀ .تفعيل تشغيل_مضاد_الصوت
└─ ❀ .تفعيل ايقاف_مضاد_الصوت

🗣️ *ضِدُّ الشَّاتِمِ*
├─ ❀ .تفعيل تشغيل_ضد_الشاتم
└─ ❀ .تفعيل ايقاف_ضد_الشاتم

🤖 *مُضَادُ البُوتَاتِ*
├─ ❀ .تفعيل تشغيل_مضاد_البوتات
└─ ❀ .تفعيل ايقاف_مضاد_البوتات

👑 *المُطَوِّرِينَ*
├─ ❀ .تفعيل تشغيل_المطورين
└─ ❀ .تفعيل ايقاف_المطورين

${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}

👑 *الصَّلَاحِيَّاتُ*
├─ ❀ .تفعيل تشغيل_الادمن
├─ ❀ .تفعيل ايقاف_الادمن
├─ ❀ .تفعيل مطور_فقط
└─ ❀ .تفعيل مطور_عام

📦 *البُوتَاتُ الفَرْعِيَّةُ*
├─ ❀ .تفعيل تشغيل_الفرعي
└─ ❀ .تفعيل ايقاف_الفرعي

${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}

⚙️ *جروب التنصيب*
├─ ❀ .تفعيل تنصيب_جروب *تفعيل كل الإعدادات دفعة واحدة*
└─ ❀ .تفعيل_خاص *للمطورين فقط* 🔒
└─ ❀ .تفعيل_عام *للمشرفين والمطورين* 🌐

${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}

📌 *استخدم:* .تفعيل + [الأمر]
📌 *أوامر مضاد الروابط:*
├─ ❀ .تفعيل_خاص *للمطورين فقط* 🔒
└─ ❀ .تفعيل_عام *للمشرفين والمطورين* 🌐

${EMOJI} *┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}`;

        // ✅ إرسال القائمة مع الصورة
        try {
            await conn.sendMessage(m.chat, {
                image: { url: MAIN_IMAGE },
                caption: menuText,
                footer: `${EMOJI} ${BOT_NAME || 'ISAGI TENGEN BOT'}`,
                mentions: [m.sender]
            }, { quoted: m });
        } catch (e) {
            // ✅ في حال فشل إرسال الصورة، نرسل النص فقط
            console.log(`${EMOJI} فشل إرسال الصورة:`, e);
            await m.reply(menuText);
        }
        return;
    }

    // ✅ التخزين الموحد
    if (!global.db) global.db = {};
    if (!global.db.data) global.db.data = {};
    if (!global.db.data.antiLink) global.db.data.antiLink = {};
    if (!global.db.data.chats) global.db.data.chats = {};
    if (!global.db.data.chats[chatId]) global.db.data.chats[chatId] = {};
    
    if (!global._gs) global._gs = {};
    if (!global._gs[chatId]) global._gs[chatId] = {};
    if (!global.db.groups) global.db.groups = {};
    if (!global.db.groups[chatId]) global.db.groups[chatId] = {};

    // ✅ دالة حفظ الإعدادات (متوافقة مع جميع الأنظمة)
    const setSetting = (key, value) => {
        // 1- تخزين في antiLink (لنظام index.js)
        if (key === 'antiLink') {
            if (value) {
                global.db.data.antiLink[chatId] = true;
            } else {
                delete global.db.data.antiLink[chatId];
            }
        }
        
        // 2- تخزين في _gs (للتوافق مع الملفات القديمة)
        if (value) {
            global._gs[chatId][key] = true;
        } else {
            delete global._gs[chatId][key];
        }
        
        // 3- تخزين في db.data.chats (للتوافق مع نظام التفعيل القديم)
        if (value) {
            global.db.data.chats[chatId][key] = true;
        } else {
            delete global.db.data.chats[chatId][key];
        }
        
        // 4- تخزين في db.groups (للتوافق مع نظام group)
        if (value) {
            global.db.groups[chatId][key] = true;
        } else {
            delete global.db.groups[chatId][key];
        }
        
        // محاولة حفظ قاعدة البيانات
        try {
            if (global.db.save) global.db.save();
        } catch (e) {}
    };

    // ✅ دالة للتحقق من الصلاحيات
    const checkPermissions = (requiredLevel = 'admin') => {
        if (requiredLevel === 'owner') {
            return isOwner;
        }
        return isOwner || m.isAdmin;
    };

    const CASES = {
        // ============================================
        // 🎉 الترحيب
        // ============================================
        'تشغيل_الترحيب': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('welcomeDisabled', false);
            return `${EMOJI} ✅ *تَمَّ تَشْغِيلُ التَّرْحِيبِ*`;
        },
        'ايقاف_الترحيب': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('welcomeDisabled', true);
            return `${EMOJI} ✅ *تَمَّ إِيْقَافُ التَّرْحِيبِ*`;
        },
        
        // ============================================
        // 👋 الوداع
        // ============================================
        'تشغيل_الوداع': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('goodbyeDisabled', false);
            return `${EMOJI} ✅ *تَمَّ تَشْغِيلُ الوَدَاعِ*`;
        },
        'ايقاف_الوداع': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('goodbyeDisabled', true);
            return `${EMOJI} ✅ *تَمَّ إِيْقَافُ الوَدَاعِ*`;
        },
        
        // ============================================
        // 🔗 مضاد الروابط وجهات الاتصال
        // ============================================
        'تشغيل_مضاد_الروابط': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('antiLink', true);
            return `${EMOJI} ✅ *تَمَّ تَشْغِيلُ مُضَادِ الرَّوَابِطِ وَجِهَاتِ الاتِّصَالِ (طرد فوري)*\n\n📌 سيتم طرد أي شخص يرسل رابط أو جهة اتصال`;
        },
        'ايقاف_مضاد_الروابط': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('antiLink', false);
            return `${EMOJI} ✅ *تَمَّ إِيْقَافُ مُضَادِ الرَّوَابِطِ وَجِهَاتِ الاتِّصَالِ*`;
        },
        
        // ============================================
        // 🎬 مضاد الفيديو
        // ============================================
        'تشغيل_مضاد_الفيديو': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('antiVideo', true);
            return `${EMOJI} ✅ *تَمَّ تَشْغِيلُ مُضَادِ الفِيدِيُو*`;
        },
        'ايقاف_مضاد_الفيديو': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('antiVideo', false);
            return `${EMOJI} ✅ *تَمَّ إِيْقَافُ مُضَادِ الفِيدِيُو*`;
        },
        
        // ============================================
        // 🎭 مضاد الملصقات
        // ============================================
        'تشغيل_مضاد_الملصقات': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('antiSticker', true);
            return `${EMOJI} ✅ *تَمَّ تَشْغِيلُ مُضَادِ المُلْصَقَاتِ*`;
        },
        'ايقاف_مضاد_الملصقات': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('antiSticker', false);
            return `${EMOJI} ✅ *تَمَّ إِيْقَافُ مُضَادِ المُلْصَقَاتِ*`;
        },
        
        // ============================================
        // 🖼️ مضاد الصور
        // ============================================
        'تشغيل_مضاد_الصور': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('antiImage', true);
            return `${EMOJI} ✅ *تَمَّ تَشْغِيلُ مُضَادِ الصُّوَرِ*`;
        },
        'ايقاف_مضاد_الصور': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('antiImage', false);
            return `${EMOJI} ✅ *تَمَّ إِيْقَافُ مُضَادِ الصُّوَرِ*`;
        },
        
        // ============================================
        // 🔊 مضاد الصوت
        // ============================================
        'تشغيل_مضاد_الصوت': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('antiAudio', true);
            return `${EMOJI} ✅ *تَمَّ تَشْغِيلُ مُضَادِ الصَّوْتِ*`;
        },
        'ايقاف_مضاد_الصوت': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('antiAudio', false);
            return `${EMOJI} ✅ *تَمَّ إِيْقَافُ مُضَادِ الصَّوْتِ*`;
        },
        
        // ============================================
        // 🗣️ ضد الشاتم
        // ============================================
        'تشغيل_ضد_الشاتم': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('antiCurse', true);
            return `${EMOJI} ✅ *تَمَّ تَشْغِيلُ ضِدِّ الشَّاتِمِ*`;
        },
        'ايقاف_ضد_الشاتم': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('antiCurse', false);
            return `${EMOJI} ✅ *تَمَّ إِيْقَافُ ضِدِّ الشَّاتِمِ*`;
        },
        
        // ============================================
        // 🤖 مضاد البوتات
        // ============================================
        'تشغيل_مضاد_البوتات': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('antiBots', true);
            return `${EMOJI} ✅ *تَمَّ تَشْغِيلُ مُضَادِ البُوتَاتِ*`;
        },
        'ايقاف_مضاد_البوتات': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('antiBots', false);
            return `${EMOJI} ✅ *تَمَّ إِيْقَافُ مُضَادِ البُوتَاتِ*`;
        },
        
        // ============================================
        // 👑 المطورين
        // ============================================
        'تشغيل_المطورين': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            global.db.ownerOnly = false;
            return `${EMOJI} ✅ *تَمَّ تَشْغِيلُ المُطَوِّرِينَ*`;
        },
        'ايقاف_المطورين': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            global.db.ownerOnly = true;
            return `${EMOJI} ✅ *تَمَّ إِيْقَافُ المُطَوِّرِينَ*`;
        },
        
        // ============================================
        // 👑 الصلاحيات
        // ============================================
        'تشغيل_الادمن': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('adminOnly', true);
            return `${EMOJI} ✅ *تَمَّ تَفْعِيلُ وَضْعِ الإِدْمِنِ*`;
        },
        'ايقاف_الادمن': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('adminOnly', false);
            return `${EMOJI} ✅ *تَمَّ إِيْقَافُ وَضْعِ الإِدْمِنِ*`;
        },
        'مطور_فقط': () => {
            if (!isOwner) {
                return `${EMOJI} 🔒 *هذا الأمر للمطورين فقط*`;
            }
            global.db.ownerOnly = true;
            return `${EMOJI} ✅ *تَمَّ تَفْعِيلُ وَضْعِ المُطَوِّرِ فَقَطْ*`;
        },
        'مطور_عام': () => {
            if (!isOwner) {
                return `${EMOJI} 🔒 *هذا الأمر للمطورين فقط*`;
            }
            global.db.ownerOnly = false;
            return `${EMOJI} ✅ *تَمَّ تَفْعِيلُ وَضْعِ المُطَوِّرِ العَامِّ*`;
        },
        
        // ============================================
        // 📦 البوتات الفرعية
        // ============================================
        'تشغيل_الفرعي': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            global.db.noSub = false;
            return `${EMOJI} ✅ *تَمَّ تَشْغِيلُ البُوتَاتِ الفَرْعِيَّةِ*`;
        },
        'ايقاف_الفرعي': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            global.db.noSub = true;
            return `${EMOJI} ✅ *تَمَّ إِيْقَافُ البُوتَاتِ الفَرْعِيَّةِ*`;
        },

        // ============================================
        // ⚙️ تنصيب الجروب (تفعيل كل الإعدادات دفعة واحدة)
        // ============================================
        'تنصيب_جروب': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            // تفعيل جميع الإعدادات الأساسية
            setSetting('welcomeDisabled', false);
            setSetting('goodbyeDisabled', false);
            setSetting('antiLink', true);
            setSetting('antiVideo', true);
            setSetting('antiSticker', true);
            setSetting('antiImage', true);
            setSetting('antiAudio', true);
            setSetting('antiCurse', true);
            setSetting('antiBots', true);
            setSetting('adminOnly', false);
            global.db.ownerOnly = false;
            global.db.noSub = false;
            
            // حفظ التغييرات
            try {
                if (global.db.save) global.db.save();
            } catch (e) {}
            
            return `${EMOJI} ✅ *تَمَّ تَنْصِيبُ الجَرُوبِ بِنَجَاح!*\n\n` +
                   `📌 *الإعدادات التي تم تفعيلها:*\n` +
                   `├ ✅ الترحيب\n` +
                   `├ ✅ الوداع\n` +
                   `├ ✅ مضاد الروابط وجهات الاتصال (طرد فوري)\n` +
                   `├ ✅ مضاد الفيديو\n` +
                   `├ ✅ مضاد الملصقات\n` +
                   `├ ✅ مضاد الصور\n` +
                   `├ ✅ مضاد الصوت\n` +
                   `├ ✅ ضد الشاتم\n` +
                   `├ ✅ مضاد البوتات\n` +
                   `└ ✅ المطورين\n\n` +
                   `🔹 *تم تجهيز المجموعة بالكامل!*`;
        },

        // ============================================
        // 🔒 أوامر التفعيل الخاصة والعامة (المضافة حديثاً)
        // ============================================
        
        // ✅ أمر التفعيل الخاص (للمطورين فقط)
        'تفعيل_خاص': () => {
            if (!isOwner) {
                return `${EMOJI} 🔒 *هذا الأمر للمطورين فقط*`;
            }
            setSetting('antiLink', true);
            return `${EMOJI} ✅ *تَمَّ تَفْعِيلُ مُضَادِ الرَّوَابِطِ وَجِهَاتِ الاتِّصَالِ* 🔒\n` +
                   `📌 *نوع التفعيل:* خاص (للمطورين فقط)\n` +
                   `📌 سيتم طرد أي شخص يرسل رابط أو جهة اتصال فوراً`;
        },
        
        // ✅ أمر التفعيل العام (للمشرفين والمطورين)
        'تفعيل_عام': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('antiLink', true);
            return `${EMOJI} ✅ *تَمَّ تَفْعِيلُ مُضَادِ الرَّوَابِطِ وَجِهَاتِ الاتِّصَالِ* 🌐\n` +
                   `📌 *نوع التفعيل:* عام (للمشرفين والمطورين)\n` +
                   `📌 سيتم طرد أي شخص يرسل رابط أو جهة اتصال فوراً`;
        },
        
        // ✅ أمر إيقاف مضاد الروابط (للمشرفين والمطورين)
        'ايقاف_مضاد': () => {
            if (!checkPermissions('admin')) {
                return `${EMOJI} 🔒 *هذا الأمر للمشرفين والمطورين فقط*`;
            }
            setSetting('antiLink', false);
            return `${EMOJI} ✅ *تَمَّ إِيْقَافُ مُضَادِ الرَّوَابِطِ وَجِهَاتِ الاتِّصَالِ*\n` +
                   `📌 تم إيقاف النظام بنجاح`;
        },
        
        // ✅ أمر حالة مضاد الروابط (للجميع)
        'حالة_مضاد': () => {
            const status = global.db.data.antiLink?.[chatId] || false;
            const stats = global.db.data.antiLinkStats?.[chatId] || { total: 0, today: 0 };
            const isActive = status ? '🟢 مُفَعَّل' : '🔴 غَيْرُ مُفَعَّل';
            
            // تحديد نوع التفعيل
            let activationType = 'غير محدد';
            if (status) {
                const isOwnerActivated = global._gs?.[chatId]?.ownerActivated || false;
                activationType = isOwnerActivated ? 'خاص (مطورين فقط)' : 'عام (مشرفين ومطورين)';
            }
            
            return `${EMOJI} *حَالَةُ مُضَادِ الرَّوَابِطِ وَجِهَاتِ الاتِّصَالِ*\n` +
                   `${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                   `📌 *الحالة:* ${isActive}\n` +
                   `🔹 *نوع التفعيل:* ${activationType}\n` +
                   `📊 *الإحصاءات:*\n` +
                   `├ إجمالي المطرودين: ${stats.total || 0}\n` +
                   `└ اليوم: ${stats.today || 0}\n` +
                   `${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                   `📌 *الأوامر المتاحة:*\n` +
                   `├ .تفعيل_خاص 🔒 (للمطورين فقط)\n` +
                   `├ .تفعيل_عام 🌐 (للمشرفين والمطورين)\n` +
                   `├ .ايقاف_مضاد (للمشرفين والمطورين)\n` +
                   `└ .حالة_مضاد (للجميع)`;
        },
    };

    const fn = CASES[subCmd];
    if (!fn) {
        return m.reply(`${EMOJI} ❌ *أَمْرٌ غَيْرُ مَعْرُوفٍ*\n\n📌 *.تفعيل* لِعَرْضِ القَائِمَةِ`);
    }
    
    const result = fn();
    await m.reply(result);
};

handler.command = ['تفعيل', 'activation', 'م'];
handler.category = 'admins';

export default handler;